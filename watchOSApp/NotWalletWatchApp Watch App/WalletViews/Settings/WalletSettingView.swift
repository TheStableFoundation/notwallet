//
//  WalletSettingView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import Combine
import SwiftUI
import WalletKitV3

struct WalletSettingView: View {

    internal init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        NavigationView {
            switch viewModel.state {
            case .idle:
                Color.clear.onAppear(perform: {
                    viewModel.initialize()
                })
            case .loading:
                ProgressView("Processing").frame(alignment: .center)
            case .failed:
                VStack(spacing: 8) {
                    Text("Something wrong").frame(alignment: .center).multilineTextAlignment(.center)
                    Button(action: { viewModel.onAppear() }) {
                        HStack {
                            Image(systemName: "info.circle")
                            Text("Reload")
                        }
                    }
                }
                .padding(.horizontal, 8)
            case .loaded(let wallet):
                walletSetting(wallet: wallet)
                    .navigationTitle("Settings")
                    .navigationBarTitleDisplayMode(.inline)
                    .sheet(isPresented: $viewModel.showCreate) {
                        CreateWalletAccountView(
                            viewModel: .init(
                                activeKeyPair: viewModel.activeKeyPair
                            ),
                        )
                    }
                    .sheet(isPresented: $viewModel.showSeedPhrase) {
                        WalletSeedPhraseView(
                            viewModel: .init(
                                activeKeyPair: viewModel.activeKeyPair
                            ),
                        )
                    }
            }
        }
        .onAppear {
            viewModel.onAppear()
        }
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
    
    @ViewBuilder
    private func walletSetting(wallet: Wallet) -> some View {
        Form {
            Group {
                VStack(spacing: 2) {
                    Spacer()
                    
                    Text(wallet.initial())
                        .font(.title)
                        .foregroundColor(.purple)
                    
                    Text(wallet.name)
                        .font(.caption)
                    
                    Spacer()
                    
                    NavigationLink(
                        destination: EditWalletView(
                            viewModel: .init(
                                activeKeyPair: wallet,
                                onEditWalletDone: viewModel.onEditWalletDone(wallet:)
                            )
                        )
                    ) {
                        Text("Edit Wallet")
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .font(.system(size: 18))
                            .padding()
                            .foregroundColor(.white)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color(.darkGray).opacity(0.6))
                            )
                    }
                }
                .padding(.bottom, 16)
            }
            Section(
                header: Text("Wallet"),
                content: {
                    if viewModel.shouldShowSelectWalletOption {
                        HStack {
                            NavigationLink(
                                destination: SelectActiveWalletView(
                                    viewModel: .init(
                                        activeKeyPair: wallet,
                                        onSelectWalletDone: viewModel.onEditWalletDone(wallet:)
                                    )
                                )
                            ) {
                                
                                Image(systemName: "arrow.right.arrow.left")
                                Text("Switch")
                            }
                        }
                    }
                    
                    Button(action: { viewModel.showCreate = true }) {
                        HStack {
                            Image(systemName: "plus.rectangle")
                            Text("Generate New")
                            
                        }
                    }
                    
                    Button(action: { viewModel.showSeedPhrase = true }) {
                        HStack {
                            Image(systemName: "eye.fill")
                            Text("Show Seed Phrase")
                            
                        }
                    }
                    
                })
        }
    }
}

extension WalletSettingView {
    final class ViewModel: ObservableObject {
        internal init(
            state: ViewState = ViewState.idle,
            activeKeyPair: Wallet,
            onActiveKeyPairChanged: @escaping (Wallet) -> Void
        ) {
            self.state = state
            self.activeKeyPair = activeKeyPair
            self.onActiveKeyPairChanged = onActiveKeyPairChanged
            self.walletManagement = WalletManagement()
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(Wallet)
        }

        enum OnboardingState {
            case done, new
        }
        
        func onAppear() {
            state = .idle
        }
        
        func initialize() {
            do {
                state = .loading
                let wallet = try walletManagement.getActiveKeypair()
                shouldShowSelectWalletOption = true
                state = .loaded(wallet)
            } catch {
                state = .failed(error)
            }
        }

        func onEditWalletDone(wallet: Wallet) {
            activeKeyPair = wallet
            onActiveKeyPairChanged(wallet)
        }

        @Published var showCreate = false
        @Published var showSeedPhrase = false
        @Published var shouldShowSelectWalletOption = false

        // - MARK: Private

        @Published private(set) var state = ViewState.idle
        @Published private(set) var activeKeyPair: Wallet
        private let onActiveKeyPairChanged: (Wallet) -> Void
        private let walletManagement: WalletManagement

    }
}

#Preview {
    WalletSettingView(
        viewModel: .init(
            activeKeyPair: .init(
                id: "",
                username: nil,
                name: "test",
                account: 0,
                pubkey: "EjEYahpsv5AADKHdv32wknbq59tsqZPDZJgyMpZ5qhnV",
                privkey: "",
                seedId: ""
            ),
            onActiveKeyPairChanged: { _ in }
        )
    )
}
