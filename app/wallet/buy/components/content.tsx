import * as React from "react";
import LoadingCard from "@/lib/components/loading-card";
import ErrorCard from "@/lib/components/error-card";
import { OnrampSession } from "@/lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";
import OnrampView from "./onramp-view";
import { ONRAMP_SESSION } from "@/lib/commands";
import Confetti from "react-confetti";
import { useSearchParams } from "next/navigation";

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

  const init = async () => {
    try {
      const result = await invoke<OnrampSession>(ONRAMP_SESSION, {
        solanaAddress: address,
      });
      console.log(result);
      setClientSecret(result.client_secret);
      setState(State.Loaded);
    } catch (error) {
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
    <>
      {state === State.Loading && <LoadingCard />}
      {state === State.Error && <ErrorCard />}
      {state === State.Loaded && clientSecret && (
        <OnrampView
          clientSecret={clientSecret}
          onPurchaseComplete={() => setState(State.PurchaseComplete)}
        />
      )}
      {state === State.PurchaseComplete && (
        <Confetti width={dimensions.width} height={dimensions.height} />
      )}
    </>
  );
}
