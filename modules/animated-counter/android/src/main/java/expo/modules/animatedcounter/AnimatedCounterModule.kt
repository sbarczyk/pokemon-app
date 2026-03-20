package expo.modules.animatedcounter

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AnimatedCounterModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AnimatedCounter")

    View(AnimatedCounterView::class) {
      Prop("count") { view: AnimatedCounterView, count: Int ->
        view.updateCount(count)
      }
    }
  }
}
