use {
    crate::{
        balance::{
            sol_balance::sol_balance as core_sol_balance,
            spl_token_accounts_with_balance::spl_token_accounts_with_balance,
        },
        price_data::{get_asset_price::get_asset_price, get_sol_price::get_sol_price},
    },
    constants::constants::{LAMPORTS_PER_SOL, SPL_TOKEN_PROGRAM_ID},
    network::model::ErrorResponse,
    std::time::Duration,
    tokio::time::sleep,
};

pub async fn wallet_balance(rpc_url: String, pubkey: String) -> Result<String, ErrorResponse> {
    // Get SOL balance
    let sol_amount = match core_sol_balance(rpc_url.clone(), pubkey.clone()) {
        Ok(balance) => balance / LAMPORTS_PER_SOL,
        Err(_) => 0.0,
    };

    println!("🦀🦀  Will calculate balance for {:?} SOL", sol_amount);

    // Get current prices in the target currency
    // If SOL balance is less than 0.000000001 SOL, we don't query the price.
    let sol_price = if sol_amount >= 0.000000001 {
        get_sol_price().await?
    } else {
        0.0
    };

    // Calculate total value
    let sol_value = sol_amount * sol_price;
    println!("🦀🦀  SOL value is {:?} USD", sol_value);
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

    let mut spl_value = 0.0;
    for token in spl_tokens {
        // By pass too many request error from BiredEye 😂
        sleep(Duration::from_millis(500)).await;
        let token_price = match get_asset_price(&token.mint).await {
            Ok(price) => price.data.value,
            Err(err) => {
                println!(
                    "🦀🦀  Failed to get price for token {}: {:?}",
                    token.mint, err
                );
                0.0
            }
        };
        let token_amount = match token.token_amount.ui_amount {
            Some(amount) => amount,
            None => {
                println!("🦀🦀  Token amount is None for token {}", token.mint);
                0.0
            }
        };
        spl_value += token_amount * token_price;
    }

    println!("🦀🦀  SPL token value is {:?} USD", spl_value);

    let total_value = sol_value + spl_value;
    println!("🦀🦀  Total value is {:?} USD", total_value);

    Ok(format!("{}{:.2}", "$", total_value))
}
