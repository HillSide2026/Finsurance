import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type {
  ProductEnquiryRequest,
  ProductEnquiryResponse,
} from "@shared/workspace";
import { siteConfig } from "@shared/site";
import {
  buildCaptureEnquirySourcePath,
  buildCaptureRecommendation,
  captureBusinessTypeOptions,
  captureNeedOptions,
  captureRouteCopy,
  captureStageOptions,
  emptyCaptureQuestionnaire,
  type CaptureQuestionnaire,
  type CaptureRoute,
} from "@/features/capture/captureFunnel";
import { CapturePageShell } from "@/features/capture/CapturePageShell";
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

type LeadFormState = {
  email: string;
  phone: string;
};

function hasPhoneDigits(value: string): boolean {
  return value.replace(/\D/g, "").length >= 7;
}

function ChoiceGrid<T extends string | boolean>({
  options,
  selected,
  onSelect,
}: {
  options: Array<{ value: T; label: string; description: string }>;
  selected: T | null;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-[16px] border px-4 py-4 text-left transition-colors",
              isSelected
                ? "border-[#6F8B65] bg-[rgba(111,139,101,0.10)]"
                : "border-[rgba(42,53,46,0.12)] bg-white/90 hover:border-[rgba(111,139,101,0.38)]",
            )}
          >
            <p className="font-semibold text-[#1F241D]">{option.label}</p>
            <p className="mt-2 text-sm leading-6 text-[#596255]">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}

function scrollToElement(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ComplianceChecklistAssessmentPage() {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<CaptureQuestionnaire>(() => emptyCaptureQuestionnaire());
  const [leadForm, setLeadForm] = useState<LeadFormState>({
    email: "",
    phone: "",
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<CaptureRoute>("product");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recommendation = isGenerated ? buildCaptureRecommendation(answers) : null;

  const generateChecklist = () => {
    if (
      answers.businessType === null ||
      answers.stage === null ||
      answers.servesCanada === null ||
      answers.primaryNeed === null
    ) {
      toast({
        title: "Complete the questions first",
        description:
          "We need all four answers before we can generate your indicative compliance requirements.",
        variant: "destructive",
      });
      return;
    }

    const nextRecommendation = buildCaptureRecommendation(answers);
    setSelectedRoute(nextRecommendation.recommendedRoute);
    setIsGenerated(true);
    window.requestAnimationFrame(() => {
      scrollToElement("checklist-results");
    });
  };

  const submitInterest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = {
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
    };

    if (!normalized.email.includes("@") || !hasPhoneDigits(normalized.phone)) {
      toast({
        title: "Add your email and phone number",
        description: "We need a valid email and phone number so we can follow up on your request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest<ProductEnquiryResponse>("/api/enquiries", {
        method: "POST",
        body: {
          ...normalized,
          sourcePath: buildCaptureEnquirySourcePath(selectedRoute),
        } satisfies ProductEnquiryRequest,
      });
      const routeCopy = captureRouteCopy[selectedRoute];
      setLeadForm({
        email: "",
        phone: "",
      });
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

  return (
    <CapturePageShell
      action={
        <Button asChild variant="outline" className="rounded-xl px-6">
          <a href={siteConfig.links.complianceChecklist}>Back to overview</a>
        </Button>
      }
    >
      <section className="capture-funnel-panel rounded-[24px] border px-6 py-8 md:px-8 md:py-9">
        <div className="max-w-3xl space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
            Pseudo product validation layer
          </p>
          <h1 className="text-4xl leading-[0.96] text-[#1B2118] md:text-[2.9rem]">
            Generate your compliance checklist
          </h1>
          <p className="text-lg leading-8 text-[#596255]">
            Answer four structured questions, review the indicative requirements, then choose the
            next step. Product pricing is the primary path. Human-led support stays available when
            the checklist is not the best fit.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl">
        <Card className="capture-funnel-card rounded-[22px]">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl text-[#1B2118]">Questions</CardTitle>
            <CardDescription className="text-base leading-7 text-[#596255]">
              This page is intentionally short so we can help you quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#1F241D]">1. What kind of fintech are you building?</h2>
              <ChoiceGrid
                options={captureBusinessTypeOptions}
                selected={answers.businessType}
                onSelect={(value) => setAnswers((current) => ({ ...current, businessType: value }))}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#1F241D]">2. What stage are you in?</h2>
              <ChoiceGrid
                options={captureStageOptions}
                selected={answers.stage}
                onSelect={(value) => setAnswers((current) => ({ ...current, stage: value }))}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#1F241D]">
                3. Will this product touch Canada directly?
              </h2>
              <ChoiceGrid
                options={[
                  {
                    value: true,
                    label: "Yes, Canada is in scope",
                    description: "Canadian users, flows, counterparties, or launch plans are already in view.",
                  },
                  {
                    value: false,
                    label: "Not directly, but maybe later",
                    description: "Canada is not the immediate market, but exposure still needs to be tested.",
                  },
                ]}
                selected={answers.servesCanada}
                onSelect={(value) => setAnswers((current) => ({ ...current, servesCanada: value }))}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#1F241D]">4. What do you need right now?</h2>
              <ChoiceGrid
                options={captureNeedOptions}
                selected={answers.primaryNeed}
                onSelect={(value) => setAnswers((current) => ({ ...current, primaryNeed: value }))}
              />
            </div>

            <Button
              size="lg"
              className="rounded-xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.18)] hover:bg-[#dcbc6f]"
              onClick={generateChecklist}
            >
              Generate your compliance requirements
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {recommendation ? (
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
                    Pricing is the default path. Service follow-up is available if your need is
                    better suited to CAMLO, managed compliance, or direct counsel.
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
                  <p className="text-sm uppercase tracking-[0.18em] text-[#CDBA8A]">Early access pricing</p>
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

            <div className="space-y-4">
              {(["camlo", "compliance_service", "legal"] as const).map((route) => {
                const routeCopy = captureRouteCopy[route];
                const isActive = selectedRoute === route;
                return (
                  <Card
                    key={route}
                    className={cn(
                      "capture-funnel-card rounded-[18px] border transition-colors",
                      isActive ? "border-[#6F8B65]" : "",
                    )}
                  >
                    <CardHeader className="space-y-3">
                      <CardTitle className="text-xl text-[#1B2118]">{routeCopy.label}</CardTitle>
                      <CardDescription className="text-sm leading-7 text-[#596255]">
                        {routeCopy.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="rounded-xl px-6"
                        onClick={() => {
                          setSelectedRoute(route);
                          scrollToElement("capture-lead-form");
                        }}
                      >
                        {routeCopy.title}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <Card id="capture-lead-form" className="capture-funnel-card rounded-[22px]">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl text-[#1B2118]">
                {captureRouteCopy[selectedRoute].title}
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-8 text-[#596255]">
                Enter your email and phone number so we can follow up on the route you selected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={submitInterest}>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#1F241D]" htmlFor="capture-email">
                    Email
                  </label>
                  <Input
                    id="capture-email"
                    type="email"
                    value={leadForm.email}
                    onChange={(event) =>
                      setLeadForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="you@company.com"
                    className="h-12 rounded-[14px] border-border/70 bg-white text-[#1F241D]"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#1F241D]" htmlFor="capture-phone">
                    Phone number
                  </label>
                  <Input
                    id="capture-phone"
                    type="tel"
                    value={leadForm.phone}
                    onChange={(event) =>
                      setLeadForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="+1 416 555 0148"
                    className="h-12 rounded-[14px] border-border/70 bg-white text-[#1F241D]"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-[#596255]">
                    Selected route: <span className="font-semibold text-[#1F241D]">{captureRouteCopy[selectedRoute].label}</span>
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
      ) : null}
    </CapturePageShell>
  );
}
