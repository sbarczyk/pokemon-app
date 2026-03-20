import { Appearance, NativeEventEmitter, TurboModuleRegistry } from 'react-native';

type NativeThemeModule = {
  getColorScheme(): string;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
};

function getNativeThemeModule(): NativeThemeModule | undefined {
  const mod = TurboModuleRegistry.get('NativeTheme') as NativeThemeModule | null;
  return mod ?? undefined;
}

function normalizeScheme(raw: string | null | undefined): 'light' | 'dark' {
  if (raw === 'dark') return 'dark';
  if (raw === 'light') return 'light';
  const fallback = Appearance.getColorScheme();
  return fallback === 'dark' ? 'dark' : 'light';
}

/** Odczyt schematu z natywnego TurboModule NativeTheme (Android/iOS), z fallbackiem do Appearance. */
export function getSystemColorScheme(): 'light' | 'dark' {
  const mod = getNativeThemeModule();
  if (mod) return normalizeScheme(mod.getColorScheme());
  return normalizeScheme(Appearance.getColorScheme());
}

/** Nasłuch zmiany motywu systemu — zdarzenie onThemeChange z natywnego modułu lub Appearance. */
export function subscribeSystemColorScheme(
  onChange: (scheme: 'light' | 'dark') => void,
): { remove: () => void } {
  const mod = getNativeThemeModule();
  if (mod) {
    const emitter = new NativeEventEmitter(mod);
    return emitter.addListener('onThemeChange', (scheme: string) => {
      onChange(normalizeScheme(scheme));
    });
  }
  return Appearance.addChangeListener(({ colorScheme }) => {
    onChange(normalizeScheme(colorScheme));
  });
}
