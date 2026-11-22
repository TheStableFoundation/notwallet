//! Tauri command: `chat_get_history`
//!
//! Returns the full conversation history from the cached chat state.

use super::ChatMessagePayload;

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
use {super::ENGINE, onde::inference::ChatRole};

/// Return the full conversation history.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
#[tauri::command]
pub async fn chat_get_history() -> Vec<ChatMessagePayload> {
    ENGINE
        .history()
        .await
        .into_iter()
        .map(|msg| ChatMessagePayload {
            role: match msg.role {
                ChatRole::User => "user".to_string(),
                ChatRole::Assistant => "assistant".to_string(),
                ChatRole::System => "system".to_string(),
            },
            content: msg.content,
        })
        .collect()
}

#[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
#[tauri::command]
pub async fn chat_get_history() -> Vec<ChatMessagePayload> {
    Vec::new()
}
