//
//  ContentView.swift
//  NotWallet Watch App
//
//  Created by Seto Elkahfi on 2025-07-14.
//

import Combine
import SwiftUI
import WalletKitV3

struct ContentView: View {
    @State private var showImport = false
    @State private var showCreate = false

    var body: some View {
        VStack {
            Text("NotWallet")
                .font(.system(size: 32, weight: .bold, design: .rounded))
                .foregroundColor(.purple)
            Text("Crypto")
                .font(.system(size: 16, weight: .regular, design: .rounded))
                .foregroundColor(.purple)
            Divider()
            Button(action: { showCreate = true }) {
                Text("Create new")
                .foregroundColor(.primary)
                .padding(.vertical, 8)
                .frame(height: 28)
                .clipShape(Rectangle())
                .contentShape(Rectangle())
            }
            .buttonStyle(.bordered)
            .frame(maxWidth: .infinity)
            /*
            Button(action: { showImport = true }) {
                Text("Import")
                .foregroundColor(.primary)
                .padding(.vertical, 8)
                .frame(height: 28)
                .clipShape(Rectangle())
                .contentShape(Rectangle())
            }
            .buttonStyle(.bordered)
            .frame(maxWidth: .infinity)*/
        }
        .padding()
        .sheet(isPresented: $showImport) {
            ImportWalletView()
        }
        .sheet(isPresented: $showCreate) {
            CreateWalletView(viewModel: .init())
        }
    }
}

#Preview {
    ContentView()
}
