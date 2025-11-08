use {
    log::info, smbcloud_wallet_core_model::models::environment::Environment,
    smbcloud_wallet_kit::balance::sol_balance, tauri::command,
};

#[command]
pub fn get_sol_balance(network: Environment, pubkey: String) -> String {
    info!("Getting balance for {}", pubkey);
    sol_balance(network.rpc_url(), pubkey)
}
