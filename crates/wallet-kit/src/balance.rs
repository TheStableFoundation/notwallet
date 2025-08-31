use {
    crate::{
        constants::{
            BACH_MINT_ACCOUNT, JUPITER_BASE_URL, JUPITER_PRICE_PATH, LAMPORTS_PER_SOL,
            SOLANA_MINT_ACCOUNT, SPL_TOKEN_PROGRAM_ID,
        },
        models::{currency::FiatCurrency, price::PricesResponse},
    },
    log::{debug, error},
    network::{
        model::{ErrorCode::BalanceError, ErrorResponse},
        request,
    },
    reqwest::Client,
    serde::{Deserialize, Serialize},
    solana_account_decoder::{parse_token::UiTokenAccount, UiAccountData},
    solana_client::{rpc_client::RpcClient, rpc_request::TokenAccountsFilter},
    solana_program::pubkey::Pubkey,
    std::str::FromStr,
};

pub fn spl_balance(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
    token_address: String,
) -> String {
    let balance = aggregate_spl_token_balance(rpc_url, pubkey, spl_token_program_id, token_address);
    format!("{} BACH", balance)
}

pub fn aggregate_spl_token_balance(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
    token_address: String,
) -> f64 {
    let connection = RpcClient::new(rpc_url);

    let spl_token_program_id_pubkey = Pubkey::from_str(&spl_token_program_id).unwrap();
    let pubkey = Pubkey::from_str(&pubkey).unwrap();

    // Get all token accounts owned by the pubkey
    let spl_token_accounts = match connection.get_token_accounts_by_owner(
        &pubkey,
        TokenAccountsFilter::ProgramId(spl_token_program_id_pubkey),
    ) {
        Ok(accounts) => accounts,
        Err(err) => {
            error!("Error getting token accounts: {}", err);
            return 0.0;
        }
    };

    debug!("Number of token accounts: {}", spl_token_accounts.len());

    // Get bach token accounts
    let target_spl_token_accounts = spl_token_accounts
        .iter()
        .map(|account| account.account.clone())
        .filter_map(|account| get_token_account(&account.data))
        .filter(|account| account.mint == token_address)
        .collect::<Vec<_>>();

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

pub fn sol_balance(rpc_url: String, pubkey: String) -> String {
    let connection = RpcClient::new(rpc_url);
    let pubkey = match Pubkey::from_str(&pubkey) {
        Ok(pubkey) => pubkey,
        Err(e) => {
            println!("Error parsing pubkey: {}", e);
            return "0".to_string();
        }
    };
    let balance = match connection.get_balance(&pubkey) {
        Ok(balance) => balance as f64,
        Err(e) => {
            println!("Error getting balance: {}", e);
            return "0".to_string();
        }
    };
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
    let sol_balance_str = sol_balance(rpc_url.clone(), pubkey.clone());
    let sol_amount = parse_sol_amount(&sol_balance_str);

    // Get BACH balance using proper constants
    let bach_balance_str = spl_balance(
        rpc_url,
        pubkey.clone(),
        SPL_TOKEN_PROGRAM_ID.to_string(),
        BACH_MINT_ACCOUNT.to_string(),
    );
    let bach_amount = parse_bach_amount(&bach_balance_str);

    let target_currency = currency.unwrap_or(FiatCurrency::USD);

    // Get current prices in the target currency
    let sol_price = get_sol_price().await?;
    let bach_price = get_bach_price().await?;

    // Calculate total value
    let sol_value = sol_amount * sol_price;
    let bach_value = bach_amount * bach_price;
    let total_value = sol_value + bach_value;

    let currency_symbol = match target_currency {
        FiatCurrency::USD => "$",
        FiatCurrency::IDR => "Rp",
        FiatCurrency::SEK => "kr",
    };

    Ok(format!("{}{:.2}", currency_symbol, total_value))
}

fn parse_sol_amount(balance_str: &str) -> f64 {
    // Extract numeric value from "X.XXXXXXXXX SOL" format
    balance_str.replace(" SOL", "").parse().unwrap_or(0.0)
}

fn parse_bach_amount(balance_str: &str) -> f64 {
    0.0
}

async fn get_sol_price() -> f64 {
    match get_asset_price(SOLANA_MINT_ACCOUNT).await {
        Ok(price) => {
            if price.prices.contains_key(SOLANA_MINT_ACCOUNT) {
                Ok(price.prices[SOLANA_MINT_ACCOUNT].usd_price)
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

async fn get_bach_price() -> Result<f64, ErrorResponse> {
    match get_asset_price(BACH_MINT_ACCOUNT).await {
        Ok(price) => {
            if price.prices.contains_key(BACH_MINT_ACCOUNT) {
                Ok(price.prices[BACH_MINT_ACCOUNT].usd_price)
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

async fn get_asset_price(asset: &str) -> Result<PricesResponse, ErrorResponse> {
    // For now, return 0 as BACH price fetching would need specific token address and DEX integration
    // This could be implemented using Birdeye API or similar service
    debug!("Get asset price");

    let url = format!("{}{}?ids={}", JUPITER_BASE_URL, JUPITER_PRICE_PATH, asset);
    let client = Client::new().get(url);
    request(client).await
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct TokenAccount {
    pub info: UiTokenAccount,
}

fn get_token_account(data: &UiAccountData) -> Option<UiTokenAccount> {
    let parsed_account = match data {
        solana_account_decoder::UiAccountData::Json(parsed) => parsed,
        _ => return None,
    };
    let token_account: TokenAccount = match serde_json::from_value(parsed_account.parsed.clone()) {
        Ok(account) => {
            println!("Parsed Account: {:?}", account);
            account
        }
        Err(e) => {
            println!("Error parsing account: {}", e);
            return None;
        }
    };
    Some(token_account.info)
}
