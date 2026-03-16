import { requireNativeModule, EventSubscription } from 'expo-modules-core';
import { ChangeEventPayload } from './src/ScreenOrientation.types';

const ScreenOrientationModule = requireNativeModule('ScreenOrientation');

export function getOrientation(): string {
  return ScreenOrientationModule.getOrientation();
}

export function addOrientationListener(listener: (event: ChangeEventPayload) => void): EventSubscription {
  return ScreenOrientationModule.addListener('onChange', listener);
}