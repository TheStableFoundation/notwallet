use {
    smbcloud_model::oauth::OauthRedirect,
    tauri::{command, AppHandle, Emitter, Url},
    tauri_plugin_log::log::{debug, error},
    tauri_plugin_oauth::{start_with_config, OauthConfig},
};

#[command]
pub async fn start_server(app: AppHandle) -> Result<u16, String> {
    let config = OauthConfig {
        ports: Some(vec![8000, 8001, 8002, 8003]),
        response: Some(
            "
        <html>
        <head>
            <title>Done!</title>
            <style>
                body {
                    font-family: sans-serif;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 20px;
                    color: #666;
                }
                a {
                    color: #007BFF;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Done!</h1>
            <p>You can close this window. You can <a href='notwallet://'>open the app</a>.</p>
            <p>If you are not redirected, <a href=\"javascript:window.close()\">click here</a>.</p>
        </body>
        </html>
        "
            .into(),
        ),
    };
    start_with_config(config, move |url| {
        debug!("Received URL: {}", url);
        let url = Url::try_from(url.as_str()).unwrap();

        for (key, val) in url.query_pairs() {
            debug!("{} = {}", key, val);
        }

        if let Some(query) = url.query() {
            let oauth_redirect: OauthRedirect = serde_qs::from_str(query).unwrap();
            match app.emit("oauth_redirect_uri", oauth_redirect) {
                Ok(_) => {
                    debug!("Emitted event.");
                }
                Err(e) => {
                    error!("Failed to emit event: {}", e);
                }
            }
        }
    })
    .map_err(|err| err.to_string())
}
