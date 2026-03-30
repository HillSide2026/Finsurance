import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { siteConfig } from "@shared/site";
import type {
  ProductEnquiryRequest,
  ProductEnquiryResponse,
} from "@shared/workspace";
import { CapturePageShell } from "@/features/capture/CapturePageShell";
import {
  buildCaptureEnquirySourcePath,
  buildCaptureRecommendation,
  captureRouteCopy,
  loadCaptureResultsSession,
  type CaptureRoute,
} from "@/features/capture/captureFunnel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ApiError, apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

function hasPhoneDigits(value: string): boolean {
  return value.replace(/\D/g, "").length >= 7;
}

function scrollToElement(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ComplianceChecklistResultsPage() {
  const { toast } = useToast();
  const session = loadCaptureResultsSession();
  const recommendation = session ? buildCaptureRecommendation(session.answers) : null;
  const [selectedRoute, setSelectedRoute] = useState<CaptureRoute>(
    recommendation?.recommendedRoute ?? "product",
  );
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInterest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = session?.email.trim() ?? "";
    const normalizedPhone = phone.trim();

    if (!normalizedEmail.includes("@")) {
      toast({
        title: "Complete your Checklist first",
        description: "We need your captured email from the questionnaire before we can save this request.",
        variant: "destructive",
      });
      return;
    }

    if (!hasPhoneDigits(normalizedPhone)) {
      toast({
        title: "Add your phone number",
        description: "We need a valid phone number so we can follow up on your request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest<ProductEnquiryResponse>("/api/enquiries", {
        method: "POST",
        body: {
          email: normalizedEmail,
          phone: normalizedPhone,
          sourcePath: buildCaptureEnquirySourcePath(selectedRoute),
        } satisfies ProductEnquiryRequest,
      });

      const routeCopy = captureRouteCopy[selectedRoute];
      toast({
        title: routeCopy.successTitle,
        description: routeCopy.successDescription,
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description:
          error instanceof ApiError
            ? error.message
            : "We could not save your request right now.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session || !recommendation) {
    return (
      <CapturePageShell>
        <section className="capture-funnel-panel rounded-[24px] border px-6 py-12 text-center md:px-8">
          <div className="mx-auto max-w-2xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
              Results unavailable
            </p>
            <h1 className="text-3xl text-[#1B2118] md:text-4xl">Complete your Checklist first</h1>
            <p className="text-base leading-8 text-[#596255]">
              We need the questionnaire answers and your email from page 1 before we can show the
              results page.
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-[#E6C989] px-7 text-[#1F241D] hover:bg-[#dcbc6f]"
              >
                <a href={siteConfig.links.complianceChecklist}>Complete your Checklist</a>
              </Button>
            </div>
          </div>
        </section>
      </CapturePageShell>
    );
  }

  return (
    <CapturePageShell>
      <section id="checklist-results" className="space-y-8">
        <Card className="capture-funnel-panel rounded-[24px] border px-6 py-8 md:px-8 md:py-9">
          <CardHeader className="space-y-4 px-0 pt-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[rgba(111,139,101,0.24)] bg-[rgba(111,139,101,0.10)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F8B65]">
                {recommendation.readinessLabel}
              </span>
              <span className="rounded-full border border-[rgba(230,201,137,0.32)] bg-[rgba(230,201,137,0.12)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A5140]">
                Your compliance requirements
              </span>
            </div>
            <CardTitle className="text-3xl text-[#1B2118]">
              Your indicative compliance requirements
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-8 text-[#596255]">
              {recommendation.summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-0 pb-0">
            <div className="space-y-4">
              {recommendation.requirements.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[16px] border border-[rgba(42,53,46,0.12)] bg-white/90 px-4 py-4 text-sm leading-7 text-[#596255]"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 text-[#6F8B65]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {recommendation.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-[rgba(96,110,89,0.14)] bg-white/80 px-4 py-4 text-sm leading-7 text-[#596255]"
                >
                  {item}
                </div>
              ))}
              <div className="rounded-[16px] border border-[rgba(230,201,137,0.32)] bg-[rgba(230,201,137,0.12)] px-4 py-4 text-sm leading-7 text-[#3E443A]">
                <p className="font-semibold">Next commercial step</p>
                <p className="mt-2">
                  Close on either the existing product or a consultation with our sales team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-5">
          <Card className="capture-funnel-dark-card rounded-[22px] border text-[#F7F1E4]">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#E6C989]">
                <Sparkles className="h-4 w-4" />
                Primary path
              </div>
              <CardTitle className="text-3xl text-white">Reserve software access</CardTitle>
              <CardDescription className="max-w-2xl text-base leading-8 text-[#DAD5C7]">
                The automation path looks promising. Connect with our team to learn more about
                software-based solutions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-[16px] border border-white/10 bg-white/5 px-5 py-5">
                <p className="text-sm uppercase tracking-[0.18em] text-[#CDBA8A]">
                  Early access pricing
                </p>
                <p className="mt-3 text-4xl font-semibold text-white">$99</p>
                <p className="mt-2 text-sm leading-7 text-[#DAD5C7]">
                  Structured compliance checklist access for teams that want a fast self-serve
                  first step before engaging broader support.
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-xl bg-[#E6C989] px-8 text-[#1F241D] hover:bg-[#dcbc6f]"
                onClick={() => {
                  setSelectedRoute("product");
                  scrollToElement("capture-lead-form");
                }}
              >
                Reserve software access
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-[#DAD5C7]">{recommendation.pricingLabel}</p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "capture-funnel-card rounded-[18px] border transition-colors",
              selectedRoute === "consultation" ? "border-[#6F8B65]" : "",
            )}
          >
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-[#1B2118]">
                {captureRouteCopy.consultation.label}
              </CardTitle>
              <CardDescription className="text-sm leading-7 text-[#596255]">
                If the existing product is not the right fit, close the conversation with a
                consultation with our sales team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="rounded-xl px-6"
                onClick={() => {
                  setSelectedRoute("consultation");
                  scrollToElement("capture-lead-form");
                }}
              >
                {captureRouteCopy.consultation.title}
              </Button>
            </CardContent>
          </Card>
        </section>

        <Card id="capture-lead-form" className="capture-funnel-card rounded-[22px]">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl text-[#1B2118]">
              {captureRouteCopy[selectedRoute].title}
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-8 text-[#596255]">
              We already have your email. Add your phone number so we can follow up on the route
              you selected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={submitInterest}>
              <div className="rounded-[16px] border border-[rgba(42,53,46,0.12)] bg-white/80 px-4 py-4 text-sm leading-7 text-[#596255]">
                <p className="font-semibold text-[#1F241D]">Email captured</p>
                <p className="mt-1">{session.email}</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#1F241D]" htmlFor="capture-phone">
                  Phone number
                </label>
                <Input
                  id="capture-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 416 555 0148"
                  className="h-12 rounded-[14px] border-border/70 bg-white text-[#1F241D]"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[#596255]">
                  Selected route:{" "}
                  <span className="font-semibold text-[#1F241D]">
                    {captureRouteCopy[selectedRoute].label}
                  </span>
                </p>
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl bg-[#E6C989] px-8 text-[#1F241D] hover:bg-[#dcbc6f]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </CapturePageShell>
  );
}
