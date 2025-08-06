import SwiftUI

struct TransactionDetailView: View {
    let transaction: Transaction
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(transaction.amount)
                .font(.system(size: 28, weight: .bold, design: .monospaced))
                .foregroundColor(transaction.amount.hasPrefix("+") ? .green : .red)
            Text(transaction.description)
                .font(.title2)
                .foregroundColor(.primary)
            Text("Date: \(transaction.date)")
                .font(.subheadline)
                .foregroundColor(.secondary)
            Spacer()
        }
        .padding()
        .navigationTitle("Detail")
    }
}

#Preview {
    TransactionDetailView(transaction: Transaction(date: "2025-07-13", amount: "+2.000 BACH", description: "Salary"))
}
