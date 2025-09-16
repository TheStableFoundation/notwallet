//
//  WalletView.swift
//  NotWallet Watch App
//
//  Created by Seto Elkahfi on 2025-07-14.
//

import Combine
import SwiftUI
import WalletKitV3


struct WalletView: View {
    
    init(
        viewModel: WalletView.ViewModel,
        onResetWallet: @escaping () -> Void
    ) {
        self.viewModel = viewModel
        self.onResetWallet = onResetWallet
    }

    var body: some View {
        ScrollView {
            switch viewModel.state {
            case .loading:
                ProgressView().frame(alignment: .center)
            case .idle:
                Color.clear.onAppear(perform: {
                    Task {
                         await viewModel.walletBalance()
                    }
                })
            case .loaded(let balance):
                Text(balance)
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(.purple)
            case .failed(_):
                Text("N/A")
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(.purple)
            }
            
            Text("Your active Solana wallet")
                .font(.system(size: 12, weight: .regular, design: .rounded))
                .foregroundColor(.secondary)

            Divider()
            
            Button(action: { viewModel.showTransactions = true }) {
                MarqueeText(
                    text: viewModel.activeKeyPair.pubkey,
                    font: .system(size: 20, weight: .medium, design: .monospaced),
                    leftFade: 8, rightFade: 8, startDelay: 1.5
                )
                .foregroundColor(.purple)
                .padding(.bottom, 8)
                .frame(height: 28)
                .clipShape(Rectangle())
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            
            Button(action: {
                viewModel.showWalletInfo = true
            }) {
                Text("Info")
                    .foregroundColor(.green)
                    .padding(.vertical, 6)
                    .frame(height: 18)
                    .clipShape(Rectangle())
                    .contentShape(Rectangle())
                
                Image(systemName: "info.circle.fill")
                    .renderingMode(.original)
                    .font(.caption2)
            }
            .buttonStyle(.bordered)
            .frame(maxWidth: .infinity)
            /*
            Button(action: {
                viewModel.showBachInfo = true
            }) {
                Text("Switch Wallet")
                    .foregroundColor(.green)
                    .padding(.vertical, 6)
                    .frame(height: 18)
                    .clipShape(Rectangle())
                    .contentShape(Rectangle())
            }
            .buttonStyle(.bordered)
            .frame(maxWidth: .infinity)*/
            Button(action: {
                viewModel.confirmResetWallet = true
            }) {
                Text("Reset Wallet")
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
        .sheet(isPresented: $viewModel.showTransactions) {
            TransactionListView()
        }
        .sheet(isPresented: $viewModel.showWalletInfo) {
            WalletInfoView(viewModel: .init())
        }
        .sheet(isPresented: $viewModel.confirmResetWallet) {
            ConfirmResetWalletView(onResetWallet: onResetWallet)
        }
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
    private let onResetWallet: () -> Void
}


extension WalletView {
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
        
        @Published var showTransactions = false
        @Published var showWalletInfo = false
        @Published var confirmResetWallet = false
        
        @MainActor
        func walletBalance() async {
            do {
                state = .loading
                let balance = try await WalletKitV3.walletBalance(network: .solanaTestnet, pubkey: activeKeyPair.pubkey)
                state = .loaded(balance)
            } catch {
                state = .failed(error)
            }
        }
    }
}

#Preview {
    WalletView(
        viewModel: .init(activeKeyPair: .init(id: "", username: nil, name: "", account: 0, pubkey: "EjEYahpsv5AADKHdv32wknbq59tsqZPDZJgyMpZ5qhnV", privkey: "", seedId: "")),
        onResetWallet: {})
}
