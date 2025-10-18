//
//  NotWalletWatchApp.swift
//  NotWalletWatchApp Watch App
//
//  Created by Seto Elkahfi on 2025-08-06.
//

import SwiftUI

@main
struct NotWalletWatchApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: .init())
        }
    }
}
