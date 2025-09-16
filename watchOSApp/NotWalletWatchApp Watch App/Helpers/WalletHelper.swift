//
//  WalletHelper.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-16.
//

import WalletKitV3
import UIKit

func saveCreateWalletResponse(userDefault: UserDefaults, wallet: CreateWalletResponse) async throws {
    
    // Append wallet
    var keyPairs: [Wallet]
        
    if let data = userDefault.object(forKey: storage(key: .keyPairs)) as? Data,
            let _keyPairs = try? JSONDecoder().decode([Wallet].self, from: data)
        {
            print("Found existing keyPairs: \(_keyPairs.count)")
            keyPairs = _keyPairs
        } else {
            print("No existing keyPairs found, creating empty array")
            keyPairs = []
        }
    keyPairs.append(wallet.wallet)
    print("Total keyPairs after append: \(keyPairs.count)")

    do {
        let encoded = try JSONEncoder().encode(keyPairs)
        print("Successfully encoded keyPairs: \(encoded.count) bytes")
        userDefault.set(encoded, forKey: storage(key: .keyPairs))
        userDefault.synchronize()
        print("Saved keyPairs to UserDefaults with key: \(storage(key: .keyPairs))")
    } catch {
        print("Failed to encode keyPairs: \(error)")
    }

    // Append seed to stored seeds
    var seeds: [Seed] = []
    
    if let data = userDefault.object(forKey: storage(key: .seeds)) as? Data,
        let _seeds = try? JSONDecoder().decode([Seed].self, from: data)
    {
        seeds = _seeds
    } else {
        print("No existing seeds found, creating empty array")
        seeds = []
    }
    seeds.append(wallet.seed)
    print("Total seeds after append: \(seeds.count)")

    do {
        let encoded = try JSONEncoder().encode(seeds)
        print("Successfully encoded seeds: \(encoded.count) bytes")
        userDefault.set(encoded, forKey: storage(key: .seeds))
        userDefault.synchronize()
        print("Saved seeds to UserDefaults with key: \(storage(key: .seeds))")
    } catch {
        print("Failed to encode seeds: \(error)")
    }

    try await Task.sleep(nanoseconds: 2_000_000_000)
    
}
