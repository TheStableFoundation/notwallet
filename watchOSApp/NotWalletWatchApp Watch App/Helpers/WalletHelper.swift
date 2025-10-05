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

func getAssetPrice(asset: String) async throws -> Double {
    /// Configure the URL for our request.
    let url = URL(string: "BIRDEYE_BASE_URL/defi/price?address=\(asset)")!
    
    /// Create a URLRequest for the POST request.
    var request = URLRequest(url: url)
    
    /// Configure the HTTP method.
    request.httpMethod = "GET"

    /// Configure the proper content-type value to JSON.
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    /// Configure BirdEye header
    request.setValue("BIRDEYE_API_KEY", forHTTPHeaderField: "X-API-KEY")
    
    /// Use URLSession to fetch the data asynchronously.
    let (data, _) = try await URLSession.shared.data(for: request)
    
    /// Decode the JSON response into the PostResponse struct.
    let decodedResponse = try JSONDecoder().decode(BirdeyePriceResponse.self, from: data)
    
    return decodedResponse.data.value
}

func getWalletPortfolio(wallet: String) async throws -> [BalanceV1] {
    /// Configure the URL for our request.
    let url = URL(string: "BIRDEYE_BASE_URL/v1/wallets/token_list?wallet=\(wallet)&environment=Mainnet")!
    
    /// Create a URLRequest for the POST request.
    var request = URLRequest(url: url)
    
    /// Configure the HTTP method.
    request.httpMethod = "GET"

    /// Configure the proper content-type value to JSON.
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    /// Configure BirdEye API Key
    request.setValue("BIRDEYE_API_KEY", forHTTPHeaderField: "X-API-KEY")
    /// Configure network
    request.setValue("Solana", forHTTPHeaderField: "x-chain")
    
    /// Use URLSession to fetch the data asynchronously.
    let (data, _) = try await URLSession.shared.data(for: request)
    
    /// Decode the JSON response
    let decodedResponse = try JSONDecoder().decode(WalletPortfolioResponse.self, from: data)
    
    return decodedResponse.data
}

func getWalletBalance(wallet: String) async throws -> String {
    /// Configure the URL for our request.
    let url = URL(string: "BIRDEYE_BASE_URL/v1/wallets/wallet_balance?wallet=\(wallet)&environment=Mainnet")!
    
    /// Create a URLRequest for the POST request.
    var request = URLRequest(url: url)
    
    /// Configure the HTTP method.
    request.httpMethod = "GET"

    /// Configure the proper content-type value to JSON.
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    /// Configure BirdEye API Key
    request.setValue("BIRDEYE_API_KEY", forHTTPHeaderField: "X-API-KEY")
    /// Configure network
    request.setValue("Solana", forHTTPHeaderField: "x-chain")
    
    /// Use URLSession to fetch the data asynchronously.
    let (data, _) = try await URLSession.shared.data(for: request)
    
    /// Decode the JSON response
    let decodedResponse = try JSONDecoder().decode(WalletBalanceResponse.self, from: data)
    
    return decodedResponse.value
}
