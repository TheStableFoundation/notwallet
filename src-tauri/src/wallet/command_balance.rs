use {
    crate::constants::rpc::rpc_url, log::info, tauri::command, wallet_kit::balance::wallet_balance,
};

#[command]
pub fn get_wallet_balance(pubkey: String) -> String {
    info!("Getting wallet balance for {}", pubkey);
    wallet_balance(rpc_url(), pubkey, currency)
}
