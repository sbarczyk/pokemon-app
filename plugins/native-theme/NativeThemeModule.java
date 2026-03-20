package __JAVA_PACKAGE__;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NativeThemeModule extends NativeThemeSpec {

  public static final String NAME = "NativeTheme";
  private static final String THEME_CHANGE_EVENT = "onThemeChange";
  private BroadcastReceiver receiver;

  public NativeThemeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public String getColorScheme() {
    int uiMode = getReactApplicationContext()
      .getResources()
      .getConfiguration()
      .uiMode & Configuration.UI_MODE_NIGHT_MASK;

    if (uiMode == Configuration.UI_MODE_NIGHT_YES) {
      return "dark";
    } else if (uiMode == Configuration.UI_MODE_NIGHT_NO) {
      return "light";
    } else {
      return "unspecified";
    }
  }

  @Override
  public void addListener(String eventName) {
    receiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        ReactContext reactContext = getReactApplicationContext();
        reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(THEME_CHANGE_EVENT, getColorScheme());
      }
    };

    IntentFilter filter = new IntentFilter(Intent.ACTION_CONFIGURATION_CHANGED);
    getReactApplicationContext().registerReceiver(receiver, filter);
  }

  @Override
  public void removeListeners(double count) {
    if (receiver != null) {
      getReactApplicationContext().unregisterReceiver(receiver);
      receiver = null;
    }
  }
}
