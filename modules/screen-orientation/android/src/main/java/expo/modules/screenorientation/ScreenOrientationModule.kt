package expo.modules.screenorientation

import android.content.Context
import android.content.res.Configuration
import android.content.ComponentCallbacks
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenOrientationModule : Module() {
  
  private val callbacks = object : ComponentCallbacks {
    override fun onConfigurationChanged(newConfig: Configuration) {
      val res = if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) "landscape" else "portrait"
      sendEvent("onChange", mapOf("orientation" to res))
    }
    override fun onLowMemory() {}
  }

  override fun definition() = ModuleDefinition {
    Name("ScreenOrientation")
    Events("onChange")

    Function("getOrientation") {
      val orientation = appContext.reactContext?.resources?.configuration?.orientation
      return@Function if (orientation == Configuration.ORIENTATION_LANDSCAPE) "landscape" else "portrait"
    }

    OnStartObserving {
      appContext.reactContext?.registerComponentCallbacks(callbacks)
    }

    OnStopObserving {
      appContext.reactContext?.unregisterComponentCallbacks(callbacks)
    }
  }
}