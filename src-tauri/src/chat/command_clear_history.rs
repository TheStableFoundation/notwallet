//! Tauri command: `chat_clear_history`
//!
//! Clears the conversation history but keeps the model loaded in memory.

use log::debug;

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
use {super::ENGINE, log::info};

/// Clear the conversation history but keep the model loaded.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
#[tauri::command]
pub async fn chat_clear_history() -> Result<String, String> {
    if ENGINE.is_loaded().await {
        let count = ENGINE.history().await.len();
        ENGINE.clear_history().await;
        info!("Chat history cleared ({} turns removed).", count);
        Ok(format!("Chat history cleared ({} turns removed).", count))
    } else {
        debug!("No chat model loaded; nothing to clear.");
        Ok("No chat model loaded.".to_string())
    }
}

#[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
#[tauri::command]
pub async fn chat_clear_history() -> Result<String, String> {
    debug!("Amethyst is only supported on macOS, iOS, and Android for now.");
    Ok("No chat model loaded.".to_string())
}
