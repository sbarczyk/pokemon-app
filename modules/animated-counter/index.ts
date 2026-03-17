// Reexport the native module. On web, it will be resolved to AnimatedCounterModule.web.ts
// and on native platforms to AnimatedCounterModule.ts
export { default } from './src/AnimatedCounterModule';
export { default as AnimatedCounterView } from './src/AnimatedCounterView';
export * from  './src/AnimatedCounter.types';
