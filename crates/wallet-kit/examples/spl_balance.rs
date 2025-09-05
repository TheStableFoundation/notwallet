use wallet_kit::{balance::spl_balance, constants::SPL_TOKEN_PROGRAM_ID};

fn main() {
    let rpc_url = "http://localhost:8899/";
    let pubkey = "BuLWxBBwgo2QTZjkAHr4YTKpEKssKgNiejMg8Z66dQ4A";
    let token = "FXNgxCz1cDbAxkp17S92vLZKXKjvA19P3jsDArrtJdjx";

    let balance = spl_balance(
        rpc_url.to_string(),
        pubkey.to_string(),
        SPL_TOKEN_PROGRAM_ID.to_string(),
        token.to_string(),
    );

    // Print the balance
    println!("Balance: {}", balance);
}
