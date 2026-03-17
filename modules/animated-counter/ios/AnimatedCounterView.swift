import ExpoModulesCore
import SwiftUI

struct CounterView: View {
  var count: Int

  var body: some View {
    GeometryReader { geometry in
      let fontSize = min(geometry.size.width, geometry.size.height) * 0.85
      Text("\(count)")
        .font(.system(size: max(fontSize, 10), weight: .bold, design: .rounded).monospacedDigit())
        .foregroundColor(.blue)
        .lineLimit(1)
        .minimumScaleFactor(0.5)
        .contentTransition(.numericText(value: Double(count)))
        .animation(.spring(response: 0.4, dampingFraction: 0.6), value: count)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.clear)
    }
  }
}

class AnimatedCounterView: ExpoView {
  private var hostingController: UIHostingController<CounterView>?

  var count: Int = 0 {
    didSet {
      hostingController?.rootView = CounterView(count: count)
    }
  }

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    backgroundColor = .clear

    let rootView = CounterView(count: 0)
    hostingController = UIHostingController(rootView: rootView)

    if let hostView = hostingController?.view {
      hostView.backgroundColor = .clear
      hostView.isOpaque = false
      addSubview(hostView)
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }
}