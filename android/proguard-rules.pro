# Consumer rules, applied to the app that minifies this library.

# time4j-android creates its resource loader by reflection (DatePickerModule calls
# ApplicationStarter.initialize). Its own consumer rules keep the class but not its constructor,
# which R8 removes once optimizations are enabled (proguard-android-optimize.txt, AGP 9).
-keep class net.time4j.android.spi.AndroidResourceLoader { <init>(); }
