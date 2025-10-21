import React, { ReactNode } from "react";
import { StripeOnramp, OnrampSessionOptions } from "@stripe/crypto";

// ReactContext to simplify access of StripeOnramp object
const CryptoElementsContext = React.createContext<StripeOnramp | null>(null);

export const CryptoElements = ({
  stripeOnramp,
  children,
}: {
  stripeOnramp: Promise<StripeOnramp | null>;
  children: ReactNode;
}) => {
  const [ctx, setContext] = React.useState<StripeOnramp | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    Promise.resolve(stripeOnramp).then((onramp) => {
      if (onramp && isMounted) {
        setContext(onramp);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [stripeOnramp]);

  return (
    <CryptoElementsContext.Provider value={ctx}>
      {children}
    </CryptoElementsContext.Provider>
  );
};

// React hook to get StripeOnramp from context
export const useStripeOnramp = () => {
  const context = React.useContext(CryptoElementsContext);
  return context;
};

interface OnrampProps extends OnrampSessionOptions {
  onFulfillmentComplete: () => void;
}

// React element to render Onramp UI
export const OnrampElement = ({
  clientSecret,
  appearance,
  onFulfillmentComplete,
  ...props
}: OnrampProps) => {
  const stripeOnramp = useStripeOnramp();
  const onrampElementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const containerRef = onrampElementRef.current;
    if (containerRef) {
      containerRef.innerHTML = "";

      if (clientSecret && stripeOnramp) {
        stripeOnramp
          .createSession({
            clientSecret,
            appearance,
          })
          .mount(containerRef)
          .addEventListener("onramp_session_updated", (p) => {
            console.log("onramp_session_updated", p);
            if (p.payload.session.status === "fulfillment_complete") {
              onFulfillmentComplete();
            }
          });
      }
    }
  }, [clientSecret, stripeOnramp]);

  return <div {...props} ref={onrampElementRef}></div>;
};
