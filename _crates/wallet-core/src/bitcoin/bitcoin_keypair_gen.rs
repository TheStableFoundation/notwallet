use bip39::{Language, Mnemonic};
use bitcoin::bip32::{ChildNumber, DerivationPath, ExtendedPrivKey, ExtendedPubKey};
use bitcoin::script::PushBytesBuf;
use bitcoin::secp256k1::{Message, Secp256k1, SecretKey};
use bitcoin::sighash::{EcdsaSighashType, Prevouts, SighashCache};
use bitcoin::ScriptBuf;
use bitcoin::{Address, Network, OutPoint, PublicKey, Transaction, TxIn, TxOut, Txid};
use std::str::FromStr;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Bitcoin Wallet Demo ===\n");

    // Generate or restore mnemonic
    let mnemonic = Mnemonic::generate_in(Language::English, 12)?;
    println!("Mnemonic: {}\n", mnemonic);

    // Derive multiple addresses
    derive_multiple_addresses(&mnemonic)?;

    // Sign transaction example
    sign_transaction_example(&mnemonic)?;

    Ok(())
}

/// Derive multiple addresses from a single mnemonic (HD wallet)
fn derive_multiple_addresses(mnemonic: &Mnemonic) -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Deriving Multiple Addresses ===\n");

    let passphrase = ""; // Optional BIP39 passphrase
    let seed = mnemonic.to_seed(passphrase);
    let secp = Secp256k1::new();
    let network = Network::Bitcoin;

    let master_xpriv = ExtendedPrivKey::new_master(network, &seed)?;

    // BIP84 path for native segwit: m/84'/0'/0'
    let account_path = DerivationPath::from_str("m/84'/0'/0'")?;
    let account_xpriv = master_xpriv.derive_priv(&secp, &account_path)?;

    // Derive first 5 receiving addresses (m/84'/0'/0'/0/0 to m/84'/0'/0'/0/4)
    println!("Receiving Addresses:");
    for i in 0..5 {
        let address_info = derive_address(&secp, &account_xpriv, network, 0, i)?;
        println!("  [{}] Address: {}", i, address_info.address);
        println!("      Private Key: {:?}", address_info.private_key);
        println!("      Path: m/84'/0'/0'/0/{}\n", i);
    }

    // Derive first 3 change addresses (m/84'/0'/0'/1/0 to m/84'/0'/0'/1/2)
    println!("Change Addresses:");
    for i in 0..3 {
        let address_info = derive_address(&secp, &account_xpriv, network, 1, i)?;
        println!("  [{}] Address: {}", i, address_info.address);
        println!("      Path: m/84'/0'/0'/1/{}\n", i);
    }

    Ok(())
}

struct AddressInfo {
    address: Address,
    private_key: SecretKey,
    public_key: PublicKey,
}

/// Derive a specific address given account xpriv, change/receive index, and address index
fn derive_address(
    secp: &Secp256k1<bitcoin::secp256k1::All>,
    account_xpriv: &ExtendedPrivKey,
    network: Network,
    change: u32, // 0 for receiving, 1 for change
    index: u32,  // address index
) -> Result<AddressInfo, Box<dyn std::error::Error>> {
    // Derive: account/change/index
    let path = vec![
        ChildNumber::from_normal_idx(change)?,
        ChildNumber::from_normal_idx(index)?,
    ];

    let derived_xpriv = account_xpriv.derive_priv(secp, &path)?;
    let private_key = derived_xpriv.private_key;

    let derived_xpub = ExtendedPubKey::from_priv(secp, &derived_xpriv);

    // Convert secp256k1::PublicKey to bitcoin::PublicKey
    let public_key = bitcoin::PublicKey::new(derived_xpub.public_key);

    // Address creation now returns Result in newer versions
    let address = Address::p2wpkh(&public_key, network)?;

    Ok(AddressInfo {
        address,
        private_key,
        public_key,
    })
}

/// Example of signing a Bitcoin transaction
fn sign_transaction_example(mnemonic: &Mnemonic) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n=== Transaction Signing Example ===\n");

    let seed = mnemonic.to_seed("");
    let secp = Secp256k1::new();
    let network = Network::Bitcoin;

    let master_xpriv = ExtendedPrivKey::new_master(network, &seed)?;
    let account_path = DerivationPath::from_str("m/84'/0'/0'")?;
    let account_xpriv = master_xpriv.derive_priv(&secp, &account_path)?;

    // Get address at m/84'/0'/0'/0/0
    let sender_info = derive_address(&secp, &account_xpriv, network, 0, 0)?;
    println!("Sender Address: {}", sender_info.address);

    // Create a dummy transaction (in real scenario, you'd get UTXO details from blockchain)
    let prev_txid =
        Txid::from_str("0000000000000000000000000000000000000000000000000000000000000001")?;
    let prev_vout = 0;
    let amount_satoshis = 100_000; // 0.001 BTC

    // Recipient address (example)
    let recipient_addr = Address::from_str("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq")?;

    // Build transaction
    let mut tx = Transaction {
        version: 2,
        lock_time: bitcoin::absolute::LockTime::ZERO,
        input: vec![TxIn {
            previous_output: OutPoint {
                txid: prev_txid,
                vout: prev_vout,
            },
            script_sig: ScriptBuf::new(),
            sequence: bitcoin::Sequence::MAX,
            witness: bitcoin::Witness::new(),
        }],
        output: vec![
            // Output to recipient
            TxOut {
                value: 50_000, // 0.0005 BTC
                script_pubkey: recipient_addr.script_pubkey(),
            },
            // Change output back to sender
            TxOut {
                value: 49_000, // 0.00049 BTC (1000 sats fee)
                script_pubkey: sender_info.address.script_pubkey(),
            },
        ],
    };

    println!("\nUnsigned Transaction:");
    println!("{:#?}", tx);

    // Sign the transaction
    let prevouts = vec![TxOut {
        value: amount_satoshis,
        script_pubkey: sender_info.address.script_pubkey(),
    }];
    let prevouts = Prevouts::All(&prevouts);

    let mut sighash_cache = SighashCache::new(&tx);

    let sighash = sighash_cache.segwit_signature_hash(
        0, // input index
        &sender_info.address.script_pubkey(),
        amount_satoshis,
        EcdsaSighashType::All,
    )?;

    // Sign the sighash
    let message = Message::from_slice(sighash.as_ref())?;
    let signature = secp.sign_ecdsa(&message, &sender_info.private_key);

    // Create witness (signature + public key)
    let mut sig_with_hashtype = signature.serialize_der().to_vec();
    sig_with_hashtype.push(EcdsaSighashType::All.to_u32() as u8);

    let mut witness = bitcoin::Witness::new();
    witness.push(sig_with_hashtype);
    witness.push(sender_info.public_key.to_bytes());
    tx.input[0].witness = witness;

    println!("\n✓ Transaction signed successfully!");
    println!("\nSigned Transaction (hex):");
    let tx_hex = bitcoin::consensus::encode::serialize_hex(&tx);
    println!("{}", tx_hex);

    println!("\nTransaction ID: {}", tx.txid());

    Ok(())
}

/// Restore wallet from mnemonic phrase
fn restore_wallet(mnemonic_phrase: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("=== Restoring Wallet ===\n");

    let mnemonic = Mnemonic::parse_in(Language::English, mnemonic_phrase)?;
    println!("✓ Mnemonic validated successfully");

    derive_multiple_addresses(&mnemonic)?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use zerocopy::IntoBytes;

    #[test]
    fn test_address_derivation() {
        let mnemonic = Mnemonic::generate_in(Language::English, 12).unwrap();
        let seed = mnemonic.to_seed("");
        let secp = Secp256k1::new();
        let network = Network::Bitcoin;

        let master_xpriv = ExtendedPrivKey::new_master(network, seed.as_bytes()).unwrap();
        let account_path = DerivationPath::from_str("m/84'/0'/0'").unwrap();
        let account_xpriv = master_xpriv.derive_priv(&secp, &account_path).unwrap();

        // Derive same address twice - should be identical
        let addr1 = derive_address(&secp, &account_xpriv, network, 0, 0).unwrap();
        let addr2 = derive_address(&secp, &account_xpriv, network, 0, 0).unwrap();

        assert_eq!(addr1.address, addr2.address);
    }
}
