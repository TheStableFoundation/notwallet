//
//  Seed+Codable.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import WalletKitV3

extension Seed: Codable {
    enum CodingKeys: String, CodingKey {
        case id, phrase, seedType
    }
    public init(from decoder: any Decoder) throws {
        print("Will decode Seed")
        let container = try decoder.container(keyedBy: CodingKeys.self)
        do {
            let id = try container.decode(String.self, forKey: .id)
            let phrase = try container.decode(String.self, forKey: .phrase)
            let seedType = try container.decode(SeedType.self, forKey: .seedType)
            print("Decoded Seed with id: \(id)")
            self.init(id: id, phrase: phrase, seedType: seedType)
        } catch {
            print("Failed to decode Seed: \(error)")
            throw error
        }
    }
    public func encode(to encoder: any Encoder) throws {
        print("Will encode Seed with id: \(id)")
        var container = encoder.container(keyedBy: CodingKeys.self)
        do {
            try container.encode(id, forKey: .id)
            try container.encode(phrase, forKey: .phrase)
            try container.encode(seedType, forKey: .seedType)
            print("Successfully encoded Seed")
        } catch {
            print("Failed to encode Seed: \(error)")
            throw error
        }
    }
}
