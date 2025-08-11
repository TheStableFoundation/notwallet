import * as React from "react";
import LoadingCard from "@/lib/components/loading-card";
import ErrorCard from "@/lib/components/error-card";
import { OnrampSession } from "@/lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";
import OnrampView from "./onramp-view";
import { ONRAMP_SESSION } from "@/lib/commands";
import Confetti from "react-confetti";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { error as logError, debug } from "@tauri-apps/plugin-log";

enum State {
  Loading,
  Loaded,
  Error,
  PurchaseComplete,
}

export default function Content() {
  const [state, setState] = React.useState(State.Loading);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const router = useRouter();

  const onPurchaseComplete = () => {
    setState(State.PurchaseComplete);
    setTimeout(() => {
      router.push("/wallet");
    }, 5000);
  };

  const init = async () => {
    try {
      const result = await invoke<OnrampSession>(ONRAMP_SESSION, {
        solanaAddress: address,
      });
      debug(`result: ${JSON.stringify(result)}`);
      setClientSecret(result.client_secret);
      setState(State.Loaded);
    } catch (error) {
      logError(`error: ${JSON.stringify(error)}`);
      setState(State.Error);
    }
  };

  React.useEffect(() => {
    // Add any side effects here
    init();
  }, []);

  React.useEffect(() => {
    function update() {
      setDimensions({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "unset",
      }}
    >
      {state === State.Loading && <LoadingCard />}
      {state === State.Error && <ErrorCard />}
      {state === State.Loaded && clientSecret && (
        <OnrampView
          clientSecret={clientSecret}
          onPurchaseComplete={onPurchaseComplete}
        />
      )}
      {state === State.PurchaseComplete && (
        <>
          <Confetti width={dimensions.width} height={dimensions.height} />
          <Typography variant="h4" color="primary">
            Thank you for your purchase!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your purchase has been successfully completed. You will be
            redirected to your wallet shortly.
          </Typography>
        </>
      )}
    </Box>
  );
}
