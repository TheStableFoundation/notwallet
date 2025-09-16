use {
    crate::balance::spl_token_accounts_for::spl_token_accounts_for,
    log::{debug, error},
};

/// Get an address balance for a given public key and token address
/// for all token accounts associated with the given public key and token address.
///
/// Returns the total balance of the token accounts.

pub fn aggregate_spl_token_balance(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
    token_address: String,
) -> f64 {
    // Get token accounts for the given public key and token address
    let target_spl_token_accounts =
        match spl_token_accounts_for(rpc_url, pubkey, spl_token_program_id, token_address) {
            Ok(accounts) => accounts,
            Err(err) => {
                error!("Failed to fetch token accounts: {}", err);
                return 0.0;
            }
        };

    debug!(
        "Number of target token accounts: {}",
        target_spl_token_accounts.len()
    );

    if target_spl_token_accounts.is_empty() {
        return 0.0;
    }

    // Get aggregated amount
    let mut aggregated_amount = 0.0;
    for account in target_spl_token_accounts {
        if let Some(ui_amount) = account.token_amount.ui_amount {
            aggregated_amount += ui_amount;
        }
    }

    aggregated_amount
}

#[cfg(test)]
mod tests {
    use super::*;
    use constants::constants::{BACH_TOKEN, SPL_TOKEN_PROGRAM_ID};

    #[test]
    fn test_aggregate_spl_token_balance_invalid_pubkey() {
        let balance = aggregate_spl_token_balance(
            "https://api.mainnet-beta.solana.com".to_string(),
            "invalid_pubkey".to_string(),
            SPL_TOKEN_PROGRAM_ID.to_string(),
            BACH_TOKEN.to_string(),
        );
        // Should return 0.0 for invalid pubkey instead of panicking
        assert_eq!(balance, 0.0);
    }
}
