use {
    crate::{
        constants::{
            BACH_MINT_ACCOUNT, JUPITER_BASE_URL, JUPITER_PRICE_PATH, LAMPORTS_PER_SOL,
            SPL_TOKEN_PROGRAM_ID,
        },
        models::{currency::FiatCurrency, price::PricesResponse},
    },
    log::{debug, error},
    network::{model::ErrorResponse, request},
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
    let connection = RpcClient::new(rpc_url);

    let bach_pubkey = Pubkey::from_str(&spl_token_program_id).unwrap();
    let pubkey = Pubkey::from_str(&pubkey).unwrap();

    // Get all token accounts owned by the pubkey
    let token_accounts = match connection
        .get_token_accounts_by_owner(&pubkey, TokenAccountsFilter::ProgramId(bach_pubkey))
    {
        Ok(accounts) => accounts,
        Err(err) => {
            error!("Error getting token accounts: {}", err);
            return String::new();
        }
    };

    debug!("Number of token accounts: {}", token_accounts.len());

    // Get bach token accounts
    let bach_account = token_accounts
        .iter()
        .map(|account| account.account.clone())
        .filter_map(|account| get_token_account(&account.data))
        .filter(|account| account.mint == token_address)
        .collect::<Vec<_>>();

    debug!("Number of bach token accounts: {}", bach_account.len());

    if bach_account.is_empty() {
        return "0".to_string();
    }

    debug!(
        "Bach balance: {}",
        bach_account[0].token_amount.ui_amount_string
    );

    format!("{} BACH", bach_account[0].token_amount.ui_amount_string)
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

pub fn wallet_balance(rpc_url: String, pubkey: String, currency: Option<FiatCurrency>) -> String {
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
    let sol_price = get_sol_price(&target_currency);
    let bach_price = get_bach_price(&target_currency);

    // Calculate total value
    let sol_value = sol_amount * sol_price;
    let bach_value = bach_amount * bach_price;
    let total_value = sol_value + bach_value;

    let currency_symbol = match target_currency {
        FiatCurrency::USD => "$",
        FiatCurrency::IDR => "Rp",
        FiatCurrency::SEK => "kr",
    };

    format!("{}{:.2}", currency_symbol, total_value)
}

fn parse_sol_amount(balance_str: &str) -> f64 {
    // Extract numeric value from "X.XXXXXXXXX SOL" format
    balance_str.replace(" SOL", "").parse().unwrap_or(0.0)
}

fn parse_bach_amount(balance_str: &str) -> f64 {
    0.0
}

fn get_sol_price(currency: &FiatCurrency) -> f64 {
    // Using CoinGecko API as it's free and reliable
    0.0
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
