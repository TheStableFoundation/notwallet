use {
    smbcloud_wallet_core_network::model::ErrorResponse,
    smbcloud_wallet_kit::{
        models::swap::{SwapTransactionPayload, SwapTransactionResponse},
        swap::build_swap_transaction as build_swap_tx,
    },
    tauri::command,
};

#[command]
pub async fn build_swap_transaction(
    payload: SwapTransactionPayload,
) -> Result<SwapTransactionResponse, ErrorResponse> {
    build_swap_tx(payload).await
}
