/* This file is generated and managed by tsync */

/** Payload emitted with the `chat_status_changed` event. */
export interface ChatStatusPayload {
  status: ChatStatus;
  model_name?: string;
  error?: string;
}

/** A single message in the conversation, returned to the frontend. */
export interface ChatMessagePayload {
  role: string;
  content: string;
}

/**
 * Event payload emitted as `chat_reply` once inference completes.
 * 
 * Using an event instead of a blocking command return avoids the WebView
 * garbage-collecting the JS invoke-callback before slow on-device
 * inference (tens of seconds on mobile) finishes.
 */
export interface ChatReplyPayload {
  /** The assistant's reply text, or `None` on error. */
  reply?: string;
  /** Human-readable inference duration, or `None` on error. */
  duration?: string;
  /** Error message if inference failed, or `None` on success. */
  error?: string;
}

/** Response returned by `chat_get_status`. */
export interface ChatStatusResponse {
  status: ChatStatus;
  model_name?: string;
  approx_memory?: string;
  history_length: number;
}

export const BACH_TOKEN_ADDRESS_LOCAL = "your_local_token_address";

/**
 * AI Chat model status, mirrored to the frontend via the
 * `chat_status_changed` event and the `chat_get_status` command.
 */
export type ChatStatus =
  | "unloaded" | "loading" | "ready" | "error";

/**
 * Generate:
 * tsync -i src-tauri/src/ crates/wallet-kit/src/ -o lib/crate/generated.ts
 */
export const STORE = ".notwallet.dat";

export const STORE_ACCOUNT = ".account.dat";

export const STORE_ACCESS_TOKEN_KEY = "access_token";

export const STORE_KEYPAIRS = "keypairs";

export const STORE_SEEDS = "seeds";

export const STORE_ACTIVE_KEYPAIR = "activeKeypair";

export const STORE_PASSWORD = "password";

/**
 * Legacy store for the wallet.
 * This is used to store the wallet in the old format.
 */
export const STORE_WALLET = "wallet.json";

/**
 * Legacy wallet key.
 * This is used to store the wallet in the old format.
 */
export const WALLET_0 = "wallet_0";

export interface CheckPubkeyResponse {
  exists: boolean;
  user_id?: number;
}

export interface SolanaWallet {
  /**
   * The unique identifier for the wallet, typically a UUID.
   * This ID is used to reference the wallet in various operations.
   */
  id: string;
  /** The unique username of the wallet that is human-readable. */
  username?: string;
  /**
   * The name of the wallet, which is a human-readable identifier.
   * This can be used to differentiate between multiple wallets.
   */
  name: string;
  /**
   * The account index for the wallet, typically used in Solana to differentiate between multiple accounts.
   * This is usually 0 for the first account.
   * In the context of Solana, this is often referred to as the \"account\" index.
   */
  account: number;
  /**
   * The public key of the wallet, represented as a base58-encoded string.
   * This key is used to receive funds and is shared publicly.
   * In Solana, this is often referred to as the \"public key\" or \"address\".
   */
  pubkey: string;
  /**
   * The private key of the wallet, represented as a base58-encoded string.
   * This key is used to sign transactions and should be kept secret.
   * In Solana, this is often referred to as the \"private key
   */
  privkey: string;
  /** The UUID of the seed that this keypair is derived from. */
  seed_id: string;
}

export interface OnrampSession {
  id: string;
  client_secret: string;
}

/** Error type for Stripe operations */
export type StripeError =
  | { "RequestError": Error }
  | {
      "InvalidApiKey": {
        [key: PropertyKey]: never;
      }
    }
  | { "ApiError": string };

export interface Seed {
  id: string;
  phrase: string;
  seed_type: SeedType;
}

export type SeedType =
  | {
      "Created": {
        timestamp: Date;
      }
    }
  | {
      "Imported": {
        timestamp: Date;
      }
    };

export type AirdropEnvironment =
  | "development" | "production";

export type XlpEnvironment =
  | "development" | "production";

export interface OnboardingCreateWallet {
  seed: string;
  keypair: SolanaWallet;
}

export const KEY_NETWORK_ENVIRONMENT = "network_environment";

export const KEY_AIRDROP_ENVIRONMENT = "airdrop_environment";

export const KEY_XLP_ENVIRONMENT = "xlp_environment";

export const SOLANA = "So11111111111111111111111111111111111111112";

export const SOL_DECIMALS = 9;

export const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const USDT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

export const USDG = "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH";

export const EURC = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";

export const JUPITER = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";

export const MEW = "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5";

export const PAYPAY_USD = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";

export const BONK = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";

export const USDS = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA";

export const OFFICIAL_TRUMP = "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN";

export const COINBASE_WRAPPED_BTC = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";

export const MELANIA_MEME = "FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P";

export const JITO_STAKED_SOL = "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn";

export const ZBTC = "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg";

export const USD1 = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  logo_url: string;
}

export interface AssetBalance {
  id: string;
  balance: number;
}

export interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export interface RoutePlan {
  swapInfo: SwapInfo;
  percent: number;
}

export interface SwapQuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: PlatformFee;
  priceImpactPct: string;
  routePlan: Array<RoutePlan>;
  contextSlot: number;
  timeTaken: number;
  swapUsdValue?: string;
  simplerRouteUsed?: boolean;
  mostReliableAmmsQuoteReport?: MostReliableAmmsQuoteReportInfo;
  useIncurredSlippageForQuoting?: boolean;
  otherRoutePlans?: Array<RoutePlan>;
  aggregatorVersion?: string;
}

export interface MostReliableAmmsQuoteReportInfo {
  info: Record<string, string>;
}

export interface PriorityLevelWithMaxLamports {
  maxLamports: number;
  priorityLevel: string;
}

export interface PlatformFee {
  amount: string;
  feeBps: number;
}

export interface PrioritizationFeeLamports {
  priorityLevelWithMaxLamports: PriorityLevelWithMaxLamports;
}

export interface SwapTransactionPayload {
  quoteResponse: SwapQuoteResponse;
  userPublicKey: string;
  dynamicComputeUnitLimit: boolean;
  dynamicSlippage: boolean;
  prioritizationFeeLamports: PrioritizationFeeLamports;
}

export interface ComputeBudget {
  microLamports: number;
  estimatedMicroLamports: number;
}

export interface PrioritizationType {
  computeBudget: ComputeBudget;
}

export interface DynamicSlippageReport {
  slippageBps: number;
  otherAmount: number;
  simulatedIncurredSlippageBps: number;
  amplificationRatio?: string;
  categoryName: string;
  heuristicMaxSlippageBps?: number;
  rtseSlippageBps?: number;
  failedTxnEstSlippage?: number;
  emaEstSlippage?: number;
  useIncurredSlippageForQuoting?: boolean;
}

export interface SwapTransactionResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
  computeUnitLimit: number;
  prioritizationType: PrioritizationType;
  simulationSlot?: number;
  dynamicSlippageReport: DynamicSlippageReport;
  simulationError?: string;
  addressesByLookupTableAddress?: Array<string>;
}

export const ADDRESS_SOL = "So11111111111111111111111111111111111111112";

export const ADDRESS_BACH_TOKEN = "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf";

export const ADDRESS_BACH_TOKEN_DEVNET = "DENNuKzCcrLhEtxZ8tm7nSeef8qvKgGGrdxX6euNkNS7";

export const ADDRESS_BACH_TOKEN_TESTNET = "A6a2s9LTZcYZQgxrDatLHYfvHhJEfb5ZWuFENhHtxJtR";

export const ADDRESS_JUPITER = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";

export const ADDRESS_USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const ADDRESS_USDT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

export const ADDRESS_USDG = "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH";

export const ADDRESS_USDS = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA";

export const ADDRESS_USD1 = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB";

export const ADDRESS_EURC = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";

export const ADDRESS_ZBTC = "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg";

export const ADDRESS_CBBTC = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";

export const ADDRESS_XBTC = "CtzPWv73Sn1dMGVU3ZtLv9yWSyUAanBni19YWDaznnkn";

export const ADDRESS_GOOGLX = "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN";

export const ADDRESS_AMZNX = "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg";

export const ADDRESS_AAPLX = "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp";

export const ADDRESS_METAX = "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu";

export const ADDRESS_MSFTX = "XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX";

export const ADDRESS_NVDAX = "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh";

export const ADDRESS_TSLAX = "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB";

export const ADDRESS_ABTX = "XsHtf5RpxsQ7jeJ9ivNewouZKJHbPxhPoEy6yYvULr7";

export const ADDRESS_ABBVX = "XswbinNKyPmzTa5CskMbCPvMW6G5CMnZXZEeQSSQoie";

export const ADDRESS_ACNX = "Xs5UJzmCRQ8DWZjskExdSQDnbE6iLkRu2jjrRAB1JSU";

export const ADDRESS_AMBRX = "XsaQTCgebC2KPbf27KUhdv5JFvHhQ4GDAPURwrEhAzb";

export const ADDRESS_APPX = "XsPdAVBi8Zc1xvv53k4JcMrQaEDTgkGqKYeh7AYgPHV";

export const ADDRESS_AZNX = "Xs3ZFkPYT2BN7qBMqf1j1bfTeTm1rFzEFSsQ1z3wAKU";

export const ADDRESS_BACX = "XswsQk4duEQmCbGzfqUUWYmi7pV7xpJ9eEmLHXCaEQP";

export const ADDRESS_BRK_BX = "Xs6B6zawENwAbWVi7w92rjazLuAr5Az59qgWKcNb45x";

export const ADDRESS_AVGOX = "XsgSaSvNSqLTtFuyWPBhK9196Xb9Bbdyjj4fH3cPJGo";

export const ADDRESS_CVXX = "XsNNMt7WTNA2sV3jrb1NNfNgapxRF5i4i6GcnTRRHts";

export const ADDRESS_CRCLX = "XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1";

export const ADDRESS_CSCOX = "Xsr3pdLQyXvDJBFgpR5nexCEZwXvigb8wbPYp4YoNFf";

export const ADDRESS_KOX = "XsaBXg8dU5cPM6ehmVctMkVqoiRG2ZjMo1cyBJ3AykQ";

export const ADDRESS_COINX = "Xs7ZdzSHLU9ftNJsii5fCeJhoRWSC32SQGzGQtePxNu";

export const ADDRESS_CMCSAX = "XsvKCaNsxg2GN8jjUmq71qukMJr7Q1c5R2Mk9P8kcS8";

export const ADDRESS_CRWDX = "Xs7xXqkcK7K8urEqGg52SECi79dRp2cEKKuYjUePYDw";

export const ADDRESS_DHRX = "Xseo8tgCZfkHxWS9xbFYeKFyMSbWEvZGFV1Gh53GtCV";

export const ADDRESS_DFDVX = "Xs2yquAgsHByNzx68WJC55WHjHBvG9JsMB7CWjTLyPy";

export const ADDRESS_LLYX = "Xsnuv4omNoHozR6EEW5mXkw8Nrny5rB3jVfLqi6gKMH";

export const ADDRESS_XOMX = "XsaHND8sHyfMfsWPj6kSdd5VwvCayZvjYgKmmcNL5qh";

export const ADDRESS_GMEX = "Xsf9mBktVB9BSU5kf4nHxPq5hCBJ2j2ui3ecFGxPRGc";

export const ADDRESS_GLDX = "Xsv9hRk1z5ystj9MhnA7Lq4vjSsLwzL2nxrwmwtD3re";

export const ADDRESS_GSX = "XsgaUyp4jd1fNBCxgtTKkW64xnnhQcvgaxzsbAq5ZD1";

export const ADDRESS_HDX = "XszjVtyhowGjSC5odCqBpW1CtXXwXjYokymrk7fGKD3";

export const ADDRESS_HONX = "XsRbLZthfABAPAfumWNEJhPyiKDW6TvDVeAeW7oKqA2";

export const ADDRESS_INTCX = "XshPgPdXFRWB8tP1j82rebb2Q9rPgGX37RuqzohmArM";

export const ADDRESS_IBMX = "XspwhyYPdWVM8XBHZnpS9hgyag9MKjLRyE3tVfmCbSr";

export const ADDRESS_JNJX = "XsGVi5eo1Dh2zUpic4qACcjuWGjNv8GCt3dm5XcX6Dn";

export const ADDRESS_JPMX = "XsMAqkcKsUewDrzVkait4e5u4y8REgtyS7jWgCpLV2C";

export const ADDRESS_LINX = "XsSr8anD1hkvNMu8XQiVcmiaTP7XGvYu7Q58LdmtE8Z";

export const ADDRESS_MRVLX = "XsuxRGDzbLjnJ72v74b7p9VY6N66uYgTCyfwwRjVCJA";

export const ADDRESS_MAX = "XsApJFV9MAktqnAc6jqzsHVujxkGm9xcSUffaBoYLKC";

export const ADDRESS_MCDX = "XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2";

export const ADDRESS_MDTX = "XsDgw22qRLTv5Uwuzn6T63cW69exG41T6gwQhEK22u2";

export const ADDRESS_MRKX = "XsnQnU7AdbRZYe2akqqpibDdXjkieGFfSkbkjX1Sd1X";

export const ADDRESS_MSTRX = "XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ";

export const ADDRESS_QQQX = "Xs8S1uUs1zvS2p7iwtsG3b6fkhpvmwz4GYU3gWAmWHZ";

export const ADDRESS_NFLXX = "XsEH7wWfJJu2ZT3UCFeVfALnVA6CP5ur7Ee11KmzVpL";

export const ADDRESS_NVOX = "XsfAzPzYrYjd4Dpa9BU3cusBsvWfVB9gBcyGC87S57n";

export const ADDRESS_OPENX = "XsGtpmjhmC8kyjVSWL4VicGu36ceq9u55PTgF8bhGv6";

export const ADDRESS_ORCLX = "XsjFwUPiLofddX5cWFHW35GCbXcSu1BCUGfxoQAQjeL";

export const ADDRESS_PLTRX = "XsoBhf2ufR8fTyNSjqfU71DYGaE6Z3SUGAidpzriAA4";

export const ADDRESS_PEPX = "Xsv99frTRUeornyvCfvhnDesQDWuvns1M852Pez91vF";

export const ADDRESS_PFEX = "XsAtbqkAP1HJxy7hFDeq7ok6yM43DQ9mQ1Rh861X8rw";

export const ADDRESS_PMX = "Xsba6tUnSjDae2VcopDB6FGGDaxRrewFCDa5hKn5vT3";

export const ADDRESS_PGX = "XsYdjDjNUygZ7yGKfQaB6TxLh2gC6RRjzLtLAGJrhzV";

export const ADDRESS_HOODX = "XsvNBAYkrDRNhA7wPHQfX3ZUXZyZLdnCQDfHZ56bzpg";

export const ADDRESS_CRMX = "XsczbcQ3zfcgAEt9qHQES8pxKAVG5rujPSHQEXi4kaN";

export const ADDRESS_SPYX = "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W";

export const ADDRESS_STRCX = "Xs78JED6PFZxWc2wCEPspZW9kL3Se5J7L5TChKgsidH";

export const ADDRESS_TBLLX = "XsqBC5tcVQLYt8wqGCHRnAUUecbRYXoJCReD6w7QEKp";

export const ADDRESS_TMOX = "Xs8drBWy3Sd5QY3aifG9kt9KFs2K3PGZmx7jWrsrk57";

export const ADDRESS_TONXX = "XscE4GUcsYhcyZu5ATiGUMmhxYa1D5fwbpJw4K6K4dp";

export const ADDRESS_TQQQX = "XsjQP3iMAaQ3kQScQKthQpx9ALRbjKAjQtHg6TFomoc";

export const ADDRESS_UNHX = "XszvaiXGPwvk2nwb3o9C1CX4K6zH8sez11E6uyup6fe";

export const ADDRESS_VTIX = "XsssYEQjzxBCFgvYFFNuhJFBeHNdLWYeUSP8F45cDr9";

export const ADDRESS_VX = "XsqgsbXwWogGJsNcVZ3TyVouy2MbTkfCFhCGGGcQZ2p";

export const ADDRESS_WMTX = "Xs151QeqTCiuKtinzfRATnUESM2xTU6V9Wy8Vy538ci";

/** The Stable Foundation */
export const THE_STABLE_FOUNDATION_ADDRESS = "9DWkPYFKcjpGVjwCjgAnYM8T6H4hssEnW27rLDtfU8y5";

export const THE_STABLE_FOUNDATION_TREASURY_ADDRESS = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";

export const THE_STABLE_FOUNDATION_TREASURY_WALLET_FEE = "GHwjki2QkzkY9ZsDWEpvxk8EAckm8FuAtsohQYW9RFnj";

export const SPL_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export interface Metadata {
  address: string;
  name: string;
  symbol: string;
  decimal: number;
  logo_uri: string;
}

export type SolanaAsset =
  | {
      "Sol": {
        meta: Metadata;
      }
    }
  | {
      "BachToken": {
        meta: Metadata;
      }
    }
  | {
      "Jupiter": {
        meta: Metadata;
      }
    }
  /** Begin Bitcoin */
  | {
      "ZBtc": {
        meta: Metadata;
      }
    }
  | {
      "CbBtc": {
        meta: Metadata;
      }
    }
  | {
      "XBtc": {
        meta: Metadata;
      }
    }
  /**
   * End Bitcoin
   * Begin USD Stablecoins
   */
  | {
      "Usdc": {
        meta: Metadata;
      }
    }
  | {
      "Usdt": {
        meta: Metadata;
      }
    }
  | {
      "Usdg": {
        meta: Metadata;
      }
    }
  | {
      "Usds": {
        meta: Metadata;
      }
    }
  | {
      "Usd1": {
        meta: Metadata;
      }
    }
  /**
   * End USD Stablecoins
   * Begin Euro stablecoins
   */
  | {
      "Eurc": {
        meta: Metadata;
      }
    }
  /**
   * End Euro stablecoins
   * Begin xStocks Tokenized US Stocks
   */
  | {
      "MsftX": {
        meta: Metadata;
      }
    }
  | {
      "AmznX": {
        meta: Metadata;
      }
    }
  | {
      "MetaX": {
        meta: Metadata;
      }
    }
  | {
      "AaplX": {
        meta: Metadata;
      }
    }
  | {
      "GooglX": {
        meta: Metadata;
      }
    }
  | {
      "NvdaX": {
        meta: Metadata;
      }
    }
  | {
      "TslaX": {
        meta: Metadata;
      }
    }
  | {
      "AbtX": {
        meta: Metadata;
      }
    }
  | {
      "AbbvX": {
        meta: Metadata;
      }
    }
  | {
      "AcnX": {
        meta: Metadata;
      }
    }
  | {
      "AmbrX": {
        meta: Metadata;
      }
    }
  | {
      "AppX": {
        meta: Metadata;
      }
    }
  | {
      "AznX": {
        meta: Metadata;
      }
    }
  | {
      "BacX": {
        meta: Metadata;
      }
    }
  | {
      "BrkBX": {
        meta: Metadata;
      }
    }
  | {
      "AvgoX": {
        meta: Metadata;
      }
    }
  | {
      "CvxX": {
        meta: Metadata;
      }
    }
  | {
      "CrclX": {
        meta: Metadata;
      }
    }
  | {
      "CscoX": {
        meta: Metadata;
      }
    }
  | {
      "KoX": {
        meta: Metadata;
      }
    }
  | {
      "CoinX": {
        meta: Metadata;
      }
    }
  | {
      "CmcsaX": {
        meta: Metadata;
      }
    }
  | {
      "CrwdX": {
        meta: Metadata;
      }
    }
  | {
      "DhrX": {
        meta: Metadata;
      }
    }
  | {
      "DfdvX": {
        meta: Metadata;
      }
    }
  | {
      "LlyX": {
        meta: Metadata;
      }
    }
  | {
      "XomX": {
        meta: Metadata;
      }
    }
  | {
      "GmeX": {
        meta: Metadata;
      }
    }
  | {
      "GldX": {
        meta: Metadata;
      }
    }
  | {
      "GsX": {
        meta: Metadata;
      }
    }
  | {
      "HdX": {
        meta: Metadata;
      }
    }
  | {
      "HonX": {
        meta: Metadata;
      }
    }
  | {
      "IntcX": {
        meta: Metadata;
      }
    }
  | {
      "IbmX": {
        meta: Metadata;
      }
    }
  | {
      "JnjX": {
        meta: Metadata;
      }
    }
  | {
      "JpmX": {
        meta: Metadata;
      }
    }
  | {
      "LinX": {
        meta: Metadata;
      }
    }
  | {
      "MrvlX": {
        meta: Metadata;
      }
    }
  | {
      "MaX": {
        meta: Metadata;
      }
    }
  | {
      "McdX": {
        meta: Metadata;
      }
    }
  | {
      "MdtX": {
        meta: Metadata;
      }
    }
  | {
      "MrkX": {
        meta: Metadata;
      }
    }
  | {
      "MstrX": {
        meta: Metadata;
      }
    }
  | {
      "QqqX": {
        meta: Metadata;
      }
    }
  | {
      "NflxX": {
        meta: Metadata;
      }
    }
  | {
      "NvoX": {
        meta: Metadata;
      }
    }
  | {
      "OpenX": {
        meta: Metadata;
      }
    }
  | {
      "OrclX": {
        meta: Metadata;
      }
    }
  | {
      "PltrX": {
        meta: Metadata;
      }
    }
  | {
      "PepX": {
        meta: Metadata;
      }
    }
  | {
      "PfeX": {
        meta: Metadata;
      }
    }
  | {
      "PmX": {
        meta: Metadata;
      }
    }
  | {
      "PgX": {
        meta: Metadata;
      }
    }
  | {
      "HoodX": {
        meta: Metadata;
      }
    }
  | {
      "CrmX": {
        meta: Metadata;
      }
    }
  | {
      "SpyX": {
        meta: Metadata;
      }
    }
  | {
      "StrcX": {
        meta: Metadata;
      }
    }
  | {
      "TbllX": {
        meta: Metadata;
      }
    }
  | {
      "TmoX": {
        meta: Metadata;
      }
    }
  | {
      "TonxX": {
        meta: Metadata;
      }
    }
  | {
      "TqqqX": {
        meta: Metadata;
      }
    }
  | {
      "UnhX": {
        meta: Metadata;
      }
    }
  | {
      "VtiX": {
        meta: Metadata;
      }
    }
  | {
      "VX": {
        meta: Metadata;
      }
    }
  | {
      "WmtX": {
        meta: Metadata;
      }
    }
  /** End xStocks Tokenized US Stocks */
  | {
      "BachToken0": {
        meta: Metadata;
      }
    }
  | {
      "BachToken1": {
        meta: Metadata;
      }
    };

export interface BalanceV1 {
  meta: Metadata;
  /**
   * Balance in its smallest nomimal. For example, a 0.01 SOL balance will return 10000000,
   * 0.010000000 * 1_000_000_000.
   */
  balance: number;
  /** Balance in its easy-to-read form. For example, a 0.01 SOL. */
  ui_amount: number;
}

export type Environment =
  | "Local" | "Devnet" | "Testnet" | "Mainnet";
