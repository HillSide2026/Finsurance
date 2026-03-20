import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  FileStack,
  Hash,
  RefreshCcw,
  ScanSearch,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
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
    <Card className="border-border/70 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
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
            <Badge key={highlight} variant="outline" className="bg-white">
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

function CustomerSnapshot({
  customerData,
}: {
  customerData: StrCustomerData;
}) {
  const items = [
    customerData.name.trim().length > 0
      ? `Name or legal name: ${customerData.name.trim()}`
      : "",
    customerData.referenceId.trim().length > 0
      ? `Internal reference: ${customerData.referenceId.trim()}`
      : "",
    customerData.dateOfBirthOrIncorporation.trim().length > 0
      ? `DOB or incorporation: ${customerData.dateOfBirthOrIncorporation.trim()}`
      : "",
    customerData.occupationOrBusiness.trim().length > 0
      ? `Occupation or business: ${customerData.occupationOrBusiness.trim()}`
      : "",
    customerData.expectedActivity.trim().length > 0
      ? `Expected activity: ${customerData.expectedActivity.trim()}`
      : "",
  ].filter((item) => item.length > 0);

  return (
    <SummaryList
      title="Customer Data"
      items={items}
      emptyCopy="No customer data has been captured yet."
    />
  );
}

export default function StrAssistant() {
  const { toast } = useToast();
  const [view, setView] = useState<View>("landing");
  const [session, setSession] = useState<SessionMeta>(() => createSessionMeta());
  const [intake, setIntake] = useState<StrIntake>(() => createEmptyStrIntake());
  const [narrativeText, setNarrativeText] = useState("");

  const draft = buildStrDraft(intake);
  const selectedPreset = intake.scenarioPresetId
    ? strScenarioPresets.find((preset) => preset.id === intake.scenarioPresetId) ?? null
    : null;
  const levelMeta = levelCopy[draft.suspicionLevel];

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

  const reviewRiskSignals = () => {
    if (!draft.readiness.canGenerate) {
      toast({
        title: "Complete the intake first",
        description:
          "Finish the required structured fields before reviewing the risk signals.",
        variant: "destructive",
      });
      return;
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
                Finsurance
              </p>
              <h1 className="mt-3 text-4xl leading-tight text-primary md:text-6xl">
                Draft an STR in minutes.
              </h1>
            </div>
            <Badge className="w-fit border-amber-200 bg-amber-100 px-4 py-2 text-amber-950">
              Drafting assist only. Final reporting judgment stays with your team.
            </Badge>
          </header>

          <main className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1.2fr)_400px] lg:items-center">
            <div className="space-y-8">
              <div className="max-w-3xl space-y-5">
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  Convert a structured suspicious activity scenario into a FINTRAC-ready
                  suspicious transaction report narrative and review checklist in under
                  a minute.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="rounded-2xl px-8" onClick={startBlankFlow}>
                    Start Blank Intake
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
                    No login. No saved sessions. Deterministic drafting flow.
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
                    Preset scenarios and hardcoded red flags keep the reasoning explainable.
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                  <CardHeader className="pb-3">
                    <WalletCards className="h-8 w-8 text-primary" />
                    <CardTitle className="mt-4 text-xl">Customer Data Ready</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    Capture customer identity, reference, and expected activity to tighten the draft.
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

          <section className="space-y-5 border-t border-border/60 pt-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Scenario Presets
                </p>
                <h2 className="mt-2 text-2xl text-primary">
                  Start from common STR patterns
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Presets are editable starting points. They load a plausible suspicious-activity
                fact pattern, customer profile, and draft-ready transaction context.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {strScenarioPresets.map((preset) => (
                <PresetCard key={preset.id} preset={preset} onApply={applyPreset} />
              ))}
            </div>
          </section>
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
                Finsurance
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
              <CustomerSnapshot customerData={intake.customerData} />

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
                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="rounded-2xl" onClick={buildNarrativeDraft}>
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
              <CustomerSnapshot customerData={intake.customerData} />

              <SummaryList
                title="Detected Red Flags"
                items={draft.redFlags.map((flag) => flag.label)}
                emptyCopy="No deterministic flags fired from the current selections."
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
              <CustomerSnapshot customerData={intake.customerData} />

              <SummaryList
                title="Flags Summary"
                items={draft.redFlags.map((flag) => flag.label)}
                emptyCopy="No deterministic flags fired from the current selections."
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
