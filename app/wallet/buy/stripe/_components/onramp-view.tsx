import { loadStripeOnramp } from "@stripe/crypto";
import {
  CryptoElements,
  OnrampElement,
} from "@app/lib/components/stripe-crypto-elements";

export default function OnrampView({
  clientSecret,
  onPurchaseComplete,
  publishableKey,
}: {
  clientSecret: string;
  publishableKey: string;
  onPurchaseComplete: () => void;
}) {
  const onFulfillmentComplete = () => {
    console.log("Fulfillment complete");
    onPurchaseComplete();
  };

  return (
    <CryptoElements stripeOnramp={loadStripeOnramp(publishableKey)}>
      <OnrampElement
        clientSecret={clientSecret}
        onFulfillmentComplete={onFulfillmentComplete}
      />
    </CryptoElements>
  );
}
