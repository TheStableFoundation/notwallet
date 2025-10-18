#[derive(Debug)]
pub enum Network {
    Solana,
}

impl Network {
    pub fn from_string(network: String) -> Option<Self> {
        match network.as_str() {
            "Solana" => Some(Self::Solana),
            _ => None,
        }
    }
}
