#!/usr/bin/env bash
# build-ios.sh
#
# Full App Store pipeline for NotWallet (iOS):
#   1. Clean    — rm -rf src-tauri/gen/apple
#   2. Init     — pnpm tauri ios init (prod iOS App Store config)
#   3. Icons    — pnpm gim
#   4. Override — copy gen-override/apple into gen/apple
#   5. Build    — pnpm tauri ios build (app-store-connect, datetime CFBundleVersion)
#   6. Fixplist — rewrite beta toolchain stamps → release values, re-sign
#   7. Upload   — xcrun altool (App Store Connect submission)
#
# NotWallet is an open-source project, so no credential or signing identity is
# committed here. Supply them via .env.appstore (see .env.appstore.example).
#
# Usage:
#   ./scripts/build-ios.sh              # full pipeline
#   ./scripts/build-ios.sh clean        # rm gen/apple only
#   ./scripts/build-ios.sh init         # tauri ios init only
#   ./scripts/build-ios.sh icons        # pnpm gim only
#   ./scripts/build-ios.sh override     # copy gen-override/apple only
#   ./scripts/build-ios.sh build        # build only (assumes init already done)
#   ./scripts/build-ios.sh fixplist     # patch beta toolchain stamps + re-sign
#   ./scripts/build-ios.sh upload       # upload only (assumes .ipa already built)
#
#   make asios                          # full pipeline via Makefile
#   make asios-build

set -euo pipefail

# ── Paths ─────────────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IOS_CONFIG="${REPO_ROOT}/src-tauri/tauri.prod-ios-appstore.conf.json"
GEN_APPLE="${REPO_ROOT}/src-tauri/gen/apple"
GEN_OVERRIDE="${REPO_ROOT}/src-tauri/gen-override/apple"

# Auto-load the untracked .env.appstore (signing identities + ASC creds) so
# `make asios` works without the caller exporting them first. See
# .env.appstore.example for the expected keys.
if [[ -f "${REPO_ROOT}/.env.appstore" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env.appstore"
  set +a
fi

# Xcode toolchain. App Store Connect rejects binaries built with a beta Xcode or
# beta SDK. `pnpm tauri ios build` resolves the toolchain from the system
# xcode-select (it ignores DEVELOPER_DIR), so the fixplist step below rewrites
# the beta stamps instead — but a pinned release Xcode is still needed to derive
# the release values to stamp in.
# Override: DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer ./scripts/build-ios.sh
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
# Optional path to a local Tauri source checkout. When set, `ios init` runs via
# `cargo run` against this manifest so the CLI version matches the workspace.
# Left empty by default so a fresh clone just uses the installed tauri CLI.
# Override: TAURI_CLI_MANIFEST=/path/to/tauri/Cargo.toml ./scripts/build-ios.sh
TAURI_CLI_MANIFEST="${TAURI_CLI_MANIFEST:-}"

# App Store Connect API credentials.
# ASC_API_KEY   — Key ID shown in App Store Connect → Users & Access → Keys.
# ASC_ISSUER_ID — Issuer UUID on the same page.
# The private key (.p8) must be present at:
#   ~/.appstoreconnect/private_keys/AuthKey_<ASC_API_KEY>.p8
ASC_API_KEY="${ASC_API_KEY:-}"
ASC_ISSUER_ID="${ASC_ISSUER_ID:-}"

# Apple Developer Team ID (10 characters, e.g. ABCDE12345). Found under
# Membership details at https://developer.apple.com/account.
#
# src-tauri/tauri.conf.json commits the placeholder "your_team_id" so no real
# account identifier lands in the repository; the init and build steps patch the
# real value in from here via an inline --config, leaving the file unmodified.
APPLE_DEVELOPMENT_TEAM="${APPLE_DEVELOPMENT_TEAM:-}"

# Beta-macOS submission workaround (non-sensitive; safe default).
#
# App Store Connect rejects binaries whose Info.plist reports a *beta*
# BuildMachineOSBuild (e.g. macOS 27.0 build 26A5353q → "Invalid Binary").
# The fixplist step rewrites that key to a shipping macOS build and re-signs
# the .app so the code-signature seal stays valid.
# RELEASE_OS_BUILD — a shipping macOS build number. Default 25A354 = macOS 26.0.
RELEASE_OS_BUILD="${RELEASE_OS_BUILD:-25A354}"

# Distribution identity used to re-sign after the fixplist patch
# (e.g. "Apple Distribution: <Your Org> (<TEAM_ID>)"). Required by fixplist only.
# SIGN_IDENTITY — env-only, never committed.

# App name — must match the productName in tauri.prod-ios-appstore.conf.json.
APP_NAME="${APP_NAME:-NotWallet}"

# Derived IPA path produced by `pnpm tauri ios build`. Tauri names the .ipa
# after productName, but older configs in this repo produced a lowercase name,
# so resolve_ipa falls back to whatever .ipa is actually present.
IPA_PATH="${GEN_APPLE}/build/arm64/${APP_NAME}.ipa"

resolve_ipa() {
  [[ -f "$IPA_PATH" ]] && return 0
  local found
  found="$(find "${GEN_APPLE}/build" -name '*.ipa' -print -quit 2>/dev/null || true)"
  [[ -n "$found" ]] && IPA_PATH="$found"
  return 0
}

# ── Helpers ───────────────────────────────────────────────────────────────────

step() { echo ""; echo "── $* ──────────────────────────────────────────────"; }
ok()   { echo "✅  $*"; }
fail() { printf "❌  %b\n" "$*" >&2; exit 1; }

# Release toolchain stamps used by the fixplist step to rewrite a beta-built
# binary's Info.plist so App Store Connect reads it as a release-Xcode build.
# Auto-derived from the pinned release Xcode (DEVELOPER_DIR, from pick_release_xcode);
# every value is overridable via env.
#   RELEASE_DTXCODE      e.g. 2660   (Xcode 26.6 → "2660")
#   RELEASE_XCODE_BUILD  e.g. 17F113 (Xcode product build)
#   RELEASE_SDK_VERSION  e.g. 26.5
#   RELEASE_SDK_NAME     e.g. iphoneos26.5
#   RELEASE_SDK_BUILD    e.g. 23F81a (iPhoneOS SDK product build)
derive_release_toolchain() {
  local dd="${DEVELOPER_DIR}"
  if [[ -z "$dd" || ! -d "$dd" || "$dd" == *[Bb]eta* ]]; then
    [[ -n "${RELEASE_DTXCODE:-}${RELEASE_XCODE_BUILD:-}" ]] \
      || fail "No release Xcode found to derive release stamps.\n       Install a release Xcode, or set RELEASE_DTXCODE / RELEASE_XCODE_BUILD / RELEASE_SDK_* by hand."
  fi
  local xv sv xver xbuild sdkver sdkbuild d
  xv="$(DEVELOPER_DIR="$dd" xcodebuild -version 2>/dev/null)"
  sv="$(DEVELOPER_DIR="$dd" xcodebuild -version -sdk iphoneos 2>/dev/null)"
  xver="$(printf '%s\n' "$xv"  | awk '/^Xcode/{print $2}')"
  xbuild="$(printf '%s\n' "$xv" | awk '/Build version/{print $3}')"
  sdkver="$(printf '%s\n' "$sv" | awk -F': ' '/SDKVersion/{print $2; exit}')"
  sdkbuild="$(printf '%s\n' "$sv" | awk -F': ' '/ProductBuildVersion/{print $2; exit}')"
  d="${xver//./}"; while [[ -n "$d" && ${#d} -lt 4 ]]; do d="${d}0"; done
  REL_DTXCODE="${RELEASE_DTXCODE:-$d}"
  REL_XCODE_BUILD="${RELEASE_XCODE_BUILD:-$xbuild}"
  REL_SDK_VERSION="${RELEASE_SDK_VERSION:-$sdkver}"
  REL_SDK_NAME="${RELEASE_SDK_NAME:-iphoneos${sdkver}}"
  REL_SDK_BUILD="${RELEASE_SDK_BUILD:-$sdkbuild}"
  [[ -n "$REL_DTXCODE" && -n "$REL_XCODE_BUILD" && -n "$REL_SDK_BUILD" ]] \
    || fail "Could not determine release toolchain stamps from ${dd:-<unset>}."
}

# True when an Apple build number is a pre-release (beta) seed. Apple stamps
# seeds with a trailing lowercase letter (e.g. 26A5353q); shipping builds never
# carry one (e.g. 25A354). Used to decide whether the Info.plist actually needs
# patching, so the workaround is a no-op on a release macOS.
is_beta_build() {
  [[ "${1:-}" =~ [a-z]$ ]]
}

# ── Steps ─────────────────────────────────────────────────────────────────────

do_clean() {
  step "Clean"
  rm -rf "${GEN_APPLE}"
  ok "Removed ${GEN_APPLE}"
}

# Inline --config patch carrying the real Team ID, replacing the committed
# "your_team_id" placeholder. Both `ios init` (which bakes the team into the
# generated Xcode project) and `ios build` (which signs with it) need this.
team_config_json() {
  [[ -n "${APPLE_DEVELOPMENT_TEAM}" ]] \
    || fail "APPLE_DEVELOPMENT_TEAM is not set.\n       Add your 10-character Apple Developer Team ID to .env.appstore:\n       APPLE_DEVELOPMENT_TEAM=ABCDE12345\n       Find it under Membership details at https://developer.apple.com/account."
  jq -nc --arg team "${APPLE_DEVELOPMENT_TEAM}" \
    '{bundle: {iOS: {developmentTeam: $team}}}'
}

do_init() {
  step "Init"

  [[ -f "$IOS_CONFIG" ]] || fail "Config not found: $IOS_CONFIG"
  TEAM_JSON="$(team_config_json)"

  echo "📱  config  → ${IOS_CONFIG}"
  echo "👥  team    → ${APPLE_DEVELOPMENT_TEAM}"

  if [[ -n "$TAURI_CLI_MANIFEST" ]]; then
    [[ -f "$TAURI_CLI_MANIFEST" ]] \
      || fail "Tauri CLI manifest not found: $TAURI_CLI_MANIFEST\n       Unset TAURI_CLI_MANIFEST to use the installed tauri CLI instead."
    echo "🦀  cli     → ${TAURI_CLI_MANIFEST}"
    echo ""
    cargo run --release \
      --manifest-path "${TAURI_CLI_MANIFEST}" \
      -p tauri-cli \
      -- tauri ios init \
      -c "${IOS_CONFIG}" \
      -c "${TEAM_JSON}"
  else
    echo "🦀  cli     → project Tauri CLI"
    echo ""
    pnpm tauri ios init -c "${IOS_CONFIG}" -c "${TEAM_JSON}"
  fi

  ok "Xcode project generated → ${GEN_APPLE}"
}

do_icons() {
  step "Icons"
  pnpm gim
  ok "Icons generated"
}

do_override() {
  step "Override"

  if [[ -d "${GEN_OVERRIDE}" ]]; then
    cp -r "${GEN_OVERRIDE}/." "${GEN_APPLE}/"
    ok "Copied ${GEN_OVERRIDE} → ${GEN_APPLE}"
  else
    echo "ℹ️   No overrides found at ${GEN_OVERRIDE}, skipping."
  fi
}

do_build() {
  step "Build"

  [[ -f "$IOS_CONFIG" ]] || fail "Config not found: $IOS_CONFIG"
  [[ -d "$GEN_APPLE" ]]  || fail "Xcode project not found at ${GEN_APPLE}\n       Run 'init' step first."
  TEAM_JSON="$(team_config_json)"

  # CFBundleVersion: YYYYMMDD.HHMM (UTC)
  #   Two period-separated integers → valid for Apple
  #   Monotonically increasing      → satisfies App Store requirement
  BUNDLE_VERSION="$(date -u +"%Y%m%d.%H%M")"
  BUNDLE_VERSION_JSON="{\"bundle\":{\"iOS\":{\"bundleVersion\":\"${BUNDLE_VERSION}\"}}}"

  echo "🏷   bundleVersion  → ${BUNDLE_VERSION}"
  echo "📦  app config     → ${IOS_CONFIG}"
  echo "👥  team           → ${APPLE_DEVELOPMENT_TEAM}"
  echo ""

  # `pnpm tauri ios build` resolves the toolchain from the system xcode-select
  # (it ignores DEVELOPER_DIR), so on a beta-Xcode machine it builds with the
  # beta. That is fine: the fixplist step rewrites the beta toolchain stamps
  # (DTXcode, DTSDKBuild, …) to release values and re-signs, so the uploaded
  # binary reads as a release-Xcode build. App Store Connect accepts it.
  pnpm tauri ios build \
    --export-method app-store-connect \
    --config "${IOS_CONFIG}" \
    --config "${TEAM_JSON}" \
    --config "${BUNDLE_VERSION_JSON}"

  resolve_ipa
  [[ -f "$IPA_PATH" ]] || fail "Build succeeded but no .ipa found under ${GEN_APPLE}/build"
  ok "Build complete → ${IPA_PATH}"
}

do_fixplist() {
  step "Fixplist (beta toolchain → release)"

  resolve_ipa
  [[ -f "$IPA_PATH" ]] || fail ".ipa not found: ${IPA_PATH}\n       Run 'build' step first."

  command -v /usr/libexec/PlistBuddy >/dev/null || fail "PlistBuddy not found"
  : "${SIGN_IDENTITY:?set SIGN_IDENTITY (distribution identity for the re-sign) in .env.appstore}"

  WORK="$(mktemp -d)"
  trap 'rm -rf "$WORK"' RETURN

  unzip -q "$IPA_PATH" -d "$WORK"

  local app_dir plist ent os_cur xcb_cur sdk_cur
  app_dir="$(find "$WORK/Payload" -maxdepth 1 -name '*.app' -print -quit)"
  [[ -n "$app_dir" && -d "$app_dir" ]] || fail "No .app found inside ${IPA_PATH}"
  plist="$app_dir/Info.plist"
  [[ -f "$plist" ]] || fail "Info.plist not found in $app_dir"

  pl() { /usr/libexec/PlistBuddy -c "Print :$1" "$plist" 2>/dev/null || echo ""; }
  setpl() { /usr/libexec/PlistBuddy -c "Set :$1 $2" "$plist" 2>/dev/null \
              || /usr/libexec/PlistBuddy -c "Add :$1 string $2" "$plist"; }

  os_cur="$(pl BuildMachineOSBuild)"   # set by the build *machine's* OS (beta macOS)
  xcb_cur="$(pl DTXcodeBuild)"         # set by the *Xcode* used (beta Xcode)
  sdk_cur="$(pl DTSDKBuild)"           # set by the *SDK* used (beta SDK)

  # Patch when ANY toolchain stamp is a pre-release seed (trailing lowercase
  # letter): a beta macOS (BuildMachineOSBuild), a beta Xcode (DTXcodeBuild) or a
  # beta SDK (DTSDKBuild) all make App Store Connect reject the upload. Override
  # with FORCE_FIXPLIST=1 to patch regardless, or SKIP_FIXPLIST=1 to never patch.
  if [[ -n "${SKIP_FIXPLIST:-}" ]]; then
    ok "SKIP_FIXPLIST set — leaving ${IPA_PATH} untouched (DTXcodeBuild=${xcb_cur:-<unset>})."
    return 0
  fi
  if [[ -z "${FORCE_FIXPLIST:-}" ]] \
     && ! is_beta_build "$os_cur" && ! is_beta_build "$xcb_cur" && ! is_beta_build "$sdk_cur"; then
    ok "Toolchain stamps are already release seeds — no patch needed, leaving .ipa untouched."
    return 0
  fi

  derive_release_toolchain
  echo "📦  ipa      → ${IPA_PATH}"
  echo "🔏  identity → ${SIGN_IDENTITY}"
  echo "🛠   xcode    → ${REL_DTXCODE} / ${REL_XCODE_BUILD}    sdk → ${REL_SDK_NAME} / ${REL_SDK_BUILD}"
  echo ""

  # Capture the entitlements the binary was actually signed with, so the
  # re-sign reproduces them exactly (matches the embedded provisioning profile).
  ent="$WORK/entitlements.plist"
  if ! codesign -d --entitlements :"$ent" "$app_dir" 2>/dev/null || [[ ! -s "$ent" ]]; then
    local fallback_ent
    fallback_ent="$(find "${GEN_OVERRIDE}" -name '*.entitlements' -print -quit 2>/dev/null || true)"
    [[ -n "$fallback_ent" ]] \
      || fail "Could not read entitlements from the .app and no fallback .entitlements found under ${GEN_OVERRIDE}"
    echo "ℹ️   Falling back to ${fallback_ent#"${REPO_ROOT}/"}"
    cp "$fallback_ent" "$ent"
  fi

  # Rewrite every beta toolchain stamp to the release Xcode's values.
  echo "🔁  BuildMachineOSBuild: ${os_cur:-<unset>} → ${RELEASE_OS_BUILD}"
  echo "🔁  DTXcode/DTXcodeBuild: ${xcb_cur:-<unset>} → ${REL_DTXCODE}/${REL_XCODE_BUILD}"
  echo "🔁  DTSDK*:               ${sdk_cur:-<unset>} → ${REL_SDK_NAME}/${REL_SDK_BUILD}"
  setpl BuildMachineOSBuild "${RELEASE_OS_BUILD}"
  setpl DTXcode             "${REL_DTXCODE}"
  setpl DTXcodeBuild        "${REL_XCODE_BUILD}"
  setpl DTSDKName           "${REL_SDK_NAME}"
  setpl DTSDKBuild          "${REL_SDK_BUILD}"
  setpl DTPlatformBuild     "${REL_SDK_BUILD}"
  setpl DTPlatformVersion   "${REL_SDK_VERSION}"

  # Rewrite the Mach-O LC_BUILD_VERSION load command on every binary in the
  # bundle. This is the critical step: App Store Connect's *review-stage*
  # validation reads the `sdk` field baked into the executable's load command —
  # NOT the Info.plist DTSDK* keys above — so a beta-SDK build (e.g. sdk 27.0)
  # is accepted at upload, processes fine, then flags "Invalid Binary" only
  # after it is submitted for review. Patching Info.plist alone does not fix it;
  # vtool rewrites the binary itself. Each slice's `minos` is preserved; only
  # the beta `sdk` is lowered to the release SDK (REL_SDK_VERSION). The re-sign
  # below re-seals the modified Mach-O.
  local macho
  while IFS= read -r macho; do
    [[ -z "$macho" ]] && continue
    local minos_cur
    minos_cur="$(xcrun vtool -show-build "$macho" 2>/dev/null | awk '/minos/{print $2; exit}')"
    minos_cur="${minos_cur:-16.0}"
    echo "🔁  Mach-O sdk → ${REL_SDK_VERSION} (minos ${minos_cur}): ${macho#"$app_dir"/}"
    xcrun vtool -set-build-version ios "${minos_cur}" "${REL_SDK_VERSION}" \
      -replace -output "${macho}.vt" "$macho" >/dev/null 2>&1 \
      && mv "${macho}.vt" "$macho" \
      || fail "vtool failed to patch LC_BUILD_VERSION on ${macho#"$app_dir"/}"
  done < <(find "$app_dir" -type f -exec sh -c 'file "$1" | grep -q Mach-O' _ {} \; -print)

  # Re-sign nested code first (deepest path → shallowest), then the .app itself.
  # Editing Info.plist / the Mach-O load command invalidates the original
  # signature; without this the upload is rejected for a broken seal.
  local nested
  while IFS= read -r nested; do
    [[ -z "$nested" ]] && continue
    echo "✍️   sign nested → ${nested#"$app_dir"/}"
    codesign --force --timestamp=none --sign "$SIGN_IDENTITY" "$nested"
  done < <(find "$app_dir" \( -name '*.framework' -o -name '*.dylib' -o -name '*.appex' \) -print | awk '{ print length, $0 }' | sort -rn | cut -d' ' -f2-)

  codesign --force --timestamp=none \
    --sign "$SIGN_IDENTITY" \
    --entitlements "$ent" \
    "$app_dir"

  codesign --verify --deep --strict "$app_dir" \
    || fail "Re-signed app failed signature verification"
  echo "🔁  now: DTXcodeBuild=$(pl DTXcodeBuild)  DTSDKBuild=$(pl DTSDKBuild)  BuildMachineOSBuild=$(pl BuildMachineOSBuild)"

  # Repack the .ipa in place (zip from the extraction root so Payload/ is at top).
  rm -f "$IPA_PATH"
  ( cd "$WORK" && zip -qry "$IPA_PATH" Payload )
  [[ -f "$IPA_PATH" ]] || fail "Repack failed: $IPA_PATH"

  ok "Patched + re-signed → ${IPA_PATH}"
}

do_upload() {
  step "Upload"

  resolve_ipa
  [[ -f "$IPA_PATH" ]] || fail ".ipa not found: ${IPA_PATH}\n       Run 'build' step first."
  [[ -n "${ASC_API_KEY}" ]]   || fail "ASC_API_KEY is not set.\n       Add it to .env.appstore (App Store Connect → Users & Access → Integrations)."
  [[ -n "${ASC_ISSUER_ID}" ]] || fail "ASC_ISSUER_ID is not set.\n       Add it to .env.appstore (App Store Connect → Users & Access → Integrations)."

  echo "📤  file    → ${IPA_PATH}"
  echo "🔑  apiKey  → ${ASC_API_KEY}"
  echo "🏢  issuer  → ${ASC_ISSUER_ID}"
  echo ""

  xcrun altool \
    --upload-app \
    --type ios \
    --file "${IPA_PATH}" \
    --apiKey "${ASC_API_KEY}" \
    --apiIssuer "${ASC_ISSUER_ID}"

  ok "Uploaded to App Store Connect"
}

# ── Entry point ───────────────────────────────────────────────────────────────

STEP="${1:-all}"

case "$STEP" in
  clean)    do_clean    ;;
  init)     do_init     ;;
  icons)    do_icons    ;;
  override) do_override ;;
  build)    do_build    ;;
  fixplist) do_fixplist ;;
  upload)   do_upload   ;;
  all)
    do_clean
    do_init
    do_icons
    do_override
    do_build
    do_fixplist
    do_upload
    echo ""
    echo "🎉  Pipeline complete: built and uploaded ${APP_NAME} to App Store Connect."
    ;;
  *)
    echo "Usage: $0 [clean|init|icons|override|build|fixplist|upload|all]" >&2
    exit 1
    ;;
esac
