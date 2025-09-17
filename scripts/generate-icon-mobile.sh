#!/usr/bin/env bash

# This command should be run after the cargo tauri android|ios init.
#
# Generate icon for mobile platforms. The no-alpha version is used for iOS. Should update the script
# if Android icon is broken.
cargo tauri icon assets/app-icon-v4-no-alpha.png

# Restore the icons directory to its original state.
git restore src-tauri/icons
