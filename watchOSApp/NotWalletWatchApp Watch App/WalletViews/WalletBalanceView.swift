//
//  WalletBalanceView.swift
//  NotWallet Watch App
//
//  Created by Seto Elkahfi on 2025-07-14.
//

import Combine
import SwiftUI
import WalletKitV3

struct WalletBalanceView: View {

    init(
        viewModel: ViewModel,
        onResetWallet: @escaping () -> Void
    ) {
        self.viewModel = viewModel
        self.onResetWallet = onResetWallet
    }

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 8) {
                    switch viewModel.state {
                    case .loading:
                        ProgressView().frame(alignment: .center)
                    case .idle:
                        Color.clear.onAppear(perform: {
                            Task {
                                try await viewModel.initialize()
                            }
                        })
                    case .failed:
                        Text("N/A")
                            .font(.system(size: 24, weight: .bold, design: .rounded))
                            .foregroundColor(.purple)
                    case .loaded(let balances):
                        Text("Balance")
                            .font(.system(size: 24, weight: .bold, design: .rounded))
                            .foregroundColor(.purple)

                        ForEach(balances, id: \.meta.address) { balance in
                            Button(action: { }) {
                                VStack(alignment: .leading) {
                                    Text("\(balance.display())")
                                        .alignmentGuide(.trailing) { _ in
                                            -10
                                        }
                                        .padding(.horizontal)
                                    Text(balance.meta.address)
                                        .font(.system(size: 12, weight: .light, design: .rounded))
                                        .foregroundColor(.yellow)
                                        .padding(.horizontal)
                                }
                                .background(
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(Color(.purple))
                                )
                                .padding()
                            }
                            .buttonStyle(.plain)
                        }
                        .frame(minHeight: minRowHeight)
                        
                        /*
                        Divider()

                        Button(action: {
                            Task {
                                // Call the callback
                                // onResetWallet()
                            }
                        }) {
                            HStack {
                                Image(systemName: "gear")
                                Text("Balance settings")
                                    .font(.system(size: 18, weight: .medium, design: .rounded))
                                    .foregroundColor(.primary)
                                    .frame(height: 24)

                                Spacer()
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            .background(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(Color(.darkGray).opacity(0.6))
                            )
                        }
                        .buttonStyle(.plain)*/

                    }
                }
            }
        }
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
    private let onResetWallet: () -> Void

    // MARK: - Environment

    @SwiftUI.Environment(\.defaultMinListRowHeight) private var minRowHeight
}

extension WalletBalanceView {
    final class ViewModel: ObservableObject {
        internal init(state: ViewState = ViewState.idle, activeKeyPair: Wallet) {
            self.state = state
            self.activeKeyPair = activeKeyPair
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded([BalanceV1])
        }

        @Published private(set) var state = ViewState.idle

        @MainActor
        func initialize() async throws {
            print("Get aggregate wallet balance")
            state = .loading
            let balances = try await getWalletPortfolio(wallet: activeKeyPair.pubkey)
            state = .loaded(balances)
        }

        // MARK: - Private

        @Published private(set) var activeKeyPair: Wallet
    }
}

#Preview {
    WalletBalanceView(
        viewModel: .init(
            state: .loaded([]),
            activeKeyPair: .init(
                id: "",
                username: nil,
                name: "",
                account: 2,
                pubkey: "",
                privkey: "",
                seedId: ""
            )
        ),
        onResetWallet: {}
    )
}
