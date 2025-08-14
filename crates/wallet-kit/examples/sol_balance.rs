use {
    wallet_kit::balance::sol_balance,
};

fn main() {
    let RPC_URL = "http://localhost:8899/";
    let PUBKEY = "BuLWxBBwgo2QTZjkAHr4YTKpEKssKgNiejMg8Z66dQ4A";
    sol_balance(RPC_URL.to_string(), PUBKEY.to_string());
}
