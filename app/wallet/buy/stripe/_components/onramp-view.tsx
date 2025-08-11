import { loadStripeOnramp } from "@stripe/crypto";
import {
  CryptoElements,
  OnrampElement,
} from "@/lib/components/stripe-crypto-elements";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/crate/generated";

export default function OnrampView({
  clientSecret,
  onPurchaseComplete,
}: {
  clientSecret: string;
  onPurchaseComplete: () => void;
}) {
  const onFulfillmentComplete = () => {
    console.log("Fulfillment complete");
    onPurchaseComplete();
  };

  return (
    <CryptoElements stripeOnramp={loadStripeOnramp(STRIPE_PUBLISHABLE_KEY)}>
      <OnrampElement
        clientSecret={clientSecret}
        onFulfillmentComplete={onFulfillmentComplete}
      />
    </CryptoElements>
  );
}
