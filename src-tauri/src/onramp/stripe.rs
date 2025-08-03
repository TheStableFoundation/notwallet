use crate::{
    constants::onramp::STRIPE_SECRET_KEY,
    model::onramp::{OnrampSession, StripeError},
};
use reqwest::{
    header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE},
    Client,
};
use std::collections::HashMap;

/// Creates a crypto onramp session with Stripe
///
/// # Arguments
///
/// * `api_key` - Stripe API key
/// * `wallet_addresses` - A map of blockchain names to wallet addresses
/// * `additional_params` - Optional additional parameters for the request
///
/// # Returns
///
/// * `Result<OnrampSession, StripeError>` - The created onramp session or an error
pub async fn create_onramp_session(
    api_key: &str,
    wallet_addresses: HashMap<String, String>,
    additional_params: Option<HashMap<String, String>>,
) -> Result<OnrampSession, StripeError> {
    // Create a client
    let client = Client::new();

    // Set up basic auth header with the API key
    let mut headers = HeaderMap::new();
    let auth_value = format!("{}:", api_key); // Note the colon at the end
    let auth_header = HeaderValue::from_str(&format!("Basic {}", base64::encode(auth_value)))
        .map_err(|_| StripeError::InvalidApiKey)?;

    headers.insert(AUTHORIZATION, auth_header);
    headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_static("application/x-www-form-urlencoded"),
    );

    // Build form data
    let mut form = Vec::new();

    // Add wallet addresses
    for (blockchain, address) in wallet_addresses {
        form.push((format!("wallet_addresses[{}]", blockchain), address));
    }

    // Add any additional parameters
    if let Some(params) = additional_params {
        for (key, value) in params {
            form.push((key, value));
        }
    }

    // Make the request
    let response = client
        .post("https://api.stripe.com/v1/crypto/onramp_sessions")
        .headers(headers)
        .form(&form)
        .send()
        .await?;

    // Check if the request was successful
    if !response.status().is_success() {
        let error_text = response.text().await?;
        return Err(StripeError::ApiError(error_text));
    }

    // Parse the response
    let session: OnrampSession = response.json().await?;

    Ok(session)
}

/// Convenience function to create an onramp session with just a Solana address
///
/// # Arguments
///
/// * `solana_address` - The Solana wallet address
///
/// # Returns
///
/// * `Result<OnrampSession, StripeError>` - The created onramp session or an error
pub async fn create_solana_onramp_session(
    solana_address: &str,
) -> Result<OnrampSession, StripeError> {
    let mut wallet_addresses = HashMap::new();
    wallet_addresses.insert("solana".to_string(), solana_address.to_string());

    create_onramp_session(STRIPE_SECRET_KEY, wallet_addresses, None).await
}
