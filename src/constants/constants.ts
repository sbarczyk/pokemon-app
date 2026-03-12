import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CONTENT_SPACING = 15;
export const MAX_ZOOM_FACTOR = 10;
export const CAPTURE_BUTTON_SIZE = 78;
export const CONTROL_BUTTON_SIZE = 40;

export const useLayoutConstants = () => {
  const insets = useSafeAreaInsets();
  
  const window = Dimensions.get('window');
  const screen = Dimensions.get('screen');

  const SCREEN_WIDTH = window.width;
  
  const SCREEN_HEIGHT = Platform.select<number>({
    android: screen.height - insets.bottom - insets.top,
    ios: window.height - insets.bottom,
  }) ?? window.height;

  return {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    SAFE_BOTTOM: insets.bottom,
    SAFE_TOP: insets.top,
  };
};