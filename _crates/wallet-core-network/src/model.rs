use {
    core::fmt,
    serde::{Deserialize, Serialize},
    serde_repr::{Deserialize_repr, Serialize_repr},
    std::{
        error::Error,
        fmt::{Display, Formatter},
    },
    strum_macros::EnumIter,
    tsync::tsync,
};

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
#[tsync]
pub enum ErrorResponse {
    Error { code: ErrorCode, message: String },
}

impl Error for ErrorResponse {}

impl Display for ErrorResponse {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[derive(Serialize_repr, Deserialize_repr, Debug, EnumIter)]
#[repr(i32)]
#[tsync]
pub enum ErrorCode {
    Unknown = 0,
    ParseError = 1,
    NetworkError = 2,
    // Wallet related error codes.
    BalanceError = 1000,
    InvalidPubkey = 1001,
}

impl Display for ErrorCode {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}
