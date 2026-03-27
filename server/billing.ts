import { siteConfig } from "@shared/site";
import type {
  BillingCheckoutMode,
  BillingCheckoutSessionSummary,
  BillingCheckoutStatus,
  BillingPaymentStatus,
} from "@shared/billing";

type EnvironmentMap = Record<string, string | undefined>;

type StripePrice = {
  id?: string;
  type?: string;
  recurring?: Record<string, unknown> | null;
};

type StripeApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
};

type StripeCheckoutSessionObject = Record<string, unknown> & {
  id?: string;
  url?: string | null;
  mode?: string | null;
  status?: string | null;
  payment_status?: string | null;
  customer_email?: string | null;
  client_reference_id?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  livemode?: boolean;
  customer_details?: {
    email?: string | null;
  } | null;
  metadata?: Record<string, unknown> | null;
};

type CreateStripeCheckoutSessionInput = {
  fallbackBaseUrl?: string;
  customerEmail?: string | null;
  clientReferenceId?: string | null;
  metadata?: Record<string, string>;
};

type FetchLike = typeof fetch;

type ResolvedStripeBillingConfig = {
  secretKey: string;
  priceId: string;
  baseUrl: string;
};

export class StripeBillingError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "StripeBillingError";
    this.code = code;
    this.status = status;
  }
}

function normalizeText(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveBaseUrl(baseUrl: string): string {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new StripeBillingError(
      "APP_BASE_URL must be a valid absolute URL.",
      "invalid_app_base_url",
      503,
    );
  }

  const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "");
  return `${parsedUrl.origin}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function resolveStripeBillingConfig(
  env: EnvironmentMap = process.env,
  fallbackBaseUrl?: string,
): ResolvedStripeBillingConfig {
  const secretKey = normalizeText(env.STRIPE_SECRET_KEY);
  if (secretKey.length === 0) {
    throw new StripeBillingError(
      "Stripe secret key is not configured.",
      "missing_stripe_secret_key",
      503,
    );
  }

  const priceId = normalizeText(env.STRIPE_PRICE_ID);
  if (priceId.length === 0) {
    throw new StripeBillingError(
      "Stripe price ID is not configured.",
      "missing_stripe_price_id",
      503,
    );
  }

  const configuredBaseUrl = normalizeText(env.APP_BASE_URL);
  const baseUrl = configuredBaseUrl || normalizeText(fallbackBaseUrl) || siteConfig.canonicalOrigin;

  return {
    secretKey,
    priceId,
    baseUrl: resolveBaseUrl(baseUrl),
  };
}

function normalizeCheckoutMode(value: unknown): BillingCheckoutMode {
  switch (value) {
    case "payment":
    case "subscription":
    case "setup":
      return value;
    default:
      return "unknown";
  }
}

function normalizeCheckoutStatus(value: unknown): BillingCheckoutStatus {
  switch (value) {
    case "open":
    case "complete":
    case "expired":
      return value;
    default:
      return "unknown";
  }
}

function normalizePaymentStatus(value: unknown): BillingPaymentStatus {
  switch (value) {
    case "paid":
    case "unpaid":
    case "no_payment_required":
      return value;
    default:
      return "unknown";
  }
}

function normalizeMetadata(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, metadataValue]) =>
      typeof metadataValue === "string" && metadataValue.trim().length > 0
        ? [[key, metadataValue.trim()]]
        : [],
    ),
  );
}

function getCustomerEmail(session: StripeCheckoutSessionObject): string | null {
  const directEmail =
    typeof session.customer_email === "string" && session.customer_email.trim().length > 0
      ? session.customer_email.trim()
      : null;
  if (directEmail) {
    return directEmail;
  }

  const nestedEmail =
    typeof session.customer_details?.email === "string" &&
    session.customer_details.email.trim().length > 0
      ? session.customer_details.email.trim()
      : null;

  return nestedEmail;
}

export function summarizeStripeCheckoutSession(
  payload: unknown,
): BillingCheckoutSessionSummary & { metadata: Record<string, string> } {
  const session = payload as StripeCheckoutSessionObject;

  if (typeof session.id !== "string" || session.id.trim().length === 0) {
    throw new StripeBillingError(
      "Stripe Checkout session payload is missing an id.",
      "invalid_checkout_session",
      502,
    );
  }

  return {
    id: session.id,
    checkoutUrl: typeof session.url === "string" && session.url.trim().length > 0 ? session.url : null,
    mode: normalizeCheckoutMode(session.mode),
    status: normalizeCheckoutStatus(session.status),
    paymentStatus: normalizePaymentStatus(session.payment_status),
    customerEmail: getCustomerEmail(session),
    clientReferenceId:
      typeof session.client_reference_id === "string" && session.client_reference_id.trim().length > 0
        ? session.client_reference_id
        : null,
    amountTotal: typeof session.amount_total === "number" ? session.amount_total : null,
    currency: typeof session.currency === "string" ? session.currency.toUpperCase() : null,
    livemode: session.livemode === true,
    metadata: normalizeMetadata(session.metadata),
  };
}

async function parseStripeResponse(
  response: Response,
): Promise<StripeCheckoutSessionObject | StripePrice | StripeApiErrorPayload | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as
    | StripeCheckoutSessionObject
    | StripePrice
    | StripeApiErrorPayload
    | null;
}

async function throwStripeApiError(response: Response): Promise<never> {
  const payload = (await parseStripeResponse(response)) as StripeApiErrorPayload | null;
  const defaultMessage =
    response.status === 404
      ? "Stripe resource was not found."
      : "Stripe request failed.";

  throw new StripeBillingError(
    payload?.error?.message ?? defaultMessage,
    payload?.error?.code ??
      (response.status === 404 ? "stripe_resource_not_found" : "stripe_request_failed"),
    response.status === 404 ? 404 : response.status >= 400 && response.status < 500 ? 400 : 502,
  );
}

async function fetchStripePrice(
  priceId: string,
  secretKey: string,
  fetchImpl: FetchLike,
): Promise<StripePrice> {
  const response = await fetchImpl(
    `https://api.stripe.com/v1/prices/${encodeURIComponent(priceId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    },
  );

  if (!response.ok) {
    await throwStripeApiError(response);
  }

  const payload = (await parseStripeResponse(response)) as StripePrice | null;
  if (!payload || typeof payload !== "object") {
    throw new StripeBillingError(
      "Stripe price lookup returned an invalid response.",
      "invalid_stripe_price_response",
      502,
    );
  }

  return payload;
}

function resolveCheckoutMode(price: StripePrice): "payment" | "subscription" {
  return price.type === "recurring" || price.recurring ? "subscription" : "payment";
}

function buildCheckoutSessionUrls(baseUrl: string): {
  successUrl: string;
  cancelUrl: string;
} {
  return {
    successUrl: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${baseUrl}${siteConfig.productPath}#pricing`,
  };
}

function buildCreateCheckoutSessionBody(
  priceId: string,
  mode: "payment" | "subscription",
  urls: {
    successUrl: string;
    cancelUrl: string;
  },
  input: CreateStripeCheckoutSessionInput,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", urls.successUrl);
  params.set("cancel_url", urls.cancelUrl);

  if (typeof input.customerEmail === "string" && input.customerEmail.trim().length > 0) {
    params.set("customer_email", input.customerEmail.trim());
  }

  if (
    typeof input.clientReferenceId === "string" &&
    input.clientReferenceId.trim().length > 0
  ) {
    params.set("client_reference_id", input.clientReferenceId.trim());
  }

  for (const [key, value] of Object.entries(input.metadata ?? {})) {
    if (value.trim().length > 0) {
      params.set(`metadata[${key}]`, value);
    }
  }

  return params;
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutSessionInput = {},
  env: EnvironmentMap = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<BillingCheckoutSessionSummary & { metadata: Record<string, string> }> {
  const config = resolveStripeBillingConfig(env, input.fallbackBaseUrl);
  const stripePrice = await fetchStripePrice(config.priceId, config.secretKey, fetchImpl);
  const checkoutMode = resolveCheckoutMode(stripePrice);
  const body = buildCreateCheckoutSessionBody(
    config.priceId,
    checkoutMode,
    buildCheckoutSessionUrls(config.baseUrl),
    input,
  );

  const response = await fetchImpl("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    await throwStripeApiError(response);
  }

  const payload = await parseStripeResponse(response);
  return summarizeStripeCheckoutSession(payload);
}

export async function retrieveStripeCheckoutSession(
  sessionId: string,
  env: EnvironmentMap = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<BillingCheckoutSessionSummary & { metadata: Record<string, string> }> {
  const config = resolveStripeBillingConfig(env);
  const normalizedSessionId = normalizeText(sessionId);
  if (normalizedSessionId.length === 0) {
    throw new StripeBillingError(
      "Stripe Checkout session id is required.",
      "missing_checkout_session_id",
      400,
    );
  }

  const response = await fetchImpl(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(normalizedSessionId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
      },
    },
  );

  if (!response.ok) {
    await throwStripeApiError(response);
  }

  const payload = await parseStripeResponse(response);
  return summarizeStripeCheckoutSession(payload);
}
