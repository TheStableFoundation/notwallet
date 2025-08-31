use core::fmt;
use serde::{Deserialize, Serialize};
use serde_repr::{Deserialize_repr, Serialize_repr};
use std::{
    error::Error,
    fmt::{Display, Formatter},
};
use strum_macros::EnumIter;
use tsync::tsync;

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
    BalanceError = 1000, // Move this to wallet-kit
}

impl Display for ErrorCode {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}
