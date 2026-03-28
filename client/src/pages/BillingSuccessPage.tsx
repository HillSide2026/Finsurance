import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import type { BillingCheckoutSessionSummary, CheckoutSessionStatusResponse } from "@shared/billing";
import { siteConfig } from "@shared/site";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";

type LoadState = "idle" | "loading" | "ready" | "error";

function formatAmount(session: BillingCheckoutSessionSummary | null): string | null {
  if (!session || typeof session.amountTotal !== "number" || !session.currency) {
    return null;
  }

  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: session.currency,
    }).format(session.amountTotal / 100);
  } catch {
    return `${(session.amountTotal / 100).toFixed(2)} ${session.currency}`;
  }
}

export default function BillingSuccessPage() {
  const sessionId = useMemo(
    () => new URLSearchParams(window.location.search).get("session_id"),
    [],
  );
  const [loadState, setLoadState] = useState<LoadState>(sessionId ? "loading" : "idle");
  const [session, setSession] = useState<BillingCheckoutSessionSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await apiRequest<CheckoutSessionStatusResponse>(
          `/api/billing/checkout-session/${encodeURIComponent(sessionId)}/reconcile`,
          {
            method: "POST",
          },
        );
        if (!isMounted) {
          return;
        }

        setSession(response.session);
        setLoadState("ready");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "The checkout session could not be confirmed.";
        setErrorMessage(message);
        setLoadState("error");
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const amountLabel = formatAmount(session);
  const title =
    session?.paymentStatus === "paid"
      ? "Payment received"
      : loadState === "error"
        ? "We could not confirm payment yet"
        : "Checkout complete";
  const description =
    session?.paymentStatus === "paid"
      ? "Stripe confirmed the payment. You can head back into FinSure and continue from there."
      : loadState === "error"
        ? errorMessage ??
          "The session returned from Stripe, but the payment status could not be confirmed yet."
        : "Your Stripe Checkout session returned successfully.";

  return (
    <div className="legal-home-shell min-h-screen px-4 py-6 text-[#1F241D] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="legal-home-panel rounded-[32px] border px-8 py-5 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <a href={siteConfig.links.home} className="flex items-center">
              <img
                src="/fintechlawyer-logo.png"
                alt="FintechLawyer.ca"
                className="h-12 w-auto md:h-14"
              />
            </a>

            <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#525B50] md:gap-6">
              <a href={siteConfig.links.home} className="transition-colors hover:text-[#6F8B65]">
                Home
              </a>
              <a
                href={siteConfig.links.finsure}
                className="transition-colors hover:text-[#6F8B65]"
              >
                FinSure
              </a>
            </nav>
          </div>
        </header>

        <main className="legal-home-panel rounded-[40px] border px-6 py-10 md:px-10 md:py-12">
          <Card className="legal-home-card">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3 text-[#6F8B65]">
                {loadState === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                  Stripe Checkout
                </span>
              </div>
              <CardTitle className="text-3xl text-[#1B2118] md:text-4xl">{title}</CardTitle>
              <CardDescription className="max-w-2xl text-base leading-8 text-[#596255]">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sessionId ? (
                <div className="rounded-3xl border border-[rgba(96,110,89,0.14)] bg-white/70 p-5 text-sm text-[#596255]">
                  <div>Session ID: {sessionId}</div>
                  {session?.customerEmail ? <div className="mt-2">Customer email: {session.customerEmail}</div> : null}
                  {amountLabel ? <div className="mt-2">Amount: {amountLabel}</div> : null}
                  {session?.status ? <div className="mt-2">Checkout status: {session.status}</div> : null}
                  {session?.paymentStatus ? <div className="mt-2">Payment status: {session.paymentStatus}</div> : null}
                </div>
              ) : (
                <div className="rounded-3xl border border-[rgba(96,110,89,0.14)] bg-white/70 p-5 text-sm text-[#596255]">
                  Stripe returned without a `session_id`, so there is nothing specific to confirm on this page.
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-2xl px-8">
                  <a href={siteConfig.links.finsure}>
                    Open FinSure
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                  <a href={siteConfig.links.earlyAccess}>Need rollout help?</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
