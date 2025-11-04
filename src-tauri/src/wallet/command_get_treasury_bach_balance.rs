use {
    crate::constants::{
        address::{BACH_TOKEN_ADDRESS, BACH_TOKEN_ADDRESS_LOCAL},
        rpc::{rpc_url, USE_LOCAL_RPC},
    },
    log::info,
    smbcloud_wallet_constants::constants::SPL_TOKEN_PROGRAM_ID,
    smbcloud_wallet_core_rpc::balance::spl_balance::spl_balance,
    tauri::command,
};

#[command]
pub fn get_treasury_bach_balance() -> String {
    info!("Getting treasury BACH balance");
    let treasury_address = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";
    let bach_token_address = if USE_LOCAL_RPC {
        BACH_TOKEN_ADDRESS_LOCAL.to_string()
    } else {
        BACH_TOKEN_ADDRESS.to_string()
    };
    match spl_balance(
        rpc_url(),
        treasury_address.to_string(),
        SPL_TOKEN_PROGRAM_ID.to_string(),
        bach_token_address,
    ) {
        Ok(balance) => balance,
        Err(_) => "0.0".to_string(),
    }
}
