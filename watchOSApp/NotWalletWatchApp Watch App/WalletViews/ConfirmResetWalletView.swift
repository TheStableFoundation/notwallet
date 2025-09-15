//
//  ConfirmResetWalletView.swift
//  NotWallet Watch App
//
//  Created by Seto Elkahfi on 2025-07-14.
//

import Combine
import SwiftUI
import WalletKitV3

struct ConfirmResetWalletView: View {

    init(
        viewModel: ViewModel = .init(),
        onResetWallet: @escaping () -> Void
    ) {
        self.viewModel = viewModel
        self.onResetWallet = onResetWallet
    }

    var body: some View {
        ScrollView {
            Text("Are you sure?")
                .font(.system(size: 32, weight: .bold, design: .rounded))
                .foregroundColor(.purple)
            Text("All your wallets and seed phrases will be removed permanently. Make sure you have backed up your wallets.")
                .font(.system(size: 12, weight: .regular, design: .rounded))
                .foregroundColor(.primary)

         
            Button(action: {
                Task {
                    try await viewModel.resetWallet()
                    // Call the callback
                    onResetWallet()
                }
            }) {
                Text("I understand")
                    .foregroundColor(.red)
                    .padding(.vertical, 6)
                    .frame(height: 18)
                    .clipShape(Rectangle())
                    .contentShape(Rectangle())
            }
            .buttonStyle(.bordered)
            .frame(maxWidth: .infinity)
        }
        .padding()
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
    private let onResetWallet: () -> Void
}

extension ConfirmResetWalletView {
    final class ViewModel: ObservableObject {
        internal init(state: ViewState = ViewState.idle) {
            self.state = state
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(OnboardingState)
        }

        enum OnboardingState {
            case done, new
        }

        @Published private(set) var state = ViewState.idle

        @MainActor
        func resetWallet() async throws {
            print("Starting wallet reset process")

            // Remove seeds from UserDefaults
            let seedsKey = storage(key: .seeds)
            userDefault.removeObject(forKey: seedsKey)
            print("Removed seeds with key: \(seedsKey)")

            // Remove keyPairs from UserDefaults
            let keyPairsKey = storage(key: .keyPairs)
            userDefault.removeObject(forKey: keyPairsKey)
            print("Removed keyPairs with key: \(keyPairsKey)")

            // Remove activeKeyPair from UserDefaults
            let activeKeyPairKey = storage(key: .activeKeyPair)
            userDefault.removeObject(forKey: activeKeyPairKey)
            print("Removed activeKeyPair with key: \(activeKeyPairKey)")

            // Ensure changes are written to disk
            userDefault.synchronize()
            print("Wallet reset completed - all data cleared from UserDefaults")
        }

        // MARK: - Private

        private let userDefault = UserDefaults.standard
    }
}

#Preview {
    WalletView(
        viewModel: .init(
            activeKeyPair: .init(
                id: "", username: nil, name: "", account: 0,
                pubkey: "EjEYahpsv5AADKHdv32wknbq59tsqZPDZJgyMpZ5qhnV", privkey: "", seedId: "")),
        onResetWallet: {}
    )
}
