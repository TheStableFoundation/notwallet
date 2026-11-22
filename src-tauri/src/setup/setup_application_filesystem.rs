//! Chat model filesystem setup: redirects Amethyst's model/temp paths into
//! the shared Apple App Group container so that NotWallet shares a single
//! HuggingFace model cache with other apps in `group.com.ondeinference.apps`.

#[cfg(any(target_os = "ios", target_os = "macos"))]
use objc2_foundation::ns_string;
#[cfg(any(target_os = "ios", target_os = "macos"))]
use objc2_foundation::NSFileManager;
use std::path::{Path, PathBuf};
use tauri::{App, Manager};

/// Chat model filesystem setup.
///
/// On sandboxed platforms (iOS, macOS App Store / TestFlight) several default
/// paths used by Rust crates (`~/.cache/…`, `/tmp`, etc.) are **not** writable.
/// We must redirect all file I/O into directories inside the app container
/// *before* any downstream code (hf-hub, mistral.rs, candle, …) runs.
///
/// 1. `HF_HOME`      → controls where `hf-hub` stores downloaded models
/// 2. `HF_HUB_CACHE` → explicit cache dir read by some mistral.rs code paths
/// 3. `TMPDIR`       → controls where `std::env::temp_dir()` points;
///    mistral.rs writes Metal `.metallib` files there
///
/// The Apple App Group container (`group.com.ondeinference.apps`) is used as
/// the base directory so that models are shared across all Onde apps,
/// avoiding duplicate downloads.
///
/// On non-sandboxed macOS all of this is harmless; the directories are just
/// as writable as their default counterparts, and if the group container is
/// unavailable we fall back to `app_data_dir`.
pub fn setup_application_filesystem(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_dir = app.path().app_data_dir()?;

    #[cfg(any(target_os = "ios", target_os = "macos"))]
    let container_dir: PathBuf = {
        let fs = NSFileManager::defaultManager();
        let group_identifier = ns_string!("group.com.ondeinference.apps");
        let group_url = fs.containerURLForSecurityApplicationGroupIdentifier(group_identifier);

        match group_url {
            Some(url) => {
                let path_str = url.path().map(|p| p.to_string()).unwrap_or_default();

                if path_str.is_empty() {
                    log::warn!("App Group container URL had no path, falling back to app_data_dir");
                    app_data_dir.clone()
                } else {
                    let p = PathBuf::from(&path_str);
                    log::debug!("App Group container resolved: {}", p.display());
                    p
                }
            }
            None => {
                log::warn!(
                    "App Group container not available, falling back to app_data_dir: {}",
                    app_data_dir.display()
                );
                app_data_dir.clone()
            }
        }
    };

    #[cfg(not(any(target_os = "ios", target_os = "macos")))]
    let container_dir: PathBuf = app_data_dir;

    // ── Redirect HF_HOME, HF_HUB_CACHE, and TMPDIR ───────────────────────
    setup_hf_home(&container_dir)?;
    setup_tmpdir(&container_dir)?;

    Ok(())
}

/// Point `HF_HOME` and `HF_HUB_CACHE` at `<container_dir>/models/` and
/// ensure the directory (and its `hub/` child) exist.
///
/// This must run **before** any `hf-hub` API call so the crate picks up the
/// environment variables instead of falling back to `~/.cache/huggingface/`.
///
/// Using the App Group container means the chat model cache is shared
/// across all apps in the `group.com.ondeinference.apps` group, avoiding
/// duplicate downloads.
fn setup_hf_home(container_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let models_home = container_dir.join("models");
    let model_hub = models_home.join("hub");

    // Create both directories (idempotent).
    std::fs::create_dir_all(&model_hub).map_err(|e| {
        log::error!(
            "Failed to create model hub cache directory at {}: {}",
            model_hub.display(),
            e
        );
        e
    })?;

    // Only set if the user hasn't explicitly overridden it already.
    if std::env::var("HF_HOME").is_err() {
        std::env::set_var("HF_HOME", &models_home);
        log::info!("HF_HOME set to: {}", models_home.display());
    }

    if std::env::var("HF_HUB_CACHE").is_err() {
        std::env::set_var("HF_HUB_CACHE", &model_hub);
        log::info!("HF_HUB_CACHE set to: {}", model_hub.display());
    }

    Ok(())
}

/// Ensure `TMPDIR` points to a writable directory inside the app container.
///
/// On iOS, `std::env::temp_dir()` falls back to `/tmp` when the `TMPDIR`
/// environment variable is not set. `/tmp` is **outside** the app sandbox
/// and writes there fail with "Operation not permitted".
///
/// mistral.rs writes precompiled Metal shader libraries to
/// `std::env::temp_dir()`, so this must be a writable location.
///
/// On non-sandboxed macOS this is harmless; the system temp directory is
/// always writable, and if `TMPDIR` is already set we leave it alone.
fn setup_tmpdir(container_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let current_tmp = std::env::temp_dir();
    let probe_file = current_tmp.join(".notwallet_chat_tmp_probe");
    let tmp_is_writable = std::fs::write(&probe_file, b"probe")
        .and_then(|_| std::fs::remove_file(&probe_file))
        .is_ok();

    if tmp_is_writable {
        log::debug!("TMPDIR is writable at: {}", current_tmp.display());
        return Ok(());
    }

    // The current temp directory is not writable (typical on iOS / sandboxed
    // macOS). Redirect to a `tmp/` folder inside the App Group container.
    let app_tmp = container_dir.join("tmp");
    std::fs::create_dir_all(&app_tmp).map_err(|e| {
        log::error!(
            "Failed to create app-local tmp directory at {}: {}",
            app_tmp.display(),
            e
        );
        e
    })?;

    std::env::set_var("TMPDIR", &app_tmp);
    log::info!(
        "TMPDIR redirected from {} to {} (original was not writable)",
        current_tmp.display(),
        app_tmp.display()
    );

    Ok(())
}
