use {
    crate::balance::spl_token_accounts::spl_token_accounts, network::model::ErrorResponse,
    solana_account_decoder::parse_token::UiTokenAccount,
};

pub fn spl_token_accounts_with_balance(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
) -> Result<Vec<UiTokenAccount>, ErrorResponse> {
    let target_spl_token_accounts = spl_token_accounts(rpc_url, pubkey, spl_token_program_id)?;
    let spl_token_accounts_with_balance = target_spl_token_accounts
        .into_iter()
        .filter_map(|account| {
            // Only non-SOL
            if account.is_native {
                return None;
            }
            // token_amount.amount is the amount of tokens in its smallest unit
            if let Ok(amount) = account.token_amount.amount.parse::<u64>() {
                if amount > 0 {
                    Some(account)
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect::<Vec<_>>();
    Ok(spl_token_accounts_with_balance)
}
