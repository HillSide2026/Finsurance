import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  ScanSearch,
} from "lucide-react";
import { siteConfig } from "@shared/site";
import { Button } from "@/components/ui/button";

type UseCaseCard = {
  title: string;
  bullets: readonly string[];
  href: string;
};

type PlatformPillar = {
  number: string;
  title: string;
  body: string;
  bullets: readonly string[];
  href: string;
  cta: string;
};

type FeaturedItem = {
  eyebrow: string;
  title: string;
  body: string;
};

type ValidationCard = {
  role: string;
  quote: string;
  tag: string;
};

const proofPoints = [
  "Built by Levine Law",
  "Designed for regulated fintech teams",
  "Counsel, compliance, and tools in one platform",
] as const;

function buildUseCaseHref(slug: string): string {
  return `${siteConfig.links.home}?use_case=${slug}#contact`;
}

const useCaseCards: UseCaseCard[] = [
  {
    title: "Payments & Money Services Businesses",
    bullets: [
      "FINTRAC registration and MSB structuring",
      "AML program design and implementation",
      "Cross-border payment flow analysis",
    ],
    href: buildUseCaseHref("payments-msbs"),
  },
  {
    title: "Crypto & Virtual Currency Platforms",
    bullets: [
      "MSB / foreign MSB positioning",
      "Wallet, custody, and exchange classification",
      "Ongoing AML and reporting obligations",
    ],
    href: buildUseCaseHref("crypto-virtual-currency"),
  },
  {
    title: "AML & Compliance Operations",
    bullets: [
      "Suspicious transaction reporting workflows",
      "Internal risk scoring and monitoring design",
      "Audit readiness and documentation structure",
    ],
    href: buildUseCaseHref("aml-compliance-operations"),
  },
  {
    title: "Product & Infrastructure Teams",
    bullets: [
      "Payment flow and ledger structuring",
      "Regulatory exposure mapping (RPAA / PCMLTFA)",
      "API and platform liability positioning",
    ],
    href: buildUseCaseHref("product-infrastructure-teams"),
  },
  {
    title: "Platform Structuring & Partnerships",
    bullets: [
      "White-label and programme manager models",
      "Allocation of compliance responsibilities",
      "Third-party provider and bank integrations",
    ],
    href: buildUseCaseHref("platform-structuring-partnerships"),
  },
  {
    title: "Regulatory Issues & Remediation",
    bullets: [
      "FINTRAC inquiries and examination support",
      "Delisting or registration gaps",
      "AML deficiencies and corrective action plans",
    ],
    href: buildUseCaseHref("regulatory-issues-remediation"),
  },
] as const;

const platformPillars: PlatformPillar[] = [
  {
    number: "01",
    title: "Legal Information",
    body:
      "Plain-language explanations and structured materials covering Canadian fintech, AML, and payments regulation.",
    bullets: [
      "FINTRAC, MSB, and AML frameworks",
      "Regulatory scope and classification issues",
      "Practical interpretations of rules and obligations",
    ],
    href: `${siteConfig.links.home}?topic=legal-information#contact`,
    cta: "Browse articles",
  },
  {
    number: "02",
    title: "Infrastructure",
    body:
      "Operational guidance and system-level frameworks for implementing compliance and regulatory workflows.",
    bullets: [
      "AML workflow design",
      "Reporting and documentation structures",
      "Implementation patterns and system design",
    ],
    href: `${siteConfig.links.home}?topic=infrastructure#contact`,
    cta: "View resources",
  },
  {
    number: "03",
    title: "Tools",
    body:
      "Productized interfaces designed to support specific compliance tasks and reduce operational friction.",
    bullets: [
      "Guided drafting workflows",
      "Structured compliance inputs",
      "Repeatable, export-ready outputs",
    ],
    href: siteConfig.links.finsure,
    cta: "Explore tools",
  },
] as const;

const featuredToolItems: FeaturedItem[] = [
  {
    eyebrow: "Structured intake",
    title: "Collect relevant facts in a guided sequence instead of starting from a blank page.",
    body: "",
  },
  {
    eyebrow: "Deterministic red flags",
    title: "Surface report-relevant indicators in a consistent, repeatable way.",
    body: "",
  },
  {
    eyebrow: "Editable narrative assembly",
    title: "Build working report language that can be reviewed, refined, and finalized.",
    body: "",
  },
  {
    eyebrow: "Export-ready workflow",
    title: "Support downstream packaging, review, and reporting processes.",
    body: "",
  },
] as const;

const validationCards: ValidationCard[] = [
  {
    role: "Compliance Lead — Payments Company",
    quote:
      "Structured drafting removed the need to start from a blank page. The workflow is consistent and easy to review.",
    tag: "Payments / AML",
  },
  {
    role: "Operations — Crypto Platform",
    quote:
      "Helps standardize how we approach reporting and documentation across the team.",
    tag: "Crypto / MSB",
  },
  {
    role: "Risk & Compliance — FinTech",
    quote: "Clear inputs, predictable outputs, and easier internal review.",
    tag: "FinTech / AML",
  },
] as const;

const validationTags = ["Payments", "Crypto", "MSB", "Compliance Teams"] as const;

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

function FinsureDevicePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[380px] lg:mx-0 lg:justify-self-end">
      <div className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989] lg:text-left">
        FinSure Interface
      </div>
      <div className="absolute inset-x-8 top-14 h-48 rounded-full bg-[radial-gradient(circle,_rgba(111,139,101,0.22),_transparent_68%)] blur-3xl" />
      <div className="legal-home-device-frame relative rounded-[42px] p-3 lg:hover:-translate-y-1">
        <div className="flex justify-center pb-3 pt-1">
          <div className="h-1.5 w-20 rounded-full bg-white/12" />
        </div>
        <div className="legal-home-device-screen rounded-[32px] p-5 pb-6">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-[rgba(197,155,71,0.28)] bg-[rgba(197,155,71,0.10)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E6C989]">
              Live now
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <ScanSearch className="h-4 w-4 text-[#6F8B65]" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6F8B65]">
              {siteConfig.productName}
            </p>
            <h2 className="text-3xl leading-tight text-[#F7F1E4]">
              Faster suspicious transaction drafting without the blank-page problem.
            </h2>
            <p className="text-sm leading-7 text-[#D2DEE0]">
              Structured intake, deterministic red flags, editable narrative drafting, and
              export-ready report packaging in a single flow.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="legal-home-device-card rounded-[22px] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E6C989]">
                Delivery
              </p>
              <p className="mt-2 text-sm leading-6 text-[#D2DEE0]">
                Guided intake, readiness scoring, narrative assembly, and package export.
              </p>
            </div>
            <div className="legal-home-device-card rounded-[22px] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E6C989]">
                Context
              </p>
              <p className="mt-2 text-sm leading-6 text-[#D2DEE0]">
                Designed for regulated teams working in Canadian AML and FINTRAC-adjacent
                contexts.
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-[#D2DEE0] lg:text-left">
        One of the tools available on FintechLawyer.ca.
      </p>
    </div>
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
              <a href={siteConfig.links.offerings} className="transition-colors hover:text-[#6F8B65]">
                Offerings
              </a>
              <a href={siteConfig.links.approach} className="transition-colors hover:text-[#6F8B65]">
                Approach
              </a>
              <a href={siteConfig.links.contact} className="transition-colors hover:text-[#6F8B65]">
                Contact
              </a>
              <a href={siteConfig.links.finsure} className="transition-colors hover:text-[#6F8B65]">
                {siteConfig.productName}
              </a>
            </nav>
          </div>
        </header>

        <main className="space-y-8">
          <section className="legal-home-panel overflow-hidden rounded-[40px] border px-6 py-10 md:px-10 md:py-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(197,155,71,0.28)] bg-[rgba(197,155,71,0.10)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#E6C989]">
                  Built by Levine Law
                </div>
                <div className="space-y-5">
                  <h1 className="max-w-4xl text-5xl leading-[0.92] text-[#F7F1E4] md:text-7xl">
                    Canadian FinTech Counsel, Compliance Infrastructure, and Tools
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[#D2DEE0] md:text-xl">
                    {siteConfig.siteName} brings together legal information, compliance
                    systems, and AI-powered tools for teams working across payments, crypto,
                    AML, and regulated financial operations in Canada. Start with{" "}
                    {siteConfig.productName} for suspicious transaction report drafting, then
                    explore practical resources and implementation guidance.
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
                    <a href={siteConfig.links.useCases}>
                      Browse Resources
                      <ArrowRight className="h-4 w-4" />
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

              <FinsureDevicePreview />
            </div>
          </section>

          <section
            id="use-cases"
            className="legal-home-panel rounded-[36px] border px-6 py-20 md:px-10 md:py-24"
          >
            <div className="mx-auto max-w-6xl">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                  Use Cases
                </p>
                <h2 className="text-4xl text-[#F7F1E4] md:text-5xl">
                  Where FintechLawyer.ca Is Used
                </h2>
                <p className="max-w-[600px] text-base leading-7 text-[#D2DEE0]">
                  Applied across regulated fintech workflows involving payments, crypto, AML
                  programs, and financial infrastructure operating in Canada.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {useCaseCards.map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className="flex cursor-pointer flex-col justify-between rounded-[28px] border border-white/10 bg-white/5 p-6 transition-transform transition-shadow transition-colors hover:-translate-y-1 hover:border-[rgba(111,139,101,0.42)] hover:shadow-[0_18px_42px_rgba(0,0,0,0.18)]"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight text-[#F7F1E4]">
                        {card.title}
                      </h3>
                      <ul className="mt-5 space-y-3 text-sm leading-6 text-[#D2DEE0]">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#6F8B65]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="mt-6 text-sm font-semibold text-[#F7F1E4]">
                      View details
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section
            id="offerings"
            className="legal-home-panel rounded-[36px] border px-6 py-20 md:px-10 md:py-24"
          >
            <div className="mx-auto max-w-6xl">
              <div className="max-w-3xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                  Platform Overview
                </p>
                <h2 className="text-4xl text-[#F7F1E4] md:text-5xl">
                  What FintechLawyer.ca Provides
                </h2>
                <p className="max-w-[640px] text-base leading-7 text-[#D2DEE0]">
                  FintechLawyer.ca brings together legal information, compliance
                  infrastructure, and productized tools for teams operating in regulated
                  fintech environments in Canada.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {platformPillars.map((pillar) => (
                  <article
                    key={pillar.number}
                    className="legal-home-card flex h-full flex-col rounded-[30px] border p-6"
                  >
                    <p className="text-sm font-semibold tracking-[0.2em] text-[#E6C989]">
                      {pillar.number}
                    </p>
                    <h3 className="mt-5 text-3xl text-[#F7F1E4]">{pillar.title}</h3>
                    <p className="mt-4 text-base leading-7 text-[#D2DEE0]">{pillar.body}</p>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-[#D2DEE0]">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#6F8B65]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={pillar.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F7F1E4] transition-colors hover:text-[#6F8B65]"
                    >
                      {pillar.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="legal-home-panel rounded-[36px] border px-6 py-20 md:px-10 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                    Featured Tool
                  </p>
                  <h2 className="text-4xl text-[#F7F1E4] md:text-5xl">FinSure</h2>
                  <p className="max-w-2xl text-base leading-7 text-[#D2DEE0]">
                    A productized tool for suspicious transaction reporting and related AML
                    workflows.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
                    Currently Featured
                  </p>
                  <h3 className="text-3xl text-[#F7F1E4]">{siteConfig.productName}</h3>
                  <p className="text-lg text-[#F7F1E4]">
                    Structured STR drafting for Canadian AML teams.
                  </p>
                  <p className="max-w-2xl text-base leading-7 text-[#D2DEE0]">
                    FinSure is a guided interface for drafting suspicious transaction reports
                    using structured intake, deterministic red flags, editable narrative logic,
                    and export-oriented workflow design.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {featuredToolItems.map((item) => (
                    <div key={item.eyebrow} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-sm font-semibold text-[#F7F1E4]">{item.eyebrow}</p>
                      <p className="mt-2 text-sm leading-6 text-[#D2DEE0]">{item.title}</p>
                    </div>
                  ))}
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
                    <a href={siteConfig.links.product}>
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-sm text-[#D2DEE0]">
                  Built for Canadian AML and FINTRAC-adjacent workflows.
                </p>
              </div>

              <FinsureDevicePreview />
            </div>
          </section>

          <section id="approach" className="legal-home-panel rounded-[36px] border px-6 py-20 md:px-10 md:py-24">
            <div className="mx-auto max-w-6xl">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                  Validation
                </p>
                <h2 className="text-4xl text-[#F7F1E4] md:text-5xl">
                  Used by FinTech and Compliance Teams
                </h2>
                <p className="max-w-[600px] text-base leading-7 text-[#D2DEE0]">
                  Applied across payments, crypto, and AML workflows by teams operating in
                  regulated environments.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {validationCards.map((card) => (
                  <article
                    key={card.role}
                    className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-6"
                  >
                    <p className="text-xs text-[#BCC7B6]">{card.role}</p>
                    <p className="mt-4 text-lg leading-8 text-[#F7F1E4]">"{card.quote}"</p>
                    <p className="mt-6 text-sm font-semibold text-[#6F8B65]">{card.tag}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {validationTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#D2DEE0]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="legal-home-panel rounded-[36px] border px-6 py-20 md:px-10 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl text-[#F7F1E4] md:text-5xl">Start with FinSure</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#D2DEE0]">
                Use structured workflows to draft suspicious transaction reports and support AML
                processes.
              </p>

              <div className="mt-8">
                <Button asChild size="lg" className="rounded-2xl px-10">
                  <a href={siteConfig.links.finsure}>
                    Explore FinSure
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-sm text-[#D2DEE0]">
                Structured intake, deterministic flags, and export-ready drafting.
              </p>
              <a
                href={siteConfig.links.product}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#F7F1E4] transition-colors hover:text-[#6F8B65]"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-6 text-xs text-[#BCC7B6]">
                Built by Levine Law
                <br />
                For informational and workflow support purposes only.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
