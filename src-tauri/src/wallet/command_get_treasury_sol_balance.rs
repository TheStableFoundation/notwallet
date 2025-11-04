use {
    crate::constants::rpc::rpc_url, log::info, smbcloud_wallet_kit::balance::sol_balance,
    tauri::command,
};

#[command]
pub fn get_treasury_sol_balance() -> String {
    info!("Getting treasury SOL balance");
    let treasury_address = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";
    sol_balance(rpc_url(), treasury_address.to_string())
}
