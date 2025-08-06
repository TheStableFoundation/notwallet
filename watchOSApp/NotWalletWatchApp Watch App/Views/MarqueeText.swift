import SwiftUI

struct MarqueeText: View {
    let text: String
    let font: Font
    let leftFade: CGFloat
    let rightFade: CGFloat
    let startDelay: Double

    @State private var offset: CGFloat = 0
    @State private var textWidth: CGFloat = 0
    @State private var containerWidth: CGFloat = 0
    @State private var animating = false
    @State private var shouldAnimate = false

    private let timerInterval: TimeInterval = 0.03
    private let pixelsPerSecond: Double = 30

    var body: some View {
        TimelineView(.animation(minimumInterval: timerInterval)) { timeline in
            GeometryReader { geo in
                let containerW = geo.size.width

                ZStack(alignment: .leading) {
                    // Content with measurement
                    HStack(spacing: 0) {
                        Text(text)
                            .font(font)
                            .fixedSize(horizontal: true, vertical: false)
                            .background(
                                GeometryReader { textGeo in
                                    Color.clear
                                        .onAppear {
                                            textWidth = textGeo.size.width
                                            containerWidth = containerW
                                            shouldAnimate = textWidth > containerW

                                            // Start with no offset
                                            offset = 0

                                            // Start animation after delay
                                            DispatchQueue.main.asyncAfter(
                                                deadline: .now() + startDelay
                                            ) {
                                                animating = shouldAnimate
                                            }
                                        }
                                }
                            )
                            .offset(x: shouldAnimate ? offset : 0)
                            .onChange(of: timeline.date) { newValue in
                                if animating && shouldAnimate {
                                    // Calculate how much to move based on time passed
                                    let delta = timerInterval * pixelsPerSecond

                                    // Update offset, creating a scrolling effect
                                    offset -= delta

                                    // Reset when text has scrolled out of view with some buffer
                                    if abs(offset) > (textWidth + 20) {
                                        offset = containerW
                                    }
                                }
                            }
                    }

                    // Fade effects
                    HStack(spacing: 0) {
                        // Left fade
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color.black,
                                Color.black.opacity(0),
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .frame(width: leftFade)

                        Spacer()

                        // Right fade
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color.black.opacity(0),
                                Color.black,
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .frame(width: rightFade)
                    }
                    .frame(width: containerW)
                }
            }
            .frame(height: getFontSize() + 8)
            .clipShape(Rectangle())
        }
    }

    // Helper to estimate font size
    private func getFontSize() -> CGFloat {
        switch font {
        case .largeTitle: return 34
        case .title: return 28
        case .title2: return 22
        case .title3: return 20
        case .headline: return 17
        case .subheadline: return 15
        case .callout: return 16
        case .caption: return 12
        case .caption2: return 11
        default: return 17
        }
    }
}

struct MarqueeText_Previews: PreviewProvider {
    static var previews: some View {
        MarqueeText(
            text: "This is a very long text that should scroll on watchOS",
            font: .system(size: 18),
            leftFade: 8,
            rightFade: 8,
            startDelay: 1.0
        )
        .frame(width: 150)
        .background(Color.gray.opacity(0.2))
        .clipShape(Rectangle())
    }
}
