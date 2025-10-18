//
//  WalletManagement.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import Foundation
import Combine
import WalletKitV3

final class WalletManagement {
    
    init(activeWallet: Wallet) {
        self.activeWallet = activeWallet
    }
    
    init(userDefaults: UserDefaults = .standard) {
        self.userDefault = userDefaults
    }
    
    func sync(activeWallet: Wallet) throws {
        // Sync active keypair
        try updateActiveKeyPair(activeWallet)
        
        // Then sync the keypairs
        try updateKeyPairsWith(activeWallet)
    }
    
    func activeSeed() throws -> Seed {
        let activeWallet = try getActiveKeypair()
        return try getSeedFrom(seedId: activeWallet.seedId)
    }
    
    func deriveNewAccount() throws -> Wallet {
        let activeWallet = try getActiveKeypair()
        let wallet = try WalletKitV3.deriveNewAccount(
            seedId: activeWallet.seedId,
            mnemonicPhrase: try getSeedPhraseFrom(seedId: activeWallet.seedId),
            account: try nextAccount()
        )
        
        // Save wallet
        try appendKeyPairsWith(wallet: wallet)
        
        return wallet
    }
    
    func appendKeyPairsWith(wallet: Wallet) throws {
        guard
            let data = userDefault.object(forKey: storage(key: .keyPairs)) as? Data,
            var keyPairs = try? JSONDecoder().decode([Wallet].self, from: data)
        else {
            print("No existing keyPairs found, creating empty array")
            throw KeyPairError.MnemonicError("Should not be here")
        }
        keyPairs.append(wallet)
        
        do {
            let encoded = try JSONEncoder().encode(keyPairs)
            print("Successfully encoded keyPairs: \(encoded.count) bytes")
            userDefault.set(encoded, forKey: storage(key: .keyPairs))
            userDefault.synchronize()
            print("Saved keyPairs to UserDefaults with key: \(storage(key: .keyPairs))")
        } catch {
            print("Failed to encode keyPairs: \(error)")
        }

    }
    
    func getSeedPhraseFrom(seedId: String) throws -> String {
        guard
            let data = userDefault.object(forKey: storage(key: .seeds)) as? Data,
            let seeds = try? JSONDecoder().decode([Seed].self, from: data),
            let seed = seeds.first(where: { $0.id == seedId })
        else {
            print("No existing seeds found, creating empty array")
            throw KeyPairError.MnemonicError("Should have one.")
        }
        
        return seed.phrase
    }
    
    func allKeyPairs() throws -> [Wallet] {
        guard
            let data = userDefault.object(forKey: storage(key: .keyPairs)) as? Data,
            let keyPairs = try? JSONDecoder().decode([Wallet].self, from: data)
        else {
            throw KeyPairError.InvalidAddress("Error state")
        }
        
        return keyPairs
    }
    
    func getActiveKeypair() throws -> Wallet {
        guard
            let data = userDefault.object(forKey: storage(key: .activeKeyPair)) as? Data,
            let wallet = try? JSONDecoder().decode(Wallet.self, from: data)
        else {
            throw KeyPairError.InvalidAddress("Should have at least one active keypair.")
        }
        
        return wallet
    }
    

    // MARK: - Private
    
    private func updateActiveKeyPair(_ wallet: Wallet) throws {
        let encoded = try JSONEncoder().encode(wallet)
        userDefault.set(encoded, forKey: storage(key: .activeKeyPair))
        userDefault.synchronize()
    }
    
    private func updateKeyPairsWith(_ activeKeyPair: Wallet) throws {
        
        var keyPairs = try allKeyPairs()
        
        guard
            var keyPair = keyPairs.filter({ $0.id == activeKeyPair.id }).first,
            let index = keyPairs.firstIndex(of: keyPair)
        else {
            throw KeyPairError.MnemonicError("Error")
        }
        keyPair.name = activeKeyPair.name
        keyPairs[index] = keyPair
        
        // Now we can sync the keypairs with the updated one
        let encoded = try JSONEncoder().encode(keyPairs)
        userDefault.set(encoded, forKey: storage(key: .keyPairs))
        userDefault.synchronize()
    }
    
    private func getSeedFrom(seedId: String) throws -> Seed {
        guard
            let data = userDefault.object(forKey: storage(key: .seeds)) as? Data,
            let seeds = try? JSONDecoder().decode([Seed].self, from: data),
            let seed = seeds.first(where: { $0.id == seedId })
        else {
            print("No existing seeds found, creating empty array")
            throw KeyPairError.MnemonicError("Should have one.")
        }
        
        return seed
    }
    
    private func nextAccount() throws -> UInt32 {
        guard
            let data = userDefault.object(forKey: storage(key: .keyPairs)) as? Data,
            let keyPairs = try? JSONDecoder().decode([Wallet].self, from: data)
        else {
            print("No existing keyPairs found, creating empty array")
            throw KeyPairError.MnemonicError("Should already have  seedphrase")
        }
        
        print("Found existing keyPairs: \(keyPairs.count)")
        return UInt32(keyPairs.count)
    }

    private var userDefault: UserDefaults = .standard
    private var activeWallet: Wallet? = nil
}
