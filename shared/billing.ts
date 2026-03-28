export const billingCheckoutModeValues = [
  "payment",
  "subscription",
  "setup",
  "unknown",
] as const;
export type BillingCheckoutMode = (typeof billingCheckoutModeValues)[number];

export const billingCheckoutStatusValues = [
  "open",
  "complete",
  "expired",
  "unknown",
] as const;
export type BillingCheckoutStatus = (typeof billingCheckoutStatusValues)[number];

export const billingPaymentStatusValues = [
  "paid",
  "unpaid",
  "no_payment_required",
  "unknown",
] as const;
export type BillingPaymentStatus = (typeof billingPaymentStatusValues)[number];

export type CreateCheckoutSessionRequest = {
  sourcePath?: string;
  draftId?: string;
};

export type BillingCheckoutSessionSummary = {
  id: string;
  checkoutUrl: string | null;
  draftId: string | null;
  mode: BillingCheckoutMode;
  status: BillingCheckoutStatus;
  paymentStatus: BillingPaymentStatus;
  customerEmail: string | null;
  clientReferenceId: string | null;
  amountTotal: number | null;
  currency: string | null;
  livemode: boolean;
};

export type CreateCheckoutSessionResponse = {
  ok: true;
  session: BillingCheckoutSessionSummary;
};

export type CheckoutSessionStatusResponse = {
  ok: true;
  session: BillingCheckoutSessionSummary;
};

export type DraftExportAccessResponse = {
  ok: true;
  access: {
    draftId: string;
    unlocked: boolean;
    paidCheckoutSessionId: string | null;
  };
};
