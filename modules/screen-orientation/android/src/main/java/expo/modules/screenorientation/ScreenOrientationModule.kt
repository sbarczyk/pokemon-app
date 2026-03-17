package expo.modules.screenorientation

import android.view.OrientationEventListener
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenOrientationModule : Module() {

  private var lastOrientation = "unknown"

  private val orientationListener by lazy {
    object : OrientationEventListener(appContext.reactContext) {
      override fun onOrientationChanged(orientation: Int) {
        if (orientation == -1) return

        val newOrientation = when (orientation) {
          in 45..134 -> "landscape-reversed"
          in 135..224 -> "portrait-reversed"
          in 225..314 -> "landscape"
          else -> "portrait"
        }

        if (newOrientation != lastOrientation) {
          lastOrientation = newOrientation
          println("SCREEN_ORIENTATION_NATIVE: $newOrientation")
          sendEvent("onChange", mapOf("orientation" to newOrientation))
        }
      }
    }
  }

  override fun definition() = ModuleDefinition {
    Name("ScreenOrientation")
    Events("onChange")

    OnStartObserving {
      if (orientationListener.canDetectOrientation()) {
        orientationListener.enable()
      }
    }

    OnStopObserving {
      orientationListener.disable()
    }

    Function("getOrientation") {
      return@Function lastOrientation
    }
  }
}