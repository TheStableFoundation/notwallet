use {
    crate::balance::aggregate_spl_token_balance::aggregate_spl_token_balance, log::debug,
    smbcloud_wallet_core_network::model::ErrorResponse,
};

pub fn spl_balance(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
    token_address: String,
) -> Result<String, ErrorResponse> {
    debug!(
        "Fetching SPL balance for {}, token {}",
        pubkey, token_address
    );

    let balance =
        aggregate_spl_token_balance(rpc_url, pubkey, spl_token_program_id, token_address)?;
    Ok(format!("{} BACH", balance.1))
}

#[cfg(test)]
mod tests {
    use super::*;
    use smbcloud_wallet_constants::constants::{BACH_TOKEN, SPL_TOKEN_PROGRAM_ID};

    #[test]
    fn test_spl_balance_error_handling() {
        let result = match spl_balance(
            "https://api.mainnet-beta.solana.com".to_string(),
            "invalid_pubkey".to_string(),
            SPL_TOKEN_PROGRAM_ID.to_string(),
            BACH_TOKEN.to_string(),
        ) {
            Ok(result) => result,
            Err(_) => panic!(),
        };
        // Should return "0 BACH" instead of panicking
        assert_eq!(result, "0 BACH");
    }
}
