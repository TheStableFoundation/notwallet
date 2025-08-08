import { openUrl } from "@tauri-apps/plugin-opener";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import crypto from "crypto";

export const openExplorer = async (address: string) => {
  await selectionFeedback();
  const url = `https://explorer.solana.com/address/${address}`;
  openUrl(url);
};

export const generateSignature = (secretKey: string, data: string): string => {
  const hmac = crypto.createHmac("sha256", secretKey);
  const sortedData = arrangeStringAlphabetically(data);
  hmac.update(sortedData);
  return hmac.digest("hex");
};

function arrangeStringAlphabetically(inputString: string): string {
  // Parse the input string into an object
  const inputObject: { [key: string]: { [key: string]: string } } = {};
  inputString.split("&").forEach((pair) => {
    // Split each pair into key and value
    const [key, value] = pair.split("=");
    // Split the value into nested key-value pairs
    const nestedPairs = value.split(",");
    inputObject[key] = {}; // Initialize the nested object for the key
    nestedPairs.forEach((nestedPair) => {
      // Split each nested pair into nested key and value
      const [nestedKey, nestedValue] = nestedPair.split(":");
      // Assign the nested key-value pair to the nested object
      inputObject[key][nestedKey] = nestedValue;
    });
  });

  // Sort the keys of each nested object alphabetically
  for (const key in inputObject) {
    inputObject[key] = Object.fromEntries(
      Object.entries(inputObject[key]).sort(),
    );
  }

  // Sort the keys of the top-level object alphabetically
  const sortedKeys = Object.keys(inputObject).sort();
  const sortedObject: { [key: string]: { [key: string]: string } } = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = inputObject[key];
  });

  // Reconstruct the string from the sorted object
  let resultString = "";
  for (const key in sortedObject) {
    resultString += key + "="; // Append the key
    // Append nested key-value pairs, sorted alphabetically
    resultString += Object.entries(sortedObject[key])
      .map(([nestedKey, nestedValue]) => `${nestedKey}:${nestedValue}`)
      .join(",");
    resultString += "&"; // Separate key-value pairs with '&'
  }
  resultString = resultString.slice(0, -1); // Remove the trailing '&'

  return resultString;
}
