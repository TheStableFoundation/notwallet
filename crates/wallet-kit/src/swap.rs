use crate::constants::{
    FEE_ACCOUNT, JUPITER_BASE_URL, JUPITER_SWAP_PATH, JUPITER_SWAP_QUOTE_PATH, PLATFORM_FEE_BPS,
};
use crate::models::swap::{SwapQuoteResponse, SwapTransactionPayload, SwapTransactionResponse};
use reqwest::header::CONTENT_TYPE;

pub async fn get_jupiter_swap_quote(
    from_token: &str,
    to_token: &str,
    amount: u64,
    slippage_bps: u64,
) -> Result<SwapQuoteResponse, String> {
    let url = format!(
        "{}/{}?inputMint={}&outputMint={}&amount={}&slippageBps={}&platformFeeBps={}&feeAccount={}",
        JUPITER_BASE_URL,
        JUPITER_SWAP_QUOTE_PATH,
        from_token,
        to_token,
        amount,
        slippage_bps,
        PLATFORM_FEE_BPS,
        FEE_ACCOUNT
    );
    let client = reqwest::Client::new();
    let response = match client.get(url).send().await {
        Ok(response) => response,
        Err(err) => return Err(err.to_string()),
    };

    match response.json().await {
        Ok(json) => json,
        Err(err) => return Err(err.to_string()),
    }
}

pub async fn build_swap_transaction(
    payload: SwapTransactionPayload,
) -> Result<SwapTransactionResponse, String> {
    let url = format!("{}/{}", JUPITER_BASE_URL, JUPITER_SWAP_PATH);
    let client = reqwest::Client::new();

    let response = match client
        .post(url)
        .header(CONTENT_TYPE, "application/json")
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => response,
        Err(err) => return Err(err.to_string()),
    };

    match response.json().await {
        Ok(json) => json,
        Err(err) => Err(err.to_string()),
    }
}
