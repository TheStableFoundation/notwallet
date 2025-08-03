/* This file is generated and managed by tsync */

export const STRIPE_PUBLISHABLE_KEY = "your_stripe_publishable_key";

/**
 * Generate:
 * tsync -i src-tauri/src/ -o lib/crate/generated.ts
 */
export const STORE = ".notwallet.dat";

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

export interface SolanaWallet {
  /**
   * The unique identifier for the wallet, typically a UUID.
   * This ID is used to reference the wallet in various operations.
   */
  id: string;
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

export interface OnboardingCreateWallet {
  seed: string;
  keypair: SolanaWallet;
}
