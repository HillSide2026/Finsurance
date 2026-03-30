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
  name: string;
  email: string;
  company: string;
};

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
    <div className="grid gap-3 md:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-[20px] border px-4 py-4 text-left transition-colors",
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
    name: "",
    email: "",
    company: "",
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
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
      company: leadForm.company.trim(),
    };

    if (normalized.name.length === 0 || !normalized.email.includes("@")) {
      toast({
        title: "Add your name and a valid email",
        description: "We only need a valid contact so we can follow up on the route you selected.",
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
        name: "",
        email: "",
        company: "",
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
        <Button asChild variant="outline" className="rounded-2xl px-6">
          <a href={siteConfig.links.complianceChecklist}>Back to overview</a>
        </Button>
      }
    >
      <section className="legal-home-panel rounded-[32px] border px-6 py-12 md:px-10 md:py-14">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6F8B65]">
            Pseudo product validation layer
          </p>
          <h1 className="text-4xl leading-[0.96] text-[#1B2118] md:text-5xl">
            Generate your compliance checklist
          </h1>
          <p className="text-lg leading-8 text-[#596255]">
            Answer four structured questions, review the indicative requirements, then choose the
            next step. Product pricing is the primary path. Human-led support stays available when
            the checklist is not the best fit.
          </p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
        <Card className="legal-home-card rounded-[28px]">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl text-[#1B2118]">Questions</CardTitle>
            <CardDescription className="text-base leading-7 text-[#596255]">
              This page is intentionally short so we can capture real demand and get to a pricing or
              routing decision quickly.
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
              className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
              onClick={generateChecklist}
            >
              Generate your compliance requirements
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="legal-home-card rounded-[28px]">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl text-[#1B2118]">What happens next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-[#596255]">
            <div className="rounded-2xl border border-[rgba(96,110,89,0.14)] bg-white/80 px-4 py-4">
              <p className="font-semibold text-[#1F241D]">Primary path</p>
              <p className="mt-2">
                Reach pricing, test willingness to pay, and reserve checklist access if the
                self-serve route fits.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(96,110,89,0.14)] bg-white/80 px-4 py-4">
              <p className="font-semibold text-[#1F241D]">Secondary path</p>
              <p className="mt-2">
                If your answers point toward human-led support, we can route you into CAMLO,
                Compliance as a Service, or Levine Law follow-up.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(230,201,137,0.32)] bg-[rgba(230,201,137,0.12)] px-4 py-4 text-[#3E443A]">
              Strongest validation signal: <span className="font-semibold">payment attempt after pricing</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {recommendation ? (
        <section id="checklist-results" className="space-y-8">
          <Card className="legal-home-panel rounded-[32px] border px-6 py-10 md:px-10 md:py-12">
            <CardHeader className="space-y-4 px-0 pt-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[rgba(111,139,101,0.24)] bg-[rgba(111,139,101,0.10)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6F8B65]">
                  {recommendation.readinessLabel}
                </span>
                <span className="rounded-full border border-[rgba(230,201,137,0.32)] bg-[rgba(230,201,137,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A5140]">
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
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  {recommendation.requirements.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-[rgba(42,53,46,0.12)] bg-white/90 px-4 py-4 text-sm leading-7 text-[#596255]"
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
                      className="rounded-2xl border border-[rgba(96,110,89,0.14)] bg-white/80 px-4 py-4 text-sm leading-7 text-[#596255]"
                    >
                      {item}
                    </div>
                  ))}
                  <div className="rounded-2xl border border-[rgba(230,201,137,0.32)] bg-[rgba(230,201,137,0.12)] px-4 py-4 text-sm leading-7 text-[#3E443A]">
                    <p className="font-semibold">Next commercial step</p>
                    <p className="mt-2">
                      Pricing is the default path. Service follow-up is available if your need is
                      better suited to CAMLO, managed compliance, or direct counsel.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_0.95fr]">
            <Card className="legal-home-feature-panel rounded-[28px] border text-[#F7F1E4]">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#E6C989]">
                  <Sparkles className="h-4 w-4" />
                  Primary path
                </div>
                <CardTitle className="text-3xl text-white">Reserve checklist access</CardTitle>
                <CardDescription className="max-w-2xl text-base leading-8 text-[#DAD5C7]">
                  The product path is the default. Use pricing exposure and a paid-intent CTA to
                  validate whether founders will buy the self-serve checklist.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-[#CDBA8A]">Early access pricing</p>
                  <p className="mt-3 text-4xl font-semibold text-white">$99</p>
                  <p className="mt-2 text-sm leading-7 text-[#DAD5C7]">
                    Structured compliance checklist access for teams that want a fast self-serve
                    first step before engaging broader support.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] hover:bg-[#dcbc6f]"
                  onClick={() => {
                    setSelectedRoute("product");
                    scrollToElement("capture-lead-form");
                  }}
                >
                  Reserve checklist access
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
                      "legal-home-card rounded-[24px] border transition-colors",
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
                        className="rounded-2xl px-6"
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

          <Card id="capture-lead-form" className="legal-home-card rounded-[28px]">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl text-[#1B2118]">
                {captureRouteCopy[selectedRoute].title}
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-8 text-[#596255]">
                {captureRouteCopy[selectedRoute].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-5 md:grid-cols-2" onSubmit={submitInterest}>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#1F241D]" htmlFor="capture-name">
                    Name
                  </label>
                  <Input
                    id="capture-name"
                    value={leadForm.name}
                    onChange={(event) =>
                      setLeadForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Your name"
                    className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D]"
                  />
                </div>
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
                    className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D]"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-[#1F241D]" htmlFor="capture-company">
                    Company
                  </label>
                  <Input
                    id="capture-company"
                    value={leadForm.company}
                    onChange={(event) =>
                      setLeadForm((current) => ({ ...current, company: event.target.value }))
                    }
                    placeholder="Optional"
                    className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D]"
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-[#596255]">
                    Selected route: <span className="font-semibold text-[#1F241D]">{captureRouteCopy[selectedRoute].label}</span>
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] hover:bg-[#dcbc6f]"
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
