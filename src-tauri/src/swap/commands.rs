use wallet_kit::{
    models::swap::{SwapQuoteResponse, SwapTransactionPayload, SwapTransactionResponse},
    swap::{build_swap_transaction as build_swap_tx, get_jupiter_swap_quote},
};

#[tauri::command]
pub async fn get_swap_quote(
    from_token: &str,
    to_token: &str,
    amount: u64,
    slippage_bps: u64,
) -> Result<SwapQuoteResponse, String> {
    get_jupiter_swap_quote(from_token, to_token, amount, slippage_bps).await
}

#[tauri::command]
pub async fn build_swap_transaction(
    payload: SwapTransactionPayload,
) -> Result<SwapTransactionResponse, String> {
    build_swap_tx(payload).await
}
