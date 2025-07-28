plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    //alias(libs.plugins.cargo.ndk)
}

android {
    namespace = "xyz.notwallet.notwallet"
    compileSdk = 36

    defaultConfig {
        applicationId = "xyz.notwallet.NotWallet"
        minSdk = 30
        targetSdk = 36
        versionCode = 5
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                    getDefaultProguardFile("proguard-android-optimize.txt"),
                    "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions { jvmTarget = "11" }
    useLibrary("wear-sdk")
    buildFeatures { compose = true }
}

dependencies {
    implementation(libs.play.services.wearable)
    implementation(platform(libs.compose.bom))
    implementation(libs.ui)
    implementation(libs.ui.graphics)
    implementation(libs.ui.tooling.preview)
    implementation(libs.compose.material)
    implementation(libs.compose.foundation)
    implementation(libs.wear.tooling.preview)
    implementation(libs.activity.compose)
    implementation(libs.core.splashscreen)
    implementation(libs.material3.android)
    implementation(libs.horologist.compose.layout)
    implementation(libs.androidx.material.icons.extended)
    // Compose preview annotations for Wear OS.
    implementation(libs.androidx.compose.ui.tooling)
    androidTestImplementation(platform(libs.compose.bom))
    androidTestImplementation(libs.ui.test.junit4)
    debugImplementation(libs.ui.tooling)
    debugImplementation(libs.ui.test.manifest)
}

/*
cargoNdk {
    module = "../crates/wallet-kit"
    librariesNames = arrayListOf("libwallet_kit.so")
}

android.applicationVariants.forEach { variant ->
    val bDir = layout.buildDirectory.dir("generated/source/uniffi/${variant.name}/java").get()
    println("Build directory for ${variant.name}: ${bDir.asFile.absolutePath}")
    val generateBindings =
            tasks.register("generate${variant.name.capitalize()}UniFFIBindings", Exec::class) {
                workingDir = file("../crates/wallet-kit")
                commandLine(
                        "cargo",
                        "run",
                        "--bin",
                        "uniffi-bindgen",
                        "generate",
                        "--library",
                        "./jniLibs/arm64-v8a/libwallet_kit.so",
                        "--language",
                        "kotlin",
                        "--out-dir",
                        bDir
                )
                dependsOn("buildCargoNdk${variant.name.capitalize()}")
            }

    variant.javaCompileProvider.get().dependsOn(generateBindings)

    tasks.named("compile${variant.name.capitalize()}Kotlin").configure {
        dependsOn(generateBindings)
    }

    tasks.named("connectedDebugAndroidTest").configure { dependsOn(generateBindings) }

    android.sourceSets.named(variant.name) {
        java.srcDir(layout.buildDirectory.dir("generated/source/uniffi/${variant.name}/java"))
    }
}
*/