import Combine
import SwiftUI
import WalletKitV3

struct WalletInfoView: View {
    
    internal init(viewModel: WalletInfoView.ViewModel) {
        self.viewModel = viewModel
    }
    
    
    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                Text("Addres")
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(.purple)

                PriceGraphView(prices: [])
                    .frame(height: 60)
                    .padding(.vertical, 8)

                Divider()
                Text("Token Information")
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                    .foregroundColor(.primary)
                VStack(alignment: .leading, spacing: 4) {
                    Text("Symbol: BACH")
                        .font(.system(size: 16, weight: .regular, design: .rounded))
                    Text("Network: Solana")
                        .font(.system(size: 16, weight: .regular, design: .rounded))
                    Text("Decimals: 12")
                        .font(.system(size: 16, weight: .regular, design: .rounded))
                }
                Divider()
                
                AssetsListView()
            }
        }
    }
    
    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
}

extension WalletInfoView {
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
    WalletInfoView(viewModel: .init())
}
