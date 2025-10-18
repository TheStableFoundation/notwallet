//
//  SeedType+Codable.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import WalletKitV3

extension SeedType: @retroactive Codable {

    private enum CodingKeys: String, CodingKey {
        case type
        case timestamp
    }

    private enum CaseType: String, Codable {
        case created
        case imported
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(CaseType.self, forKey: .type)
        let timestamp = try container.decode(String.self, forKey: .timestamp)
        switch type {
        case .created:
            self = .created(timestamp: timestamp)
        case .imported:
            self = .imported(timestamp: timestamp)
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .created(let timestamp):
            try container.encode(CaseType.created, forKey: .type)
            try container.encode(timestamp, forKey: .timestamp)
        case .imported(let timestamp):
            try container.encode(CaseType.imported, forKey: .type)
            try container.encode(timestamp, forKey: .timestamp)
        }
    }
}
