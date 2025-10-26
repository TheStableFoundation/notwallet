use {
    smbcloud_wallet_constants::{
        assets_solana::ADDRESS_SOL,
        constants::{SOL_DECIMALS, SPL_TOKEN_PROGRAM_ID},
    },
    smbcloud_wallet_core_model::models::balance::Balance,
    smbcloud_wallet_core_network::model::ErrorResponse,
    smbcloud_wallet_core_rpc::balance::{
        sol_balance::sol_balance as core_sol_balance,
        spl_token_accounts_with_balance::spl_token_accounts_with_balance,
    },
};

pub async fn wallet_balance_aggregate(
    rpc_url: String,
    pubkey: String,
) -> Result<Vec<Balance>, ErrorResponse> {
    let mut aggregates: Vec<Balance> = Vec::new();

    // Get SOL balance
    let sol_amount = match core_sol_balance(rpc_url.clone(), pubkey.clone()) {
        Ok(balance) => balance.1,
        Err(_) => 0.0,
    };

    println!("🦀🦀  Balance {:?} SOL", sol_amount);

    aggregates.push(Balance {
        mint: ADDRESS_SOL.to_string(),
        symbol: "SOL".to_string(),
        balance: sol_amount,
        balance_string: format!("{:.9}", sol_amount),
        decimal: SOL_DECIMALS,
    });

    // Try to get BACH price, but handle errors gracefully
    let spl_tokens = match spl_token_accounts_with_balance(
        rpc_url.clone(),
        pubkey.clone(),
        SPL_TOKEN_PROGRAM_ID.to_string(),
    ) {
        Ok(tokens) => tokens,
        Err(err) => {
            println!("🦀🦀  Failed to get SPL token accounts: {:?}", err);
            Vec::new()
        }
    };

    println!("🦀🦀  SPL tokens with balance: {:?}", spl_tokens);

    for token in spl_tokens {
        let token_amount = match token.token_amount.ui_amount {
            Some(amount) => amount,
            None => {
                println!("🦀🦀  Token amount is None for token {}", token.mint);
                0.0
            }
        };
        let symbol = token.mint[..3].to_string();
        aggregates.push(Balance {
            mint: token.mint,
            symbol,
            balance: token_amount,
            balance_string: token.token_amount.ui_amount_string,
            decimal: token.token_amount.decimals,
        });
    }

    println!("🦀🦀  Aggregates: {:?}", aggregates);

    Ok(aggregates)
}
