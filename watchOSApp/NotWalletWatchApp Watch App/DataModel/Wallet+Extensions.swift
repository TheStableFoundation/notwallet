//
//  Wallet+Extensions.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-20.
//

import WalletKitV3

extension Wallet {
    func initial() -> String {
        /// get the three first and last letters of the public key
        pubkey.prefix(3) + "..." + pubkey.suffix(3)
    }
}
