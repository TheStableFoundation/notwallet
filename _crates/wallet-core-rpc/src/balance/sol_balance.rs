use {
    smbcloud_wallet_constants::constants::LAMPORTS_PER_SOL, solana_pubkey::Pubkey,
    solana_rpc_client::rpc_client::RpcClient, std::str::FromStr,
};

/// Return native Solana balance for a given address.
///
/// Params:
///  - RPC Url
///  - Pubkey address
/// Return:
///  - Tuple with balance and ui balance.
pub fn sol_balance(rpc_url: String, pubkey: String) -> Result<(u64, f64), String> {
    println!("🦀🦀  Will load balance");
    let connection = RpcClient::new(rpc_url);
    let pubkey = match Pubkey::from_str(&pubkey) {
        Ok(pubkey) => pubkey,
        Err(e) => {
            println!("🦀🦀  Error parsing pubkey: {}", e);
            return Err(format!("Error parsing pubkey: {}", e));
        }
    };
    match connection.get_balance(&pubkey) {
        Ok(balance) => {
            println!("🦀🦀  Get balance for {}: {}", pubkey, balance);
            let balance_as_f64 = balance as f64;
            let ui_amount = balance_as_f64 / LAMPORTS_PER_SOL;
            Ok((balance, ui_amount))
        }
        Err(e) => {
            println!("🦀🦀  Error getting balance: {}", e);
            Err(format!("Error getting balance: {}", e))
        }
    }
}
