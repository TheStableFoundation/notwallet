use {
    log::{debug, error},
    network::model::{
        ErrorCode::{InvalidPubkey, NetworkError},
        ErrorResponse,
    },
    serde::{Deserialize, Serialize},
    solana_account_decoder::{parse_token::UiTokenAccount, UiAccountData},
    solana_client::{rpc_client::RpcClient, rpc_request::TokenAccountsFilter},
    solana_program::pubkey::Pubkey,
    std::str::FromStr,
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

pub(crate) fn spl_token_accounts_with_balance(
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

// Should use the wallet-core
pub(crate) fn spl_token_accounts(
    rpc_url: String,
    pubkey: String,
    spl_token_program_id: String,
) -> Result<Vec<UiTokenAccount>, ErrorResponse> {
    let connection = RpcClient::new(rpc_url);

    let spl_token_program_id_pubkey = match Pubkey::from_str(&spl_token_program_id) {
        Ok(pubkey) => pubkey,
        Err(err) => {
            error!("Error parsing SPL token program ID: {}", err);
            return Err(ErrorResponse::Error {
                code: InvalidPubkey,
                message: err.to_string(),
            });
        }
    };

    let pubkey = match Pubkey::from_str(&pubkey) {
        Ok(pubkey) => pubkey,
        Err(err) => {
            error!("Error parsing wallet pubkey: {}", err);
            return Err(ErrorResponse::Error {
                code: InvalidPubkey,
                message: err.to_string(),
            });
        }
    };

    // Get all token accounts owned by the pubkey
    let rpc_keyed_accounts = match connection.get_token_accounts_by_owner(
        &pubkey,
        TokenAccountsFilter::ProgramId(spl_token_program_id_pubkey),
    ) {
        Ok(accounts) => accounts,
        Err(err) => {
            error!("Error getting token accounts: {}", err);
            return Err(ErrorResponse::Error {
                code: NetworkError,
                message: err.to_string(),
            });
        }
    };

    debug!("RPC keyed accounts: {}", rpc_keyed_accounts.len());

    // Get token accounts
    let spl_token_accounts = rpc_keyed_accounts
        .iter()
        .map(|account| account.account.clone())
        .filter_map(|account| get_token_account(&account.data))
        .collect::<Vec<_>>();

    debug!("Token accounts: {}", spl_token_accounts.len());

    Ok(spl_token_accounts)
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct TokenAccount {
    pub info: UiTokenAccount,
}

fn get_token_account(data: &UiAccountData) -> Option<UiTokenAccount> {
    let parsed_account = match data {
        solana_account_decoder::UiAccountData::Json(parsed) => parsed,
        _ => {
            error!("Failed to parse account data - not in JSON format");
            return None;
        }
    };
    let token_account: TokenAccount = match serde_json::from_value(parsed_account.parsed.clone()) {
        Ok(account) => {
            debug!("Parsed Account: {:?}", account);
            account
        }
        Err(e) => {
            error!("Error parsing token account: {}", e);
            return None;
        }
    };
    Some(token_account.info)
}
