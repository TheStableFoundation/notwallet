import Combine
import SwiftUI

struct PriceGraphView: View {
    var prices: [Double]

    // If no external prices are provided, use the dummy data
    @StateObject private var dummyDataSource = DummyPriceDataSource()

    private var displayPrices: [Double] {
        return prices.isEmpty ? dummyDataSource.prices : prices
    }

    var normalizedPrices: [CGFloat] {
        guard let min = displayPrices.min(), let max = displayPrices.max(), max > min else {
            return displayPrices.map { _ in 0.5 }
        }
        return displayPrices.map { CGFloat(($0 - min) / (max - min)) }
    }

    var body: some View {
        GeometryReader { geo in
            ZStack {
                // Background
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.gray.opacity(0.2))

                // Price line
                Path { path in
                    let width = geo.size.width
                    let height = geo.size.height
                    let step = width / CGFloat(max(normalizedPrices.count - 1, 1))
                    for (i, value) in normalizedPrices.enumerated() {
                        let x = CGFloat(i) * step
                        let y = height * (1 - value)
                        if i == 0 {
                            path.move(to: CGPoint(x: x, y: y))
                        } else {
                            path.addLine(to: CGPoint(x: x, y: y))
                        }
                    }
                }
                .stroke(Color.purple, lineWidth: 2)

                // Gradient overlay on the path
                LinearGradient(
                    gradient: Gradient(colors: [.purple, .purple.opacity(0.5)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .mask(
                    Path { path in
                        let width = geo.size.width
                        let height = geo.size.height
                        let step = width / CGFloat(max(normalizedPrices.count - 1, 1))

                        // Start at bottom left
                        path.move(to: CGPoint(x: 0, y: height))

                        // Move to first data point
                        let firstY = height * (1 - normalizedPrices.first!)
                        path.addLine(to: CGPoint(x: 0, y: firstY))

                        // Draw lines through all points
                        for (i, value) in normalizedPrices.enumerated() {
                            let x = CGFloat(i) * step
                            let y = height * (1 - value)
                            path.addLine(to: CGPoint(x: x, y: y))
                        }

                        // Draw line to bottom right and close the path
                        path.addLine(to: CGPoint(x: width, y: height))
                        path.closeSubpath()
                    }
                )
                .opacity(0.3)
            }
        }
        .onAppear {
            if prices.isEmpty {
                dummyDataSource.startUpdating()
            }
        }
        .onDisappear {
            dummyDataSource.stopUpdating()
        }
    }
}

// Dummy data source that provides continuously updating price data
class DummyPriceDataSource: ObservableObject {
    @Published var prices: [Double] = []
    private let dataPointCount = 20
    private var cancellables = Set<AnyCancellable>()

    init() {
        // Initialize with some random data
        prices = generateInitialPrices()
    }

    func startUpdating() {
        // Update every 2 seconds
        Timer.publish(every: 2.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.updatePrices()
            }
            .store(in: &cancellables)
    }

    func stopUpdating() {
        cancellables.forEach { $0.cancel() }
        cancellables.removeAll()
    }

    private func generateInitialPrices() -> [Double] {
        // Start with a realistic-looking price curve
        return (0..<dataPointCount).map { i in
            let base = 10000.0
            let trend = sin(Double(i) / 3.0) * 200.0
            let noise = Double.random(in: -100.0...100.0)
            return base + trend + noise
        }
    }

    private func updatePrices() {
        // Remove the oldest price and add a new one
        var newPrices = prices
        if !newPrices.isEmpty {
            newPrices.removeFirst()

            // Generate new price based on the last one with some randomness
            let lastPrice = newPrices.last ?? 10000.0
            let change = Double.random(in: -40.0...40.0)
            let trendForce = (10000.0 - lastPrice) * 0.02  // pull towards 10000
            let newPrice = lastPrice + change + trendForce

            newPrices.append(newPrice)

            // Update the published prices
            prices = newPrices
        } else {
            // If prices somehow became empty, regenerate
            prices = generateInitialPrices()
        }
    }
}

struct PriceGraphView_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Text("BACH Price Chart")
                .font(.caption)
                .foregroundColor(.secondary)

            PriceGraphView(prices: [])
                .frame(height: 100)
                .padding()
        }
    }
}
