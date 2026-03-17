import { NativeModule, requireNativeModule } from 'expo';

import { AnimatedCounterModuleEvents } from './AnimatedCounter.types';

declare class AnimatedCounterModule extends NativeModule<AnimatedCounterModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AnimatedCounterModule>('AnimatedCounter');
