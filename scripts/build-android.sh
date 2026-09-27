#!/usr/bin/env bash
# build-android.sh
#
# Full Play Store pipeline for NotWallet (Android):
#   1. Clean    — rm -rf src-tauri/gen/android
#   2. Init     — cargo tauri android init (Play Store config)
#   3. Icons    — pnpm gim
#   4. Override — copy src-tauri/gen-override/android/* into gen/android/
#   5. Keystore — patch storeFile path in gen/android/keystore.properties
#   6. Build    — cargo tauri android build --aab
#
# The build produces a signed universal .aab ready to upload to the Play
# Console. versionCode is injected at init/build time as YYYYMMDDhh (UTC) via a
# second -c flag, so tauri.prod-android-playstore.conf.json is never mutated.
#
# NotWallet is an open-source project, so no keystore path, password, or
# credential is committed here — supply them via .env.appstore or the
# environment (see .env.appstore.example).
#
# Usage:
#   ./scripts/build-android.sh              # full pipeline
#   ./scripts/build-android.sh clean        # rm gen/android only
#   ./scripts/build-android.sh init         # android init only
#   ./scripts/build-android.sh icons        # generate icons only
#   ./scripts/build-android.sh override     # copy gen-override files only
#   ./scripts/build-android.sh keystore     # patch keystore.properties only
#   ./scripts/build-android.sh build        # android build only
#
#   make psmobile                           # full pipeline via Makefile
#   make psmobile-build

set -euo pipefail

# ── Paths ─────────────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_CONFIG="${REPO_ROOT}/src-tauri/tauri.prod-android-playstore.conf.json"
GEN_ANDROID_DIR="${REPO_ROOT}/src-tauri/gen/android"
GEN_OVERRIDE_DIR="${REPO_ROOT}/src-tauri/gen-override/android"
KEYSTORE_PROPERTIES="${GEN_ANDROID_DIR}/keystore.properties"

# Auto-load the untracked .env.appstore so `make psmobile` works without the
# caller exporting KEYSTORE_PATH first. See .env.appstore.example.
if [[ -f "${REPO_ROOT}/.env.appstore" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env.appstore"
  set +a
fi

# ── Overridable config ────────────────────────────────────────────────────────

# Absolute path to the upload keystore (.jks). Never committed — set it in
# .env.appstore or export it before running.
KEYSTORE_PATH="${KEYSTORE_PATH:-}"

# versionCode: YYYYMMDDhh (UTC) — same UTC timestamp base as the iOS bundleVersion
#   Integer form of the date+hour; fits the Play Store 32-bit limit (≤ 2,100,000,000) through 2099
#   Monotonically increasing → satisfies Play Store requirement
VERSION_CODE="$(date -u +"%Y%m%d%H")"
VERSION_CODE_JSON="{\"bundle\":{\"android\":{\"versionCode\":${VERSION_CODE}}}}"

# ── Helpers ───────────────────────────────────────────────────────────────────

step() { echo ""; echo "── $* ──────────────────────────────────────────────"; }
ok()   { echo "✅  $*"; }
fail() { printf "❌  %b\n" "$*" >&2; exit 1; }

# ── Steps ─────────────────────────────────────────────────────────────────────

do_clean() {
  step "1/6  Clean gen/android"

  echo "🗑   rm -rf ${GEN_ANDROID_DIR}"
  rm -rf "${GEN_ANDROID_DIR}"
  ok "Cleaned"
}

do_init() {
  step "2/6  Android init"

  [[ -f "$ANDROID_CONFIG" ]] || fail "Android config not found: $ANDROID_CONFIG"

  echo "🏷   versionCode → ${VERSION_CODE}"
  echo "📂  config       → ${ANDROID_CONFIG}"
  echo ""

  cargo tauri android init \
    -c "${ANDROID_CONFIG}" \
    -c "${VERSION_CODE_JSON}"

  ok "Android project initialised → ${GEN_ANDROID_DIR}"
}

do_icons() {
  step "3/6  Generate icons"

  pnpm gim
  ok "Icons generated"
}

do_override() {
  step "4/6  Apply gen-override/android"

  [[ -d "${GEN_OVERRIDE_DIR}" ]] || { echo "ℹ️   No ${GEN_OVERRIDE_DIR} — skipping."; return; }

  # Nothing to do if the override directory contains only .keep files.
  OVERRIDE_COUNT="$(find "${GEN_OVERRIDE_DIR}" -not -name '.keep' -not -type d | wc -l | tr -d ' ')"

  if [[ "$OVERRIDE_COUNT" -eq 0 ]]; then
    echo "ℹ️   No override files — skipping."
    return
  fi

  echo "📋  Copying ${OVERRIDE_COUNT} file(s) from gen-override/android → gen/android"

  rsync -av \
    --exclude='.keep' \
    "${GEN_OVERRIDE_DIR}/" \
    "${GEN_ANDROID_DIR}/"

  ok "Overrides applied"
}

do_keystore() {
  step "5/6  Patch keystore.properties"

  [[ -f "$KEYSTORE_PROPERTIES" ]] || fail "keystore.properties not found: ${KEYSTORE_PROPERTIES}\n       Run 'override' step first."
  [[ -n "$KEYSTORE_PATH" ]] || fail "KEYSTORE_PATH is not set.\n       Set it in .env.appstore or export it:\n       export KEYSTORE_PATH=/absolute/path/to/upload-keystore.jks"
  [[ -f "$KEYSTORE_PATH" ]] || fail "Keystore file not found: ${KEYSTORE_PATH}\n       Set KEYSTORE_PATH to the correct .jks path."

  echo "🔑  storeFile → ${KEYSTORE_PATH}"

  # Replace the storeFile= line in-place, leaving all other keys untouched.
  sed -i '' "s|^storeFile=.*|storeFile=${KEYSTORE_PATH}|" "${KEYSTORE_PROPERTIES}"

  ok "Patched → ${KEYSTORE_PROPERTIES}"
}

do_build() {
  step "6/6  Build"

  [[ -f "$ANDROID_CONFIG" ]] || fail "Android config not found: $ANDROID_CONFIG"

  echo "🏷   versionCode → ${VERSION_CODE}"
  echo "📦  config       → ${ANDROID_CONFIG}"
  echo ""

  cargo tauri android build \
    --aab \
    -c "${ANDROID_CONFIG}" \
    -c "${VERSION_CODE_JSON}"

  AAB_PATH="${GEN_ANDROID_DIR}/app/build/outputs/bundle/universalRelease/app-universal-release.aab"
  if [[ -f "$AAB_PATH" ]]; then
    ok "Build complete → ${AAB_PATH}"
  else
    ok "Build complete (locate the .aab under ${GEN_ANDROID_DIR}/app/build/outputs/bundle/)"
  fi
}

# ── Entry point ───────────────────────────────────────────────────────────────

STEP="${1:-all}"

case "$STEP" in
  clean)    do_clean    ;;
  init)     do_init     ;;
  icons)    do_icons    ;;
  override) do_override ;;
  keystore) do_keystore ;;
  build)    do_build    ;;
  all)
    do_clean
    do_init
    do_icons
    do_override
    do_keystore
    do_build
    echo ""
    echo "🎉  Pipeline complete: NotWallet Android .aab is ready for Play Store upload."
    ;;
  *)
    echo "Usage: $0 [clean|init|icons|override|keystore|build|all]" >&2
    exit 1
    ;;
esac
