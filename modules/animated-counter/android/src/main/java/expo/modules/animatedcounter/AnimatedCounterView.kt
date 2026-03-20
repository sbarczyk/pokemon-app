package expo.modules.animatedcounter

import android.content.Context
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.min
import androidx.compose.ui.unit.sp
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class AnimatedCounterView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {

  private val countState = mutableIntStateOf(0)

  init {
    val composeView = ComposeView(context).apply {
      layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
      setContent {
        val count by countState
        AnimatedCounter(count = count)
      }
    }
    addView(composeView)
  }

  fun updateCount(newCount: Int) {
    countState.intValue = newCount
  }
}

@Composable
private fun AnimatedCounter(count: Int) {
  var countingUp by remember { mutableStateOf(true) }
  var prevCount by remember { mutableIntStateOf(count) }

  if (count != prevCount) {
    countingUp = count > prevCount
    prevCount = count
  }

  val countStr = count.toString()
  val isCountingUp = countingUp

  BoxWithConstraints(
    modifier = Modifier
      .fillMaxSize()
      .background(Color.Transparent),
    contentAlignment = Alignment.Center
  ) {
    val fontSize = (min(maxWidth, maxHeight) * 0.75f).value.sp

    Row(
      horizontalArrangement = Arrangement.Center,
      verticalAlignment = Alignment.CenterVertically
    ) {
      val digits = countStr.toList()
      val totalDigits = digits.size

      digits.forEachIndexed { index, _ ->
        val posFromRight = totalDigits - 1 - index
        key(posFromRight) {
          AnimatedContent(
            targetState = countStr[index],
            transitionSpec = {
              val slideDir = if (isCountingUp) 1 else -1
              (slideInVertically(
                animationSpec = androidx.compose.animation.core.spring(
                  dampingRatio = 0.55f,
                  stiffness = 380f
                )
              ) { height -> slideDir * height } + fadeIn()) togetherWith
                (slideOutVertically(
                  animationSpec = androidx.compose.animation.core.spring(
                    dampingRatio = 0.55f,
                    stiffness = 380f
                  )
                ) { height -> -slideDir * height } + fadeOut())
            },
            label = "digit_$posFromRight"
          ) { digit ->
            Text(
              text = digit.toString(),
              fontSize = fontSize,
              fontWeight = FontWeight.Bold,
              color = Color.Blue
            )
          }
        }
      }
    }
  }
}
