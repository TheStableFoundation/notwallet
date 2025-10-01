use {
    crate::balance::spl_token_accounts::spl_token_accounts, log::debug,
    network::model::ErrorResponse, solana_account_decoder::parse_token::UiTokenAccount,
};

pub(crate) fn spl_token_accounts_for(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
    token_address: String,
) -> Result<Vec<UiTokenAccount>, ErrorResponse> {
    // Get token accounts for a specific token
    let target_spl_token_accounts = spl_token_accounts(rpc_url, pubkey, spl_token_program_id)?
        .into_iter()
        .filter(|account| account.mint == token_address)
        .collect::<Vec<_>>();

    debug!(
        "Number of target token accounts: {}",
        target_spl_token_accounts.len()
    );

    Ok(target_spl_token_accounts)
}
