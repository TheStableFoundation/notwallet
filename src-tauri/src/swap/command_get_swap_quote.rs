use {
    smbcloud_wallet_core_network::model::ErrorResponse,
    smbcloud_wallet_kit::{models::swap::SwapQuoteResponse, swap::get_jupiter_swap_quote},
    tauri::command,
};

#[command]
pub async fn get_swap_quote(
    from_token: &str,
    to_token: &str,
    amount: f64,
    slippage_bps: u64,
) -> Result<SwapQuoteResponse, ErrorResponse> {
    get_jupiter_swap_quote(from_token, to_token, amount, slippage_bps).await
}
