//! Chat feature module: fully on-device LLM inference for NotWallet's AI
//! assistant, Amethyst.
//!
//! Each Tauri command lives in its own file (`command_*.rs`). Shared types,
//! the cached engine instance, and model/sampling configuration are kept
//! here in `mod.rs` so every command file can `use super::*`.
//!
//! Model loading, inference, and history management are delegated to
//! [`onde::inference::ChatEngine`], the shared on-device inference engine
//! from the `onde` crate. Amethyst runs fully offline: it loads the
//! platform-default GGUF model directly and never sends chat content off
//! the device.

// ── Command submodules (one Tauri command per file) ──────────────────────────

pub mod command_clear_history;
pub mod command_get_history;
pub mod command_get_status;
pub mod command_load_model;
pub mod command_send_message;
pub mod command_unload_model;

// ── Re-exports so lib.rs can pull in commands with a flat path ───────────────

pub use command_clear_history::chat_clear_history;
pub use command_get_history::chat_get_history;
pub use command_get_status::chat_get_status;
pub use command_load_model::chat_load_model;
pub use command_send_message::chat_send_message;
pub use command_unload_model::chat_unload_model;

// ── Imports shared with submodules via `super::` ─────────────────────────────

use serde::{Deserialize, Serialize};
use tsync::tsync;

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
use {
    crate::constants::chat_status::ChatStatus,
    crate::events::EVENT_CHAT_STATUS_CHANGED,
    log::error,
    once_cell::sync::Lazy,
    onde::inference::{ChatEngine, GgufModelConfig, SamplingConfig},
    tauri::{AppHandle, Emitter},
};

// ── Response / payload types ─────────────────────────────────────────────────

/// Payload emitted with the `chat_status_changed` event.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[tsync]
pub struct ChatStatusPayload {
    pub status: crate::constants::chat_status::ChatStatus,
    pub model_name: Option<String>,
    pub error: Option<String>,
}

/// A single message in the conversation, returned to the frontend.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[tsync]
pub struct ChatMessagePayload {
    pub role: String,
    pub content: String,
}

/// Event payload emitted as `chat_reply` once inference completes.
///
/// Using an event instead of a blocking command return avoids the WebView
/// garbage-collecting the JS invoke-callback before slow on-device
/// inference (tens of seconds on mobile) finishes.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[tsync]
pub struct ChatReplyPayload {
    /// The assistant's reply text, or `None` on error.
    pub reply: Option<String>,
    /// Human-readable inference duration, or `None` on error.
    pub duration: Option<String>,
    /// Error message if inference failed, or `None` on success.
    pub error: Option<String>,
}

/// Response returned by `chat_get_status`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[tsync]
pub struct ChatStatusResponse {
    pub status: crate::constants::chat_status::ChatStatus,
    pub model_name: Option<String>,
    pub approx_memory: Option<String>,
    pub history_length: usize,
}

// ── Shared ChatEngine instance ───────────────────────────────────────────────
//
// `ChatEngine` from `onde` handles all model lifecycle, history, and
// inference. It is `Send + Sync` and manages its own internal mutex.

#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
pub(crate) static ENGINE: Lazy<ChatEngine> = Lazy::new(ChatEngine::new);

// ── Model selection & configuration ──────────────────────────────────────────
//
// Amethyst is not user-configurable (no model marketplace): it always loads
// the platform-appropriate general chat model, chosen to fit typical device
// memory budgets:
//   - iOS / Android → Qwen 2.5 1.5B (~941 MB)
//   - macOS         → Qwen 2.5 3B   (~1.93 GB, more headroom on desktop)

/// Amethyst's chat model for the current platform.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
pub(crate) fn model_config() -> GgufModelConfig {
    if cfg!(any(target_os = "ios", target_os = "android")) {
        GgufModelConfig::qwen25_1_5b()
    } else {
        GgufModelConfig::qwen25_3b()
    }
}

/// Sampling config for Amethyst's chat model.
///
/// iOS and Android use a smaller `max_tokens` budget to bound KV cache
/// memory and keep worst-case latency reasonable on slower SoCs.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
pub(crate) fn sampling_config() -> SamplingConfig {
    let mobile = cfg!(any(target_os = "ios", target_os = "android"));
    let max_tokens = if mobile { 256 } else { 512 };

    if mobile {
        SamplingConfig {
            temperature: Some(0.7),
            top_p: Some(0.95),
            max_tokens: Some(max_tokens),
            ..SamplingConfig::mobile()
        }
    } else {
        SamplingConfig {
            temperature: Some(0.7),
            top_p: Some(0.95),
            max_tokens: Some(max_tokens),
            ..SamplingConfig::default()
        }
    }
}

/// Default system prompt for Amethyst, NotWallet's private on-device crypto
/// educator.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
pub(crate) const CHAT_SYSTEM_PROMPT: &str = r#"You are Amethyst, the on-device crypto educator built into NotWallet, a non-custodial Solana wallet. You run entirely on the user's device — nothing they say ever leaves it.

Your job is to teach, not to advise. You explain how crypto actually works: self-custody, seed phrases and private keys, network fees, stablecoins and how they hold a peg, tokens and token accounts, swaps, liquidity pools and slippage, staking, DAOs and governance, tokenised real-world assets, and how on- and off-ramps move money between banks and blockchains.

How to teach:
- Lead with a one-sentence plain-language answer, then add detail only if it helps.
- Define each piece of jargon the first time you use it.
- Use small concrete numbers in examples ("on a $100 swap, 0.5% slippage is about 50 cents").
- Match the user's level. If you cannot tell how much they already know, ask one short question first.
- Say when something is contested, varies by blockchain, or has changed recently.

Hard boundaries:
- Never ask for, accept, or repeat a seed phrase, private key, or password. If a user pastes one, tell them to treat it as compromised and move their funds to a new wallet.
- You are not a financial adviser. Never tell anyone what to buy, sell, or hold, how to allocate funds, or where prices are heading. Explain mechanics, risks, and tradeoffs, and leave the decision to them.
- Teach scam patterns actively: phishing sites, fake support messages, wallet drainers, malicious token approvals, and "guaranteed yield" offers.
- Never present a stablecoin as risk-free. Explain depegging, reserve backing, and issuer risk honestly.

You run locally, so you have no live prices, balances, yields, or news, and your knowledge has a cutoff. Say so plainly instead of guessing."#;

// ── Helpers ──────────────────────────────────────────────────────────────────

/// Format a `Duration` as `Xm Ys` or just `Ys` when under a minute.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
pub(crate) fn fmt_duration(d: std::time::Duration) -> String {
    let total_secs = d.as_secs_f64();
    let mins = (total_secs / 60.0).floor() as u64;
    let secs = total_secs - (mins as f64 * 60.0);
    if mins > 0 {
        format!("{}m {:.1}s", mins, secs)
    } else {
        format!("{:.1}s", secs)
    }
}

/// Emit a chat status event to the frontend.
#[cfg(any(target_os = "macos", target_os = "ios", target_os = "android"))]
pub(crate) fn emit_chat_status(
    app: &AppHandle,
    status: ChatStatus,
    model_name: Option<&str>,
    error_msg: Option<&str>,
) {
    let payload = ChatStatusPayload {
        status,
        model_name: model_name.map(|s| s.to_string()),
        error: error_msg.map(|s| s.to_string()),
    };
    if let Err(e) = app.emit(EVENT_CHAT_STATUS_CHANGED, &payload) {
        error!("Failed to emit chat status event: {:?}", e);
    }
}
