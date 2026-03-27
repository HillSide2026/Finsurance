import crypto from "node:crypto";

export type StripeWebhookEvent = {
  id: string;
  type: string;
  livemode: boolean;
  api_version: string | null;
  account?: string | null;
  data: {
    object: Record<string, unknown> & {
      id?: string;
    };
  };
};

export class StripeWebhookVerificationError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "StripeWebhookVerificationError";
    this.code = code;
  }
}

function timingSafeHexMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function parseStripeSignatureHeader(signatureHeader: string): {
  timestamp: number;
  signatures: string[];
} {
  const pairs = signatureHeader
    .split(",")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  const timestampValue = pairs.find((segment) => segment.startsWith("t="))?.slice(2) ?? "";
  const signatures = pairs
    .filter((segment) => segment.startsWith("v1="))
    .map((segment) => segment.slice(3))
    .filter((signature) => signature.length > 0);

  const timestamp = Number.parseInt(timestampValue, 10);
  if (!Number.isFinite(timestamp) || signatures.length === 0) {
    throw new StripeWebhookVerificationError(
      "Stripe signature header is malformed.",
      "invalid_signature_header",
    );
  }

  return { timestamp, signatures };
}

function normalizePayload(payload: string | Buffer): string {
  return typeof payload === "string" ? payload : payload.toString("utf8");
}

export function verifyStripeWebhookEvent(
  payload: string | Buffer,
  signatureHeader: string | undefined,
  endpointSecret: string | undefined,
  options: {
    toleranceSeconds?: number;
    nowMs?: number;
  } = {},
): StripeWebhookEvent {
  if (typeof signatureHeader !== "string" || signatureHeader.trim().length === 0) {
    throw new StripeWebhookVerificationError(
      "Stripe-Signature header is required.",
      "missing_signature",
    );
  }

  if (typeof endpointSecret !== "string" || endpointSecret.trim().length === 0) {
    throw new StripeWebhookVerificationError(
      "Stripe webhook secret is not configured.",
      "missing_secret",
    );
  }

  const toleranceSeconds = options.toleranceSeconds ?? 300;
  const nowMs = options.nowMs ?? Date.now();
  const normalizedPayload = normalizePayload(payload);
  const { timestamp, signatures } = parseStripeSignatureHeader(signatureHeader);
  const signedPayload = `${timestamp}.${normalizedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", endpointSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const signatureMatched = signatures.some((signature) =>
    timingSafeHexMatch(signature, expectedSignature),
  );
  if (!signatureMatched) {
    throw new StripeWebhookVerificationError(
      "Stripe webhook signature verification failed.",
      "invalid_signature",
    );
  }

  const ageSeconds = Math.abs(Math.floor(nowMs / 1000) - timestamp);
  if (ageSeconds > toleranceSeconds) {
    throw new StripeWebhookVerificationError(
      "Stripe webhook timestamp is outside the allowed tolerance.",
      "stale_signature",
    );
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(normalizedPayload);
  } catch {
    throw new StripeWebhookVerificationError("Webhook payload is not valid JSON.", "invalid_json");
  }

  const event = parsedPayload as Partial<StripeWebhookEvent>;
  if (
    typeof event.id !== "string" ||
    typeof event.type !== "string" ||
    !event.data ||
    typeof event.data !== "object" ||
    !("object" in event.data)
  ) {
    throw new StripeWebhookVerificationError(
      "Webhook payload is missing required Stripe event fields.",
      "invalid_event",
    );
  }

  return {
    id: event.id,
    type: event.type,
    livemode: event.livemode === true,
    api_version: typeof event.api_version === "string" ? event.api_version : null,
    account: typeof event.account === "string" ? event.account : null,
    data: {
      object:
        typeof event.data.object === "object" && event.data.object !== null
          ? (event.data.object as Record<string, unknown>)
          : {},
    },
  };
}
