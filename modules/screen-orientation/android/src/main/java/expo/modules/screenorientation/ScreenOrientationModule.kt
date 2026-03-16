package expo.modules.screenorientation

import android.content.res.Configuration
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenOrientationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ScreenOrientation")

    Events("onChange")

    Function("getOrientation") {
      val isLandscape = appContext.reactContext?.resources?.configuration?.orientation == Configuration.ORIENTATION_LANDSCAPE
      return@Function if (isLandscape) "landscape" else "portrait"
    }

    OnConfigurationChanged {
      val isLandscape = appContext.reactContext?.resources?.configuration?.orientation == Configuration.ORIENTATION_LANDSCAPE
      val res = if (isLandscape) "landscape" else "portrait"
      sendEvent("onChange", mapOf("orientation" to res))
    }
  }
}