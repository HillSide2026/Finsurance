import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Landmark,
  ScanSearch,
  Scale,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { siteConfig } from "@shared/site";
import { Button } from "@/components/ui/button";

type HomepageCard = {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  href?: string;
  cta?: string;
  external?: boolean;
};

const proofPoints = [
  "Built by Levine Law",
  "Designed for regulated fintech teams",
  "Product and counsel in one operating stack",
] as const;

const offerings: HomepageCard[] = [
  {
    eyebrow: "Live product",
    title: siteConfig.productName,
    body:
      "Generate structured suspicious transaction report drafts with guided intake, explainable risk signals, narrative assembly, and export-ready output.",
    icon: ScanSearch,
    href: siteConfig.links.finsure,
    cta: "Explore FinSure",
  },
  {
    eyebrow: "Operating design",
    title: "AML and compliance systems",
    body:
      "Translate legal obligations into workflows, templates, escalation paths, and operator-ready controls that a growing team can actually run.",
    icon: ShieldCheck,
  },
  {
    eyebrow: "Counsel partnership",
    title: "Legal strategy with delivery instincts",
    body:
      "Work with Levine Law on fintech launches, payments issues, documentation, and launch risk without keeping strategy trapped in static memos.",
    icon: Scale,
    href: siteConfig.links.levineLaw,
    cta: "Visit Levine Law",
    external: true,
  },
] as const;

const capabilityCards: HomepageCard[] = [
  {
    eyebrow: "Payments",
    title: "Money movement, counterparties, and launch readiness",
    body:
      "Support for payments products, MSB-facing questions, partner diligence, and commercial/legal friction before it turns into launch delay.",
    icon: Landmark,
  },
  {
    eyebrow: "Execution",
    title: "Productized legal operations",
    body:
      "Reusable tools, guided intake, and sharper internal execution across legal, compliance, and frontline teams.",
    icon: Workflow,
  },
  {
    eyebrow: "Alignment",
    title: "Controls that match how teams actually work",
    body:
      "Design around operators, not abstract checklists, so legal guidance survives first contact with growth, support, and compliance pressure.",
    icon: Building2,
  },
] as const;

const approachSteps = [
  {
    number: "01",
    title: "Map the real risk surface",
    body:
      "Start with how funds, users, and counterparties actually move through the product, not just how the policy set is labeled.",
  },
  {
    number: "02",
    title: "Design controls around operations",
    body:
      "Policies matter only if onboarding, review, escalation, and documentation can hold up under time pressure.",
  },
  {
    number: "03",
    title: "Ship usable outputs",
    body:
      "Templates, tools, and drafting systems give the team something durable to run instead of re-solving the same issue from scratch.",
  },
] as const;

function HomepageLink({
  item,
  className,
}: {
  item: HomepageCard;
  className?: string;
}) {
  if (!item.href || !item.cta) {
    return null;
  }

  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className={className}
    >
      {item.cta}
      {item.external ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </a>
  );
}

export default function SiteHome() {
  return (
    <div className="legal-home-shell min-h-screen px-4 py-6 text-[#F7F1E4] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="legal-home-panel rounded-[32px] border px-6 py-5 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <a href={siteConfig.links.home} className="flex items-center gap-4 text-[#F7F1E4]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold tracking-[0.16em]">
                FL
              </span>
              <div>
                <p className="text-lg font-semibold tracking-[0.02em]">{siteConfig.siteName}</p>
                <p className="legal-home-muted text-sm">
                  Counsel and productized compliance infrastructure
                </p>
              </div>
            </a>

            <nav className="flex flex-wrap items-center gap-5 text-sm text-[#D2DEE0]">
              <a href={siteConfig.links.offerings} className="transition-colors hover:text-[#A6BE98]">
                Offerings
              </a>
              <a href={siteConfig.links.approach} className="transition-colors hover:text-[#A6BE98]">
                Approach
              </a>
              <a href={siteConfig.links.contact} className="transition-colors hover:text-[#A6BE98]">
                Contact
              </a>
              <a href={siteConfig.links.finsure} className="transition-colors hover:text-[#A6BE98]">
                {siteConfig.productName}
              </a>
            </nav>
          </div>
        </header>

        <main className="space-y-8">
          <section className="legal-home-panel overflow-hidden rounded-[40px] border px-6 py-10 md:px-10 md:py-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_460px] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(197,155,71,0.28)] bg-[rgba(197,155,71,0.10)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#E6C989]">
                  Built by Levine Law
                </div>
                <div className="space-y-5">
                  <h1 className="max-w-4xl text-5xl leading-[0.92] text-[#F7F1E4] md:text-7xl">
                    Canadian Counsel for Global FinTech Teams
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[#D2DEE0] md:text-xl">
                    {siteConfig.siteName} combines counsel, compliance systems, and
                    productized tools for teams navigating AML, payments, and launch risk.
                    Start with {siteConfig.productName} for suspicious transaction drafting,
                    then build the rest of the operating stack around it.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-2xl px-8">
                    <a href={siteConfig.links.finsure}>
                      Explore FinSure
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-8 text-[#F7F1E4]"
                  >
                    <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                      Visit Levine Law
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {proofPoints.map((point) => (
                    <span
                      key={point}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#D2DEE0]"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-10 top-8 h-44 rounded-full bg-[radial-gradient(circle,_rgba(166,190,152,0.20),_transparent_68%)] blur-3xl" />
                <div className="legal-home-card relative rounded-[32px] border p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <ScanSearch className="h-6 w-6 text-[#A6BE98]" />
                    </div>
                    <span className="rounded-full border border-[rgba(197,155,71,0.28)] bg-[rgba(197,155,71,0.10)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#E6C989]">
                      Live now
                    </span>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-[#A6BE98]">
                        {siteConfig.productName}
                      </p>
                      <h2 className="mt-3 text-3xl text-[#F7F1E4]">
                        Faster suspicious transaction drafting without the blank-page problem.
                      </h2>
                    </div>
                    <p className="text-base leading-7 text-[#D2DEE0]">
                      Structured intake, deterministic red flags, editable narrative drafting,
                      and export-ready report packaging in a single flow.
                    </p>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E6C989]">
                        Delivery
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#D2DEE0]">
                        Guided intake, readiness scoring, narrative assembly, and package export.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E6C989]">
                        Context
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#D2DEE0]">
                        Designed for regulated teams working in Canadian AML and FINTRAC-adjacent contexts.
                      </p>
                    </div>
                  </div>
                  <HomepageLink
                    item={offerings[0]}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F7F1E4] transition-colors hover:text-[#A6BE98]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="offerings" className="grid gap-5 lg:grid-cols-3">
            {offerings.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="legal-home-card rounded-[30px] border p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icon className="h-5 w-5 text-[#A6BE98]" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                    {item.eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl text-[#F7F1E4]">{item.title}</h2>
                  <p className="mt-4 text-base leading-7 text-[#D2DEE0]">{item.body}</p>
                  <HomepageLink
                    item={item}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F7F1E4] transition-colors hover:text-[#A6BE98]"
                  />
                </article>
              );
            })}
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            {capabilityCards.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="legal-home-panel rounded-[28px] border p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-[#E6C989]" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A6BE98]">
                      {item.eyebrow}
                    </p>
                  </div>
                  <h2 className="mt-5 text-2xl text-[#F7F1E4]">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#D2DEE0]">{item.body}</p>
                </article>
              );
            })}
          </section>

          <section id="approach" className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="legal-home-panel rounded-[30px] border p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A6BE98]">
                Working model
              </p>
              <h2 className="mt-4 text-4xl text-[#F7F1E4]">
                Build legal and compliance systems people will actually use.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#D2DEE0]">
                The point is not just to produce advice. The point is to give the team durable
                structure they can execute with confidence.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {approachSteps.map((step) => (
                <article key={step.number} className="legal-home-card rounded-[28px] border p-6">
                  <p className="text-sm font-semibold tracking-[0.2em] text-[#E6C989]">
                    {step.number}
                  </p>
                  <h3 className="mt-4 text-2xl text-[#F7F1E4]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#D2DEE0]">{step.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="legal-home-panel rounded-[36px] border px-6 py-8 md:px-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A6BE98]">
                  Next step
                </p>
                <h2 className="mt-4 text-4xl text-[#F7F1E4]">
                  Start with the live product, then layer in the operating design behind it.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#D2DEE0]">
                  Open {siteConfig.productName} for the current drafting workflow, or reach out at{" "}
                  <a
                    href={`mailto:${siteConfig.supportEmail}`}
                    className="font-semibold text-[#F7F1E4] underline decoration-[rgba(247,241,228,0.28)] underline-offset-4"
                  >
                    {siteConfig.supportEmail}
                  </a>{" "}
                  if you want to discuss broader fintech legal and compliance infrastructure.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-2xl px-8">
                  <a href={siteConfig.links.finsure}>
                    Open FinSure
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 text-[#F7F1E4]"
                >
                  <a href={siteConfig.links.levineLaw} target="_blank" rel="noreferrer">
                    Visit Levine Law
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
