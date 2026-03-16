import ExpoModulesCore

public class ScreenOrientationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenOrientation")

    Events("onChange")

    Function("getOrientation") { () -> String in
      return UIDevice.current.orientation.isLandscape ? "landscape" : "portrait"
    }

    OnStartObserving {
      NotificationCenter.default.addObserver(
        forName: UIDevice.orientationDidChangeNotification,
        object: nil,
        queue: .main
      ) { [weak self] _ in
        let res = UIDevice.current.orientation.isLandscape ? "landscape" : "portrait"
        self?.sendEvent("onChange", ["orientation": res])
      }
    }

    OnStopObserving {
      NotificationCenter.default.removeObserver(self)
    }
  }
}