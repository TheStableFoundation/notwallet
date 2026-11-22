buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:9.3.1")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.2.10")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

tasks.register("clean").configure {
    delete("build")
}


// tauri-android 2.12 needs libraries to compile against Android API 36 or newer.
// Some plugins (tauri-plugin-android-tv-check) still declare compileSdk 34, which
// fails checkReleaseAarMetadata. Raise any library module that is below 36.
subprojects {
    afterEvaluate {
        extensions.findByType(com.android.build.api.dsl.LibraryExtension::class.java)?.let { lib ->
            val current = lib.compileSdk ?: 0
            if (current < 36) lib.compileSdk = 36
        }
    }
}
