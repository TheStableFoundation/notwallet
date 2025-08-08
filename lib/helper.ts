import { openUrl } from "@tauri-apps/plugin-opener";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import crypto from "crypto";

export const openExplorer = async (address: string) => {
  await selectionFeedback();
  const url = `https://explorer.solana.com/address/${address}`;
  openUrl(url);
};

export const generateSignature = (secretKey: string, content: string) => {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(content);
  return hmac.digest("hex");
};
