use wallet_kit::balance::sol_balance;

fn main() {
    let rpc_url = "http://localhost:8899/";
    let pubkey = "BuLWxBBwgo2QTZjkAHr4YTKpEKssKgNiejMg8Z66dQ4A";
    sol_balance(rpc_url.to_string(), pubkey.to_string());
}
