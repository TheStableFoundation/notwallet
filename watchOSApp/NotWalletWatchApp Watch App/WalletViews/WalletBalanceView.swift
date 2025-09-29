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
        viewModel: ViewModel = .init(),
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
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.purple)
                    case .loaded(let balances):
                        Text("Balance")
                            .font(.title)
                            .foregroundColor(.purple)
                        
                            ForEach(balances, id: \.id) { balance in
                                    HStack(alignment: .lastTextBaseline) {
                                        Text("\(balance.balance) \(balance.id)")
                                            .alignmentGuide(.trailing) {  _ in
                                                -10
                                            }
                                    }
                                    .frame(width: .greatestFiniteMagnitude, height: minRowHeight, alignment: .trailing)
                                    .border(Color.purple)
                            }
                            .frame(minHeight: minRowHeight)
                        
                        
                        Divider()
                        
                        Button(action: {
                            Task {
                                // Call the callback
                                // onResetWallet()
                            }
                        }) {
                            HStack {
                                Image(systemName: "gear")
                                Text("Balance Settings")
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
                        .buttonStyle(.plain)
                         
                    }
                }
            }
        }
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
    private let onResetWallet: () -> Void
    
    // MARK: - Environment
    
    @Environment(\.defaultMinListRowHeight) private var minRowHeight
}

extension WalletBalanceView {
    final class ViewModel: ObservableObject {
        internal init(state: ViewState = ViewState.idle) {
            self.state = state
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded([Balance])
        }

        enum OnboardingState {
            case done, new
        }

        @Published private(set) var state = ViewState.idle

        @MainActor
        func initialize() async throws {
            print("Get aggregate wallet balance")
            state = .loading
            let balances = try await walletBalanceAggregate(
                network: .solanaMainnet,
                pubkey: ""
            )
            state = .loaded(balances)
        }

        // MARK: - Private

        private let userDefault = UserDefaults.standard
    }
}

#Preview {
    WalletBalanceView(
        viewModel: .init(
            state: .loaded([
                Balance(id: "SOL", balance: "4.5"),
                Balance(id: "BACH", balance: "7.6"),
            ])
        ),
        onResetWallet: {}
    )
}
