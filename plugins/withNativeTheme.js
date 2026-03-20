const fs = require('fs');
const path = require('path');
const {
  createRunOncePlugin,
  PluginError,
  withDangerousMod,
  withMainApplication,
  withPodfile,
} = require('@expo/config-plugins');

const PLUGIN_NAME = 'with-native-theme';
const PLUGIN_VERSION = '1.0.0';

function getJavaPackage(projectRoot) {
  const appPkg = require(path.join(projectRoot, 'package.json'));
  const javaPackage = appPkg.codegenConfig?.android?.javaPackageName;
  if (!javaPackage || typeof javaPackage !== 'string') {
    throw new PluginError(
      PLUGIN_NAME,
      'Brak package.json → codegenConfig.android.javaPackageName (musi być zgodny z NativeThemeSpec).',
    );
  }
  return javaPackage;
}

function copyTemplateFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function withNativeThemeAndroidSources(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      if (config.modRequest.introspect) {
        return config;
      }
      const projectRoot = config.modRequest.projectRoot;
      const androidRoot = config.modRequest.platformProjectRoot;
      const javaPackage = getJavaPackage(projectRoot);
      const templateRoot = path.join(__dirname, 'native-theme');
      const relJava = javaPackage.split('.');
      const javaOutDir = path.join(androidRoot, 'app/src/main/java', ...relJava);

      const moduleSrc = path.join(templateRoot, 'NativeThemeModule.java');
      const packageSrc = path.join(templateRoot, 'NativeThemePackage.java');
      const moduleBody = fs
        .readFileSync(moduleSrc, 'utf8')
        .replace(/^package __JAVA_PACKAGE__;/m, `package ${javaPackage};`);
      const packageBody = fs
        .readFileSync(packageSrc, 'utf8')
        .replace(/^package __JAVA_PACKAGE__;/m, `package ${javaPackage};`);

      fs.mkdirSync(javaOutDir, { recursive: true });
      fs.writeFileSync(path.join(javaOutDir, 'NativeThemeModule.java'), moduleBody);
      fs.writeFileSync(path.join(javaOutDir, 'NativeThemePackage.java'), packageBody);

      return config;
    },
  ]);
}

function withNativeThemeIosSources(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      if (config.modRequest.introspect) {
        return config;
      }
      const iosRoot = config.modRequest.platformProjectRoot;
      const destDir = path.join(iosRoot, 'NativeTheme');
      const templateDir = path.join(__dirname, 'native-theme', 'ios');
      for (const name of ['RCTNativeTheme.h', 'RCTNativeTheme.mm', 'NativeTheme.podspec']) {
        copyTemplateFile(path.join(templateDir, name), path.join(destDir, name));
      }
      return config;
    },
  ]);
}

function withNativeThemeMainApplication(config) {
  return withMainApplication(config, (config) => {
    let contents = config.modResults.contents;
    if (contents.includes('NativeThemePackage')) {
      return config;
    }
    const javaPackage = getJavaPackage(config.modRequest.projectRoot);
    const importLine = `import ${javaPackage}.NativeThemePackage`;
    const expoImport = 'import expo.modules.ApplicationLifecycleDispatcher';
    if (!contents.includes(expoImport)) {
      throw new PluginError(
        PLUGIN_NAME,
        'Nie znaleziono importu ApplicationLifecycleDispatcher — nieznany szablon MainApplication.',
      );
    }
    if (!contents.includes(importLine)) {
      contents = contents.replace(
        expoImport,
        `${importLine}\n\n${expoImport}`,
      );
    }
    if (!contents.includes('add(NativeThemePackage())')) {
      contents = contents.replace(
        /PackageList\(this\)\.packages\.apply\s*\{/,
        (m) => `${m}\n          add(NativeThemePackage())`,
      );
    }
    config.modResults.contents = contents;
    return config;
  });
}

function withNativeThemePodfile(config) {
  return withPodfile(config, (config) => {
    let contents = config.modResults.contents;
    if (contents.includes("pod 'NativeTheme'")) {
      return config;
    }
    const anchor = /\n  post_install do \|installer\|/;
    if (!anchor.test(contents)) {
      throw new PluginError(
        PLUGIN_NAME,
        'Nie znaleziono bloku post_install w Podfile — nieznany szablon.',
      );
    }
    contents = contents.replace(
      anchor,
      "\n\n  pod 'NativeTheme', :path => 'NativeTheme'\n\n  post_install do |installer|",
    );
    config.modResults.contents = contents;
    return config;
  });
}

function withNativeTheme(config) {
  config = withNativeThemeAndroidSources(config);
  config = withNativeThemeIosSources(config);
  config = withNativeThemeMainApplication(config);
  config = withNativeThemePodfile(config);
  return config;
}

module.exports = createRunOncePlugin(withNativeTheme, PLUGIN_NAME, PLUGIN_VERSION);
