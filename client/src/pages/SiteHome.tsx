import { useState } from "react";
import {
  ArrowRight,
  Menu,
  ScanSearch,
  X,
} from "lucide-react";
import { siteConfig } from "@shared/site";
import { SiteFooter } from "@/components/SiteFooter";
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
  "Designed for regulated fintech operators",
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
    title: "Product & Infrastructure",
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
      "Helps standardize how we approach reporting and documentation across the workflow.",
    tag: "Crypto / MSB",
  },
  {
    role: "Risk & Compliance — FinTech",
    quote: "Clear inputs, predictable outputs, and easier internal review.",
    tag: "FinTech / AML",
  },
] as const;

const validationTags = ["Payments", "Crypto", "MSB", "Compliance"] as const;

const headerLinks = [
  { label: "Offerings", href: siteConfig.links.offerings },
  { label: "Approach", href: siteConfig.links.approach },
  { label: "Contact", href: siteConfig.links.contact },
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
      "Templates, tools, and drafting systems give operators something durable to run instead of re-solving the same issue from scratch.",
  },
] as const;

function FinsureDevicePreview() {
  const deviceRows = [
    { title: "Intake", detail: "Guided facts collection" },
    { title: "Flags", detail: "Deterministic red flags" },
    { title: "Export", detail: "Package-ready output" },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:justify-self-end">
      <div className="absolute inset-x-10 top-16 h-48 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.1),_transparent_70%)] blur-3xl" />
      <div className="legal-home-device-frame relative rounded-[44px] border border-white/10 p-[10px] shadow-[0_36px_100px_rgba(0,0,0,0.42)] lg:hover:-translate-y-1">
        <div className="absolute left-1/2 top-[10px] h-6 w-28 -translate-x-1/2 rounded-b-[18px] bg-[#040404]" />
        <div className="legal-home-device-screen min-h-[620px] rounded-[34px] px-4 pb-5 pt-9">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <p className="text-sm font-semibold tracking-[0.02em] text-[#F7F1E4]">
              FinSure
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(195,154,86,0.28)] bg-white/5">
              <ScanSearch className="h-3.5 w-3.5 text-[#E6C989]" />
            </div>
          </div>

          <div className="mt-4">
            <span className="rounded-full border border-[rgba(230,201,137,0.26)] bg-[rgba(255,255,255,0.08)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F3D8A2]">
              Live now
            </span>
          </div>

          <div className="legal-home-device-card mt-4 rounded-[24px] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
              STR Drafting
            </p>
            <Button className="mt-3 h-11 w-full rounded-2xl bg-[#E6C989] text-sm font-semibold text-[#1F241D] shadow-[0_12px_24px_rgba(230,201,137,0.18)] hover:bg-[#dcbc6f]">
              New Draft
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {deviceRows.map((row) => (
              <div
                key={row.title}
                className="legal-home-device-card flex items-center justify-between gap-4 rounded-[20px] px-4 py-3"
              >
                <p className="text-sm font-medium text-[#F7F1E4]">{row.title}</p>
                <p className="text-xs text-right leading-5 text-[#D8DDD8]">{row.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-[#596255] lg:text-left">
        One of the tools available on FintechLawyer.ca.
      </p>
    </div>
  );
}

export default function SiteHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="legal-home-shell min-h-screen px-4 py-6 text-[#1F241D] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="legal-home-nav rounded-[32px] border px-6 py-5 md:px-8">
          <div className="flex items-center justify-between gap-6">
            <a
              href={siteConfig.links.home}
              className="shrink-0 flex items-center"
            >
              <img
                src="/fintechlawyer-logo-white.png"
                alt="FintechLawyer.ca"
                className="h-11 w-auto md:h-12"
              />
            </a>

            <div className="flex shrink-0 items-center justify-end gap-3 md:gap-4 lg:gap-8">
              <nav
                aria-label="Primary"
                className="hidden items-center gap-7 text-sm font-medium text-[#1A1A1A] lg:flex"
              >
                {headerLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="transition-colors hover:text-[#E6C989]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <Button
                asChild
                className="rounded-xl bg-[#E6C989] px-5 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f] md:px-6"
              >
                <a href={siteConfig.links.finsure}>Explore FinSure</a>
              </Button>

              <button
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(26,26,26,0.1)] bg-white/80 text-[#1A1A1A] lg:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isMenuOpen ? (
            <div className="mt-4 grid gap-3 border-t border-[rgba(26,26,26,0.08)] pt-4 lg:hidden">
              {headerLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-[#1A1A1A] transition-colors hover:text-[#E6C989]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </header>

        <main className="space-y-8">
          <section className="legal-home-hero-panel overflow-hidden rounded-[40px] border px-6 py-10 md:px-10 md:py-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-center">
              <div className="space-y-5">
                <div className="space-y-4">
                  <h1 className="max-w-4xl text-5xl leading-[0.92] text-[#F4F2EC] md:text-7xl">
                    Canadian FinTech Infrastructure and Tools
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[#D9E2D6] md:text-xl">
                    Legal guidance, compliance systems, and tools for regulated fintech
                    operators in Canada.
                  </p>
                  <p className="max-w-xl text-sm leading-6 text-[#B7C3B7] md:text-base">
                    Start with FinSure for STR drafting, then move into our enterprise
                    systems that support real-world AML work.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1 sm:flex-nowrap">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                  >
                    <a href={siteConfig.links.finsure}>
                      Explore FinSure
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-2xl border-[rgba(230,201,137,0.5)] bg-[rgba(230,201,137,0.08)] px-8 text-[#E6C989] hover:bg-[rgba(230,201,137,0.14)] hover:text-[#F4F2EC]"
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
                      className="legal-home-proof-pill rounded-full px-4 py-2 text-sm"
                    >
                      {point}
                    </span>
                  ))}
                </div>

                <div className="max-w-2xl rounded-[28px] border border-[rgba(195,154,86,0.22)] bg-[rgba(255,255,255,0.05)] p-5 text-sm leading-7 text-[#D9E1D7]">
                  Designed for operators who need legal framing, usable workflows, and outputs
                  that feel ready for the next step, not like a generic compliance demo.
                </div>
              </div>

              <FinsureDevicePreview />
            </div>
          </section>

          <section
            id="use-cases"
            className="legal-home-panel-alt rounded-[36px] border px-6 py-20 md:px-10 md:py-24"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-2xl space-y-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                  Use Cases
                </p>
                <h2 className="text-4xl text-[#1B2118] md:text-5xl">
                  Where FintechLawyer.ca Is Used
                </h2>
                <p className="max-w-[600px] text-base leading-7 text-[#6B6B6B]">
                  Applied across regulated fintech workflows involving payments, crypto, AML
                  programs, and financial infrastructure operating in Canada.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {useCaseCards.map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className="legal-home-card flex cursor-pointer flex-col justify-between rounded-[28px] border p-6 transition-transform transition-shadow transition-colors hover:-translate-y-1 hover:border-[rgba(230,201,137,0.36)] hover:shadow-[0_18px_34px_rgba(31,51,37,0.08)]"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight text-[#1F241D]">
                        {card.title}
                      </h3>
                      <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6B6B6B]">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#E6C989]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="mt-6 text-sm font-semibold text-[#1F241D]">
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
              <div className="mx-auto max-w-3xl space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                  Platform Overview
                </p>
                <h2 className="text-4xl text-[#1B2118] md:text-5xl">
                  What FintechLawyer.ca Provides
                </h2>
                <p className="max-w-[640px] text-base leading-7 text-[#6B6B6B]">
                  FintechLawyer.ca brings together legal information, compliance
                  infrastructure, and productized tools for regulated fintech operators in
                  Canada.
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
                    <h3 className="mt-5 text-3xl text-[#1F241D]">{pillar.title}</h3>
                    <p className="mt-4 text-base leading-7 text-[#6B6B6B]">{pillar.body}</p>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6B6B6B]">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#E6C989]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={pillar.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1F241D] transition-colors hover:text-[#E6C989]"
                    >
                      {pillar.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="legal-home-feature-panel rounded-[36px] border px-6 py-20 md:px-10 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                    Featured Tool
                  </p>
                  <h2 className="text-4xl text-[#F4F2EC] md:text-5xl">FinSure</h2>
                  <p className="max-w-2xl text-base leading-7 text-[#D8E1D6]">
                    A productized tool for suspicious transaction reporting and related AML
                    workflows.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E6C989]">
                    Currently Featured
                  </p>
                  <h3 className="text-3xl text-[#F4F2EC]">{siteConfig.productName}</h3>
                  <p className="text-lg text-[#F4F2EC]">
                    Structured STR drafting for Canadian AML workflows.
                  </p>
                  <p className="max-w-2xl text-base leading-7 text-[#D8E1D6]">
                    FinSure is a guided interface for drafting suspicious transaction reports
                    using structured intake, deterministic red flags, editable narrative logic,
                    and export-oriented workflow design.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {featuredToolItems.map((item) => (
                    <div
                      key={item.eyebrow}
                      className="legal-home-feature-card rounded-[24px] p-5"
                    >
                      <p className="text-sm font-semibold text-[#1F241D]">{item.eyebrow}</p>
                      <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{item.title}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                  >
                    <a href={siteConfig.links.finsure}>
                      Explore FinSure
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-2xl border-[rgba(230,201,137,0.5)] bg-[rgba(230,201,137,0.08)] px-8 text-[#E6C989] hover:bg-[rgba(230,201,137,0.14)] hover:text-[#F4F2EC]"
                  >
                    <a href={siteConfig.links.product}>
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-sm text-[#C4D0C3]">
                  Built for Canadian AML and FINTRAC-adjacent workflows.
                </p>
              </div>

              <FinsureDevicePreview />
            </div>
          </section>

          <section
            id="approach"
            className="legal-home-panel-alt rounded-[36px] border px-6 py-20 md:px-10 md:py-24"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-2xl space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                  Validation
                </p>
                <h2 className="text-4xl text-[#1B2118] md:text-5xl">
                  Used across FinTech and Compliance Workflows
                </h2>
                <p className="max-w-[600px] text-base leading-7 text-[#6B6B6B]">
                  Applied across payments, crypto, and AML workflows in regulated environments.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {validationCards.map((card) => (
                  <article
                    key={card.role}
                    className="legal-home-card flex h-full flex-col rounded-[28px] border p-6"
                  >
                    <p className="text-xs text-[#7A8176]">{card.role}</p>
                    <p className="mt-4 text-lg leading-8 text-[#1F241D]">"{card.quote}"</p>
                    <p className="mt-6 text-sm font-semibold text-[#E6C989]">{card.tag}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {validationTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[rgba(230,201,137,0.22)] bg-white px-4 py-2 text-sm text-[#6B6B6B]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section
            id="contact"
            className="legal-home-panel rounded-[36px] border bg-white px-6 py-24 md:px-10 md:py-28"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C989]">
                START HERE
              </p>
              <h2 className="mt-4 text-[2.5rem] leading-tight text-[#1B2118] md:text-[3.25rem]">
                Start with FinSure
              </h2>
              <p className="mx-auto mt-5 max-w-[680px] text-base leading-7 text-[#6B6B6B]">
                Use structured workflows for suspicious transaction reporting and related AML
                processes.
              </p>

              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl bg-[#E6C989] px-12 text-[#1F241D] shadow-[0_18px_32px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                >
                  <a href={siteConfig.links.finsure}>
                    Explore FinSure
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="mt-6 text-sm text-[#6B6B6B]">
                Structured intake, deterministic flags, and export-ready drafting.
              </p>
              <p className="mt-10 text-xs text-[#7A8176]">
                Built by Levine Law for informational and workflow support purposes only.
              </p>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
