use log::{debug, error};
use serde::{Deserialize, Serialize};
use solana_account_decoder::parse_token::UiTokenAccount;
use solana_account_decoder::UiAccountData;
use solana_client::rpc_client::RpcClient;
use solana_client::rpc_request::TokenAccountsFilter;
use solana_program::pubkey::Pubkey;
use std::str::FromStr;

pub fn bach_balance(
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
    bach_account[0].token_amount.ui_amount_string.clone()
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
