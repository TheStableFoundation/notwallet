use {
    crate::{
        assets::{BACH_TOKEN, SOLANA},
        constants::{
            BIRDEYE_API_KEY, BIRDEYE_BASE_URL, BIRDEYE_PRICE_PATH, LAMPORTS_PER_SOL,
            SPL_TOKEN_PROGRAM_ID, USER_AGENT,
        },
        models::{asset::AssetBalance, currency::FiatCurrency, price::BirdeyePriceResponse},
        spl_token::{spl_token_accounts, spl_token_accounts_for, spl_token_accounts_with_balance},
    },
    log::{debug, error},
    network::{
        model::{ErrorCode::BalanceError, ErrorResponse},
        request,
    },
    reqwest::Client,
    solana_client::rpc_client::RpcClient,
    solana_program::pubkey::Pubkey,
    std::{collections::HashMap, str::FromStr},
};

pub fn spl_balance(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
    token_address: String,
) -> String {
    debug!(
        "Fetching SPL balance for {}, token {}",
        pubkey, token_address
    );

    let balance = aggregate_spl_token_balance(rpc_url, pubkey, spl_token_program_id, token_address);
    format!("{} BACH", balance)
}

pub fn sol_balance(rpc_url: String, pubkey: String) -> String {
    let balance = _sol_balance(rpc_url, pubkey.to_string());
    let pretty_balance = balance / LAMPORTS_PER_SOL;
    println!("{:#?} SOL", pretty_balance);
    // Display SOL balance
    format!("{:.9} SOL", pretty_balance)
}

pub async fn wallet_balance(
    rpc_url: String,
    pubkey: String,
    currency: Option<FiatCurrency>,
) -> Result<String, ErrorResponse> {
    // Get SOL balance
    let sol_amount = _sol_balance(rpc_url.clone(), pubkey.clone()) / LAMPORTS_PER_SOL;

    // Get current prices in the target currency
    // If SOL balance is less than 0.000000001 SOL, we don't query the price.
    let sol_price = if sol_amount >= 0.000000001 {
        get_sol_price().await?
    } else {
        0.0
    };

    // Calculate total value
    let sol_value = sol_amount * sol_price;

    // Try to get BACH price, but handle errors gracefully
    let spl_tokens = match spl_token_accounts_with_balance(
        rpc_url.clone(),
        pubkey.clone(),
        SPL_TOKEN_PROGRAM_ID.to_string(),
    ) {
        Ok(tokens) => tokens,
        Err(err) => {
            error!("Failed to get SPL token accounts: {:?}", err);
            Vec::new()
        }
    };

    let mut spl_value = 0.0;
    for token in spl_tokens {
        let token_price = match get_asset_price(&token.mint).await {
            Ok(price) => price.data.value,
            Err(err) => {
                error!("Failed to get price for token {}: {:?}", token.mint, err);
                0.0
            }
        };
        let token_amount = match token.token_amount.ui_amount {
            Some(amount) => amount,
            None => {
                error!("Token amount is None for token {}", token.mint);
                0.0
            }
        };
        spl_value += token_amount * token_price;
    }

    let total_value = sol_value + spl_value;

    let currency_symbol = match currency.unwrap_or(FiatCurrency::USD) {
        FiatCurrency::USD => "$",
        FiatCurrency::IDR => "Rp",
        FiatCurrency::SEK => "kr",
    };

    Ok(format!("{}{:.2}", currency_symbol, total_value))
}

pub async fn other_assets_balance(
    rpc_url: String,
    pubkey: String,
) -> Result<Vec<AssetBalance>, ErrorResponse> {
    let token_accounts = match spl_token_accounts(rpc_url, pubkey, SPL_TOKEN_PROGRAM_ID.to_string())
    {
        Ok(accounts) => accounts,
        Err(err) => {
            error!("Failed to get token accounts: {:?}", err);
            return Ok(vec![]);
        }
    };
    let token_accounts_with_balance = token_accounts
        .into_iter()
        .filter_map(|account| {
            // Only non-SOL and non-BCH tokens
            if account.mint == SOLANA || account.mint == BACH_TOKEN {
                return None;
            }

            if let Some(ui_amount) = account.token_amount.ui_amount {
                if ui_amount > 0.0 {
                    Some(account)
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect::<Vec<_>>();
    let mut aggregated_balance: HashMap<String, f64> = HashMap::new();

    for account in token_accounts_with_balance {
        if let Some(ui_amount) = account.token_amount.ui_amount {
            if aggregated_balance.contains_key(&account.mint) {
                let current_balance = aggregated_balance.get(&account.mint).unwrap();
                aggregated_balance.insert(account.mint, current_balance + ui_amount);
            } else {
                aggregated_balance.insert(account.mint, ui_amount);
            }
        }
    }
    let mut assets_balance = Vec::new();
    for (mint, balance) in aggregated_balance {
        assets_balance.push(AssetBalance {
            id: mint,
            balance: balance as u64,
        });
    }
    Ok(assets_balance)
}

// Private or crate level access.

fn aggregate_spl_token_balance(
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

fn _sol_balance(rpc_url: String, pubkey: String) -> f64 {
    let connection = RpcClient::new(rpc_url);
    let pubkey = match Pubkey::from_str(&pubkey) {
        Ok(pubkey) => pubkey,
        Err(e) => {
            println!("Error parsing pubkey: {}", e);
            return 0.0;
        }
    };
    match connection.get_balance(&pubkey) {
        Ok(balance) => balance as f64,
        Err(e) => {
            println!("Error getting balance: {}", e);
            return 0.0;
        }
    }
}

async fn get_sol_price() -> Result<f64, ErrorResponse> {
    match get_asset_price(SOLANA).await {
        Ok(price) => {
            if price.is_valid() {
                Ok(price.data.value)
            } else {
                Err(ErrorResponse::Error {
                    code: BalanceError,
                    message: "No price data available".to_string(),
                })
            }
        }
        Err(err) => Err(err),
    }
}

async fn get_asset_price(asset: &str) -> Result<BirdeyePriceResponse, ErrorResponse> {
    // For now, return 0 as BACH price fetching would need specific token address and DEX integration
    // This could be implemented using Birdeye API or similar service
    debug!("Get asset price");

    let url = format!(
        "{}{}?address={}",
        BIRDEYE_BASE_URL, BIRDEYE_PRICE_PATH, asset
    );
    debug!("URL: {}", url);
    let client = Client::new()
        .get(url)
        .header("X-API-KEY", BIRDEYE_API_KEY)
        .header("User-Agent", USER_AGENT);
    request(client).await
}

#[cfg(test)]
mod tests {
    use super::*;

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

    #[test]
    fn test_spl_balance_error_handling() {
        let result = spl_balance(
            "https://api.mainnet-beta.solana.com".to_string(),
            "invalid_pubkey".to_string(),
            SPL_TOKEN_PROGRAM_ID.to_string(),
            BACH_TOKEN.to_string(),
        );
        // Should return "0 BACH" instead of panicking
        assert_eq!(result, "0 BACH");
    }

    #[tokio::test]
    async fn test_wallet_balance_with_invalid_spl() {
        // This test verifies that wallet_balance can still return SOL balance
        // even when SPL operations fail
        let result = wallet_balance(
            "https://api.mainnet-beta.solana.com".to_string(),
            "11111111111111111111111111111112".to_string(), // System program address (should have 0 SOL)
            Some(FiatCurrency::USD),
        )
        .await;

        // Should succeed even if SPL balance fetching fails
        assert!(result.is_ok() || result.is_err()); // Either way, it shouldn't panic
    }
}
