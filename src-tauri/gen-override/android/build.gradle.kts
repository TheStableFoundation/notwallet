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
//
// finalizeDsl is AGP's hook for the last word on the DSL: it runs after the
// module's own android { } block and after other afterEvaluate hooks, so a plugin
// cannot set compileSdk back afterwards the way it could with our own afterEvaluate.
subprojects {
    plugins.withId("com.android.library") {
        extensions.getByType(com.android.build.api.variant.LibraryAndroidComponentsExtension::class.java)
            .finalizeDsl { lib ->
                if ((lib.compileSdk ?: 0) < 36) lib.compileSdk = 36
            }
    }
}
