import assert from "node:assert/strict";
import test from "node:test";
import {
  createStripeCheckoutSession,
  retrieveStripeCheckoutSession,
  resolveStripeBillingConfig,
  summarizeStripeCheckoutSession,
} from "./billing";

test("resolveStripeBillingConfig normalizes base URLs and required Stripe env", () => {
  assert.deepEqual(
    resolveStripeBillingConfig(
      {
        STRIPE_SECRET_KEY: " sk_test_123 ",
        STRIPE_PRICE_ID: " price_123 ",
        APP_BASE_URL: "https://fintechlawyer.ca/",
      },
      "http://127.0.0.1:5000",
    ),
    {
      secretKey: "sk_test_123",
      priceId: "price_123",
      baseUrl: "https://fintechlawyer.ca",
    },
  );

  assert.deepEqual(
    resolveStripeBillingConfig(
      {
        STRIPE_SECRET_KEY: "sk_test_123",
        STRIPE_PRICE_ID: "price_123",
      },
      "http://127.0.0.1:5000/",
    ),
    {
      secretKey: "sk_test_123",
      priceId: "price_123",
      baseUrl: "http://127.0.0.1:5000",
    },
  );
});

test("summarizeStripeCheckoutSession extracts customer and payment status details", () => {
  const summary = summarizeStripeCheckoutSession({
    id: "cs_test_123",
    url: "https://checkout.stripe.com/c/pay/cs_test_123",
    mode: "subscription",
    status: "complete",
    payment_status: "paid",
    amount_total: 4900,
    currency: "cad",
    livemode: false,
    client_reference_id: "team:team_123:user:user_456",
    customer_details: {
      email: "billing@example.com",
    },
    metadata: {
      source_path: "/finsure",
      team_id: "team_123",
    },
  });

  assert.equal(summary.id, "cs_test_123");
  assert.equal(summary.mode, "subscription");
  assert.equal(summary.status, "complete");
  assert.equal(summary.paymentStatus, "paid");
  assert.equal(summary.customerEmail, "billing@example.com");
  assert.equal(summary.currency, "CAD");
  assert.equal(summary.metadata.source_path, "/finsure");
});

test("createStripeCheckoutSession chooses subscription mode for recurring prices", async () => {
  const requests: Array<{
    url: string;
    method: string;
    body: string;
  }> = [];

  const fakeFetch: typeof fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    const method = init?.method ?? "GET";
    const body =
      typeof init?.body === "string"
        ? init.body
        : init?.body instanceof URLSearchParams
          ? init.body.toString()
          : "";

    requests.push({
      url,
      method,
      body,
    });

    if (url.endsWith("/v1/prices/price_recurring")) {
      return new Response(
        JSON.stringify({
          id: "price_recurring",
          type: "recurring",
          recurring: {
            interval: "month",
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        id: "cs_test_created",
        url: "https://checkout.stripe.com/c/pay/cs_test_created",
        mode: "subscription",
        status: "open",
        payment_status: "unpaid",
        livemode: false,
        customer_email: "owner@example.com",
        client_reference_id: "team:team_123:user:user_456",
        amount_total: 4900,
        currency: "cad",
        metadata: {
          source_path: "/finsure",
        },
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  };

  const session = await createStripeCheckoutSession(
    {
      fallbackBaseUrl: "http://127.0.0.1:5000",
      customerEmail: "owner@example.com",
      clientReferenceId: "team:team_123:user:user_456",
      metadata: {
        source_path: "/finsure",
        team_id: "team_123",
      },
    },
    {
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_PRICE_ID: "price_recurring",
    },
    fakeFetch,
  );

  assert.equal(requests.length, 2);
  assert.equal(requests[0]?.url, "https://api.stripe.com/v1/prices/price_recurring");
  assert.equal(requests[1]?.url, "https://api.stripe.com/v1/checkout/sessions");

  const body = new URLSearchParams(requests[1]?.body ?? "");
  assert.equal(body.get("mode"), "subscription");
  assert.equal(body.get("line_items[0][price]"), "price_recurring");
  assert.equal(body.get("customer_email"), "owner@example.com");
  assert.equal(body.get("client_reference_id"), "team:team_123:user:user_456");
  assert.equal(body.get("metadata[source_path]"), "/finsure");
  assert.equal(
    body.get("success_url"),
    "http://127.0.0.1:5000/billing/success?session_id={CHECKOUT_SESSION_ID}",
  );
  assert.equal(body.get("cancel_url"), "http://127.0.0.1:5000/finsure#pricing");
  assert.equal(session.id, "cs_test_created");
  assert.equal(session.mode, "subscription");
});

test("retrieveStripeCheckoutSession normalizes a confirmed Stripe session", async () => {
  const fakeFetch: typeof fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;

    assert.equal(
      url,
      "https://api.stripe.com/v1/checkout/sessions/cs_test_confirmed",
    );
    assert.equal(init?.method, "GET");

    return new Response(
      JSON.stringify({
        id: "cs_test_confirmed",
        url: "https://checkout.stripe.com/c/pay/cs_test_confirmed",
        mode: "payment",
        status: "complete",
        payment_status: "paid",
        livemode: false,
        customer_email: "billing.owner@example.com",
        client_reference_id: "team:team_123:user:user_456",
        amount_total: 4900,
        currency: "cad",
        metadata: {
          source_path: "/finsure",
          team_id: "team_123",
          user_id: "user_456",
        },
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  };

  const session = await retrieveStripeCheckoutSession(
    "cs_test_confirmed",
    {
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_PRICE_ID: "price_123",
    },
    fakeFetch,
  );

  assert.equal(session.id, "cs_test_confirmed");
  assert.equal(session.status, "complete");
  assert.equal(session.paymentStatus, "paid");
  assert.equal(session.customerEmail, "billing.owner@example.com");
  assert.equal(session.currency, "CAD");
  assert.equal(session.metadata.source_path, "/finsure");
  assert.equal(session.metadata.team_id, "team_123");
  assert.equal(session.metadata.user_id, "user_456");
});
