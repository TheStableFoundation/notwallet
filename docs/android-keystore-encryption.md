# Android Keystore Encryption Guide

This document explains how to securely handle the Android keystore file for signing app releases, both locally and in GitHub Actions.

## Overview

When building and publishing Android apps, you need a keystore file to sign the app. This keystore file contains sensitive private keys that should never be exposed in your Git repository. This guide shows how to:

1. Encrypt your keystore file for safe storage in the repository using OpenSSL
2. Decrypt the keystore in GitHub Actions for automated builds
3. Configure the necessary secrets in GitHub

## Encrypting Your Keystore

Follow these steps to encrypt your Android keystore file:

1. Ensure your keystore file (e.g., `upload-keystore.jks`) is ready and working locally
2. Run the encryption script with your keystore path and a strong encryption password:

```bash
./scripts/encrypt-keystore.sh --keystore /path/to/your/upload-keystore.jks --password your-secure-password
```

Note: This script uses OpenSSL for encryption with AES-256-CBC cipher.

3. This creates an encrypted file at `./secrets/upload-keystore.jks.gpg`
4. Add and commit this encrypted file to your repository
5. DO NOT commit the original keystore file or the encryption password

## Setting Up GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `KEYSTORE_ENCRYPTION_PASSWORD`: The password you used to encrypt the keystore
   - `KEYSTORE_PASSWORD`: The password to unlock your keystore file
   - (Optional) `KEY_ALIAS_PASSWORD`: If your key alias has a different password

## How It Works in GitHub Actions

The GitHub workflow:

1. Checks out your code including the encrypted keystore
2. Decrypts the keystore using the `KEYSTORE_ENCRYPTION_PASSWORD` secret
3. Creates a `keystore.properties` file with the correct paths and passwords
4. Uses these files during the Android build process

## Testing Locally

You can test the decryption process locally with:

```bash
./scripts/decrypt-keystore.sh \
  --encrypted ./secrets/upload-keystore.jks.gpg \
  --output ./test-output-keystore.jks \
  --password your-encryption-password
```

This uses OpenSSL to decrypt the file.

## Security Best Practices

- Use strong, unique passwords for encryption and keystore access
- Limit access to GitHub repository secrets to essential team members
- Regularly rotate your encryption and keystore passwords
- Consider using a different keystore for development and production
- Monitor GitHub Actions logs to ensure sensitive information isn't exposed

## Troubleshooting

If you encounter issues:

- Ensure OpenSSL is installed on your local machine (it comes pre-installed on most systems)
- Verify that all required secrets are correctly set in GitHub
- Check that file paths in the scripts match your actual directory structure
- For GitHub Actions, the workflow automatically installs OpenSSL if needed