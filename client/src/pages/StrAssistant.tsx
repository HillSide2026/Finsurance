import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  RefreshCcw,
  ScanSearch,
  ShieldAlert,
} from "lucide-react";
import {
  amountBandLabels,
  amountBandValues,
  buildStrDraft,
  clientRelationshipLabels,
  clientRelationshipValues,
  createEmptyStrIntake,
  currencyLabels,
  currencyValues,
  customerTypeLabels,
  customerTypeValues,
  jurisdictionLabels,
  jurisdictionValues,
  suspicionIndicatorLabels,
  suspicionIndicatorValues,
  timeframeLabels,
  timeframeValues,
  toggleValue,
  transactionCountLabels,
  transactionCountValues,
  triggerTypeLabels,
  triggerTypeValues,
  type StrIntake,
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

type View = "landing" | "intake" | "review" | "output";

const steps: Array<{ view: Exclude<View, "landing">; label: string }> = [
  { view: "intake", label: "Intake" },
  { view: "review", label: "Risk Signals" },
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

function Stepper({ currentView }: { currentView: Exclude<View, "landing"> }) {
  const activeIndex = steps.findIndex((step) => step.view === currentView);

  return (
    <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-3">
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

export default function StrAssistant() {
  const { toast } = useToast();
  const [view, setView] = useState<View>("landing");
  const [intake, setIntake] = useState<StrIntake>(() => createEmptyStrIntake());
  const [narrativeText, setNarrativeText] = useState("");

  const draft = buildStrDraft(intake);
  const levelMeta = levelCopy[draft.suspicionLevel];

  const updateIntake = <K extends keyof StrIntake>(key: K, value: StrIntake[K]) => {
    setIntake((current) => ({ ...current, [key]: value }));
  };

  const startFlow = () => {
    setView("intake");
  };

  const resetFlow = () => {
    setIntake(createEmptyStrIntake());
    setNarrativeText("");
    setView("landing");
  };

  const reviewRiskSignals = () => {
    if (!draft.readiness.canGenerate) {
      toast({
        title: "Complete the intake first",
        description: "Finish the required structured fields before reviewing the risk signals.",
        variant: "destructive",
      });
      return;
    }

    setView("review");
  };

  const generateNarrative = () => {
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
    setView("output");
  };

  const copyNarrative = async () => {
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
    const blob = new Blob([narrativeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fintrac-str-draft.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(185,112,29,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.12),_transparent_35%),linear-gradient(180deg,_#fbf8f1_0%,_#f2efe7_100%)] px-4 py-8 text-foreground sm:px-6 lg:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-between rounded-[36px] border border-white/60 bg-white/70 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.14)] backdrop-blur md:p-10">
          <header className="flex flex-col gap-4 border-b border-border/60 pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                STR Drafting Assistant
              </p>
              <h1 className="mt-3 text-4xl leading-tight text-primary md:text-6xl">
                Draft an STR in minutes.
              </h1>
            </div>
            <Badge className="w-fit border-amber-200 bg-amber-100 px-4 py-2 text-amber-950">
              Drafting assist only. Final reporting judgment stays with your team.
            </Badge>
          </header>

          <main className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1.25fr)_380px] lg:items-center">
            <div className="space-y-8">
              <div className="max-w-3xl space-y-5">
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  Convert a structured suspicious activity scenario into a FINTRAC-ready
                  suspicious transaction report narrative and review checklist in under
                  a minute.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="rounded-2xl px-8" onClick={startFlow}>
                    Start STR Triage
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
                    No login. No saved sessions. One clean drafting flow.
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                  <CardHeader className="pb-3">
                    <ScanSearch className="h-8 w-8 text-primary" />
                    <CardTitle className="mt-4 text-xl">Structured Intake</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    Controlled inputs keep the flow fast and reduce narrative drift.
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                  <CardHeader className="pb-3">
                    <ShieldAlert className="h-8 w-8 text-primary" />
                    <CardTitle className="mt-4 text-xl">Deterministic Signals</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    Hardcoded red flags and suspicion scoring create explainable output.
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                  <CardHeader className="pb-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <CardTitle className="mt-4 text-xl">Editable Draft</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    Generate the narrative, make final edits, then copy or download.
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-primary/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))] text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl text-white">What this tool is for</CardTitle>
                <CardDescription className="text-slate-300">
                  This is an STR drafting assistant, not a full compliance platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Converts a suspicious activity scenario into a structured narrative draft
                  and supporting checklist.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Keeps the operator focused on relevant facts instead of wrestling with a
                  blank page.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Leaves final regulatory judgment, escalation, and filing decisions with
                  the reporting entity.
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(185,112,29,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.10),_transparent_35%),linear-gradient(180deg,_#fbf8f1_0%,_#f2efe7_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              FINTRAC STR Triage
            </p>
            <h1 className="mt-2 text-3xl text-primary md:text-4xl">
              Structured suspicion in, usable narrative out.
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
        </header>

        <Stepper currentView={view} />

        {view === "intake" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
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
                    Keep this structured. The narrative template will use these fields directly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
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
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Section 3: Customer Context</CardTitle>
                  <CardDescription>
                    Capture the relationship and the jurisdictions connected to the activity.
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
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Section 4: Suspicion Indicators</CardTitle>
                  <CardDescription>
                    Select the reasons the activity appeared suspicious and add optional context.
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
                      onChange={(event) =>
                        updateIntake("freeTextNotes", event.target.value)
                      }
                      placeholder="Add any short factual notes that should appear in the narrative."
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
                    Structured fields only. The narrative will be assembled from these answers.
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
                      draft.readiness.canGenerate
                        ? "border-emerald-300 bg-emerald-100 text-emerald-950"
                        : "border-amber-300 bg-amber-100 text-amber-950",
                    )}
                  >
                    {draft.readiness.canGenerate
                      ? "The intake is complete enough to review the risk signals."
                      : "The intake still has required gaps before the draft can be generated."}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                      Missing info prompts
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

                  <div className="space-y-3 pt-2">
                    <Button
                      className="w-full rounded-2xl"
                      size="lg"
                      onClick={reviewRiskSignals}
                      disabled={!draft.readiness.canGenerate}
                    >
                      Review Risk Signals
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
            </div>
          </div>
        ) : null}

        {view === "review" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>Risk Signal Review</CardTitle>
                      <CardDescription>
                        Deterministic rules convert the intake into explainable red flags.
                      </CardDescription>
                    </div>
                    <Badge className={cn("px-4 py-2", levelMeta.className)}>
                      {levelMeta.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
              <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Ready to Build</CardTitle>
                  <CardDescription>
                    The next step assembles the subject description, transaction summary,
                    suspicious indicators, basis for suspicion, and conclusion.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <SummaryList
                    title="Missing info prompts"
                    items={draft.missingFields}
                    emptyCopy="No critical gaps detected from the structured intake."
                    tone="alert"
                  />

                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="rounded-2xl" onClick={generateNarrative}>
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
                    onClick={() => setView("review")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Risk Signals
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <SummaryList
                title="Flags Summary"
                items={draft.redFlags.map((flag) => flag.label)}
                emptyCopy="No deterministic flags fired from the current selections."
              />

              <SummaryList
                title="Missing Info Prompts"
                items={draft.missingFields}
                emptyCopy="No critical gaps detected from the current intake."
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
