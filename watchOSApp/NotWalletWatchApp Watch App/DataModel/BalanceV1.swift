//
//  BalanceV1.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-10-05.
//

struct BalanceV1: Decodable {
    public let meta: Metadata
    public let balance: UInt64
    public let ui_amount: Float64
}

extension BalanceV1 {
    func display() -> String {
        "\(ui_amount) \(meta.symbol)"
    }
}

struct Metadata: Decodable {
    public let address: String
    public let name: String
    public let symbol: String
    public let decimal: UInt8
    public let logo_uri: String
}
