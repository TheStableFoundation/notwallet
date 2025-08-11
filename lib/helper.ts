import { openUrl } from "@tauri-apps/plugin-opener";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

export const openExplorer = async (address: string) => {
  await selectionFeedback();
  const url = `https://explorer.solana.com/address/${address}`;
  openUrl(url);
};

export const generateSignature = async (
  secretKey: string,
  data: string,
): Promise<string> => {
  const sortedData = arrangeStringAlphabetically(data);
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(sortedData);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

function arrangeStringAlphabetically(inputString: string): string {
  // For simple wallet parameter format like "wallets=solana:address"
  // we just need to sort the top-level parameters alphabetically
  const params = new URLSearchParams(inputString);
  const sortedParams = new URLSearchParams();

  // Sort keys alphabetically and rebuild
  Array.from(params.keys())
    .sort()
    .forEach((key) => {
      const value = params.get(key);
      if (value) {
        // For wallet parameters with colon-separated values, sort them too
        if (value.includes(":")) {
          const parts = value.split(",").sort();
          sortedParams.append(key, parts.join(","));
        } else {
          sortedParams.append(key, value);
        }
      }
    });

  return sortedParams.toString();
}
