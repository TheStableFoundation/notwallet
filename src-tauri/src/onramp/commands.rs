use {
    crate::{model::onramp::OnrampSession, onramp::stripe::create_solana_onramp_session},
    tauri::command,
};

#[command]
pub async fn onramp_session(solana_address: &str) -> Result<OnrampSession, String> {
    match create_solana_onramp_session(solana_address).await {
        Ok(session) => Ok(session),
        Err(err) => Err(format!("Failed to create onramp session: {}", err)),
    }
}

#[command]
pub async fn stripe_publishable_key() -> Result<String, String> {
    Ok(dotenv!("STRIPE_PUBLISHABLE_KEY").to_string())
}
