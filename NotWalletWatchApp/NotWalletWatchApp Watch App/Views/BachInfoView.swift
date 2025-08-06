import Combine
import SwiftUI

struct BachInfoView: View {
    // No need to provide static prices, we'll use the animated dummy data

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                Text("€BACH")
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(.purple)
                Text("Fixed supply: 12 million BACH")
                    .font(.system(size: 12, weight: .regular, design: .rounded))
                    .foregroundColor(.secondary)

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
            }
            .padding()
        }
    }
}

#Preview {
    BachInfoView()
}
