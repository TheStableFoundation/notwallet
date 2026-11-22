import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await request.json();
    const { wallet_address, destination_currency } = body;

    // Validate required parameters
    if (!wallet_address) {
      return new Response(
        JSON.stringify({ error: "wallet_address is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create Crypto Onramp Session
    const response = await fetch(
      "https://api.stripe.com/v1/crypto/onramp_sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "wallet_addresses[solana]": wallet_address,
          ...(destination_currency && {
            destination_currency: destination_currency,
          }),
          destination_network: "solana",
        }).toString(),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Stripe API error:", errorData);
      return new Response(
        JSON.stringify({
          error: "Failed to create onramp session",
          details: errorData,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({ client_secret: session.client_secret }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error creating onramp session:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
