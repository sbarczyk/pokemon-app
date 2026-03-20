require_relative '../../node_modules/react-native/scripts/react_native_pods'

Pod::Spec.new do |s|
  s.name         = 'NativeTheme'
  s.version      = '0.0.1'
  s.summary      = 'System appearance Turbo Module'
  s.license      = 'MIT'
  s.author       = 'SWM'
  s.homepage     = 'https://'
  s.platforms    = { :ios => '15.1' }
  s.source       = { :git => '.' }
  s.source_files = '**/*.{h,m,mm}'
  s.requires_arc = true

  install_modules_dependencies(s)
end
