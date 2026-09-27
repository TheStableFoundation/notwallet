# NotWallet Makefile
#
# ── macOS App Store ────────────────────────────────────────────────────────
# make asmacos         — full pipeline: build → sign → upload
# make asmacos-build   — tauri build only (universal, App Store config)
# make asmacos-sign    — sign the .app into a .pkg
# make asmacos-upload  — upload the .pkg to App Store Connect
#
# ── iOS App Store ──────────────────────────────────────────────────────────
# make asios           — full pipeline: clean → init → icons → override → build → fixplist → upload
# make asios-clean     — rm -rf src-tauri/gen/apple
# make asios-init      — pnpm tauri ios init
# make asios-icons     — pnpm gim
# make asios-override  — copy gen-override/apple into gen/apple
# make asios-build     — pnpm tauri ios build
# make asios-fixplist  — rewrite beta toolchain stamps → release, re-sign .ipa
# make asios-upload    — xcrun altool upload
#
# ── Android Play Store ─────────────────────────────────────────────────────
# make psmobile          — full pipeline: clean → init → icons → override → keystore → build → open (.aab)
# make psmobile-clean    — rm -rf src-tauri/gen/android
# make psmobile-init     — cargo tauri android init
# make psmobile-icons    — pnpm gim
# make psmobile-override — copy gen-override/android into gen/android
# make psmobile-keystore — patch keystore.properties storeFile path
# make psmobile-build    — cargo tauri android build --aab
# make psmobile-open     — open the .aab output dir (upload to Play Console)
#
# ── Desktop releases ───────────────────────────────────────────────────────
# make release-macos           — tauri build, macOS (direct download)
# make release-linux           — tauri build, Linux
# make release-windows         — tauri build, Windows (direct download)
# make release-windows-msstore — tauri build, Windows (Microsoft Store)
#
# ── Store assets ───────────────────────────────────────────────────────────
# make screenshots     — render all App Store screenshots (3 devices x 4 locales)
#
# ── Development ────────────────────────────────────────────────────────────
# make dev             — start the Tauri dev server
# make build           — standard production build
# make ts              — regenerate app/lib/crate/generated.ts from Rust models
# make fmt             — cargo fmt
# make lint            — cargo check + tsc
# make clean           — remove build artefacts

.PHONY: dev build ts \
        asmacos asmacos-build asmacos-sign asmacos-upload \
        asios asios-clean asios-init asios-icons asios-override asios-build asios-fixplist asios-upload \
        psmobile psmobile-clean psmobile-init psmobile-icons psmobile-override psmobile-keystore psmobile-build psmobile-open \
        release-macos release-linux release-windows release-windows-msstore \
        screenshots fmt lint clean

# ── macOS App Store ────────────────────────────────────────────────────────

asmacos:
	./scripts/build-appstore.sh all

asmacos-build:
	./scripts/build-appstore.sh build

asmacos-sign:
	./scripts/build-appstore.sh sign

asmacos-upload:
	./scripts/build-appstore.sh upload

# ── iOS App Store ──────────────────────────────────────────────────────────

asios:
	./scripts/build-ios.sh all

asios-clean:
	./scripts/build-ios.sh clean

asios-init:
	./scripts/build-ios.sh init

asios-icons:
	./scripts/build-ios.sh icons

asios-override:
	./scripts/build-ios.sh override

asios-build:
	./scripts/build-ios.sh build

asios-fixplist:
	./scripts/build-ios.sh fixplist

asios-upload:
	./scripts/build-ios.sh upload

# ── Android Play Store ─────────────────────────────────────────────────────

psmobile:
	./scripts/build-android.sh all
	open src-tauri/gen/android/app/build/outputs/bundle/universalRelease/

psmobile-clean:
	./scripts/build-android.sh clean

psmobile-init:
	./scripts/build-android.sh init

psmobile-icons:
	./scripts/build-android.sh icons

psmobile-override:
	./scripts/build-android.sh override

psmobile-keystore:
	./scripts/build-android.sh keystore

psmobile-build:
	./scripts/build-android.sh build

psmobile-open:
	open src-tauri/gen/android/app/build/outputs/bundle/universalRelease/

# ── Desktop releases ───────────────────────────────────────────────────────

release-macos:
	pnpm tauri build -c src-tauri/tauri.prod-macos.conf.json

release-linux:
	pnpm tauri build -c src-tauri/tauri.prod-linux.conf.json

release-windows:
	pnpm tauri build -c src-tauri/tauri.prod-windows.conf.json

release-windows-msstore:
	pnpm tauri build -c src-tauri/tauri.prod-windows-microsoftstore.conf.json

# ── Store assets ───────────────────────────────────────────────────────────

# Renders from the app's real markup + built Tailwind bundle, so `pnpm build`
# must run first. Needs playwright in .ds-sync (see the screenshot plan).
screenshots:
	pnpm build
	node assets/aso/appstore/screenshots/generator/generate.mjs

# ── Development ────────────────────────────────────────────────────────────

dev:
	pnpm tauri dev

build:
	pnpm tauri build

ts:
	pnpm tsync

fmt:
	cargo fmt --manifest-path src-tauri/Cargo.toml --all

lint:
	cargo check --manifest-path src-tauri/Cargo.toml
	pnpm tsc --noEmit

clean:
	cargo clean --manifest-path src-tauri/Cargo.toml
	rm -rf dist
