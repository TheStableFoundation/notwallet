import SwiftUI

struct Transaction: Identifiable {
    let id = UUID()
    let date: String
    let amount: String
    let description: String
}

struct TransactionListView: View {
    @State private var transactions: [Transaction] = [
        Transaction(date: "2025-07-13", amount: "+2.000 BACH", description: "Salary"),
        Transaction(date: "2025-07-12", amount: "-0.500 BACH", description: "Coffee Shop"),
        Transaction(date: "2025-07-11", amount: "+1.200 BACH", description: "Gift"),
        Transaction(date: "2025-07-10", amount: "-0.300 BACH", description: "Groceries"),
        Transaction(date: "2025-07-09", amount: "+0.800 BACH", description: "Refund")
    ]
    @State private var selectedTransaction: Transaction? = nil
    private let maxTransactions = 30
    private let loadBatch = 5
    
    private func loadMoreTransactions() {
        let currentCount = transactions.count
        guard currentCount < maxTransactions else { return }
        let newCount = min(currentCount + loadBatch, maxTransactions)
        let more = (currentCount..<newCount).map { i in
            Transaction(
                date: "2025-07-\(13 - i)",
                amount: (i % 2 == 0 ? "+" : "-") + String(format: "%.3f BACH", Double.random(in: 0.1...2.0)),
                description: "Extra Transaction #\(i + 1)"
            )
        }
        transactions.append(contentsOf: more)
    }
    
    var body: some View {
        List {
            ForEach(transactions) { tx in
                Button(action: {
                    selectedTransaction = tx
                }) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(tx.amount)
                            .font(.system(size: 18, weight: .semibold, design: .monospaced))
                            .foregroundColor(tx.amount.hasPrefix("+") ? .green : .red)
                        Text(tx.description)
                            .font(.system(size: 16, weight: .regular, design: .rounded))
                            .foregroundColor(.primary)
                        Text(tx.date)
                            .font(.system(size: 12, weight: .light, design: .rounded))
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 4)
                }
                .buttonStyle(.plain)
            }
            if transactions.count < maxTransactions {
                Button(action: loadMoreTransactions) {
                    HStack {
                        Spacer()
                        Text("Load More")
                            .font(.system(size: 16, weight: .medium))
                        Spacer()
                    }
                }
            }
        }
        .navigationTitle("Transactions")
        .sheet(item: $selectedTransaction) { tx in
            TransactionDetailView(transaction: tx)
        }
    }
}

#Preview {
    TransactionListView()
}
