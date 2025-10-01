//
//  WalletViewV1.swift
//  NotWallet Watch App
//
//  Created by Seto Elkahfi on 2025-07-14.
//

import Combine
import SwiftUI
import WalletKitV3

struct WalletViewV1: View {

    init(
        viewModel: WalletViewV1.ViewModel,
        onResetWallet: @escaping () -> Void
    ) {
        self.viewModel = viewModel
        self.onResetWallet = onResetWallet
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Balance Section
                    VStack(spacing: 8) {
                        switch viewModel.state {
                        case .loading:
                            ProgressView()
                                .scaleEffect(0.8)
                                .accentColor(.primary)
                        case .idle:
                            Color.clear.onAppear(perform: {
                                Task {
                                    await viewModel.walletBalance()
                                }
                            })
                        case .loaded(let balance):
                            Text(balance)
                                .font(.system(size: 28, weight: .medium, design: .rounded))
                                .foregroundColor(.primary)
                                .tracking(0.5)
                        case .failed(_):
                            Text("N/A")
                                .font(.system(size: 28, weight: .medium, design: .rounded))
                                .foregroundColor(.secondary)
                                .tracking(0.5)
                        }
                    }
                    .padding(.top, 8)

                    // Wallet Selection Section
                    VStack(spacing: 12) {
                        Text("SELECTED WALLET")
                            .font(.system(size: 11, weight: .medium, design: .rounded))
                            //.foregroundColor(Color(.tertiaryLabel))
                            .tracking(0.8)

                        Button(action: { viewModel.showQrCode = true }) {
                            Text(viewModel.activeKeyPairName())
                                .font(.system(size: 14, weight: .medium, design: .rounded))
                                .foregroundColor(.primary)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(Color(.purple))
                                )
                        }
                        .buttonStyle(.plain)
                    }

                    // Actions Section
                    VStack(spacing: 8) {
                        NavigationLink(
                            destination: WalletSettingView(
                                viewModel: .init(activeKeyPair: viewModel.activeKeyPair))
                        ) {
                            HStack {
                                Text("Settings")
                                    .font(.system(size: 14, weight: .medium, design: .rounded))
                                    .foregroundColor(.primary)
                                Spacer()
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            .background(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color(.gray).opacity(0.6))
                            )
                        }
                        .buttonStyle(.plain)

                        Button(action: {
                            viewModel.confirmResetWallet = true
                        }) {
                            HStack {
                                Text("Reset Wallet")
                                    .font(.system(size: 14, weight: .medium, design: .rounded))
                                    .foregroundColor(.red)
                                Spacer()
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            .background(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color(.gray).opacity(0.6))
                            )
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 4)
            }
            .sheet(isPresented: $viewModel.showQrCode) {
                QRCodeView(
                    viewModel: .init(activeKeyPair: viewModel.activeKeyPair)
                )
            }
            .sheet(isPresented: $viewModel.showWalletInfo) {
                WalletInfoView(viewModel: .init())
            }
            .sheet(isPresented: $viewModel.confirmResetWallet) {
                ConfirmResetWalletView(onResetWallet: onResetWallet)
            }
        }
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
    private let onResetWallet: () -> Void
}

extension WalletViewV1 {
    final class ViewModel: ObservableObject {
        internal init(state: ViewState = ViewState.idle, activeKeyPair: Wallet) {
            self.state = state
            self.activeKeyPair = activeKeyPair
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(String)
        }

        enum OnboardingState {
            case done, new
        }

        @Published private(set) var state = ViewState.idle
        private(set) var activeKeyPair: Wallet

        @Published var showQrCode = false
        @Published var showWalletInfo = false
        @Published var confirmResetWallet = false

        @MainActor
        func walletBalance() async {
            do {
                state = .loading
                let balance = try await WalletKitV3.walletBalance(
                    network: .solanaTestnet, pubkey: activeKeyPair.pubkey)
                state = .loaded(balance)
            } catch {
                print(error)
                state = .failed(error)
            }
        }

        func activeKeyPairName() -> String {
            activeKeyPair.username ?? "NoName"
        }
    }
}

#Preview {
    WalletView(
        viewModel: .init(
            activeKeyPair: .init(
                id: "", username: nil, name: "", account: 0,
                pubkey: "EjEYahpsv5AADKHdv32wknbq59tsqZPDZJgyMpZ5qhnV", privkey: "", seedId: "")),
        onResetWallet: {})
}
