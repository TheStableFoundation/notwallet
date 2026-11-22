//! Tauri command `chat_unload_model`: frees Amethyst's model from memory.

use {log::debug, tauri::AppHandle};

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
use {
    super::{emit_chat_status, model_config, ENGINE},
    crate::constants::chat_status::ChatStatus,
    log::info,
};

/// Unload the chat model from memory to free resources.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
#[tauri::command]
pub async fn chat_unload_model(app: AppHandle) -> Result<String, String> {
    if ENGINE.is_loaded().await {
        let display_name = model_config().display_name;
        ENGINE.unload_model().await;
        info!("Chat model unloaded: {}", display_name);
        emit_chat_status(&app, ChatStatus::Unloaded, None, None);
        Ok(format!("Chat model {} unloaded.", display_name))
    } else {
        debug!("No chat model was loaded.");
        Ok("No chat model was loaded.".to_string())
    }
}

#[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
#[tauri::command]
pub async fn chat_unload_model(_app: AppHandle) -> Result<String, String> {
    debug!("Amethyst is only supported on macOS, iOS, and Android.");
    Ok("No chat model was loaded.".to_string())
}
