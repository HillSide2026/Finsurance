import { ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@shared/site";
import { CapturePageShell } from "@/features/capture/CapturePageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function ComplianceChecklistLandingPage() {
  return (
    <CapturePageShell>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div className="legal-home-panel rounded-[32px] border px-6 py-12 md:px-10 md:py-14">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6F8B65]">
              For fintech founders and crypto startups
            </p>
            <h1 className="max-w-3xl text-4xl leading-[0.95] text-[#1B2118] md:text-6xl">
              Automate your FINTRAC and KYC compliance scoping before launch gets expensive.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#596255]">
              Generate a structured compliance checklist built for Canadian fintech operators so you
              can understand the requirements, see pricing, and decide whether self-serve or
              human-led support is the right next move.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
              >
                <a href={siteConfig.links.complianceChecklistStart}>
                  Generate your compliance checklist
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                <a href={siteConfig.links.home}>Back to main site</a>
              </Button>
            </div>
          </div>
        </div>

        <Card className="legal-home-card rounded-[28px]">
          <CardHeader className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6F8B65]">
              What this page is for
            </p>
            <CardTitle className="text-3xl text-[#1B2118]">Specific outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-[#596255]">
            {outcomes.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-[rgba(96,110,89,0.14)] bg-white/75 px-4 py-3"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 text-[#6F8B65]" />
                <span>{item}</span>
              </div>
            ))}
            <div className="rounded-2xl border border-[rgba(230,201,137,0.32)] bg-[rgba(230,201,137,0.12)] px-4 py-4 text-[#3E443A]">
              Primary CTA: <span className="font-semibold">Generate your compliance checklist</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="legal-home-panel rounded-[32px] border px-6 py-12 md:px-10 md:py-14">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6F8B65]">
              Why this exists
            </p>
            <h2 className="text-3xl text-[#1B2118] md:text-4xl">
              Confusion, legal cost, and launch delay are the problems this funnel should surface.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {painPoints.map((point) => (
              <Card key={point} className="legal-home-card rounded-[24px]">
                <CardContent className="p-6 text-base leading-8 text-[#596255]">{point}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="legal-home-panel-alt rounded-[32px] border px-6 py-12 md:px-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-3">
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
            <Card key={item.title} className="legal-home-card rounded-[24px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-[#1B2118]">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-[#596255]">{item.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </CapturePageShell>
  );
}
