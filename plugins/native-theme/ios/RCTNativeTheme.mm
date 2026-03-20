#import "RCTNativeTheme.h"
#import <UIKit/UIKit.h>

@implementation RCTNativeTheme {
  bool hasListeners;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeThemeSpecJSI>(params);
}

+ (NSString *)moduleName {
  return @"NativeTheme";
}

- (NSString *)getColorScheme {
  __block NSString *theme = @"unspecified";

  if ([NSThread isMainThread]) {
    theme = [self fetchTheme];
  } else {
    dispatch_sync(dispatch_get_main_queue(), ^{
      theme = [self fetchTheme];
    });
  }
  return theme;
}

- (NSString *)fetchTheme {
  UIUserInterfaceStyle style = [UITraitCollection currentTraitCollection].userInterfaceStyle;
  if (style == UIUserInterfaceStyleDark) return @"dark";
  if (style == UIUserInterfaceStyleLight) return @"light";
  return @"unspecified";
}

- (void)startObserving {
  hasListeners = YES;
  [[NSNotificationCenter defaultCenter]
      addObserver:self
         selector:@selector(handleThemeChange)
             name:RCTUserInterfaceStyleDidChangeNotification
           object:nil];
}

- (void)stopObserving {
  hasListeners = NO;
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"onThemeChange" ];
}

- (void)handleThemeChange {
  if (hasListeners) {
    [self sendEventWithName:@"onThemeChange" body:[self getColorScheme]];
  }
}

- (void)addListener:(NSString *)eventName {
  [super addListener:eventName];
}

- (void)removeListeners:(double)count {
  [super removeListeners:count];
}

@end
