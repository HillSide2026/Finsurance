import type { FormEvent } from "react";
import { FolderOpen, Loader2, LogOut, ShieldCheck } from "lucide-react";
import type {
  AuthSessionSummary,
  DraftStatus,
  DraftSummary,
  UserSummary,
} from "@shared/workspace";
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
import { cn } from "@/lib/utils";

type AuthFormValues = {
  teamName: string;
  name: string;
  email: string;
  password: string;
};

type AuthMode = "register" | "login";

const draftStatusLabels: Record<DraftStatus, string> = {
  draft: "Draft",
  in_review: "In Review",
  ready_for_filing: "Ready for Filing",
  archived: "Archived",
};

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AuthCard({
  mode,
  form,
  onModeChange,
  onFieldChange,
  onSubmit,
  isSubmitting,
}: {
  mode: AuthMode;
  form: AuthFormValues;
  onModeChange: (mode: AuthMode) => void;
  onFieldChange: (key: keyof AuthFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}) {
  return (
    <Card
      id="auth-access"
      className="legal-home-card shadow-[0_18px_40px_rgba(31,51,37,0.06)]"
    >
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-2xl text-[#1B2118]">
              {mode === "register" ? "Create your account" : "Sign in"}
            </CardTitle>
            <CardDescription className="mt-2 max-w-xl text-sm leading-7 text-[#596255]">
              Create an account only when you want to save drafts, reopen them later, or export
              the finished STR.
            </CardDescription>
          </div>
          <div className="flex w-full items-center gap-2 rounded-full border border-[rgba(96,110,89,0.14)] bg-white/70 p-1 md:w-auto">
            <button
              type="button"
              onClick={() => onModeChange("register")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors md:flex-none",
                mode === "register" ? "bg-[#6F8B65] text-[#F7F1E4]" : "text-[#596255]",
              )}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => onModeChange("login")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors md:flex-none",
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
                Organization
              </label>
              <Input
                id="auth-team-name"
                value={form.teamName}
                onChange={(event) => onFieldChange("teamName", event.target.value)}
                placeholder="Your company or practice"
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
                Email
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
                Email
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
                ? "You can draft first. Create an account only when you are ready to save or export."
                : "Use the email and password you registered with."}
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

export function WorkspaceCard({
  session,
  drafts,
  reviewers: _reviewers,
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
  onOpenDraft: (draftId: string) => void | Promise<void>;
  onSignOut: () => void | Promise<void>;
  isLoading: boolean;
  showActions?: boolean;
}) {
  return (
    <Card className="border-border/70 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Saved drafts
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-primary">
              Your STR drafts
            </h2>
            <CardDescription className="max-w-2xl text-base leading-7">
              Signed in as {session.user.name}. Save drafts, reopen them, and continue where you
              left off.
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
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Saved drafts</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{drafts.length}</p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-secondary/35 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              In progress
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground">
              {
                drafts.filter(
                  (draft) => draft.status === "draft" || draft.status === "in_review",
                ).length
              }
            </p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-secondary/35 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Ready for filing
            </p>
            <p className="mt-3 text-3xl font-semibold text-foreground">
              {drafts.filter((draft) => draft.status === "ready_for_filing").length}
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
                onClick={() => void onOpenDraft(draft.id)}
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
                    Updated {formatTimestamp(draft.updatedAt)}
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
