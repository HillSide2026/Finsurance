import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import {
  StripeWebhookVerificationError,
  verifyStripeWebhookEvent,
} from "./stripe";

function buildSignatureHeader(secret: string, payload: string, timestamp: number): string {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");

  return `t=${timestamp},v1=${signature}`;
}

test("verifyStripeWebhookEvent accepts a valid signed event payload", () => {
  const secret = "whsec_test_secret";
  const timestamp = 1_711_111_111;
  const payload = JSON.stringify({
    id: "evt_123",
    type: "checkout.session.completed",
    livemode: false,
    api_version: "2025-03-31.basil",
    data: {
      object: {
        id: "cs_test_123",
      },
    },
  });

  const event = verifyStripeWebhookEvent(
    payload,
    buildSignatureHeader(secret, payload, timestamp),
    secret,
    {
      nowMs: timestamp * 1000,
    },
  );

  assert.equal(event.id, "evt_123");
  assert.equal(event.type, "checkout.session.completed");
  assert.equal(event.data.object.id, "cs_test_123");
});

test("verifyStripeWebhookEvent rejects invalid signatures", () => {
  const payload = JSON.stringify({
    id: "evt_bad",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_bad",
      },
    },
  });

  assert.throws(
    () =>
      verifyStripeWebhookEvent(payload, "t=1711111111,v1=deadbeef", "whsec_test_secret", {
        nowMs: 1_711_111_111_000,
      }),
    (error: unknown) =>
      error instanceof StripeWebhookVerificationError && error.code === "invalid_signature",
  );
});

test("verifyStripeWebhookEvent rejects stale timestamps", () => {
  const secret = "whsec_test_secret";
  const timestamp = 1_711_111_111;
  const payload = JSON.stringify({
    id: "evt_old",
    type: "invoice.paid",
    data: {
      object: {
        id: "in_123",
      },
    },
  });

  assert.throws(
    () =>
      verifyStripeWebhookEvent(
        payload,
        buildSignatureHeader(secret, payload, timestamp),
        secret,
        {
          nowMs: (timestamp + 601) * 1000,
        },
      ),
    (error: unknown) =>
      error instanceof StripeWebhookVerificationError && error.code === "stale_signature",
  );
});
