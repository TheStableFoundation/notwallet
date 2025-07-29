#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

# Directory paths
SECRETS_DIR="./secrets"
OUTPUT_DIR=""
ENCRYPTED_FILE=""
DECRYPTION_PASSWORD=""
OUTPUT_FILE=""

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --encrypted) ENCRYPTED_FILE="$2"; shift ;;
        --output) OUTPUT_FILE="$2"; shift ;;
        --password) DECRYPTION_PASSWORD="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Validate required parameters
if [ -z "$ENCRYPTED_FILE" ]; then
    echo "Error: Encrypted file path is required. Use --encrypted parameter."
    echo "Example: ./scripts/decrypt-keystore.sh --encrypted ./secrets/upload-keystore.jks.gpg --output ./upload-keystore.jks --password mySecretPassword"
    exit 1
fi

if [ -z "$OUTPUT_FILE" ]; then
    echo "Error: Output file path is required. Use --output parameter."
    exit 1
fi

if [ -z "$DECRYPTION_PASSWORD" ]; then
    echo "Error: Decryption password is required. Use --password parameter."
    exit 1
fi

# Ensure the encrypted file exists
if [ ! -f "$ENCRYPTED_FILE" ]; then
    echo "Error: Encrypted file not found at $ENCRYPTED_FILE"
    exit 1
fi

# Create output directory if it doesn't exist
OUTPUT_DIR=$(dirname "$OUTPUT_FILE")
mkdir -p "$OUTPUT_DIR"

# Decrypt the file
echo "Decrypting $ENCRYPTED_FILE to $OUTPUT_FILE..."
openssl enc -d -aes-256-cbc -pbkdf2 -pass pass:"$DECRYPTION_PASSWORD" -in "$ENCRYPTED_FILE" -out "$OUTPUT_FILE"

# Make sure the keystore file has the correct permissions
chmod 600 "$OUTPUT_FILE"

echo "✅ Decryption successful!"
echo "Decrypted file saved to: $OUTPUT_FILE"
echo "Note: This file was decrypted with OpenSSL AES-256-CBC with PBKDF2."
