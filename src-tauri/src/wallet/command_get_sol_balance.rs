use {
    crate::constants::rpc::rpc_url, log::info, smbcloud_wallet_kit::balance::sol_balance,
    tauri::command,
};

#[command]
pub fn get_sol_balance(pubkey: String) -> String {
    info!("Getting balance for {}", pubkey);
    sol_balance(rpc_url(), pubkey)
}
