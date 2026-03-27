import { useEffect, useState, type FormEvent } from "react";
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
  FolderOpen,
  Hash,
  Loader2,
  LogOut,
  RefreshCcw,
  ScanSearch,
  Save,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { CreateCheckoutSessionResponse } from "@shared/billing";
import { siteConfig } from "@shared/site";
import {
  draftStatusValues,
  type AuthSessionResponse,
  type AuthSessionSummary,
  type DraftListResponse,
  type DraftRecord,
  type DraftStatus,
  type DraftSummary,
  type LoginRequest,
  type ProductEnquiryResponse,
  type RegisterRequest,
  type SaveDraftRequest,
  type SaveDraftResponse,
  type UserSummary,
  type WorkflowStepView,
  type WorkspaceSessionMeta,
} from "@shared/workspace";
import { SiteFooter } from "@/components/SiteFooter";
import {
  amountBandLabels,
  amountBandValues,
  buildDraftPackageText,
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
import { ApiError, apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

type View = "landing" | "workspace" | "intake" | "review" | "narrative" | "output";
type SessionMeta = WorkspaceSessionMeta;

type LeadFormState = {
  name: string;
  email: string;
  company: string;
};

type AuthMode = "register" | "login";

type AuthFormState = {
  teamName: string;
  name: string;
  email: string;
  password: string;
};

const steps: Array<{ view: Exclude<View, "landing" | "workspace">; label: string }> = [
  { view: "intake", label: "Intake" },
  { view: "review", label: "Risk Signals" },
  { view: "narrative", label: "Narrative" },
  { view: "output", label: "Output" },
];

const draftStatusLabels: Record<DraftStatus, string> = {
  draft: "Draft",
  in_review: "In Review",
  ready_for_filing: "Ready for Filing",
  archived: "Archived",
};

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
  "Unclear requirements create legal exposure",
  "Inconsistent documentation fails audits",
] as const;

const homepageBenefits = [
  "Generate compliant STRs in under 60 seconds",
  "Structured inputs eliminate omissions and errors",
  "Consistent, audit-ready documentation every time",
  "Reduce reliance on manual processes and legal review delays",
] as const;

const homepageWorkflow = [
  {
    icon: ScanSearch,
    title: "Input transaction details through guided fields",
    body: "Start with structured intake instead of drafting from scratch.",
  },
  {
    icon: FileText,
    title: "FinSure structures a complete suspicious transaction report",
    body: "The workflow assembles the report from the fact pattern you provide.",
  },
  {
    icon: ShieldAlert,
    title: "Review and finalize with confidence",
    body: "Check the signals, narrative, and gaps before moving ahead.",
  },
  {
    icon: ArrowRight,
    title: "Export and submit immediately",
    body: "Move from structured intake to usable output without extra friction.",
  },
] as const;

const homepageAuthorityPoints = [
  "Developed by Levine Law",
  "Years of financial regulatory experience",
  "Built by legal experts behind fintech compliance",
] as const;

const homepageOutputItems = [
  "Guided transaction details",
  "Suspicion indicators",
  "Draft narrative",
  "Review-ready output",
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

function isWorkflowView(
  view: View,
): view is Exclude<View, "landing" | "workspace"> {
  return view === "intake" || view === "review" || view === "narrative" || view === "output";
}

function getDraftSaveView(view: View): WorkflowStepView {
  return isWorkflowView(view) ? view : "intake";
}

function scrollToElement(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return fallback;
}

function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

function AuthCard({
  mode,
  form,
  onModeChange,
  onFieldChange,
  onSubmit,
  isSubmitting,
}: {
  mode: AuthMode;
  form: AuthFormState;
  onModeChange: (mode: AuthMode) => void;
  onFieldChange: <K extends keyof AuthFormState>(
    key: K,
    value: AuthFormState[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}) {
  return (
    <Card
      id="auth-access"
      className="brand-site-card shadow-[0_18px_40px_rgba(31,51,37,0.06)]"
    >
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-[#1B2118]">
              {mode === "register" ? "Create your workspace" : "Sign in to your workspace"}
            </CardTitle>
            <CardDescription className="mt-2 max-w-xl text-sm leading-7 text-[#596255]">
              Save drafts, reopen active files, and keep review-ready STR work in one protected
              workspace.
            </CardDescription>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[rgba(96,110,89,0.14)] bg-white/70 p-1 md:flex">
            <button
              type="button"
              onClick={() => onModeChange("register")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                mode === "register" ? "bg-[#6F8B65] text-[#F7F1E4]" : "text-[#596255]",
              )}
            >
              Create workspace
            </button>
            <button
              type="button"
              onClick={() => onModeChange("login")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                mode === "login" ? "bg-[#6F8B65] text-[#F7F1E4]" : "text-[#596255]",
              )}
            >
              Sign in
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
          {mode === "register" ? (
            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm font-medium text-[#1F241D]" htmlFor="auth-team-name">
                Team name
              </label>
              <Input
                id="auth-team-name"
                value={form.teamName}
                onChange={(event) => onFieldChange("teamName", event.target.value)}
                placeholder="Levine Law AML Team"
                className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
              />
            </div>
          ) : null}
          {mode === "register" ? (
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#1F241D]" htmlFor="auth-name">
                Full name
              </label>
              <Input
                id="auth-name"
                value={form.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
                placeholder="Your name"
                className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
              />
            </div>
          ) : null}
          {mode === "register" ? (
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#1F241D]" htmlFor="auth-email">
                Workspace email
              </label>
              <Input
                id="auth-email"
                type="email"
                value={form.email}
                onChange={(event) => onFieldChange("email", event.target.value)}
                placeholder="you@company.com"
                className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
              />
            </div>
          ) : null}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[#1F241D]" htmlFor="auth-password">
              Password
            </label>
            <Input
              id="auth-password"
              type="password"
              value={form.password}
              onChange={(event) => onFieldChange("password", event.target.value)}
              placeholder="Minimum 8 characters"
              className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
            />
          </div>
          {mode === "login" ? (
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#1F241D]" htmlFor="auth-email-login">
                Workspace email
              </label>
              <Input
                id="auth-email-login"
                type="email"
                value={form.email}
                onChange={(event) => onFieldChange("email", event.target.value)}
                placeholder="you@company.com"
                className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
              />
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
            <p className="text-xs text-[#7A8176]">
              {mode === "register"
                ? "The first account becomes the workspace owner."
                : "Use the workspace email and password you registered with."}
            </p>
            <Button type="submit" size="lg" className="rounded-2xl px-8" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "register" ? "Create account" : "Sign in"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function WorkspaceCard({
  session,
  drafts,
  reviewers,
  onStartNewDraft,
  onOpenDraft,
  onSignOut,
  isLoading,
  showActions = true,
}: {
  session: AuthSessionSummary;
  drafts: DraftSummary[];
  reviewers: UserSummary[];
  onStartNewDraft: () => void;
  onOpenDraft: (draftId: string) => void;
  onSignOut: () => void;
  isLoading: boolean;
  showActions?: boolean;
}) {
  return (
    <Card className="border-border/70 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Saved Draft Workspace
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-primary">
              Your active STR files
            </h2>
            <CardDescription className="max-w-2xl text-base leading-7">
              Signed in as {session.user.name} at {session.team.name}. Save drafts, reopen them,
              and move files through review-ready states.
            </CardDescription>
          </div>
          {showActions ? (
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-2xl px-6" onClick={onStartNewDraft}>
                <ShieldCheck className="h-4 w-4" />
                New draft
              </Button>
              <Button variant="outline" className="rounded-2xl px-6" onClick={onSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-border/70 bg-secondary/35 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Open drafts</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{drafts.length}</p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-secondary/35 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Reviewers available
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{reviewers.length}</p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-secondary/35 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Workspace role
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground capitalize">
              {session.user.role}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-3 rounded-[24px] border border-border/70 bg-white p-5 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading saved drafts...
            </div>
          ) : drafts.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-border/70 bg-white p-6">
              <p className="text-lg font-semibold text-foreground">No drafts saved yet.</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Start a draft, save it once, and it will appear here with status and last-updated
                context.
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <button
                key={draft.id}
                type="button"
                onClick={() => onOpenDraft(draft.id)}
                className="flex w-full items-start justify-between gap-4 rounded-[24px] border border-border/70 bg-white p-5 text-left transition-colors hover:border-primary/20 hover:bg-secondary/35"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-foreground">{draft.title}</p>
                    <Badge className="border-primary/15 bg-primary/10 text-primary">
                      {draftStatusLabels[draft.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Updated {formatTimestamp(draft.updatedAt)} by {draft.createdByName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Readiness: {draft.readinessStatus.replace(/_/g, " ")}. Suspicion level:{" "}
                    {draft.suspicionLevel}.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/70 bg-secondary/35 px-4 py-2 text-sm font-medium text-foreground">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  Open
                </div>
              </button>
            ))
          )}
        </div>
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
  const [authSession, setAuthSession] = useState<AuthSessionSummary | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [authForm, setAuthForm] = useState<AuthFormState>({
    teamName: "",
    name: "",
    email: "",
    password: "",
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [reviewers, setReviewers] = useState<UserSummary[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftStatus, setDraftStatus] = useState<DraftStatus>("draft");
  const [assignedReviewerUserId, setAssignedReviewerUserId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const draft = buildStrDraft(intake);
  const selectedPreset = intake.scenarioPresetId
    ? strScenarioPresets.find((preset) => preset.id === intake.scenarioPresetId) ?? null
    : null;
  const levelMeta = levelCopy[draft.suspicionLevel];
  const readinessMeta = readinessCopy[draft.readiness.status];
  const fullDraftPackageText = buildDraftPackageText(draft, {
    productName: siteConfig.productName,
    sessionId: session.id,
    sessionTimestamp: session.timestamp,
    narrativeText,
  });

  useEffect(() => {
    let isMounted = true;

    const bootstrapWorkspace = async () => {
      try {
        const response = await apiRequest<AuthSessionResponse>("/api/auth/session");
        if (!isMounted) {
          return;
        }

        setAuthSession(response.session);

        if (response.session) {
          setView("workspace");
          await refreshWorkspace(response.session);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        toast({
          title: "Workspace unavailable",
          description: getApiErrorMessage(
            error,
            "The saved draft workspace could not be loaded right now.",
          ),
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    void bootstrapWorkspace();

    return () => {
      isMounted = false;
    };
  }, [toast]);

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

  const updateAuthForm = <K extends keyof AuthFormState>(
    key: K,
    value: AuthFormState[K],
  ) => {
    setAuthForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const refreshWorkspace = async (sessionOverride?: AuthSessionSummary) => {
    const currentSession = sessionOverride ?? authSession;
    if (!currentSession) {
      setDrafts([]);
      setReviewers([]);
      return;
    }

    setWorkspaceLoading(true);
    try {
      const response = await apiRequest<DraftListResponse>("/api/workspace");
      setDrafts(response.drafts);
      setReviewers(response.reviewers);
    } catch (error) {
      throw error;
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const beginNewDraft = () => {
    setSession(createSessionMeta());
    setIntake(createEmptyStrIntake());
    setNarrativeText("");
    setActiveDraftId(null);
    setDraftTitle("");
    setDraftStatus("draft");
    setAssignedReviewerUserId(null);
    setView("intake");
  };

  const openWorkflow = () => {
    if (!authSession) {
      setAuthMode("register");
      scrollToElement("auth-access");
      toast({
        title: "Create your workspace first",
        description: "Sign in or create an account to save drafts and access the drafting flow.",
      });
      return;
    }

    beginNewDraft();
  };

  const applyPreset = (presetId: string) => {
    if (!authSession) {
      setAuthMode("register");
      scrollToElement("auth-access");
      toast({
        title: "Create your workspace first",
        description: "Preset-driven drafting opens inside a protected workspace.",
      });
      return;
    }

    setSession(createSessionMeta());
    setIntake(createIntakeFromPreset(presetId));
    setNarrativeText("");
    setActiveDraftId(null);
    setDraftTitle("");
    setDraftStatus("draft");
    setAssignedReviewerUserId(null);
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
    setActiveDraftId(null);
    setDraftTitle("");
    setDraftStatus("draft");
    setAssignedReviewerUserId(null);
    setView(authSession ? "workspace" : "landing");
  };

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAuthSubmitting(true);
    try {
      let response: AuthSessionResponse;

      if (authMode === "register") {
        const payload: RegisterRequest = {
          teamName: authForm.teamName.trim(),
          name: authForm.name.trim(),
          email: authForm.email.trim(),
          password: authForm.password,
        };

        if (payload.teamName.length === 0 || payload.name.length === 0) {
          toast({
            title: "Add team and name",
            description: "Team name and full name are required to create the workspace.",
            variant: "destructive",
          });
          return;
        }

        if (!payload.email.includes("@") || payload.password.length < 8) {
          toast({
            title: "Complete the account details",
            description: "Use a valid email and a password with at least 8 characters.",
            variant: "destructive",
          });
          return;
        }

        response = await apiRequest<AuthSessionResponse>("/api/auth/register", {
          method: "POST",
          body: payload,
        });
      } else {
        const payload: LoginRequest = {
          email: authForm.email.trim(),
          password: authForm.password,
        };

        if (!payload.email.includes("@") || payload.password.length < 8) {
          toast({
            title: "Check your sign-in details",
            description: "Use the workspace email and password you registered with.",
            variant: "destructive",
          });
          return;
        }

        response = await apiRequest<AuthSessionResponse>("/api/auth/login", {
          method: "POST",
          body: payload,
        });
      }

      setAuthSession(response.session);
      setAuthForm((current) => ({
        ...current,
        password: "",
      }));

      if (response.session) {
        await refreshWorkspace(response.session);
      }

      setView("workspace");
      toast({
        title: authMode === "register" ? "Workspace created" : "Signed in",
        description:
          authMode === "register"
            ? "Your saved draft workspace is ready."
            : "Your saved draft workspace is now available.",
      });
    } catch (error) {
      toast({
        title: authMode === "register" ? "Registration failed" : "Sign-in failed",
        description: getApiErrorMessage(
          error,
          authMode === "register"
            ? "The workspace could not be created."
            : "The workspace could not be opened.",
        ),
        variant: "destructive",
      });
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await apiRequest<{ ok: true }>("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setAuthSession(null);
      setDrafts([]);
      setReviewers([]);
      setActiveDraftId(null);
      setDraftTitle("");
      setDraftStatus("draft");
      setAssignedReviewerUserId(null);
      setSession(createSessionMeta());
      setIntake(createEmptyStrIntake());
      setNarrativeText("");
      setView("landing");
    }
  };

  const openSavedDraft = async (draftId: string) => {
    try {
      const response = await apiRequest<{ ok: true; draft: DraftRecord }>(`/api/drafts/${draftId}`);
      setActiveDraftId(response.draft.id);
      setDraftTitle(response.draft.title);
      setDraftStatus(response.draft.status);
      setAssignedReviewerUserId(response.draft.assignedReviewerUserId);
      setSession(response.draft.sessionMeta);
      setIntake(response.draft.intake);
      setNarrativeText(response.draft.narrativeText);
      setView(response.draft.lastWorkflowView);
      toast({
        title: "Draft opened",
        description: "The saved draft is back in the workflow.",
      });
    } catch (error) {
      toast({
        title: "Draft unavailable",
        description: getApiErrorMessage(error, "The saved draft could not be opened."),
        variant: "destructive",
      });
    }
  };

  const saveCurrentDraft = async (options?: { status?: DraftStatus; silent?: boolean }) => {
    if (!authSession || !isWorkflowView(view)) {
      return;
    }

    setIsSavingDraft(true);
    try {
      const response = await apiRequest<SaveDraftResponse>("/api/drafts", {
        method: "POST",
        body: {
          draftId: activeDraftId ?? undefined,
          title: draftTitle,
          status: options?.status ?? draftStatus,
          assignedReviewerUserId,
          lastWorkflowView: getDraftSaveView(view),
          sessionMeta: session,
          intake,
          narrativeText,
        } satisfies SaveDraftRequest,
      });

      setActiveDraftId(response.draft.id);
      setDraftTitle(response.draft.title);
      setDraftStatus(response.draft.status);
      setAssignedReviewerUserId(response.draft.assignedReviewerUserId);
      await refreshWorkspace();

      if (!options?.silent) {
        toast({
          title: activeDraftId ? "Draft saved" : "Draft created",
          description: "The STR draft is now stored in your workspace.",
        });
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: getApiErrorMessage(error, "The draft could not be saved."),
        variant: "destructive",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const recordExport = async (format: "narrative" | "package") => {
    if (!authSession || !activeDraftId) {
      return;
    }

    try {
      await apiRequest<SaveDraftResponse>(`/api/drafts/${activeDraftId}/export`, {
        method: "POST",
        body: {
          format,
        },
      });
      await refreshWorkspace();
    } catch {
      // Export logging should not block the operator workflow.
    }
  };

  const requestEarlyAccess = async (event: FormEvent<HTMLFormElement>) => {
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
          "Name and email are enough for product updates or a walkthrough request. Company is optional.",
        variant: "destructive",
      });
      return;
    }

    if (!normalizedLead.email.includes("@")) {
      toast({
        title: "Use a valid email",
        description: "Enter a valid email address so the follow-up request is usable.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest<ProductEnquiryResponse>("/api/enquiries", {
        method: "POST",
        body: {
          ...normalizedLead,
          sourcePath: siteConfig.productPath,
        },
      });
      setLeadForm({
        name: "",
        email: "",
        company: "",
      });
      toast({
        title: "Request received",
        description: "Your walkthrough or rollout request has been saved.",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: getApiErrorMessage(error, "The request could not be saved right now."),
        variant: "destructive",
      });
    }
  };

  const startCheckout = async () => {
    setIsCheckoutLoading(true);

    try {
      const response = await apiRequest<CreateCheckoutSessionResponse>(
        "/api/billing/create-checkout-session",
        {
          method: "POST",
          body: {
            sourcePath: siteConfig.productPath,
          },
        },
      );

      if (!response.session.checkoutUrl) {
        throw new Error("Stripe Checkout did not return a redirect URL.");
      }

      window.location.assign(response.session.checkoutUrl);
    } catch (error) {
      toast({
        title: "Checkout unavailable",
        description: getApiErrorMessage(
          error,
          "Stripe Checkout could not be started right now.",
        ),
        variant: "destructive",
      });
      setIsCheckoutLoading(false);
    }
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
      await recordExport("narrative");
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

    downloadTextFile(`${session.id.toLowerCase()}-str-narrative.txt`, narrativeText);
    void recordExport("narrative");
  };

  const copyDraftPackage = async () => {
    if (fullDraftPackageText.trim().length === 0) {
      toast({
        title: "No package to copy",
        description: "Build the draft package before copying it.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(fullDraftPackageText);
      await recordExport("package");
      toast({
        title: "Draft package copied",
        description: "The full STR package is on your clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard access was not available in this browser context.",
        variant: "destructive",
      });
    }
  };

  const downloadDraftPackage = () => {
    if (fullDraftPackageText.trim().length === 0) {
      toast({
        title: "No package to download",
        description: "Build the draft package before downloading it.",
        variant: "destructive",
      });
      return;
    }

    downloadTextFile(`${session.id.toLowerCase()}-str-package.txt`, fullDraftPackageText);
    void recordExport("package");
  };

  if (view === "workspace" && authSession) {
    return (
      <div className="brand-site-shell min-h-screen px-4 py-8 text-[#1F241D] sm:px-6 lg:px-10">
        <div className="brand-site-frame mx-auto max-w-6xl rounded-[36px] border p-6 backdrop-blur md:p-10">
          <header className="flex flex-col gap-4 border-b border-[rgba(96,110,89,0.14)] pb-6 md:flex-row md:items-center md:justify-between">
            <a href={siteConfig.links.start} className="flex items-center gap-3 text-[#1F241D]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(96,110,89,0.14)] bg-white/70 text-sm font-semibold">
                FS
              </span>
              <span className="text-lg font-semibold tracking-[0.02em]">
                {siteConfig.productName}
              </span>
            </a>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="w-fit border-[rgba(96,110,89,0.14)] bg-white/70 px-4 py-2 text-[#1F241D]">
                {authSession.team.name}
              </Badge>
              <Button className="rounded-2xl px-6" onClick={beginNewDraft}>
                <ShieldCheck className="h-4 w-4" />
                New draft
              </Button>
              <Button variant="outline" className="rounded-2xl px-6" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </header>

          <main className="py-12">
            <WorkspaceCard
              session={authSession}
              drafts={drafts}
              reviewers={reviewers}
              onStartNewDraft={beginNewDraft}
              onOpenDraft={openSavedDraft}
              onSignOut={handleSignOut}
              isLoading={workspaceLoading}
              showActions={false}
            />
          </main>

          <SiteFooter />
        </div>
      </div>
    );
  }

  if (view === "landing") {
    return (
      <div className="brand-site-shell min-h-screen px-4 py-8 text-[#1F241D] sm:px-6 lg:px-10">
        <div className="brand-site-frame mx-auto max-w-6xl rounded-[36px] border p-6 backdrop-blur md:p-10">
          <header className="flex items-center justify-between border-b border-[rgba(96,110,89,0.14)] pb-6">
            <a href={siteConfig.links.start} className="flex items-center gap-3 text-[#1F241D]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(96,110,89,0.14)] bg-white/70 text-sm font-semibold">
                FS
              </span>
              <span className="text-lg font-semibold tracking-[0.02em]">
                {siteConfig.productName}
              </span>
            </a>

            <div className="flex items-center gap-6">
              <nav className="hidden items-center gap-6 text-sm text-[#525B50] lg:flex">
                <a href={siteConfig.links.product} className="transition-colors hover:text-[#6F8B65]">
                  Product
                </a>
                <a
                  href={siteConfig.links.howItWorks}
                  className="transition-colors hover:text-[#6F8B65]"
                >
                  How It Works
                </a>
                <a
                  href={siteConfig.links.socialProof}
                  className="transition-colors hover:text-[#6F8B65]"
                >
                  Social Proof
                </a>
                <a
                  href={siteConfig.links.expertise}
                  className="transition-colors hover:text-[#6F8B65]"
                >
                  Expertise
                </a>
                <a
                  href={siteConfig.links.pricing}
                  className="transition-colors hover:text-[#6F8B65]"
                >
                  Pricing
                </a>
              </nav>
              {authSession ? (
                <div className="flex items-center gap-3">
                  <Button className="rounded-2xl px-6" onClick={() => setView("workspace")}>
                    Open workspace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="rounded-2xl px-6" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button className="rounded-2xl px-6" onClick={() => scrollToElement("auth-access")}>
                  Access workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </header>

          <main id="start" className="space-y-0">
            <section className="grid gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
              <div className="space-y-6">
                <h1 className="text-5xl leading-[0.95] text-[#1B2118] md:text-7xl">
                  Audit-Ready, Always
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-[#596255] md:text-xl">
                  Generate compliant suspicious transaction reports in under 60 seconds.
                  FinSure guides your team through structured inputs to produce complete,
                  submission-ready reports with no ambiguity.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" className="rounded-2xl px-8" onClick={openWorkflow}>
                    {authSession ? "Start drafting" : "Create account to draft"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-8"
                  >
                    <a href={siteConfig.links.pricing}>Purchase access</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                    <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                      Visit Levine Law
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative h-[540px]">
                  <div className="brand-workflow-screen absolute left-0 top-10 w-[260px] rounded-[28px] p-5 text-white">
                    <div className="brand-workflow-topbar">
                      <div className="brand-workflow-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="brand-workflow-label">Intake</span>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div className="brand-workflow-field" />
                      <div className="brand-workflow-field" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="brand-workflow-field" />
                        <div className="brand-workflow-field" />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <span className="brand-workflow-chip">Trigger</span>
                        <span className="brand-workflow-chip">Amount</span>
                      </div>
                    </div>
                    <div className="mt-4 brand-workflow-button flex items-center justify-center">
                      Continue
                    </div>
                  </div>

                  <div className="brand-workflow-screen absolute right-8 top-0 w-[250px] rounded-[28px] p-5 text-white">
                    <div className="brand-workflow-topbar">
                      <div className="brand-workflow-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="brand-workflow-label">Risk Signals</span>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="brand-workflow-chip">Structuring</span>
                        <span className="brand-workflow-chip">Third party</span>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="brand-workflow-line w-[88%]" />
                        <div className="brand-workflow-line mt-3 w-[72%]" />
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="brand-workflow-line w-[82%]" />
                        <div className="brand-workflow-line mt-3 w-[66%]" />
                      </div>
                    </div>
                  </div>

                  <div className="brand-workflow-screen absolute bottom-0 left-12 w-[280px] rounded-[28px] p-5 text-white">
                    <div className="brand-workflow-topbar">
                      <div className="brand-workflow-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="brand-workflow-label">Narrative</span>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div className="brand-workflow-line w-[96%]" />
                      <div className="brand-workflow-line w-[92%]" />
                      <div className="brand-workflow-line w-[88%]" />
                      <div className="brand-workflow-line w-[80%]" />
                      <div className="brand-workflow-line w-[90%]" />
                    </div>
                  </div>

                  <div className="brand-workflow-screen absolute bottom-14 right-0 w-[240px] rounded-[28px] p-5 text-white">
                    <div className="brand-workflow-topbar">
                      <div className="brand-workflow-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="brand-workflow-label">Output</span>
                    </div>
                    <div className="mt-5 space-y-3">
                      {homepageOutputItems.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-[#F7F1E4]/86">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#6F8B65]" />
                          {item}
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="brand-workflow-button flex items-center justify-center">
                          Copy
                        </div>
                        <div className="brand-workflow-field" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-10">
              {isAuthLoading ? (
                <Card className="brand-site-card">
                  <CardContent className="flex items-center gap-3 p-6 text-sm text-[#596255]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading workspace availability...
                  </CardContent>
                </Card>
              ) : authSession ? (
                <WorkspaceCard
                  session={authSession}
                  drafts={drafts}
                  reviewers={reviewers}
                  onStartNewDraft={beginNewDraft}
                  onOpenDraft={openSavedDraft}
                  onSignOut={handleSignOut}
                  isLoading={workspaceLoading}
                />
              ) : (
                <AuthCard
                  mode={authMode}
                  form={authForm}
                  onModeChange={setAuthMode}
                  onFieldChange={updateAuthForm}
                  onSubmit={handleAuthSubmit}
                  isSubmitting={isAuthSubmitting}
                />
              )}
            </section>

            <section id="problem" className="py-16">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl text-[#1B2118] md:text-4xl">
                    The Hidden Risk in Every Suspicious Transaction Report
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {homepagePainPoints.map((point) => (
                    <Card key={point} className="brand-site-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-2xl leading-tight text-[#1F241D]">{point}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                <p className="text-lg font-semibold text-[#6F8B65]">FinSure changes that.</p>
              </div>
            </section>

            <section id="product" className="py-16">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl text-[#1B2118] md:text-4xl">
                    Meet FinSure — Instant Suspicious Transaction Reporting
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {homepageBenefits.map((benefit) => (
                    <Card key={benefit} className="brand-site-card">
                      <CardContent className="p-6 text-lg leading-8 text-[#596255]">
                        {benefit}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div>
                  <Button size="lg" className="rounded-2xl px-8" onClick={openWorkflow}>
                    Start drafting
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            <section id="how-it-works" className="py-16">
              <div className="space-y-6">
                <h2 className="text-3xl text-[#1B2118] md:text-4xl">How It Works</h2>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {homepageWorkflow.map((item) => (
                    <Card key={item.title} className="brand-site-card">
                      <CardHeader className="pb-3">
                        <item.icon className="h-7 w-7 text-primary" />
                        <CardTitle className="mt-4 text-2xl leading-tight text-[#1F241D]">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm leading-6 text-[#596255]">
                        {item.body}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section id="social-proof" className="py-16">
              <div className="space-y-6">
                <h2 className="text-3xl text-[#1B2118] md:text-4xl">
                  Built by Legal Experts Behind Fintech Compliance
                </h2>
                <div className="grid gap-5 md:grid-cols-3">
                  {homepageAuthorityPoints.map((item) => (
                    <Card key={item} className="brand-site-card">
                      <CardContent className="p-6 text-lg leading-8 text-[#596255]">
                        {item}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section id="levine-law" className="py-16">
              <Card className="brand-site-card">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-3xl text-[#1B2118] md:text-4xl">
                    Powered by Real Legal Expertise
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 text-[#596255]">
                    FinSure is built and backed by Levine Law — a firm specializing in fintech,
                    financial regulation, and compliance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                    <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                      Visit Levine Law
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section id="pricing" className="py-16">
              <Card className="brand-site-card">
                <CardHeader className="space-y-3">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F8B65]">
                    Secure Checkout
                  </div>
                  <CardTitle className="text-3xl text-[#1B2118] md:text-4xl">
                    Purchase FinSure access in Stripe
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 text-[#596255]">
                    Stripe Checkout handles the hosted payment flow. If you are already signed in,
                    the checkout session will reuse your workspace email so the payment can be
                    matched back to your team faster.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-3xl border border-[rgba(96,110,89,0.14)] bg-white/70 p-6 text-sm leading-7 text-[#596255]">
                    <p>
                      You will be redirected to Stripe to complete payment, then returned to
                      FinSure on confirmation.
                    </p>
                    <p className="mt-3">
                      Team rollout questions or custom onboarding still go through the update form
                      below.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="rounded-2xl px-8"
                      onClick={startCheckout}
                      disabled={isCheckoutLoading}
                    >
                      {isCheckoutLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Redirecting to Stripe
                        </>
                      ) : (
                        <>
                          Continue to payment
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                      <a href={siteConfig.links.earlyAccess}>Need a walkthrough first?</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="early-access" className="py-16">
              <Card className="brand-site-card">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-3xl text-[#1B2118] md:text-4xl">
                    Need rollout updates or a team walkthrough?
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 text-[#596255]">
                    FinSure is usable now. If you want product updates, rollout coordination, or a
                    team introduction, leave your details and we will follow up.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-5 md:grid-cols-2" onSubmit={requestEarlyAccess}>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-[#1F241D]" htmlFor="lead-name">
                        Name
                      </label>
                      <Input
                        id="lead-name"
                        value={leadForm.name}
                        onChange={(event) => updateLeadForm("name", event.target.value)}
                        placeholder="Your name"
                        className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-[#1F241D]" htmlFor="lead-email">
                        Email
                      </label>
                      <Input
                        id="lead-email"
                        type="email"
                        value={leadForm.email}
                        onChange={(event) => updateLeadForm("email", event.target.value)}
                        placeholder="you@company.com"
                        className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
                      />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <label
                        className="text-sm font-medium text-[#1F241D]"
                        htmlFor="lead-company"
                      >
                        Company
                      </label>
                      <Input
                        id="lead-company"
                        value={leadForm.company}
                        onChange={(event) => updateLeadForm("company", event.target.value)}
                        placeholder="Optional"
                        className="h-12 rounded-xl border-border/70 bg-white text-[#1F241D] placeholder:text-[#7A8176]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" size="lg" className="rounded-2xl px-8">
                        Request updates
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>
          </main>

          <SiteFooter />
        </div>
      </div>
    );
  }

  const s1Incomplete =
    intake.triggerTypes.length === 0 ||
    (intake.triggerTypes.includes("other") && !intake.triggerOtherText.trim());
  const s2Incomplete =
    intake.amountBand === null ||
    intake.currency === null ||
    (intake.currency === "other" && !intake.currencyOtherText.trim()) ||
    intake.transactionCount === null ||
    intake.timeframe === null ||
    intake.transactionChannels.length === 0 ||
    (intake.transactionChannels.includes("other") && !intake.transactionChannelOtherText.trim());
  const s3Incomplete =
    intake.clientRelationship === null ||
    intake.customerType === null ||
    intake.jurisdictions.length === 0;
  const s4Incomplete =
    intake.suspicionIndicators.length === 0 ||
    (intake.suspicionIndicators.includes("other") && !intake.suspicionOtherText.trim());
  const incompleteCard = "border-amber-300 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]";
  const completeCard = "border-border/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(185,112,29,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.10),_transparent_35%),linear-gradient(180deg,_#fbf8f1_0%,_#f2efe7_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                {siteConfig.productName}
              </p>
              <h1 className="mt-2 text-3xl text-primary md:text-4xl">
                FINTRAC STR triage in a one-minute drafting flow.
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {activeDraftId
                  ? `Saved draft: ${draftTitle || "Untitled draft"}`
                  : "This draft is still unsaved until you create it in the workspace."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-2xl" onClick={() => setView("workspace")}>
                <FolderOpen className="h-4 w-4" />
                Workspace
              </Button>
              <Button
                className="rounded-2xl"
                onClick={() => void saveCurrentDraft()}
                disabled={isSavingDraft}
              >
                {isSavingDraft ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {activeDraftId ? "Save draft" : "Create draft"}
              </Button>
              <Button variant="outline" className="rounded-2xl" onClick={resetFlow}>
                <RefreshCcw className="h-4 w-4" />
                Restart
              </Button>
              <Badge className="w-fit border-primary/15 bg-primary/10 px-4 py-2 text-primary">
                {draftStatusLabels[draftStatus]}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground" htmlFor="draft-title">
                Draft title
              </label>
              <Input
                id="draft-title"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="Example: Cash structuring review for new client"
                className="h-11 rounded-2xl border-border/70 bg-white"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select
                value={draftStatus}
                onValueChange={(value) => setDraftStatus(value as DraftStatus)}
              >
                <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {draftStatusValues.map((status) => (
                    <SelectItem key={status} value={status}>
                      {draftStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Reviewer</label>
              <Select
                value={assignedReviewerUserId ?? "unassigned"}
                onValueChange={(value) =>
                  setAssignedReviewerUserId(value === "unassigned" ? null : value)
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-border/70 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {reviewers.map((reviewer) => (
                    <SelectItem key={reviewer.id} value={reviewer.id}>
                      {reviewer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Card className={s1Incomplete ? incompleteCard : completeCard}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>Section 1: Event Type</CardTitle>
                      <CardDescription>
                        Choose what triggered concern. Multiple triggers are allowed.
                      </CardDescription>
                    </div>
                    {s1Incomplete && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        Required
                      </span>
                    )}
                  </div>
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

              <Card className={s2Incomplete ? incompleteCard : completeCard}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>Section 2: Transaction Pattern</CardTitle>
                      <CardDescription>
                        Capture the scale, pace, and channels used in the activity.
                      </CardDescription>
                    </div>
                    {s2Incomplete && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        Required
                      </span>
                    )}
                  </div>
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

              <Card className={s3Incomplete ? incompleteCard : completeCard}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>Section 3: Customer Context</CardTitle>
                      <CardDescription>
                        Capture both the customer profile and the customer data that helps anchor the narrative.
                      </CardDescription>
                    </div>
                    {s3Incomplete && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        Required
                      </span>
                    )}
                  </div>
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

              <Card className={s4Incomplete ? incompleteCard : completeCard}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>Section 4: Suspicion Indicators</CardTitle>
                      <CardDescription>
                        Select the reasons the activity appeared suspicious and add optional factual notes.
                      </CardDescription>
                    </div>
                    {s4Incomplete && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        Required
                      </span>
                    )}
                  </div>
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
              <Card className="border-border/70 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle>Intake Progress</CardTitle>
                  <CardDescription>
                    Structured fields only. The draft will be assembled from this intake.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {draft.readiness.completedFieldCount} of {draft.readiness.totalRequiredFields} required
                      </span>
                      <span>{draft.readiness.progressPercent}%</span>
                    </div>
                    <Progress
                      value={draft.readiness.progressPercent}
                      className="h-2.5 bg-secondary/40"
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
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Required gaps
                    </p>
                    {draft.missingFields.length === 0 ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
                        No critical gaps detected.
                      </div>
                    ) : (
                      draft.missingFields.map((field) => (
                        <div
                          key={field}
                          className="rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3 text-sm text-foreground"
                        >
                          {field}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      To strengthen the draft
                    </p>
                    {draft.qualityWarnings.length === 0 ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
                        No input quality warnings detected.
                      </div>
                    ) : (
                      draft.qualityWarnings.map((warning) => (
                        <div
                          key={warning}
                          className="rounded-2xl border border-border/70 bg-secondary/40 px-4 py-3 text-sm text-foreground"
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
                      className="w-full rounded-2xl"
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
                    <CardTitle>STR Draft Package</CardTitle>
                    <CardDescription>
                      Review the package context, then export the full work product or the
                      narrative only.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn("w-fit px-4 py-2", readinessMeta.className)}>
                      {readinessMeta.label}
                    </Badge>
                    <Badge className={cn("w-fit px-4 py-2", levelMeta.className)}>
                      {levelMeta.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Session
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{session.id}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Opened
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatTimestamp(session.timestamp)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-secondary/30 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Package contents
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Facts, red flags, narrative, follow-up, checklist
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  This narrative is a drafting aid. Final regulatory judgment and report
                  submission remain with the reporting entity.
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-2xl" onClick={copyDraftPackage}>
                    <Copy className="h-4 w-4" />
                    Copy Full Package
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={downloadDraftPackage}
                  >
                    <Download className="h-4 w-4" />
                    Download Full Package
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={copyNarrative}>
                    <Copy className="h-4 w-4" />
                    Copy Narrative Only
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={downloadNarrative}
                  >
                    <Download className="h-4 w-4" />
                    Download Narrative Only
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

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Editable narrative</p>
                    <p className="text-sm text-muted-foreground">
                      Any edits made here are included in the full draft package export.
                    </p>
                  </div>

                <Textarea
                  value={narrativeText}
                  onChange={(event) => setNarrativeText(event.target.value)}
                  rows={24}
                  className="min-h-[560px] rounded-[24px] border-border/70 bg-[#fffdf8] p-5 font-mono text-sm leading-7"
                />
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

        <SiteFooter />
      </div>
    </div>
  );
}
