use {
    crate::balance::spl_token_accounts_for::spl_token_accounts_for,
    log::{debug, error},
    smbcloud_wallet_core_network::model::{ErrorCode, ErrorResponse},
    std::str::FromStr,
};

/// Get an address balance for a given public key and token address
/// for all token accounts associated with the given public key and token address.
///
/// Returns: the balance and ui balance for the given token address.
pub fn aggregate_spl_token_balance(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
    token_address: String,
) -> Result<(u64, f64), ErrorResponse> {
    // Get token accounts for the given public key and token address
    let target_spl_token_accounts =
        match spl_token_accounts_for(rpc_url, pubkey, spl_token_program_id, token_address) {
            Ok(accounts) => accounts,
            Err(err) => {
                error!("Failed to fetch token accounts: {}", err);
                return Err(ErrorResponse::Error {
                    code: ErrorCode::BalanceError,
                    message: ErrorCode::BalanceError.to_string(),
                });
            }
        };

    debug!(
        "Number of target token accounts: {}",
        target_spl_token_accounts.len()
    );

    if target_spl_token_accounts.is_empty() {
        return Ok((0, 0.0));
    }

    // Get aggregated amount
    let mut aggregated_amount: u64 = 0;
    let mut aggregated_ui_amount: f64 = 0.0;
    for account in target_spl_token_accounts {
        if let (amount, Some(ui_amount)) =
            (account.token_amount.amount, account.token_amount.ui_amount)
        {
            aggregated_amount += u64::from_str(&amount).unwrap_or_default();
            aggregated_ui_amount += ui_amount;
        }
    }

    Ok((aggregated_amount, aggregated_ui_amount))
}
