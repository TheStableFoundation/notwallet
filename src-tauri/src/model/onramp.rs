use serde::{Deserialize, Serialize};
use tsync::tsync;

#[derive(Debug, Serialize, Deserialize)]
#[tsync]
pub struct OnrampSession {
    pub id: String,
    pub client_secret: String,
    // Add other fields as needed from the Stripe response
}

/// Error type for Stripe operations
#[derive(Debug, thiserror::Error)]
#[tsync]
pub enum StripeError {
    #[error("Request error: {0}")]
    RequestError(#[from] reqwest::Error),

    #[error("Invalid API key format")]
    InvalidApiKey,

    #[error("Stripe API error: {0}")]
    ApiError(String),
}
