use {
    log::info, smbcloud_wallet_core_model::models::environment::Environment,
    smbcloud_wallet_kit::balance::sol_balance, tauri::command,
};

#[command]
pub fn get_treasury_sol_balance(network: Environment) -> String {
    info!("Getting treasury SOL balance");
    let treasury_address = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";
    sol_balance(network.rpc_url(), treasury_address.to_string())
}
