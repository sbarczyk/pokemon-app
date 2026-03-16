package expo.modules.screenorientation

import android.content.res.Configuration
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenOrientationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ScreenOrientation")

    Function("getOrientation") {
      val orientation = appContext.reactContext?.resources?.configuration?.orientation
      
      if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
        "landscape"
      } else {
        "portrait"
      }
    }
  }
}