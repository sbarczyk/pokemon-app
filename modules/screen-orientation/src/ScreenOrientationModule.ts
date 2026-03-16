import { NativeModule, requireNativeModule } from 'expo';

declare class ScreenOrientationModule extends NativeModule {
  getOrientation(): 'landscape' | 'portrait' | 'unknown';
}

export default requireNativeModule<ScreenOrientationModule>('ScreenOrientation');