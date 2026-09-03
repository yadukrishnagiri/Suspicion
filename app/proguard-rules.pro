# Proguard rules for Imposter
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.room.* *;
}
