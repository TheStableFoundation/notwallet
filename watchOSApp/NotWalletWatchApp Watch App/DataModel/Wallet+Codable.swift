//
//  Wallet+Codable.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import WalletKitV3

extension Wallet: Codable {
    enum CodingKeys: String, CodingKey {
        case id, username, name, account, pubkey, privkey, seedId
    }

    public init(from decoder: any Decoder) throws {
        print("Will decode Wallet")
        let container = try decoder.container(keyedBy: CodingKeys.self)
        do {
            let id = try container.decode(String.self, forKey: .id)
            let username = try container.decodeIfPresent(String.self, forKey: .username)
            let name = try container.decode(String.self, forKey: .name)
            let account = try container.decode(UInt32.self, forKey: .account)
            let pubkey = try container.decode(String.self, forKey: .pubkey)
            let privkey = try container.decode(String.self, forKey: .privkey)
            let seedId = try container.decode(String.self, forKey: .seedId)
            print(
                "Decoded Wallet: \(id), \(String(describing: username)), \(name), \(account), \(pubkey), \(seedId)"
            )
            self.init(
                id: id, username: username, name: name, account: account, pubkey: pubkey,
                privkey: privkey, seedId: seedId)
        } catch {
            print("Failed to decode Wallet: \(error)")
            throw error
        }
    }

    public func encode(to encoder: any Encoder) throws {
        print("Will encode Wallet with id: \(id)")
        var container = encoder.container(keyedBy: CodingKeys.self)
        do {
            try container.encode(id, forKey: .id)
            try container.encode(username, forKey: .username)
            try container.encode(name, forKey: .name)
            try container.encode(account, forKey: .account)
            try container.encode(pubkey, forKey: .pubkey)
            try container.encode(privkey, forKey: .privkey)
            try container.encode(seedId, forKey: .seedId)
            print("Successfully encoded Wallet")
        } catch {
            print("Failed to encode Wallet: \(error)")
            throw error
        }
    }
}
