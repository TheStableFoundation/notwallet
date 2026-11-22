use serde::{Deserialize, Serialize};
use tsync::tsync;

/// AI Chat model status, mirrored to the frontend via the
/// `chat_status_changed` event and the `chat_get_status` command.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
#[tsync]
pub(crate) enum ChatStatus {
    /// No model is loaded.
    Unloaded,
    /// Model is currently being downloaded / loaded into memory.
    Loading,
    /// Model is loaded and ready to chat.
    Ready,
    /// Model failed to load.
    Error,
}
