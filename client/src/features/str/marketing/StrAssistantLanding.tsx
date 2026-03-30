import type { FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  LogOut,
} from "lucide-react";
import type { AuthSessionSummary, DraftSummary, UserSummary } from "@shared/workspace";
import { siteConfig } from "@shared/site";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  strMarketingAuthorityPoints,
  strMarketingBenefits,
  strMarketingOutputItems,
  strMarketingPainPoints,
  strMarketingWorkflow,
} from "@/features/str/marketing/content";
import { AuthCard, WorkspaceCard } from "@/features/str/shared/WorkspaceAccessCards";

type AuthMode = "register" | "login";

type AuthFormValues = {
  teamName: string;
  name: string;
  email: string;
  password: string;
};

type LeadFormValues = {
  name: string;
  email: string;
  company: string;
};

function DesktopWorkflowMock() {
  return (
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
        <div className="mt-4 brand-workflow-button flex items-center justify-center">Continue</div>
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
          {strMarketingOutputItems.map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-[#F7F1E4]/86">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#6F8B65]" />
              {item}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="brand-workflow-button flex items-center justify-center">Copy</div>
            <div className="brand-workflow-field" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StrAssistantLanding({
  authSession,
  isAuthLoading,
  authMode,
  authForm,
  leadForm,
  drafts,
  reviewers,
  workspaceLoading,
  isAuthSubmitting,
  onOpenWorkflow,
  onRequestSignIn,
  onOpenWorkspace,
  onAuthModeChange,
  onAuthFieldChange,
  onAuthSubmit,
  onLeadFieldChange,
  onLeadSubmit,
  onBeginNewDraft,
  onOpenSavedDraft,
  onSignOut,
}: {
  authSession: AuthSessionSummary | null;
  isAuthLoading: boolean;
  authMode: AuthMode;
  authForm: AuthFormValues;
  leadForm: LeadFormValues;
  drafts: DraftSummary[];
  reviewers: UserSummary[];
  workspaceLoading: boolean;
  isAuthSubmitting: boolean;
  onOpenWorkflow: () => void;
  onRequestSignIn: () => void;
  onOpenWorkspace: () => void;
  onAuthModeChange: (mode: AuthMode) => void;
  onAuthFieldChange: (key: keyof AuthFormValues, value: string) => void;
  onAuthSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLeadFieldChange: (key: keyof LeadFormValues, value: string) => void;
  onLeadSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBeginNewDraft: () => void;
  onOpenSavedDraft: (draftId: string) => void | Promise<void>;
  onSignOut: () => void | Promise<void>;
}) {
  return (
    <div className="legal-home-shell min-h-screen px-4 py-6 text-[#1F241D] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="legal-home-panel rounded-[32px] border px-8 py-5 md:px-10">
          <div className="flex items-center justify-between gap-6">
            <a href={siteConfig.links.home} className="flex shrink-0 items-center">
              <img
                src="/fintechlawyer-logo-rectangle.png"
                alt="FintechLawyer.ca"
                className="h-12 w-auto rounded-[18px] shadow-[0_14px_28px_rgba(16,24,19,0.14)] md:h-14"
              />
            </a>

            <div className="flex items-center gap-6">
              <nav className="hidden items-center gap-6 text-sm font-medium text-[#525B50] lg:flex">
                <a href={siteConfig.links.product} className="transition-colors hover:text-[#E6C989]">
                  Product
                </a>
                <a
                  href={siteConfig.links.howItWorks}
                  className="transition-colors hover:text-[#E6C989]"
                >
                  How It Works
                </a>
                <a
                  href={siteConfig.links.socialProof}
                  className="transition-colors hover:text-[#E6C989]"
                >
                  Social Proof
                </a>
                <a
                  href={siteConfig.links.expertise}
                  className="transition-colors hover:text-[#E6C989]"
                >
                  Expertise
                </a>
              </nav>
              {authSession ? (
                <div className="flex items-center gap-3">
                  <Button
                    className="rounded-2xl bg-[#E6C989] px-6 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                    onClick={onOpenWorkspace}
                  >
                    Open saved drafts
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="rounded-2xl px-6" onClick={() => void onSignOut()}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  className="rounded-2xl bg-[#E6C989] px-6 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                  onClick={onRequestSignIn}
                >
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        <main id="start" className="space-y-8">
          <section className="grid gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
            <div className="space-y-6">
              <h1 className="text-5xl leading-[0.95] text-[#1B2118] md:text-7xl">
                Generate an STR draft faster
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[#596255] md:text-xl">
                FinSure guides you through structured inputs to build a Suspicious Transaction
                Report draft you can review, edit, save, and export.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                  onClick={onOpenWorkflow}
                >
                  {authSession ? "Start drafting" : "Start drafting now"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-[rgba(230,201,137,0.5)] bg-[rgba(230,201,137,0.08)] px-8 text-[#E6C989] hover:bg-[rgba(230,201,137,0.14)] hover:text-[#F4F2EC]"
                >
                  <a href={siteConfig.links.howItWorks}>See how it works</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-[rgba(230,201,137,0.5)] bg-[rgba(230,201,137,0.08)] px-8 text-[#E6C989] hover:bg-[rgba(230,201,137,0.14)] hover:text-[#F4F2EC]"
                >
                  <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                    Visit Levine Law
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              {!authSession ? (
                <p className="text-sm text-[#687164]">
                  No login required until you want to save or export.
                </p>
              ) : null}
            </div>

            <div className="hidden lg:block">
              <DesktopWorkflowMock />
            </div>
          </section>

          <section className="py-10">
            {isAuthLoading ? (
              <Card className="legal-home-card">
                <CardContent className="flex items-center gap-3 p-6 text-sm text-[#596255]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading account access...
                </CardContent>
              </Card>
            ) : authSession ? (
              <WorkspaceCard
                session={authSession}
                drafts={drafts}
                reviewers={reviewers}
                onStartNewDraft={onBeginNewDraft}
                onOpenDraft={onOpenSavedDraft}
                onSignOut={onSignOut}
                isLoading={workspaceLoading}
              />
            ) : (
              <AuthCard
                mode={authMode}
                form={authForm}
                onModeChange={onAuthModeChange}
                onFieldChange={onAuthFieldChange}
                onSubmit={onAuthSubmit}
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
                {strMarketingPainPoints.map((point) => (
                  <Card key={point} className="legal-home-card">
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
                  Meet FinSure — Guided STR Drafting
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {strMarketingBenefits.map((benefit) => (
                  <Card key={benefit} className="legal-home-card">
                    <CardContent className="p-6 text-lg leading-8 text-[#596255]">
                      {benefit}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                <Button
                  size="lg"
                  className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                  onClick={onOpenWorkflow}
                >
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
                {strMarketingWorkflow.map((item) => (
                  <Card key={item.title} className="legal-home-card">
                    <CardHeader className="pb-3">
                      <item.icon className="h-7 w-7 text-primary" />
                      <CardTitle className="mt-4 text-2xl leading-tight text-[#1F241D]">
                        {item.title}
                      </CardTitle>
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
                {strMarketingAuthorityPoints.map((item) => (
                  <Card key={item} className="legal-home-card">
                    <CardContent className="p-6 text-lg leading-8 text-[#596255]">
                      {item}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="levine-law" className="py-16">
            <Card className="legal-home-card">
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
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-[rgba(230,201,137,0.5)] bg-[rgba(230,201,137,0.08)] px-8 text-[#E6C989] hover:bg-[rgba(230,201,137,0.14)] hover:text-[#F4F2EC]"
                >
                  <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                    Visit Levine Law
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section id="pricing" className="py-16">
            <Card className="legal-home-card">
              <CardHeader className="space-y-3">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F8B65]">
                  Export first
                </div>
                <CardTitle className="text-3xl text-[#1B2118] md:text-4xl">
                  Preview the full STR before payment
                </CardTitle>
                <CardDescription className="max-w-3xl text-base leading-8 text-[#596255]">
                  FinSure shows the full draft before any payment prompt. Stripe Checkout only
                  appears when you decide to export the STR.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-3xl border border-[rgba(96,110,89,0.14)] bg-white/70 p-6 text-sm leading-7 text-[#596255]">
                  <p>
                    Generate the draft, review it in full, and only then choose whether to pay
                    for export.
                  </p>
                  <p className="mt-3">
                    Questions about the product or the payment flow can go through the form below.
                  </p>
                </div>
                <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                  <a href={siteConfig.links.earlyAccess}>Have a question first?</a>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section id="early-access" className="py-16">
            <Card className="legal-home-card">
              <CardHeader className="space-y-3">
                <CardTitle className="text-3xl text-[#1B2118] md:text-4xl">
                  Want product updates or a demo?
                </CardTitle>
                <CardDescription className="max-w-3xl text-base leading-8 text-[#596255]">
                  FinSure is live. If you want product updates, a demo, or help deciding whether
                  it fits your workflow, leave your details and we will follow up.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-5 md:grid-cols-2" onSubmit={onLeadSubmit}>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[#1F241D]" htmlFor="lead-name">
                      Name
                    </label>
                    <input
                      id="lead-name"
                      value={leadForm.name}
                      onChange={(event) => onLeadFieldChange("name", event.target.value)}
                      placeholder="Your name"
                      className="flex h-12 w-full rounded-xl border border-border/70 bg-white px-3 py-2 text-base text-[#1F241D] placeholder:text-[#7A8176] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[#1F241D]" htmlFor="lead-email">
                      Email
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={leadForm.email}
                      onChange={(event) => onLeadFieldChange("email", event.target.value)}
                      placeholder="you@company.com"
                      className="flex h-12 w-full rounded-xl border border-border/70 bg-white px-3 py-2 text-base text-[#1F241D] placeholder:text-[#7A8176] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-[#1F241D]" htmlFor="lead-company">
                      Company
                    </label>
                    <input
                      id="lead-company"
                      value={leadForm.company}
                      onChange={(event) => onLeadFieldChange("company", event.target.value)}
                      placeholder="Optional"
                      className="flex h-12 w-full rounded-xl border border-border/70 bg-white px-3 py-2 text-base text-[#1F241D] placeholder:text-[#7A8176] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
