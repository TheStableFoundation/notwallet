#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

# Default values
KEYSTORE_PASSWORD=""
KEY_ALIAS="upload"
KEY_ALIAS_PASSWORD=""

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --keystore-password) KEYSTORE_PASSWORD="$2"; shift ;;
        --key-alias) KEY_ALIAS="$2"; shift ;;
        --key-alias-password) KEY_ALIAS_PASSWORD="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Use environment variables if parameters not provided
if [ -z "$KEYSTORE_PASSWORD" ] && [ -n "$ANDROID_KEYSTORE_PASSWORD" ]; then
    KEYSTORE_PASSWORD="$ANDROID_KEYSTORE_PASSWORD"
fi

if [ -z "$KEY_ALIAS_PASSWORD" ] && [ -n "$ANDROID_KEY_ALIAS_PASSWORD" ]; then
    KEY_ALIAS_PASSWORD="$ANDROID_KEY_ALIAS_PASSWORD"
fi

# Validate required parameters
if [ -z "$KEYSTORE_PASSWORD" ]; then
    echo "Error: Keystore password is required. Use --keystore-password parameter or set ANDROID_KEYSTORE_PASSWORD environment variable."
    exit 1
fi

if [ -z "$KEY_ALIAS_PASSWORD" ]; then
    echo "Error: Key alias password is required. Use --key-alias-password parameter or set ANDROID_KEY_ALIAS_PASSWORD environment variable."
    exit 1
fi

echo "Building Android app..."
cargo tauri android build --aab || { echo "Error: Android build failed"; exit 1; }

echo "Android app successfully built!"
echo "The .aab file is available in the src-tauri/gen/android/app/build/outputs/bundle/release/ directory"
