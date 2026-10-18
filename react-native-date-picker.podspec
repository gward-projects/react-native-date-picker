require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'


Pod::Spec.new do |s|
  s.name         = "react-native-date-picker"
  s.version      = package['version']
  s.summary      = "React Native Date Picker component for Android and iOS"

  s.authors      = { "henninghall" => "henning.hall@hotmail.com" }
  s.homepage     = "https://github.com/henninghall/react-native-date-picker"
  s.license      = package['license']
  s.platform     = :ios, "8.0"

  s.source       = { :git => "https://github.com/henninghall/react-native-date-picker.git", :tag => "v#{s.version.to_s}" }
  s.source_files    = "ios/**/*.{h,m,mm,swift}"

  s.dependency 'React-Core'

  # The new architecture is always enabled since React Native 0.82: always declare its
  # dependencies and header search paths.
  install_modules_dependencies(s)
end
