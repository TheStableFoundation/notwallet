use {
    crate::constants::address::BACH_TOKEN_ADDRESS_LOCAL,
    log::info,
    smbcloud_wallet_constants::{
        assets_solana::{
            ADDRESS_BACH_TOKEN, ADDRESS_BACH_TOKEN_DEVNET, ADDRESS_BACH_TOKEN_TESTNET,
        },
        constants::SPL_TOKEN_PROGRAM_ID,
    },
    smbcloud_wallet_core_model::models::environment::Environment,
    smbcloud_wallet_core_rpc::balance::spl_balance::spl_balance,
    tauri::command,
};

#[command]
pub fn get_bach_balance(network: Environment, pubkey: String) -> String {
    info!("Getting Bach balance for {}", pubkey);
    let bach_token_address = if network == Environment::Local {
        BACH_TOKEN_ADDRESS_LOCAL.to_string()
    } else if network == Environment::Devnet {
        ADDRESS_BACH_TOKEN_DEVNET.to_string()
    } else if network == Environment::Testnet {
        ADDRESS_BACH_TOKEN_TESTNET.to_string()
    } else {
        ADDRESS_BACH_TOKEN.to_string()
    };

    match spl_balance(
        network.rpc_url(),
        pubkey,
        SPL_TOKEN_PROGRAM_ID.to_string(),
        bach_token_address,
    ) {
        Ok(balance) => balance,
        Err(_) => "0.0".to_string(),
    }
}
