use crate::constants::{
    BACH_DECIMALS, BACH_MINT_ACCOUNT, FEE_ACCOUNT, JUPITER_BASE_URL, JUPITER_SWAP_PATH,
    JUPITER_SWAP_QUOTE_PATH, PLATFORM_FEE_BPS, SOLANA_MINT_ACCOUNT, SOL_DECIMALS,
};
use crate::models::swap::{SwapQuoteResponse, SwapTransactionPayload, SwapTransactionResponse};
use network::{model::ErrorResponse, request};
use reqwest::{header::CONTENT_TYPE, Client};

/// Get a swap quote from Jupiter for exchanging tokens.
///
/// This function fetches a quote for swapping between SOL and BACH tokens using the Jupiter API.
/// The amount is automatically converted to the proper denomination based on the token decimals.
///
/// # Arguments
///
/// * `from_token` - The mint address of the token to swap from (SOL or BACH)
/// * `to_token` - The mint address of the token to swap to (SOL or BACH)
/// * `amount` - The amount of tokens to swap in base units (before decimal conversion)
/// * `slippage_bps` - The maximum slippage tolerance in basis points (e.g., 100 = 1%)
///
/// # Returns
///
/// * `Ok(SwapQuoteResponse)` - Contains the swap quote with price information, routes, and fees
/// * `Err(ErrorResponse)` - Network error or API error from Jupiter
///
/// # Panics
///
/// Panics if the swap involves tokens other than SOL and BACH, as only these pairs are currently supported.
///
/// # Examples
///
/// ```rust
/// use wallet_kit::swap::get_jupiter_swap_quote;
/// use wallet_kit::constants::{SOLANA_MINT_ACCOUNT, BACH_MINT_ACCOUNT};
///
/// // Get quote for swapping 1 SOL to BACH with 1% slippage
/// let quote = get_jupiter_swap_quote(
///     SOLANA_MINT_ACCOUNT,
///     BACH_MINT_ACCOUNT,
///     1, // 1 SOL
///     100 // 1% slippage
/// ).await?;
/// ```
pub async fn get_jupiter_swap_quote(
    from_token: &str,
    to_token: &str,
    amount: f64,
    slippage_bps: u64,
) -> Result<SwapQuoteResponse, ErrorResponse> {
    let amount_denomination = if from_token == SOLANA_MINT_ACCOUNT {
        (amount * 10f64.powi(SOL_DECIMALS)) as i64
    } else if from_token == BACH_MINT_ACCOUNT {
        (amount * 10f64.powi(BACH_DECIMALS)) as i64
    } else {
        panic!("Only support BACH and SOL swap for now.")
    };
    let url = format!(
        "{}{}?inputMint={}&outputMint={}&amount={}&slippageBps={}&platformFeeBps={}&feeAccount={}",
        JUPITER_BASE_URL,
        JUPITER_SWAP_QUOTE_PATH,
        from_token,
        to_token,
        amount_denomination,
        slippage_bps,
        PLATFORM_FEE_BPS,
        FEE_ACCOUNT
    );
    let client = Client::new().get(url);
    request(client).await
}

/// Build a swap transaction using Jupiter's swap API.
///
/// This function takes a swap transaction payload and constructs the actual transaction
/// that can be signed and executed on the Solana blockchain. The payload typically
/// contains the quote information from `get_jupiter_swap_quote` along with user preferences.
///
/// # Arguments
///
/// * `payload` - The swap transaction payload containing:
///   - Quote information from Jupiter
///   - User public key
///   - Transaction preferences (priority fee, etc.)
///   - Slippage settings
///
/// # Returns
///
/// * `Ok(SwapTransactionResponse)` - Contains the serialized transaction ready for signing
/// * `Err(String)` - Error message if the request fails or the response cannot be parsed
///
/// # Examples
///
/// ```rust
/// use wallet_kit::swap::build_swap_transaction;
/// use wallet_kit::models::swap::SwapTransactionPayload;
///
/// let payload = SwapTransactionPayload {
///     // ... payload fields from quote and user preferences
/// };
///
/// let transaction = build_swap_transaction(payload).await?;
/// // transaction.swapTransaction contains the base64 encoded transaction
/// ```
///
/// # Notes
///
/// The returned transaction is serialized and needs to be:
/// 1. Deserialized into a Solana transaction
/// 2. Signed by the user's wallet
/// 3. Submitted to the Solana network
pub async fn build_swap_transaction(
    payload: SwapTransactionPayload,
) -> Result<SwapTransactionResponse, ErrorResponse> {
    let url = format!("{}{}", JUPITER_BASE_URL, JUPITER_SWAP_PATH);
    let client = Client::new();

    let builder = client
        .post(url)
        .header(CONTENT_TYPE, "application/json")
        .json(&payload);
    request(builder).await
}
