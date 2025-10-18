use {
    crate::model::{ErrorCode, ErrorResponse},
    reqwest::{RequestBuilder, Response},
    serde::de::DeserializeOwned,
};

pub mod model;

#[cfg(debug_assertions)]
const LOG_RESPONSE_BODY: bool = true;
#[cfg(not(debug_assertions))]
const LOG_RESPONSE_BODY: bool = false;

pub async fn parse_error_response<T: DeserializeOwned>(
    response: Response,
) -> Result<T, ErrorResponse> {
    let response_body = match response.text().await {
        Ok(body) => body,
        Err(e) => {
            println!("🦀‼️  Failed to get response body: {:?}", e);
            return Err(ErrorResponse::Error {
                code: ErrorCode::NetworkError,
                message: format!("Error getting response body: {}", e),
            });
        }
    };

    if LOG_RESPONSE_BODY {
        println!("🦀🦀  RESPONSE BODY >>>");
        println!("🦀🦀  {:?}", serde_json::to_string_pretty(&response_body));
        println!("🦀🦀  RESPONSE BODY >>>");
    }

    let e = match serde_json::from_str::<ErrorResponse>(&response_body) {
        Ok(json) => json,
        Err(e) => {
            println!("🦀‼️  Failed to parse error response: {:?}", e);
            return Err(ErrorResponse::Error {
                code: ErrorCode::ParseError,
                message: format!("Error parsing response: {}", e),
            });
        }
    };
    println!("🦀🦀  Error response: {:?}", e);
    return Err(e);
}

pub async fn request<R: DeserializeOwned>(builder: RequestBuilder) -> Result<R, ErrorResponse> {
    let response = builder.send().await;
    let response = match response {
        Ok(response) => response,
        Err(e) => {
            println!("🦀‼️  Failed to get response: {:?}", e);
            return Err(ErrorResponse::Error {
                code: ErrorCode::NetworkError,
                message: format!("Error getting response: {}", e),
            });
        }
    };
    let response = match response.status() {
        reqwest::StatusCode::OK => response,
        status => {
            println!("🦀‼️  Failed to get response: {:?}", status);
            return parse_error_response(response).await;
        }
    };

    let response_body = match response.text().await {
        Ok(body) => body,
        Err(e) => {
            println!("🦀‼️  Failed to get response body: {:?}", e);
            return Err(ErrorResponse::Error {
                code: ErrorCode::NetworkError,
                message: format!("Error getting response body: {}", e),
            });
        }
    };

    if LOG_RESPONSE_BODY {
        println!("🦀🦀  RESPONSE BODY >>>");
        println!("🦀🦀  {:?}", serde_json::to_string_pretty(&response_body));
        println!("🦀🦀  RESPONSE BODY >>>");
    }

    let response = match serde_json::from_str::<R>(&response_body) {
        Ok(response) => response,
        Err(e) => {
            println!("🦀‼️  Failed to parse response: {:?}", e);
            return Err(ErrorResponse::Error {
                code: ErrorCode::ParseError,
                message: e.to_string(),
            });
        }
    };

    Ok(response)
}
