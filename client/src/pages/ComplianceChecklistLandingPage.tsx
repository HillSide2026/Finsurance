import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ComplianceChecklistQuestionnaire } from "@/features/capture/ComplianceChecklistQuestionnaire";
import { CapturePageShell } from "@/features/capture/CapturePageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const painPoints = [
  "Founders spend weeks guessing whether FINTRAC, MSB, or AML obligations apply.",
  "Legal spend rises fast when the team has not scoped the compliance problem clearly.",
  "Launch plans slip when compliance questions show up after the product is already built.",
] as const;

const outcomes = [
  "A structured checklist for your product model",
  "An early read on registration and AML program scope",
  "A cleaner path into pricing or the right human-led support option",
] as const;

function scrollToQuestionnaire() {
  document
    .getElementById("compliance-checklist-questionnaire")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ComplianceChecklistLandingPage() {
  return (
    <CapturePageShell
      action={
        <Button
          className="rounded-xl bg-[#E6C989] px-5 text-[#1F241D] shadow-[0_12px_24px_rgba(230,201,137,0.18)] hover:bg-[#dcbc6f]"
          onClick={scrollToQuestionnaire}
        >
          Complete your Checklist
        </Button>
      }
    >
      <section className="capture-funnel-hero rounded-[28px] border px-6 py-10 text-white md:px-9 md:py-12">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E6C989]">
            For fintech founders and crypto startups
          </p>
          <h1 className="max-w-3xl text-4xl leading-[0.94] text-white md:text-5xl">
            Automate your FINTRAC and KYC compliance with confidence
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#D6D2C6]">
            Complete your Checklist Now
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-xl bg-[#E6C989] px-7 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.18)] hover:bg-[#dcbc6f]"
              onClick={scrollToQuestionnaire}
            >
              Complete your Checklist
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <div className="capture-funnel-panel rounded-[24px] border px-6 py-6 md:px-7">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
              What this page is for
            </p>
            <h2 className="text-3xl text-[#1B2118]">Specific outcome</h2>
          </div>
        </div>

        <Card className="capture-funnel-card rounded-[24px]">
          <CardContent className="space-y-3 p-6 text-sm leading-7 text-[#596255] md:p-7">
            {outcomes.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[16px] border border-[rgba(96,110,89,0.14)] bg-white/78 px-4 py-3"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 text-[#6F8B65]" />
                <span>{item}</span>
              </div>
            ))}
            <div className="rounded-[16px] border border-[rgba(230,201,137,0.32)] bg-[rgba(230,201,137,0.12)] px-4 py-4 text-[#3E443A]">
              Primary CTA: <span className="font-semibold">Complete your Checklist</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="capture-funnel-panel rounded-[24px] border px-6 py-8 md:px-8">
        <div className="space-y-6">
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
              Why this exists
            </p>
            <h2 className="text-3xl text-[#1B2118] md:text-4xl">
              Confusion, legal cost, and launch delay are the problems this funnel should surface.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {painPoints.map((point) => (
              <Card key={point} className="capture-funnel-card rounded-[18px]">
                <CardContent className="p-5 text-base leading-8 text-[#596255]">{point}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="capture-funnel-panel rounded-[24px] border px-6 py-8 md:px-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
                What the funnel returns
              </p>
              <h2 className="text-3xl text-[#1B2118]">A short path from problem awareness to decision.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#596255]">
              The structure is intentionally tight so we can learn quickly whether founders will
              pay for the self-serve checklist before spending on traffic scale.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                title: "Step 1",
                body: "Answer a few structured questions about your business model, stage, and current need.",
              },
              {
                title: "Step 2",
                body: "See your indicative compliance requirements and whether the self-serve checklist is the right fit.",
              },
              {
                title: "Step 3",
                body: "Reach pricing and decide whether to reserve product access or request human-led support.",
              },
            ].map((item) => (
              <Card key={item.title} className="capture-funnel-card rounded-[18px]">
                <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-start md:gap-5">
                  <div className="min-w-[84px]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F8B65]">
                      {item.title}
                    </p>
                  </div>
                  <div className="border-l border-[rgba(42,53,46,0.12)] pl-4 text-sm leading-7 text-[#596255] md:flex-1">
                    {item.body}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {outcomes.map((item) => (
              <div
                key={item}
                className="rounded-[16px] border border-[rgba(42,53,46,0.1)] bg-[rgba(255,255,255,0.7)] px-4 py-4 text-sm leading-7 text-[#596255]"
              >
                <span className="font-semibold text-[#1F241D]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="capture-funnel-panel rounded-[24px] border px-6 py-8 md:px-8">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="space-y-2 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
              What happens next
            </p>
            <h2 className="text-3xl text-[#1B2118]">What the assessment is designed to do.</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Primary path",
                body: "Reach pricing, test willingness to pay, and reserve checklist access if the self-serve route fits.",
              },
              {
                title: "Secondary path",
                body: "If your answers point toward human-led support, we can route you into CAMLO, Compliance as a Service, or Levine Law follow-up.",
              },
              {
                title: "Strongest validation signal",
                body: "Payment attempt after pricing.",
              },
            ].map((item) => (
              <Card key={item.title} className="capture-funnel-card rounded-[18px]">
                <CardContent className="flex flex-col gap-2 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F8B65]">
                    {item.title}
                  </p>
                  <p className="text-sm leading-7 text-[#596255]">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="capture-funnel-panel rounded-[24px] border px-6 py-10 text-center md:px-8 md:py-12">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="text-3xl text-[#1B2118] md:text-4xl">
            Complete your compliance checklist
          </h2>
          <p className="text-lg leading-8 text-[#596255]">
            Answer four simple questions, review the indicative requirements, then choose your next
            step.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-xl bg-[#E6C989] px-7 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.18)] hover:bg-[#dcbc6f]"
              onClick={scrollToQuestionnaire}
            >
              Complete your Checklist
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <ComplianceChecklistQuestionnaire />
    </CapturePageShell>
  );
}
