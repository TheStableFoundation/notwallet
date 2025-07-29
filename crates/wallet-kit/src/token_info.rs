use log::info;

pub fn token_info(id: String) -> String {
    info!("Token info for {}", id);
    "Hello, World!".to_string()
}
