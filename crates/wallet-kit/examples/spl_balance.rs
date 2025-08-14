use {
    wallet_kit::{balance::spl_balance, constants::SPL_TOKEN_PROGRAM_ID},
};

fn main() {
    let RPC_URL = "http://localhost:8899/";
    let PUBKEY = "BuLWxBBwgo2QTZjkAHr4YTKpEKssKgNiejMg8Z66dQ4A";
    let TOKEN = "FXNgxCz1cDbAxkp17S92vLZKXKjvA19P3jsDArrtJdjx";

    let balance = spl_balance(
        RPC_URL.to_string(),
        PUBKEY.to_string(),
        SPL_TOKEN_PROGRAM_ID.to_string(),
        TOKEN.to_string(),
    );

    // Print the balance
    println!("Balance: {}", balance);
}
