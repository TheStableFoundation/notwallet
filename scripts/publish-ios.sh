#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

# Default values
API_KEY="xxxxxx"
API_ISSUER="xxxxxx"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --apiKey) API_KEY="$2"; shift ;;
        --apiIssuer) API_ISSUER="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Validate required parameters
if [ -z "$API_KEY" ]; then
    echo "Error: API Key is required"
    exit 1
fi

if [ -z "$API_ISSUER" ]; then
    echo "Error: API Issuer is required"
    exit 1
fi

echo "Building iOS app..."
pnpm tauri ios build --export-method app-store-connect || { echo "Error: iOS build failed"; exit 1; }

echo "Uploading to App Store Connect..."
xcrun altool --upload-app --type ios --file "src-tauri/gen/apple/build/arm64/notwallet.ipa" --apiKey "$API_KEY" --apiIssuer "$API_ISSUER" || { echo "Error: Upload to App Store Connect failed"; exit 1; }

echo "iOS app successfully published!"
