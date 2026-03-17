import ExpoModulesCore

public class AnimatedCounterModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AnimatedCounter")

    View(AnimatedCounterView.self) {
      Prop("count") { (view: AnimatedCounterView, prop: Int) in
        view.count = prop
      }
    }
  } 
}