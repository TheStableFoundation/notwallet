#!/usr/bin/env bash
# build-appstore.sh
#
# Full App Store pipeline for NotWallet macOS:
#   1. Build   — cargo tauri build (universal, App Store config, datetime CFBundleVersion)
#   2. Sign    — xcrun productbuild (installer package signing)
#   3. Upload  — xcrun altool (App Store Connect submission)
#
# NotWallet is an open-source project, so no credential, signing identity, or
# machine-specific path is committed here. Every configurable value reads from
# the environment (see .env.appstore.example) and the script fails with a clear
# message when a required one is missing.
#
# Usage:
#   ./scripts/build-appstore.sh              # full pipeline
#   ./scripts/build-appstore.sh build        # build only
#   ./scripts/build-appstore.sh sign         # sign only  (assumes .app already built)
#   ./scripts/build-appstore.sh upload       # upload only (assumes .pkg already signed)
#
#   make asmacos          # full pipeline via Makefile
#   make asmacos-build
#   make asmacos-sign
#   make asmacos-upload

set -euo pipefail

# ── Paths ─────────────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPSTORE_CONFIG="${REPO_ROOT}/src-tauri/tauri.prod-macos-appstore.conf.json"

# Auto-load the untracked .env.appstore (signing identities + ASC creds) so
# `make asmacos` works without the caller exporting them first. See
# .env.appstore.example for the expected keys.
if [[ -f "${REPO_ROOT}/.env.appstore" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env.appstore"
  set +a
fi

# Xcode toolchain. App Store Connect rejects binaries built with a beta Xcode or
# beta SDK, so pin a release Xcode here regardless of the global `xcode-select`.
# Default: the active xcode-select if it is a release, otherwise the newest
# non-beta Xcode under /Applications.
# Override: DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer ./scripts/build-appstore.sh
pick_release_xcode() {
  local active; active="$(xcode-select -p 2>/dev/null)"
  if [[ -n "$active" && "$active" != *[Bb]eta* ]]; then
    printf '%s\n' "$active"; return
  fi
  local app
  for app in /Applications/Xcode*.app; do
    case "$app" in *[Bb]eta*) continue ;; esac
    [[ -d "$app/Contents/Developer" ]] && { printf '%s\n' "$app/Contents/Developer"; return; }
  done
}
DEVELOPER_DIR="${DEVELOPER_DIR:-$(pick_release_xcode)}"
export DEVELOPER_DIR

# ── Overridable config ─────────────────────────────────────────────────────────
#
# Installer signing identity: the "3rd Party Mac Developer Installer" certificate
# (name or SHA-1 fingerprint) in your keychain. This is NOT the same as the app
# signing identity in APP_SIGNING_IDENTITY below, which Tauri uses to codesign
# the .app bundle itself — productbuild requires a separate Installer cert.
# Find it with: security find-identity -v
SIGNING_IDENTITY="${SIGNING_IDENTITY:-}"

# App codesigning identity: the "3rd Party Mac Developer Application"
# certificate (name or SHA-1 fingerprint) Tauri uses to sign the .app bundle.
# Injected into bundle.macOS.signingIdentity as an inline --config patch so no
# identity is committed to tauri.prod-macos-appstore.conf.json.
APP_SIGNING_IDENTITY="${APP_SIGNING_IDENTITY:-}"

# Apple Developer Team ID (10 characters, e.g. ABCDE12345). Found under
# Membership details at https://developer.apple.com/account. Substituted into
# the entitlements template together with the bundle identifier.
APPLE_DEVELOPMENT_TEAM="${APPLE_DEVELOPMENT_TEAM:-}"

# Absolute path to the Mac App Store provisioning profile for this bundle id,
# downloaded from the Apple Developer portal (Certificates, Identifiers &
# Profiles → Profiles → macOS App Store). Embedded into the .app as
# Contents/embedded.provisionprofile. Kept out of the committed config for the
# same reason as the identity above.
PROVISIONPROFILE_PATH="${PROVISIONPROFILE_PATH:-}"

# App Store Connect API credentials.
# ASC_API_KEY   — Key ID shown in App Store Connect → Users & Access → Keys.
# ASC_ISSUER_ID — Issuer UUID on the same page.
# The private key (.p8) must be present at:
#   ~/.appstoreconnect/private_keys/AuthKey_<ASC_API_KEY>.p8
ASC_API_KEY="${ASC_API_KEY:-}"
ASC_ISSUER_ID="${ASC_ISSUER_ID:-}"

# App name — must match the productName in tauri.prod-macos-appstore.conf.json
# and therefore the .app bundle produced by tauri build.
APP_NAME="${APP_NAME:-NotWallet}"

# Derived paths — quoted to handle spaces in the app name.
APP_PATH="${REPO_ROOT}/src-tauri/target/universal-apple-darwin/release/bundle/macos/${APP_NAME}.app"
PKG_PATH="${REPO_ROOT}/${APP_NAME}.pkg"

# ── Helpers ───────────────────────────────────────────────────────────────────

step() { echo ""; echo "── $* ──────────────────────────────────────────────"; }
ok()   { echo "✅  $*"; }
fail() { printf "❌  %b\n" "$*" >&2; exit 1; }

# Refuse to build with a beta toolchain — App Store Connect rejects beta-built
# binaries (the cause of an "Invalid Binary" after upload). DEVELOPER_DIR is
# pinned to a release Xcode above; `cargo tauri build` resolves the macOS
# linker/SDK via xcrun, which honors DEVELOPER_DIR.
require_release_xcode() {
  [[ -n "${DEVELOPER_DIR}" && -d "${DEVELOPER_DIR}" ]] \
    || fail "No release Xcode found.\n       Install a release Xcode, or set DEVELOPER_DIR to its Contents/Developer dir."
  case "${DEVELOPER_DIR}" in
    *[Bb]eta*)
      fail "DEVELOPER_DIR points at a beta Xcode:\n       ${DEVELOPER_DIR}\n       App Store Connect rejects beta-built binaries. Point DEVELOPER_DIR at a release Xcode." ;;
  esac
  echo "🛠   Xcode  → $(xcodebuild -version 2>/dev/null | head -1)  [${DEVELOPER_DIR}]"
}

# ── Entitlements ──────────────────────────────────────────────────────────────
#
# src-tauri/Entitlements-appstore.plist is committed as a template so no Apple
# account identifier lands in the repository:
#
#   <key>com.apple.application-identifier</key>   <string>$TEAM_ID.$IDENTIFIER</string>
#   <key>com.apple.developer.team-identifier</key><string>$TEAM_ID</string>
#
# codesign does not expand those, and a literal "$TEAM_ID" in the entitlements
# is rejected at App Store Connect validation. So render a copy under target/
# (gitignored) with the real values and point bundle.macOS.entitlements at it.
# The template itself is never modified.
ENTITLEMENTS_TEMPLATE="${REPO_ROOT}/src-tauri/Entitlements-appstore.plist"
ENTITLEMENTS_RENDERED="${REPO_ROOT}/src-tauri/target/Entitlements-appstore.generated.plist"

# Bundle identifier, read from the App Store config with the base config as
# fallback — must match the provisioning profile and the App Store Connect app.
app_identifier() {
  local id
  id="$(jq -r '.identifier // empty' "${APPSTORE_CONFIG}")"
  [[ -z "$id" ]] && id="$(jq -r '.identifier // empty' "${REPO_ROOT}/src-tauri/tauri.conf.json")"
  [[ -n "$id" ]] || fail "Could not determine the bundle identifier from ${APPSTORE_CONFIG}"
  printf '%s\n' "$id"
}

render_entitlements() {
  [[ -f "${ENTITLEMENTS_TEMPLATE}" ]] \
    || fail "Entitlements template not found: ${ENTITLEMENTS_TEMPLATE}"

  local identifier; identifier="$(app_identifier)"

  mkdir -p "$(dirname "${ENTITLEMENTS_RENDERED}")"
  sed -e "s|\$TEAM_ID|${APPLE_DEVELOPMENT_TEAM}|g" \
      -e "s|\$IDENTIFIER|${identifier}|g" \
      "${ENTITLEMENTS_TEMPLATE}" > "${ENTITLEMENTS_RENDERED}"

  # A leftover placeholder means the template gained a variable this function
  # does not know about — fail loudly rather than ship broken entitlements.
  if grep -q '\$[A-Z_]\{2,\}' "${ENTITLEMENTS_RENDERED}"; then
    fail "Unsubstituted placeholder left in ${ENTITLEMENTS_RENDERED}:\n$(grep -n '\$[A-Z_]\{2,\}' "${ENTITLEMENTS_RENDERED}")"
  fi
  plutil -lint "${ENTITLEMENTS_RENDERED}" >/dev/null \
    || fail "Rendered entitlements are not a valid plist: ${ENTITLEMENTS_RENDERED}"

  echo "🔐  entitlements   → ${APPLE_DEVELOPMENT_TEAM}.${identifier}"
}

# ── Proc-macro deployment-target workaround ───────────────────────────────────
#
# Tauri exports bundle.macOS.minimumSystemVersion as MACOSX_DEPLOYMENT_TARGET
# for the whole cargo invocation — including the *host* proc-macro dylibs that
# rustc has to dlopen at compile time. At a deployment target of 12.0 or above
# the linker switches to chained fixups, and recent macOS dyld then refuses to
# load the result:
#
#   error: .../libserde_derive-<hash>.dylib: dlopen(...):
#          mis-aligned LINKEDIT string pool, fileOffset=0x...
#   error[E0463]: can't find crate for `thiserror_impl`
#
# which breaks every derive-macro crate in the graph (serde_derive,
# thiserror_impl, borsh_derive, zerocopy_derive, bytemuck_derive, …). It is not
# specific to this project: a two-crate scratch project reproduces it, on both
# Xcode 26.6 (ld-1267) and 27.0b4 (ld-27036), on rustc 1.92 through current
# stable. minimumSystemVersion 11.0 links the old-style fixups and works.
#
# MACOSX_DEPLOYMENT_TARGET is *not* part of cargo's fingerprint, so a build at
# 11.0 produces host proc-macro dylibs with exactly the hashes the real build
# wants. We therefore compile once at 11.0 to populate them, then run the real
# build, which reuses them instead of relinking them at the broken setting.
#
# Because the fingerprint ignores the deployment target, cargo will not rebuild
# already-poisoned dylibs either — so the prewarm deletes them first.
PREWARM_MIN_SYSTEM_VERSION="11.0"

# True when every host proc-macro dylib in target/release/deps can be loaded.
# No dylibs yet (a clean tree) counts as "not ok" so the prewarm still runs.
host_procmacros_loadable() {
  local deps="${REPO_ROOT}/src-tauri/target/release/deps"
  compgen -G "${deps}/*.dylib" >/dev/null || return 1
  local d
  for d in "${deps}"/*.dylib; do
    python3 -c 'import ctypes,sys; ctypes.CDLL(sys.argv[1])' "$d" >/dev/null 2>&1 || return 1
  done
}

prewarm_host_procmacros() {
  if host_procmacros_loadable; then
    echo "🧩  host proc-macros  → already loadable, skipping prewarm"
    return
  fi

  echo "🧩  host proc-macros  → prewarming at minimumSystemVersion ${PREWARM_MIN_SYSTEM_VERSION}"
  echo "                        (works around dyld rejecting chained-fixups proc-macro dylibs)"

  # Drop the poisoned dylibs; cargo would otherwise consider them fresh.
  rm -rf "${REPO_ROOT}/src-tauri/target/release"

  # --no-bundle: this pass only exists to produce loadable proc-macro dylibs,
  # so skip bundling (and its signing/provisioning requirements) entirely.
  cargo tauri build \
    --no-bundle \
    --target universal-apple-darwin \
    --config "${APPSTORE_CONFIG}" \
    --config "{\"bundle\":{\"macOS\":{\"minimumSystemVersion\":\"${PREWARM_MIN_SYSTEM_VERSION}\"}}}"

  host_procmacros_loadable \
    || fail "Prewarm finished but host proc-macro dylibs are still unloadable.\n       Inspect: otool -l src-tauri/target/release/deps/libserde_derive-*.dylib | grep minos"

  ok "Host proc-macros prewarmed"
}

# ── Steps ─────────────────────────────────────────────────────────────────────

do_build() {
  step "1/3  Build"

  require_release_xcode
  [[ -f "$APPSTORE_CONFIG" ]] || fail "Config not found: $APPSTORE_CONFIG"

  if [[ -z "${APP_SIGNING_IDENTITY}" ]]; then
    fail "APP_SIGNING_IDENTITY is not set.\n       Set the '3rd Party Mac Developer Application' certificate (name or SHA-1) in .env.appstore:\n       APP_SIGNING_IDENTITY=<identity>\n       List available identities with: security find-identity -v"
  fi
  if [[ -z "${APPLE_DEVELOPMENT_TEAM}" ]]; then
    fail "APPLE_DEVELOPMENT_TEAM is not set.\n       Add your 10-character Apple Developer Team ID to .env.appstore:\n       APPLE_DEVELOPMENT_TEAM=ABCDE12345\n       Find it under Membership details at https://developer.apple.com/account."
  fi
  if [[ -z "${PROVISIONPROFILE_PATH}" ]]; then
    fail "PROVISIONPROFILE_PATH is not set.\n       Download the macOS App Store provisioning profile for this bundle id from\n       https://developer.apple.com/account/resources/profiles/list and set in .env.appstore:\n       PROVISIONPROFILE_PATH=/absolute/path/to/NotWallet.provisionprofile"
  fi
  [[ -f "${PROVISIONPROFILE_PATH}" ]] \
    || fail "Provisioning profile not found:\n       ${PROVISIONPROFILE_PATH}\n       Fix PROVISIONPROFILE_PATH in .env.appstore."

  # CFBundleVersion: YYYYMMDD.HHMM (UTC)
  #   Two period-separated integers → valid for Apple
  #   Monotonically increasing      → satisfies App Store requirement
  BUNDLE_VERSION="$(date -u +"%Y%m%d.%H%M")"

  # Machine-specific values are patched in here rather than committed. jq builds
  # the JSON so identities and paths containing spaces or quotes stay valid.
  BUILD_PATCH_JSON="$(jq -nc \
    --arg version "${BUNDLE_VERSION}" \
    --arg identity "${APP_SIGNING_IDENTITY}" \
    --arg profile "${PROVISIONPROFILE_PATH}" \
    --arg entitlements "${ENTITLEMENTS_RENDERED}" \
    '{bundle: {macOS: {
        bundleVersion: $version,
        signingIdentity: $identity,
        entitlements: $entitlements,
        files: {"embedded.provisionprofile": $profile}
     }}}')"

  echo "🏷   bundleVersion  → ${BUNDLE_VERSION}"
  echo "📦  app config     → ${APPSTORE_CONFIG}"
  echo "🔑  app identity   → ${APP_SIGNING_IDENTITY}"
  echo "📄  profile        → ${PROVISIONPROFILE_PATH}"
  render_entitlements
  echo ""

  prewarm_host_procmacros
  echo ""

  # Tauri merges multiple --config flags in order via json_patch::merge, so the
  # inline patch overrides only the keys it names; everything else comes from
  # tauri.prod-macos-appstore.conf.json. The config file is never mutated.
  cargo tauri build \
    --bundles app \
    --target universal-apple-darwin \
    --config "${APPSTORE_CONFIG}" \
    --config "${BUILD_PATCH_JSON}"

  [[ -d "$APP_PATH" ]] || fail "Build succeeded but .app not found at: $APP_PATH"
  ok "Build complete → ${APP_PATH}"
}

do_sign() {
  step "2/3  Sign"

  [[ -d "$APP_PATH" ]] || fail ".app not found: ${APP_PATH}\n       Run 'build' step first."

  if [[ -z "${SIGNING_IDENTITY}" ]]; then
    fail "SIGNING_IDENTITY is not set.\n       Set the '3rd Party Mac Developer Installer' certificate (name or SHA-1) in .env.appstore:\n       SIGNING_IDENTITY=<identity>\n       List available identities with: security find-identity -v"
  fi

  echo "🔏  identity  → ${SIGNING_IDENTITY}"
  echo "📂  component → ${APP_PATH}"
  echo "📦  output    → ${PKG_PATH}"
  echo ""

  xcrun productbuild \
    --sign "${SIGNING_IDENTITY}" \
    --component "${APP_PATH}" /Applications \
    "${PKG_PATH}"

  [[ -f "$PKG_PATH" ]] || fail "productbuild succeeded but .pkg not found at: $PKG_PATH"
  ok "Signed → ${PKG_PATH}"
}

do_upload() {
  step "3/3  Upload"

  [[ -f "$PKG_PATH" ]] || fail ".pkg not found: ${PKG_PATH}\n       Run 'sign' step first."
  [[ -n "${ASC_API_KEY}" ]]   || fail "ASC_API_KEY is not set.\n       Add it to .env.appstore (App Store Connect → Users & Access → Integrations)."
  [[ -n "${ASC_ISSUER_ID}" ]] || fail "ASC_ISSUER_ID is not set.\n       Add it to .env.appstore (App Store Connect → Users & Access → Integrations)."

  echo "📤  file      → ${PKG_PATH}"
  echo "🔑  apiKey    → ${ASC_API_KEY}"
  echo "🏢  issuer    → ${ASC_ISSUER_ID}"
  echo ""

  xcrun altool \
    --upload-app \
    --type macos \
    --file "${PKG_PATH}" \
    --apiKey "${ASC_API_KEY}" \
    --apiIssuer "${ASC_ISSUER_ID}"

  ok "Uploaded to App Store Connect"
}

# ── Entry point ───────────────────────────────────────────────────────────────

STEP="${1:-all}"

case "$STEP" in
  build)  do_build  ;;
  sign)   do_sign   ;;
  upload) do_upload ;;
  all)
    do_build
    do_sign
    do_upload
    echo ""
    echo "🎉  Pipeline complete: built, signed, and uploaded ${APP_NAME}."
    ;;
  *)
    echo "Usage: $0 [build|sign|upload|all]" >&2
    exit 1
    ;;
esac
