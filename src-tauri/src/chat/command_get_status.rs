//! Tauri command: `chat_get_status`
//!
//! Returns the current status of Amethyst's chat model and conversation.

use super::ChatStatusResponse;

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
use {super::ENGINE, crate::constants::chat_status::ChatStatus, onde::inference::EngineStatus};

/// Get the current status of the chat model and conversation.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
#[tauri::command]
pub async fn chat_get_status() -> ChatStatusResponse {
    let info = ENGINE.info().await;
    let status = match info.status {
        EngineStatus::Ready => ChatStatus::Ready,
        EngineStatus::Unloaded => ChatStatus::Unloaded,
        EngineStatus::Loading => ChatStatus::Loading,
        EngineStatus::Generating => ChatStatus::Ready,
        EngineStatus::Error => ChatStatus::Error,
    };
    ChatStatusResponse {
        status,
        model_name: info.model_name,
        approx_memory: info.approx_memory,
        history_length: info.history_length as usize,
    }
}

#[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
#[tauri::command]
pub async fn chat_get_status() -> ChatStatusResponse {
    use crate::constants::chat_status::ChatStatus;

    ChatStatusResponse {
        status: ChatStatus::Unloaded,
        model_name: None,
        approx_memory: None,
        history_length: 0,
    }
}
