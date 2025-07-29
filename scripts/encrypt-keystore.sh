#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

# Directory paths
SECRETS_DIR="./secrets"
KEYSTORE_PATH=""
ENCRYPTION_PASSWORD=""

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --keystore) KEYSTORE_PATH="$2"; shift ;;
        --password) ENCRYPTION_PASSWORD="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Validate required parameters
if [ -z "$KEYSTORE_PATH" ]; then
    echo "Error: Keystore path is required. Use --keystore parameter."
    echo "Example: ./scripts/encrypt-keystore.sh --keystore ~/upload-keystore.jks --password mySecretPassword"
    exit 1
fi

if [ -z "$ENCRYPTION_PASSWORD" ]; then
    echo "Error: Encryption password is required. Use --password parameter."
    exit 1
fi

# Ensure the keystore file exists
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "Error: Keystore file not found at $KEYSTORE_PATH"
    exit 1
fi

# Create secrets directory if it doesn't exist
mkdir -p "$SECRETS_DIR"

# Get the filename from the path
KEYSTORE_FILENAME=$(basename "$KEYSTORE_PATH")
ENCRYPTED_FILE="$SECRETS_DIR/$KEYSTORE_FILENAME.gpg"

# Encrypt the file
echo "Encrypting $KEYSTORE_PATH to $ENCRYPTED_FILE..."
openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:"$ENCRYPTION_PASSWORD" -in "$KEYSTORE_PATH" -out "$ENCRYPTED_FILE"

echo "✅ Encryption successful!"
echo "Encrypted file saved to: $ENCRYPTED_FILE"
echo
echo "Make sure to add this passphrase as a GitHub secret named 'KEYSTORE_ENCRYPTION_PASSWORD'"
echo "Also update your GitHub workflow to decrypt this file during the build process."
echo "Note: This file is encrypted with OpenSSL AES-256-CBC with PBKDF2."
