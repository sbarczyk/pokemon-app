import ExpoModulesCore

public class ScreenOrientationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenOrientation")

    Function("getOrientation") { () -> String in
      let interfaceOrientation = UIApplication.shared.windows.first?.windowScene?.interfaceOrientation
      
      if interfaceOrientation?.isLandscape ?? false {
        return "landscape"
      } else {
        return "portrait"
      }
    }
  }
}