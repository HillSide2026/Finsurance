import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  FileStack,
  FileText,
  Hash,
  Mail,
  RefreshCcw,
  ScanSearch,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { siteConfig } from "@shared/site";
import {
  amountBandLabels,
  amountBandValues,
  buildStrDraft,
  clientRelationshipLabels,
  clientRelationshipValues,
  createEmptyStrIntake,
  createIntakeFromPreset,
  currencyLabels,
  currencyValues,
  customerTypeLabels,
  customerTypeValues,
  jurisdictionLabels,
  jurisdictionValues,
  strScenarioPresets,
  suspicionIndicatorLabels,
  suspicionIndicatorValues,
  timeframeLabels,
  timeframeValues,
  toggleValue,
  transactionChannelLabels,
  transactionChannelValues,
  transactionCountLabels,
  transactionCountValues,
  triggerTypeLabels,
  triggerTypeValues,
  type StrCustomerData,
  type StrIntake,
  type StrReadinessStatus,
  type StrScenarioPreset,
  type SuspicionLevel,
} from "@shared/str";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type View = "landing" | "intake" | "review" | "narrative" | "output";
type SessionMeta = {
  id: string;
  timestamp: string;
};

type LeadFormState = {
  name: string;
  email: string;
  company: string;
};

const steps: Array<{ view: Exclude<View, "landing">; label: string }> = [
  { view: "intake", label: "Intake" },
  { view: "review", label: "Risk Signals" },
  { view: "narrative", label: "Narrative" },
  { view: "output", label: "Output" },
];

const levelCopy: Record<SuspicionLevel, { label: string; className: string }> = {
  low: {
    label: "Low suspicion strength",
    className: "border-emerald-300 bg-emerald-100 text-emerald-900",
  },
  medium: {
    label: "Medium suspicion strength",
    className: "border-amber-300 bg-amber-100 text-amber-950",
  },
  high: {
    label: "High suspicion strength",
    className: "border-rose-300 bg-rose-100 text-rose-950",
  },
};

const readinessCopy: Record<
  StrReadinessStatus,
  {
    label: string;
    className: string;
    reviewButtonLabel: string;
  }
> = {
  insufficient_information: {
    label: "Need more structured intake",
    className: "border-rose-300 bg-rose-100 text-rose-950",
    reviewButtonLabel: "Add More Intake Detail",
  },
  guidance_only: {
    label: "Preliminary guidance only",
    className: "border-amber-300 bg-amber-100 text-amber-950",
    reviewButtonLabel: "Review Preliminary Risk Signals",
  },
  ready_to_draft: {
    label: "Ready to draft",
    className: "border-emerald-300 bg-emerald-100 text-emerald-950",
    reviewButtonLabel: "Review Risk Signals",
  },
};

const homepagePainPoints = [
  "Manual reporting slows response times",
  "Unclear requirements create reporting risk",
  "Inconsistent documentation creates audit friction",
] as const;

const homepageBenefits = [
  "Generate structured STR drafts in under 60 seconds",
  "Guided inputs reduce omissions and avoidable drafting gaps",
  "Explainable risk signals keep the reasoning visible",
  "Cleaner output reduces manual back-and-forth before review",
] as const;

const homepageWorkflow = [
  {
    icon: ScanSearch,
    title: "Input transaction details",
    body: "Capture the fact pattern through structured fields instead of a blank text box.",
  },
  {
    icon: ShieldAlert,
    title: "Surface red flags and gaps",
    body: "Review deterministic indicators, suspicion strength, and the information still needed.",
  },
  {
    icon: FileText,
    title: "Review the narrative draft",
    body: "Build the draft only when the intake is strong enough to support a coherent report.",
  },
  {
    icon: WalletCards,
    title: "Export and finalize",
    body: "Copy or download a clean draft package for escalation, filing prep, and internal review.",
  },
] as const;

const homepageAuthorityPoints = [
  "Developed by Levine Law",
  "Grounded in fintech and financial-regulatory context",
  "Built for drafting clarity, consistency, and review readiness",
] as const;

function createSessionMeta(): SessionMeta {
  return {
    id: `STR-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`,
    timestamp: new Date().toISOString(),
  };
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildEarlyAccessMailto(form: LeadFormState): string {
  const subject = encodeURIComponent("FinSure early access request");
  const body = encodeURIComponent(
    [
      "Hello,",
      "",
      "I would like early access to FinSure.",
      "",
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Company: ${form.company.trim() || "Not provided"}`,
      "",
      `Requested from: ${siteConfig.canonicalOrigin}`,
    ].join("\n"),
  );

  return `mailto:${siteConfig.supportEmail}?subject=${subject}&body=${body}`;
}

function Stepper({ currentView }: { currentView: Exclude<View, "landing"> }) {
  const activeIndex = steps.findIndex((step) => step.view === currentView);

  return (
    <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-4">
      {steps.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <div
            key={step.view}
            className={cn(
              "rounded-2xl border px-4 py-3 transition-colors",
              isActive
                ? "border-primary/30 bg-primary/10"
                : isComplete
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-border/70 bg-white",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isComplete
                      ? "bg-emerald-600 text-white"
                      : "bg-secondary text-secondary-foreground",
                )}
              >
                {isComplete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Step {index + 1}
                </p>
                <p className="font-semibold text-foreground">{step.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChoiceTile({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-primary/30 bg-primary/10 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          : "border-border/70 bg-white hover:border-primary/20 hover:bg-secondary/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "mt-1 h-5 w-5 rounded-full border",
            selected
              ? "border-primary bg-primary shadow-inner"
              : "border-border bg-background",
          )}
        />
      </div>
    </button>
  );
}

function SummaryList({
  title,
  items,
  emptyCopy,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  emptyCopy: string;
  tone?: "neutral" | "alert";
}) {
  return (
    <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {emptyCopy}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item}
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm leading-6",
                tone === "alert"
                  ? "border-amber-200 bg-amber-50 text-amber-950"
                  : "border-border/70 bg-secondary/40 text-foreground",
              )}
            >
              {item}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function PresetCard({
  preset,
  onApply,
}: {
  preset: StrScenarioPreset;
  onApply: (presetId: string) => void;
}) {
  return (
    <Card className="brand-site-card text-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{preset.name}</CardTitle>
            <CardDescription className="mt-2 leading-6">
              {preset.description}
            </CardDescription>
          </div>
          <FileStack className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {preset.highlights.map((highlight) => (
            <Badge
              key={highlight}
              variant="outline"
              className="border-primary/20 bg-primary/10 text-[#EAF2F3]"
            >
              {highlight}
            </Badge>
          ))}
        </div>
        <Button className="w-full rounded-2xl" onClick={() => onApply(preset.id)}>
          Use Preset
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function StrAssistant() {
  const { toast } = useToast();
  const [view, setView] = useState<View>("landing");
  const [session, setSession] = useState<SessionMeta>(() => createSessionMeta());
  const [intake, setIntake] = useState<StrIntake>(() => createEmptyStrIntake());
  const [narrativeText, setNarrativeText] = useState("");
  const [leadForm, setLeadForm] = useState<LeadFormState>({
    name: "",
    email: "",
    company: "",
  });

  const draft = buildStrDraft(intake);
  const selectedPreset = intake.scenarioPresetId
    ? strScenarioPresets.find((preset) => preset.id === intake.scenarioPresetId) ?? null
    : null;
  const levelMeta = levelCopy[draft.suspicionLevel];
  const readinessMeta = readinessCopy[draft.readiness.status];

  const updateIntake = <K extends keyof StrIntake>(key: K, value: StrIntake[K]) => {
    setIntake((current) => ({ ...current, [key]: value }));
  };

  const updateCustomerData = <K extends keyof StrCustomerData>(
    key: K,
    value: StrCustomerData[K],
  ) => {
    setIntake((current) => ({
      ...current,
      customerData: {
        ...current.customerData,
        [key]: value,
      },
    }));
  };

  const updateLeadForm = <K extends keyof LeadFormState>(
    key: K,
    value: LeadFormState[K],
  ) => {
    setLeadForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const startBlankFlow = () => {
    setSession(createSessionMeta());
    setIntake(createEmptyStrIntake());
    setNarrativeText("");
    setView("intake");
  };

  const applyPreset = (presetId: string) => {
    setSession(createSessionMeta());
    setIntake(createIntakeFromPreset(presetId));
    setNarrativeText("");
    setView("intake");
    toast({
      title: "Scenario preset applied",
      description: "You can edit any of the structured details before generating the draft.",
    });
  };

  const resetFlow = () => {
    setSession(createSessionMeta());
    setIntake(createEmptyStrIntake());
    setNarrativeText("");
    setView("landing");
  };

  const requestEarlyAccess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedLead = {
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
      company: leadForm.company.trim(),
    };

    if (normalizedLead.name.length === 0 || normalizedLead.email.length === 0) {
      toast({
        title: "Add name and email",
        description:
          "Name and email are enough to request early access. Company is optional.",
        variant: "destructive",
      });
      return;
    }

    if (!normalizedLead.email.includes("@")) {
      toast({
        title: "Use a valid email",
        description: "Enter a valid email address so the early-access request is usable.",
        variant: "destructive",
      });
      return;
    }

    setLeadForm(normalizedLead);
    window.location.href = buildEarlyAccessMailto(normalizedLead);
  };

  const reviewRiskSignals = () => {
    if (!draft.readiness.canReviewRiskSignals) {
      toast({
        title: "More intake detail is needed",
        description:
          "Capture the trigger, transaction pattern, and basis for suspicion before reviewing risk signals.",
        variant: "destructive",
      });
      return;
    }

    if (draft.readiness.status === "guidance_only") {
      toast({
        title: "Preliminary guidance only",
        description:
          "You can review early risk signals now, but the required intake gaps still need to be completed before drafting.",
      });
    }

    setView("review");
  };

  const buildNarrativeDraft = () => {
    if (!draft.readiness.canGenerate) {
      toast({
        title: "Missing required fields",
        description: "Complete the intake before building the STR narrative draft.",
        variant: "destructive",
      });
      setView("intake");
      return;
    }

    setNarrativeText(draft.narrativeText);
    setView("narrative");
  };

  const goToOutput = () => {
    setView("output");
  };

  const copyNarrative = async () => {
    if (narrativeText.trim().length === 0) {
      toast({
        title: "No draft to copy",
        description: "Build the narrative first, then copy the finished draft.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(narrativeText);
      toast({
        title: "Narrative copied",
        description: "The STR draft is on your clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard access was not available in this browser context.",
        variant: "destructive",
      });
    }
  };

  const downloadNarrative = () => {
    if (narrativeText.trim().length === 0) {
      toast({
        title: "No draft to download",
        description: "Build the narrative first, then download the finished draft.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([narrativeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${session.id.toLowerCase()}-str-draft.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (view === "landing") {
    return (
      <div className="brand-site-shell min-h-screen px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="brand-site-frame mx-auto max-w-6xl rounded-[36px] border p-6 backdrop-blur md:p-10">
          <header className="flex flex-col gap-6 border-b border-white/10 pb-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#6B8A90]">
                  {siteConfig.siteName}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl leading-tight text-[#EAF2F3] md:text-5xl">
                    {siteConfig.productName}
                  </h1>
                  <Badge className="border-primary/20 bg-primary/10 px-4 py-2 text-[#EAF2F3]">
                    STR drafting assistant
                  </Badge>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-3 text-sm text-[#6B8A90]">
                <a href={siteConfig.links.howItWorks} className="hover:text-[#00D4D4]">
                  How it works
                </a>
                <a href={siteConfig.links.presets} className="hover:text-[#00D4D4]">
                  Use cases
                </a>
                <a href={siteConfig.links.earlyAccess} className="hover:text-[#00D4D4]">
                  Early access
                </a>
                <Button size="sm" className="rounded-2xl" onClick={startBlankFlow}>
                  Start drafting
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="w-fit border-primary/20 bg-primary/10 px-4 py-2 text-[#EAF2F3]">
                Drafting assist only. Final reporting judgment stays with your team.
              </Badge>
            </div>
          </header>

          <main id="start" className="space-y-16 py-10">
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_400px] lg:items-center">
              <div className="space-y-6">
                <Badge className="w-fit border-primary/20 bg-primary/10 px-4 py-2 text-[#EAF2F3]">
                  Suspicious transaction reporting
                </Badge>

                <div className="space-y-4">
                  <h2 className="text-5xl leading-[0.95] text-[#EAF2F3] md:text-7xl">
                    FinSure: Review-Ready STRs in less than 60 Seconds
                  </h2>
                  <p className="max-w-3xl text-lg leading-8 text-[#6B8A90]">
                    FinSure generates Suspicious Transaction Report drafts so your team can
                    review and submit faster.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" className="rounded-2xl px-8" onClick={startBlankFlow}>
                    Start drafting
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                    <a href={siteConfig.links.earlyAccess}>
                      Get early access
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                  <a
                    href={siteConfig.links.levineLaw}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#EAF2F3] transition-colors hover:text-[#00D4D4]"
                  >
                    Visit Levine Law
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-[#6B8A90]">
                  {["Structured intake", "Explainable red flags", "Editable output"].map(
                    (item) => (
                      <span
                        key={item}
                        className="brand-site-outline-pill rounded-full border px-4 py-2 text-[#EAF2F3]"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <Card className="brand-site-dark-panel text-white">
                <CardHeader className="pb-4">
                  <CardDescription className="text-slate-300">What the workflow delivers</CardDescription>
                  <CardTitle className="text-3xl text-white">Scenario in. Draft out.</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <ScanSearch className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-[#EAF2F3]">Capture the fact pattern</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Transaction details, customer context, and suspicion indicators are
                      captured through guided fields instead of freeform drafting.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-[#EAF2F3]">Review the signals</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      The app surfaces red flags, suspicion strength, and information gaps so
                      the reasoning stays visible.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-[#EAF2F3]">Produce the draft package</p>
                    </div>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                      {[
                        "Narrative draft",
                        "Detected red flags",
                        "Missing-information prompts",
                        "Checklist for review",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#00D4D4]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#6B8A90]">
                    Why teams use it
                  </p>
                  <h3 className="mt-2 text-2xl text-[#EAF2F3]">
                    Manual STR drafting creates avoidable risk
                  </h3>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-[#6B8A90]">
                  FinSure replaces ad hoc drafting with a workflow that is faster to complete
                  and easier to review.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {homepagePainPoints.map((point) => (
                  <Card key={point} className="brand-site-card text-white">
                    <CardHeader className="pb-3">
                      <ShieldAlert className="h-7 w-7 text-primary" />
                      <CardTitle className="mt-4 text-xl">{point}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-[#6B8A90]">
                      Guided inputs and cleaner draft output reduce rework and make the next
                      review step easier.
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Card className="brand-site-card text-white">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#6B8A90]">
                    Meet {siteConfig.productName}
                  </p>
                  <CardTitle className="mt-2 text-3xl text-white">
                    The product is simple on purpose
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-3xl leading-6 text-[#6B8A90]">
                    It is not a broad compliance platform. It is a focused drafting workflow
                    built to help a team move from suspicious activity facts to a review-ready
                    STR draft faster.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {homepageBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="brand-site-soft rounded-[24px] border p-5 text-sm leading-6 text-[#EAF2F3]"
                    >
                      {benefit}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="brand-site-soft text-white">
                <CardHeader>
                  <CardDescription className="text-[#6B8A90]">What stays visible</CardDescription>
                  <CardTitle className="text-3xl text-white">Function before decoration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-[#EAF2F3]">
                  <p>
                    Every major screen in the workflow is there to help the operator answer one
                    question: do we have enough structured information to draft, review, and
                    escalate confidently?
                  </p>
                </CardContent>
              </Card>
            </section>

            <section
              id="how-it-works"
              className="brand-site-soft space-y-5 rounded-[32px] border p-6"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#6B8A90]">
                    How it works
                  </p>
                  <h3 className="mt-2 text-2xl text-[#EAF2F3]">
                    One clear path from scenario to draft
                  </h3>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-[#6B8A90]">
                  The workflow is short, structured, and easy to test.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {homepageWorkflow.map((item, index) => (
                  <Card key={item.title} className="brand-site-card text-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <item.icon className="h-7 w-7 text-primary" />
                        <span className="text-sm font-semibold text-[#00D4D4]">
                          {index + 1}
                        </span>
                      </div>
                      <CardTitle className="mt-4 text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-[#6B8A90]">
                      {item.body}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="presets" className="space-y-5 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#6B8A90]">
                    Use cases
                  </p>
                  <h2 className="mt-2 text-2xl text-[#EAF2F3]">
                    Start from a realistic scenario
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-[#6B8A90]">
                  Open a common suspicious-transaction pattern, then edit any field before
                  generating the draft.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {strScenarioPresets.slice(0, 3).map((preset) => (
                  <PresetCard key={preset.id} preset={preset} onApply={applyPreset} />
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <Card className="brand-site-card text-white">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#6B8A90]">
                    Built with real legal context
                  </p>
                  <CardTitle className="mt-2 text-3xl text-white">
                    Powered by Levine Law
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-3xl leading-6 text-[#6B8A90]">
                    FinSure is backed by Levine Law. That connection supports trust and context
                    without turning the homepage into a firm brochure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 text-sm leading-7 text-slate-200">
                  <div className="grid gap-4 md:grid-cols-3">
                    {homepageAuthorityPoints.map((item) => (
                      <div
                        key={item}
                        className="brand-site-soft rounded-[24px] border p-5 text-[#EAF2F3]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="rounded-2xl">
                      <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                        Visit Levine Law
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="brand-site-soft text-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Scope</CardTitle>
                  <CardDescription className="text-[#6B8A90]">
                    One use case, one workflow, one output.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-[#EAF2F3]">
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-[#EAF2F3]">
                    Drafting suspicious transaction narratives from structured facts.
                  </div>
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-[#EAF2F3]">
                    Surfacing explainable red flags and information gaps for operator review.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#EAF2F3]">
                    Not a filing engine, case-management platform, or full AML operations portal.
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="early-access" className="border-t border-white/10 pt-8">
              <Card className="brand-site-dark-panel text-white">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-300">
                        Early access
                      </p>
                      <CardTitle className="mt-2 text-4xl text-white">
                        Get early access to {siteConfig.productName}
                      </CardTitle>
                      <CardDescription className="mt-3 max-w-3xl leading-6 text-slate-300">
                        Tell us who you are and we will coordinate access for your team. Name
                        and email are enough to get started.
                      </CardDescription>
                    </div>
                    <Mail className="mt-1 h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <form className="grid gap-4 md:grid-cols-2" onSubmit={requestEarlyAccess}>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-[#EAF2F3]" htmlFor="lead-name">
                        Name
                      </label>
                      <Input
                        id="lead-name"
                        value={leadForm.name}
                        onChange={(event) => updateLeadForm("name", event.target.value)}
                        placeholder="Your name"
                        className="h-12 rounded-xl border-white/10 bg-[#0C3540] text-[#EAF2F3] placeholder:text-[#6B8A90]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-[#EAF2F3]" htmlFor="lead-email">
                        Email
                      </label>
                      <Input
                        id="lead-email"
                        type="email"
                        value={leadForm.email}
                        onChange={(event) => updateLeadForm("email", event.target.value)}
                        placeholder="you@company.com"
                        className="h-12 rounded-xl border-white/10 bg-[#0C3540] text-[#EAF2F3] placeholder:text-[#6B8A90]"
                      />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <label
                        className="text-sm font-medium text-[#EAF2F3]"
                        htmlFor="lead-company"
                      >
                        Company
                      </label>
                      <Input
                        id="lead-company"
                        value={leadForm.company}
                        onChange={(event) => updateLeadForm("company", event.target.value)}
                        placeholder="Optional"
                        className="h-12 rounded-xl border-white/10 bg-[#0C3540] text-[#EAF2F3] placeholder:text-[#6B8A90]"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                      <Button type="submit" size="lg" className="rounded-2xl px-8">
                        Get early access
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                        <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                          Visit Levine Law
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-4 text-sm leading-6 text-slate-200">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      Early access is coordinated manually while the product stays focused on
                      one workflow and one output.
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      Prefer email directly?
                      <a
                        href={siteConfig.links.pilotAccess}
                        className="brand-site-highlight ml-1 font-medium hover:underline"
                      >
                        {siteConfig.supportEmail}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(185,112,29,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.10),_transparent_35%),linear-gradient(180deg,_#fbf8f1_0%,_#f2efe7_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                {siteConfig.productName}
              </p>
              <h1 className="mt-2 text-3xl text-primary md:text-4xl">
                FINTRAC STR triage in a one-minute drafting flow.
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-2xl" onClick={resetFlow}>
                <RefreshCcw className="h-4 w-4" />
                Restart
              </Button>
              <Badge className="w-fit border-amber-200 bg-amber-100 px-4 py-2 text-amber-950">
                No persistence in MVP
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-secondary/35 px-4 py-2">
              <Hash className="h-4 w-4 text-primary" />
              {session.id}
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-secondary/35 px-4 py-2">
              <Clock3 className="h-4 w-4 text-primary" />
              {formatTimestamp(session.timestamp)}
            </div>
            {selectedPreset ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-2 text-primary">
                <FileStack className="h-4 w-4" />
                Preset: {selectedPreset.name}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-secondary/35 px-4 py-2">
                <ScanSearch className="h-4 w-4 text-primary" />
                Blank intake
              </div>
            )}
          </div>
        </header>

        <Stepper currentView={view} />

        {view === "intake" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Section 1: Event Type</CardTitle>
                  <CardDescription>
                    Choose what triggered concern. Multiple triggers are allowed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {triggerTypeValues.map((trigger) => (
                    <ChoiceTile
                      key={trigger}
                      label={triggerTypeLabels[trigger]}
                      selected={intake.triggerTypes.includes(trigger)}
                      onClick={() =>
                        updateIntake("triggerTypes", toggleValue(intake.triggerTypes, trigger))
                      }
                    />
                  ))}
                  {intake.triggerTypes.includes("other") ? (
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Describe the other triggering concern
                      </label>
                      <Input
                        value={intake.triggerOtherText}
                        onChange={(event) =>
                          updateIntake("triggerOtherText", event.target.value)
                        }
                        placeholder="Example: unusual layering through multiple linked accounts"
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Section 2: Transaction Pattern</CardTitle>
                  <CardDescription>
                    Capture the scale, pace, and channels used in the activity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Approximate total amount
                      </label>
                      <Select
                        value={intake.amountBand ?? undefined}
                        onValueChange={(value) =>
                          updateIntake("amountBand", value as StrIntake["amountBand"])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select amount band" />
                        </SelectTrigger>
                        <SelectContent>
                          {amountBandValues.map((band) => (
                            <SelectItem key={band} value={band}>
                              {amountBandLabels[band]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Currency
                      </label>
                      <Select
                        value={intake.currency ?? undefined}
                        onValueChange={(value) =>
                          updateIntake("currency", value as StrIntake["currency"])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyValues.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currencyLabels[currency]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {intake.currency === "other" ? (
                      <div className="grid gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                          Specify the currency
                        </label>
                        <Input
                          value={intake.currencyOtherText}
                          onChange={(event) =>
                            updateIntake("currencyOtherText", event.target.value)
                          }
                          placeholder="Example: AED"
                        />
                      </div>
                    ) : null}

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Number of transactions
                      </label>
                      <Select
                        value={intake.transactionCount ?? undefined}
                        onValueChange={(value) =>
                          updateIntake(
                            "transactionCount",
                            value as StrIntake["transactionCount"],
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction count" />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionCountValues.map((count) => (
                            <SelectItem key={count} value={count}>
                              {transactionCountLabels[count]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Timeframe
                      </label>
                      <Select
                        value={intake.timeframe ?? undefined}
                        onValueChange={(value) =>
                          updateIntake("timeframe", value as StrIntake["timeframe"])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframeValues.map((timeframe) => (
                            <SelectItem key={timeframe} value={timeframe}>
                              {timeframeLabels[timeframe]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Transaction channels
                    </label>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {transactionChannelValues.map((channel) => (
                        <ChoiceTile
                          key={channel}
                          label={transactionChannelLabels[channel]}
                          selected={intake.transactionChannels.includes(channel)}
                          onClick={() =>
                            updateIntake(
                              "transactionChannels",
                              toggleValue(intake.transactionChannels, channel),
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {intake.transactionChannels.includes("other") ? (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Describe the other transaction channel
                      </label>
                      <Input
                        value={intake.transactionChannelOtherText}
                        onChange={(event) =>
                          updateIntake("transactionChannelOtherText", event.target.value)
                        }
                        placeholder="Example: stored-value card loads"
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Section 3: Customer Context</CardTitle>
                  <CardDescription>
                    Capture both the customer profile and the customer data that helps anchor the narrative.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        New or existing client
                      </label>
                      <Select
                        value={intake.clientRelationship ?? undefined}
                        onValueChange={(value) =>
                          updateIntake(
                            "clientRelationship",
                            value as StrIntake["clientRelationship"],
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientRelationshipValues.map((relationship) => (
                            <SelectItem key={relationship} value={relationship}>
                              {clientRelationshipLabels[relationship]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Individual or entity
                      </label>
                      <Select
                        value={intake.customerType ?? undefined}
                        onValueChange={(value) =>
                          updateIntake("customerType", value as StrIntake["customerType"])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer type" />
                        </SelectTrigger>
                        <SelectContent>
                          {customerTypeValues.map((customerType) => (
                            <SelectItem key={customerType} value={customerType}>
                              {customerTypeLabels[customerType]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Country or jurisdiction
                    </label>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {jurisdictionValues.map((jurisdiction) => (
                        <ChoiceTile
                          key={jurisdiction}
                          label={jurisdictionLabels[jurisdiction]}
                          selected={intake.jurisdictions.includes(jurisdiction)}
                          onClick={() =>
                            updateIntake(
                              "jurisdictions",
                              toggleValue(intake.jurisdictions, jurisdiction),
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-border/70 bg-secondary/20 p-5">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-foreground">
                        Customer data
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        These fields are optional in the MVP, but they make the narrative significantly more usable.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-foreground">
                          Full name or legal name
                        </label>
                        <Input
                          value={intake.customerData.name}
                          onChange={(event) => updateCustomerData("name", event.target.value)}
                          placeholder="Example: Sample Customer Ltd."
                        />
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-foreground">
                          Internal reference or client ID
                        </label>
                        <Input
                          value={intake.customerData.referenceId}
                          onChange={(event) =>
                            updateCustomerData("referenceId", event.target.value)
                          }
                          placeholder="Example: AML-2049"
                        />
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-foreground">
                          DOB or incorporation date
                        </label>
                        <Input
                          value={intake.customerData.dateOfBirthOrIncorporation}
                          onChange={(event) =>
                            updateCustomerData(
                              "dateOfBirthOrIncorporation",
                              event.target.value,
                            )
                          }
                          placeholder="YYYY-MM-DD"
                        />
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-foreground">
                          Occupation or business activity
                        </label>
                        <Input
                          value={intake.customerData.occupationOrBusiness}
                          onChange={(event) =>
                            updateCustomerData(
                              "occupationOrBusiness",
                              event.target.value,
                            )
                          }
                          placeholder="Example: Import/export company"
                        />
                      </div>

                      <div className="grid gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                          Expected account activity or business profile
                        </label>
                        <Textarea
                          value={intake.customerData.expectedActivity}
                          onChange={(event) =>
                            updateCustomerData("expectedActivity", event.target.value)
                          }
                          rows={3}
                          placeholder="Example: Domestic payroll, vendor payments, and recurring professional-services revenue"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Section 4: Suspicion Indicators</CardTitle>
                  <CardDescription>
                    Select the reasons the activity appeared suspicious and add optional factual notes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    {suspicionIndicatorValues.map((indicator) => (
                      <ChoiceTile
                        key={indicator}
                        label={suspicionIndicatorLabels[indicator]}
                        selected={intake.suspicionIndicators.includes(indicator)}
                        onClick={() =>
                          updateIntake(
                            "suspicionIndicators",
                            toggleValue(intake.suspicionIndicators, indicator),
                          )
                        }
                      />
                    ))}
                  </div>

                  {intake.suspicionIndicators.includes("other") ? (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Describe the additional suspicion basis
                      </label>
                      <Input
                        value={intake.suspicionOtherText}
                        onChange={(event) =>
                          updateIntake("suspicionOtherText", event.target.value)
                        }
                        placeholder="Example: transaction purpose changed when questioned"
                      />
                    </div>
                  ) : null}

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Additional details (optional)
                    </label>
                    <Textarea
                      value={intake.freeTextNotes}
                      onChange={(event) => updateIntake("freeTextNotes", event.target.value)}
                      placeholder="Add concise factual notes that should carry through to the narrative."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-primary/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))] text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
                <CardHeader>
                  <CardTitle className="text-white">Intake Progress</CardTitle>
                  <CardDescription className="text-slate-300">
                    Structured fields only. The draft will be assembled from this intake.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>
                        {draft.readiness.completedFieldCount} of {draft.readiness.totalRequiredFields} required
                      </span>
                      <span>{draft.readiness.progressPercent}%</span>
                    </div>
                    <Progress
                      value={draft.readiness.progressPercent}
                      className="h-2.5 bg-white/10"
                    />
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm",
                      readinessMeta.className,
                    )}
                  >
                    <p className="font-semibold">{readinessMeta.label}</p>
                    <p className="mt-1 leading-6">{draft.readiness.summary}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                      Required gaps
                    </p>
                    {draft.missingFields.length === 0 ? (
                      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                        No critical gaps detected.
                      </div>
                    ) : (
                      draft.missingFields.map((field) => (
                        <div
                          key={field}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
                        >
                          {field}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                      To strengthen the draft
                    </p>
                    {draft.qualityWarnings.length === 0 ? (
                      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                        No input quality warnings detected.
                      </div>
                    ) : (
                      draft.qualityWarnings.map((warning) => (
                        <div
                          key={warning}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
                        >
                          {warning}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      className="w-full rounded-2xl"
                      size="lg"
                      onClick={reviewRiskSignals}
                      disabled={!draft.readiness.canReviewRiskSignals}
                    >
                      {readinessMeta.reviewButtonLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/10"
                      onClick={() => setView("landing")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Landing
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Presets</CardTitle>
                  <CardDescription>
                    Swap in a common fact pattern without leaving the flow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {strScenarioPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={cn(
                        "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                        intake.scenarioPresetId === preset.id
                          ? "border-primary/25 bg-primary/5"
                          : "border-border/70 bg-secondary/25 hover:border-primary/20 hover:bg-secondary/40",
                      )}
                    >
                      <p className="font-semibold text-foreground">{preset.name}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {preset.description}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {view === "review" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>Risk Signal Review</CardTitle>
                      <CardDescription>
                        Deterministic rules convert the intake into explainable STR red flags.
                      </CardDescription>
                    </div>
                    <Badge className={cn("px-4 py-2", levelMeta.className)}>
                      {levelMeta.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {draft.readiness.status !== "ready_to_draft" ? (
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-4 text-sm leading-6",
                        readinessMeta.className,
                      )}
                    >
                      {draft.readiness.summary}
                    </div>
                  ) : null}

                  {draft.redFlags.length === 0 ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
                      No rules fired from the current selections. Review the intake before
                      generating the narrative.
                    </div>
                  ) : (
                    draft.redFlags.map((flag) => (
                      <div
                        key={flag.id}
                        className="rounded-2xl border border-border/70 bg-secondary/40 px-5 py-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-foreground">{flag.label}</p>
                          <Badge variant="outline" className="bg-white">
                            weight {flag.weight}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {flag.sentence}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Drafting Positioning</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-950">
                    This is a drafting assistant. It reduces blank-page effort and organizes the
                    factual basis for suspicion.
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
                    It does not determine filing obligations, replace escalation procedures, or
                    act as an AML platform.
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <SummaryList
                title="Facts Provided"
                items={draft.factsProvided}
                emptyCopy="No fact summary is available yet."
              />

              <SummaryList
                title="Input Quality Notes"
                items={draft.qualityWarnings}
                emptyCopy="No input quality warnings were generated from the current intake."
                tone="alert"
              />

              <SummaryList
                title="Missing Info Prompts"
                items={draft.missingInfoPrompts}
                emptyCopy="No additional prompts were generated from the current intake."
                tone="alert"
              />

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Ready to Build</CardTitle>
                  <CardDescription>
                    The next step assembles the narrative in the order it will appear in the final draft.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm leading-6",
                      readinessMeta.className,
                    )}
                  >
                    {draft.readiness.canGenerate
                      ? "The intake is complete enough to assemble the STR draft."
                      : "Review the signals now, then return to intake to complete the required gaps before drafting."}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      className="rounded-2xl"
                      onClick={buildNarrativeDraft}
                      disabled={!draft.readiness.canGenerate}
                    >
                      Build Narrative Draft
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => setView("intake")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Intake
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {view === "narrative" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <div className="space-y-6">
              <Card className="border-border/70 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Narrative Builder</CardTitle>
                  <CardDescription>
                    The draft is assembled in the same order the final STR narrative will read.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      1. Subject description
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground">
                      {draft.narrativeSections.subjectDescription}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      2. Transaction summary
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground">
                      {draft.narrativeSections.transactionSummary}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      3. Suspicious indicators
                    </p>
                    <div className="mt-3 space-y-2">
                      {draft.narrativeSections.suspiciousIndicators.map((item) => (
                        <p key={item} className="text-sm leading-7 text-foreground">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      4. Basis for suspicion
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground">
                      {draft.narrativeSections.basisForSuspicion}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      5. Conclusion
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground">
                      {draft.narrativeSections.conclusion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <SummaryList
                title="Facts Provided"
                items={draft.factsProvided}
                emptyCopy="No fact summary is available yet."
              />

              <SummaryList
                title="Detected Red Flags"
                items={draft.redFlags.map((flag) => flag.label)}
                emptyCopy="No deterministic flags fired from the current selections."
              />

              <SummaryList
                title="Input Quality Notes"
                items={draft.qualityWarnings}
                emptyCopy="No input quality warnings were generated from the current intake."
                tone="alert"
              />

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Draft Package</CardTitle>
                  <CardDescription>
                    Move into the final editable output once the section assembly looks right.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-foreground">
                    Review the assembled sections now, then move into the final editable output.
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="rounded-2xl" onClick={goToOutput}>
                      Continue to Output
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => setView("review")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Risk Signals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {view === "output" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_360px]">
            <Card className="border-border/70 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <CardHeader className="border-b border-border/70 pb-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Editable STR Narrative</CardTitle>
                    <CardDescription>
                      Make final edits, then copy or download the draft.
                    </CardDescription>
                  </div>
                  <Badge className={cn("w-fit px-4 py-2", levelMeta.className)}>
                    {levelMeta.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  This narrative is a drafting aid. Final regulatory judgment and report
                  submission remain with the reporting entity.
                </div>

                <Textarea
                  value={narrativeText}
                  onChange={(event) => setNarrativeText(event.target.value)}
                  rows={24}
                  className="min-h-[560px] rounded-[24px] border-border/70 bg-[#fffdf8] p-5 font-mono text-sm leading-7"
                />

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-2xl" onClick={copyNarrative}>
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={downloadNarrative}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => setView("narrative")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Narrative
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <SummaryList
                title="Facts Provided"
                items={draft.factsProvided}
                emptyCopy="No fact summary is available yet."
              />

              <SummaryList
                title="Flags Summary"
                items={draft.redFlags.map((flag) => flag.label)}
                emptyCopy="No deterministic flags fired from the current selections."
              />

              <SummaryList
                title="Input Quality Notes"
                items={draft.qualityWarnings}
                emptyCopy="No input quality warnings were generated from the current intake."
                tone="alert"
              />

              <SummaryList
                title="Missing Info Prompts"
                items={draft.missingInfoPrompts}
                emptyCopy="No additional prompts were generated from the current intake."
                tone="alert"
              />

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Compliance Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {draft.checklist.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3 text-sm leading-6"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Next Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-foreground">
                    Review the draft, confirm your supporting records, and complete internal
                    escalation before any filing decision.
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl"
                    onClick={resetFlow}
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Restart New Scenario
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
