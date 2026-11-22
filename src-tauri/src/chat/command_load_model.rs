//! Tauri command `chat_load_model`: loads Amethyst's on-device chat model.
//!
//! Amethyst is fully offline: it loads the platform-default GGUF model
//! directly. The only network access is the one-time HuggingFace download
//! of the model weights into the shared App Group cache.

use tauri::AppHandle;

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
use {
    super::{emit_chat_status, fmt_duration, model_config, sampling_config, ENGINE, CHAT_SYSTEM_PROMPT},
    crate::constants::chat_status::ChatStatus,
    log::{error, info},
};

/// Load the platform-default chat model into memory.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
#[tauri::command]
pub async fn chat_load_model(app: AppHandle) -> Result<String, String> {
    let config = model_config();
    let display_name = config.display_name.clone();
    info!("chat_load_model: loading on-device model {}", display_name);
    emit_chat_status(&app, ChatStatus::Loading, Some(&display_name), None);

    let elapsed = ENGINE
        .load_gguf_model(
            config,
            Some(CHAT_SYSTEM_PROMPT.to_string()),
            Some(sampling_config()),
        )
        .await
        .map_err(|e| {
            let msg = format!("Failed to load chat model: {}", e);
            error!("{}", msg);
            emit_chat_status(&app, ChatStatus::Error, Some(&display_name), Some(&msg));
            msg
        })?;

    let msg = format!(
        "Chat model {} loaded in {}",
        display_name,
        fmt_duration(elapsed)
    );
    info!("{}", msg);
    emit_chat_status(&app, ChatStatus::Ready, Some(&display_name), None);
    Ok(msg)
}

#[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
#[tauri::command]
pub async fn chat_load_model(_app: AppHandle) -> Result<String, String> {
    log::debug!("Amethyst is only supported on macOS, iOS, and Android for now.");
    Err("Amethyst is only supported on macOS, iOS, and Android for now.".to_string())
}
