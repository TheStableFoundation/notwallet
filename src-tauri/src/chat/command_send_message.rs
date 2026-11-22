//! Tauri command: `chat_send_message`
//!
//! Sends a user message to Amethyst (the on-device LLM) and returns `Ok(())`
//! immediately. The actual reply (or error) is delivered to the frontend
//! via the `chat_reply` Tauri event emitted from a spawned async task.

use tauri::AppHandle;

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
use {
    super::{
        emit_chat_status, model_config, sampling_config, ChatReplyPayload, ENGINE,
        CHAT_SYSTEM_PROMPT,
    },
    crate::{constants::chat_status::ChatStatus, events::EVENT_CHAT_REPLY},
    log::{error, info},
    tauri::Emitter,
};

#[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
use log::debug;

/// Send a user message to Amethyst and receive an assistant reply.
///
/// **Fire-and-return-immediately design**: this command returns `Ok(())`
/// as soon as the inference task is spawned. The actual reply (or error)
/// is delivered to the frontend via the `chat_reply` Tauri event
/// (`EVENT_CHAT_REPLY`).
///
/// ## Why events instead of a blocking return?
///
/// On Android, the Tauri IPC bridge stores the JS-side `invoke()` resolve
/// callback in a V8 `Map`. Android's WebView GC can collect that entry
/// while the command is still running, especially on budget SoCs where
/// GGUF inference takes tens of seconds. Emitting an event from a spawned
/// task sidesteps the GC entirely.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
#[tauri::command]
pub async fn chat_send_message(app: AppHandle, message: String) -> Result<(), String> {
    // ── 1. Lazy-load the model if not already cached ──────────────────────
    if !ENGINE.is_loaded().await {
        info!("No chat model loaded; lazy-loading default model.");

        let config = model_config();
        let display_name = config.display_name.clone();

        emit_chat_status(&app, ChatStatus::Loading, Some(&display_name), None);

        ENGINE
            .load_gguf_model(
                config,
                Some(CHAT_SYSTEM_PROMPT.to_string()),
                Some(sampling_config()),
            )
            .await
            .map_err(|e| {
                let msg = format!("Failed to lazy-load chat model: {}", e);
                error!("{}", msg);
                emit_chat_status(&app, ChatStatus::Error, Some(&display_name), Some(&msg));
                msg
            })?;

        emit_chat_status(&app, ChatStatus::Ready, Some(&display_name), None);
    }

    // ── 2. Spawn inference task: this command returns Ok(()) immediately ──
    let history_len = ENGINE.history().await.len();
    info!(
        "Chat inference DISPATCH history_turns={} message_len={}",
        history_len,
        message.len()
    );

    tokio::task::spawn(async move {
        info!("Chat inference START");

        let result = ENGINE.send_message(&message).await;

        let payload = match result {
            Ok(inference_result) => {
                info!("Chat inference END ({})", inference_result.duration_display);
                ChatReplyPayload {
                    reply: Some(inference_result.text),
                    duration: Some(inference_result.duration_display),
                    error: None,
                }
            }
            Err(e) => {
                let msg = format!("Chat inference FAILED: {}", e);
                error!("{}", msg);
                emit_chat_status(&app, ChatStatus::Error, None, Some(&msg));
                ChatReplyPayload {
                    reply: None,
                    duration: None,
                    error: Some(msg),
                }
            }
        };

        if let Err(e) = app.emit(EVENT_CHAT_REPLY, &payload) {
            error!("Failed to emit chat_reply event: {:?}", e);
        }
    });

    Ok(())
}

#[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
#[tauri::command]
pub async fn chat_send_message(_app: AppHandle, _message: String) -> Result<(), String> {
    debug!("Amethyst is only supported on macOS, iOS, and Android for now.");
    Err("Amethyst is only supported on macOS, iOS, and Android for now.".to_string())
}
