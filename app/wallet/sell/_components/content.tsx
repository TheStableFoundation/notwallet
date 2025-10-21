"use client";

import { ONRAMPER_KEY } from "@app/lib/crate/generated";
import { debug } from "@tauri-apps/plugin-log";
import { generateSignature } from "@app/lib/helper";
import { ONRAMPER_SIGNER_KEY } from "@app/lib/crate/generated";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Content() {
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");
  const [iframeSrc, setIframeSrc] = useState<string>("");

  useEffect(() => {
    const buildIframeSrc = async () => {
      const onramperParams: Record<string, string> = {
        apiKey: ONRAMPER_KEY,
        redirectAtCheckout: "true",
        sell_onlyCryptoNetworks: "solana",
        mode: "sell",
        hideTopBar: "true",
        themeName: "light",
        containerColor: "f5f6fa",
        primaryColor: "9932cc",
        secondaryColor: "ad5ad7",
        cardColor: "f6f7f9",
        primaryTextColor: "222222",
        secondaryTextColor: "6b6f80",
        primaryBtnTextColor: "ffffff",
        borderRadius: "0.5",
        wgBorderRadius: "0.82",
      };

      // Add wallets parameter if address is provided
      if (address) {
        onramperParams.wallets = `solana:${address}`;
      }

      const url = new URLSearchParams(onramperParams);

      // Create signature content - must include wallets parameter for signing
      const signContent = address ? `wallets=SOL:${address}` : "";

      // Only add signature if we have content to sign (i.e., when address is provided)
      if (signContent) {
        try {
          const signature = await generateSignature(
            ONRAMPER_SIGNER_KEY,
            signContent,
          );
          url.append("signature", signature);
          debug(`Generated signature: ${signature}`);
        } catch (error) {
          debug(`Error generating signature: ${error}`);
          // Continue without signature if generation fails
        }
      }

      const src = `https://buy.onramper.com?${url.toString()}`;

      debug(`iframeSrc: ${src}`);
      debug(`signContent: ${signContent}`);

      setIframeSrc(src);
    };

    buildIframeSrc();
  }, [address]);

  if (!iframeSrc) {
    return (
      <div
        style={{
          height: "630px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#6b6f80",
        }}
      >
        Loading Onramper...
      </div>
    );
  }

  return (
    <iframe
      src={iframeSrc}
      height="630px"
      width="100%"
      allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
      style={{
        border: "none",
        borderRadius: "8px",
      }}
      onLoad={() => debug("Onramper iframe loaded successfully")}
      onError={() => debug("Error loading Onramper iframe")}
    />
  );
}
