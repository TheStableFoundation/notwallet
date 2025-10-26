use {
    smbcloud_wallet_constants::constants::SPL_TOKEN_PROGRAM_ID,
    smbcloud_wallet_core_model::models::{asset_solana::SolanaAsset, balance_v1::BalanceV1},
    smbcloud_wallet_core_network::model::ErrorResponse,
    smbcloud_wallet_core_rpc::balance::{
        sol_balance::sol_balance, spl_token_accounts_with_balance::spl_token_accounts_with_balance,
    },
    std::str::FromStr,
};

pub async fn wallet_token_list(
    rpc_url: String,
    pubkey: String,
) -> Result<Vec<BalanceV1>, ErrorResponse> {
    let mut aggregates: Vec<BalanceV1> = Vec::new();

    // Get SOL balance
    let sol_balance = sol_balance(rpc_url.clone(), pubkey.clone()).unwrap_or((0, 0.0));

    println!("🦀🦀  Balance {:?} SOL", sol_balance);
    if sol_balance.0 > 0 {
        let native_asset = SolanaAsset::native();
        aggregates.push(BalanceV1 {
            meta: native_asset.metadata(),
            balance: sol_balance.0,
            ui_amount: sol_balance.1,
        });
    }

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
        let asset = match SolanaAsset::from_address(token.mint) {
            Some(asset) => asset,
            None => {
                println!("🦀🦀  Unrecognized SPL token.");
                continue;
            }
        };
        let amount = u64::from_str(&token.token_amount.amount).unwrap_or_default();
        let ui_amount = match token.token_amount.ui_amount {
            Some(amount) => amount,
            None => {
                println!(
                    "🦀🦀  Token amount is None for token {}",
                    asset.metadata().name
                );
                0.0
            }
        };
        aggregates.push(BalanceV1 {
            meta: asset.metadata(),
            balance: amount,
            ui_amount,
        });
    }

    println!("🦀🦀  Aggregates: {:?}", aggregates);

    Ok(aggregates)
}
