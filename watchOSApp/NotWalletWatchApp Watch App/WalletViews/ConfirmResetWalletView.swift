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
            VStack(spacing: 8) {
                
                Text("Are you sure?")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(.purple)
                
                Text("All your wallets and seed phrases will be removed permanently. Make sure you have backed up your wallets.")
                    .multilineTextAlignment(.center)
                    .font(.system(size: 18, weight: .regular, design: .rounded))
                    .foregroundColor(.primary)
                
                Divider()
                
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
        }
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
    ConfirmResetWalletView(
        viewModel: .init(),
        onResetWallet: {}
    )
}
