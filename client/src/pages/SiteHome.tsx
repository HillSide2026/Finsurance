import { useState } from "react";
import {
  ArrowRight,
  Menu,
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

type ProofPoint = {
  label: string;
  value: string;
};

const proofPoints: ProofPoint[] = [
  {
    label: "Origin",
    value: "Built by Levine Law",
  },
  {
    label: "Focus",
    value: "Designed for regulated fintech operators",
  },
  {
    label: "Model",
    value: "Counsel, compliance, and tools in one platform",
  },
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
  { label: "Industries", href: siteConfig.links.useCases },
  { label: "Services", href: siteConfig.links.offerings },
  { label: "Expertise", href: siteConfig.links.approach },
] as const;

const workflowSteps = [
  {
    number: "01",
    title: "Intake",
    detail: "Transaction Reviewed",
  },
  {
    number: "02",
    title: "Preparing",
    detail: "Facts compiled. Suspicion Triggered",
  },
  {
    number: "03",
    title: "Drafting",
    detail: "Report assembly. Narrative Preparation.",
  },
  {
    number: "04",
    title: "Queued",
    detail: "Export Package. Review Ready",
    note: "Awaiting internal sign-off and download.",
  },
] as const;

const workflowMetadata = [
  { label: "Case ID", value: "FL-2026-0148" },
  { label: "Entity", value: "Northline Pay" },
  { label: "Jurisdiction", value: "Canada • MSB" },
  { label: "Output", value: "Narrative Draft" },
] as const;

const workflowRows = [
  {
    time: "09:14",
    activity: "Incoming wire",
    amount: "48.5k CAD",
    signal: "Mismatch",
  },
  {
    time: "09:42",
    activity: "Layered transfer",
    amount: "17.9k CAD",
    signal: "Structuring",
  },
  {
    time: "11:08",
    activity: "Outbound EFT",
    amount: "15k CAD",
    signal: "Velocity",
  },
] as const;

const workflowFlags = [
  {
    label: "Structuring pattern",
    detail: "Three related transfers posted inside a 28 minute window.",
    level: "High",
  },
  {
    label: "Third-party activity",
    detail: "Counterparty details do not align with the stated business purpose.",
    level: "Medium",
  },
  {
    label: "Velocity spike",
    detail: "Outbound movement accelerated immediately after inbound settlement.",
    level: "Medium",
  },
] as const;

const workflowReviewDetails = [
  { label: "Owner", value: "AML Ops" },
  { label: "Last updated", value: "13:42 ET" },
  { label: "Queue", value: "Preparation" },
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

function FinsureWorkspacePreview() {
  return (
    <div className="mx-auto w-full max-w-[680px] lg:mx-0 lg:justify-self-end">
      <div className="overflow-x-auto pb-1">
        <div className="legal-home-workspace-frame min-w-[640px] rounded-[18px] border p-3">
          <div className="legal-home-workspace-shell overflow-hidden rounded-[12px] border">
            <div className="flex items-center justify-between border-b border-[rgba(60,72,65,0.12)] bg-[#ece8dd] px-4 py-3">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#627066]">
                  FinSure Workflow
                </p>
                <p className="text-sm font-semibold text-[#1F241D]">Case FL-2026-0148</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9F8A55]">
                  Preparing
                </p>
                <p className="mt-1 text-[11px] text-[#667060]">Canada • MSB</p>
              </div>
            </div>

            <div className="grid grid-cols-[160px_minmax(0,1fr)]">
              <aside className="legal-home-workspace-sidebar p-3.5">
                <div className="border-b border-white/10 pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99A39C]">
                    Workspace
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#F3F1EA]">Northline Pay</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#AEB7B0]">
                    Canada MSB review file
                  </p>
                </div>

                <div className="mt-3 rounded-[10px] border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#99A39C]">
                    Active case
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#F3F1EA]">FL-2026-0148</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#AEB7B0]">
                    Potential structuring across related wires.
                  </p>
                </div>

                <div className="mt-4 space-y-1.5">
                  {workflowSteps.map((step) => (
                    <div
                      key={step.number}
                      className="rounded-[10px] border border-white/8 px-3 py-2.5"
                    >
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8FA08F]">
                        {step.number}
                      </p>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D7DDD6]">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-[11px] leading-5 text-[#AEB7B0]">{step.detail}</p>
                      {"note" in step ? (
                        <p className="mt-1.5 text-[10px] leading-5 text-[#8FA08F]">{step.note}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </aside>

              <div className="legal-home-workspace-main p-4">
                <div className="flex items-start justify-between gap-4 border-b border-[rgba(42,54,49,0.08)] pb-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#667060]">
                      Workflow state
                    </p>
                    <p className="mt-2 text-[1.05rem] font-semibold text-[#1F241D]">
                      Narrative assembly
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[#667060]">
                      Facts, indicators, and supporting notes are being prepared for the draft.
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-[rgba(42,54,49,0.12)] bg-[#F6F4EE] px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#667060]">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1F241D]">Preparing</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {workflowMetadata.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[10px] border border-[rgba(42,54,49,0.12)] bg-[#F6F4EE] px-3 py-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#667060]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#1F241D]">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.14fr)_minmax(240px,0.86fr)]">
                  <div className="rounded-[10px] border border-[rgba(42,54,49,0.12)] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#667060]">
                        Narrative summary
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1F241D]">
                        Preparing
                      </p>
                    </div>
                    <div className="mt-3 space-y-2.5 text-[12px] leading-5 text-[#425048]">
                      <p>Customer profile, counterparties, and transaction path compiled.</p>
                      <p>Triggered indicators linked to facts, timestamps, and review notes.</p>
                      <p>Draft language is being assembled before internal sign-off and export.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[10px] border border-[rgba(42,54,49,0.12)] bg-[#F7F5EE] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#667060]">
                          Risk flags
                        </p>
                        <p className="text-sm font-semibold text-[#1F241D]">03</p>
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {workflowFlags.map((flag) => (
                          <div
                            key={flag.label}
                            className="rounded-[8px] border border-[rgba(42,54,49,0.08)] bg-white px-3 py-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-semibold text-[#1F241D]">
                                {flag.label}
                              </p>
                              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9F8A55]">
                                {flag.level}
                              </span>
                            </div>
                            <p className="mt-1.5 text-[11px] leading-5 text-[#667060]">
                              {flag.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[10px] border border-[rgba(42,54,49,0.12)] bg-[#F7F5EE] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#667060]">
                        Output state
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#1F241D]">
                        Draft packet in progress
                      </p>
                      <div className="mt-3 space-y-2">
                        {workflowReviewDetails.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between border-b border-[rgba(42,54,49,0.08)] pb-2 text-[11px] leading-5 text-[#425048] last:border-b-0 last:pb-0"
                          >
                            <span className="font-medium text-[#667060]">{item.label}</span>
                            <span className="font-semibold text-[#1F241D]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[10px] border border-[rgba(42,54,49,0.12)]">
                  <div className="flex items-center justify-between border-b border-[rgba(42,54,49,0.08)] bg-[#F1EFE8] px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#667060]">
                      Triggered activity
                    </p>
                    <p className="text-[11px] text-[#667060]">3 events linked to narrative</p>
                  </div>
                  <div className="grid grid-cols-[0.55fr_1.1fr_0.78fr_0.78fr] gap-2 bg-[#F7F5EE] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#667060]">
                    <span>Time</span>
                    <span>Activity</span>
                    <span>Amount</span>
                    <span>Signal</span>
                  </div>
                  {workflowRows.map((row) => (
                    <div
                      key={`${row.time}-${row.activity}`}
                      className="grid grid-cols-[0.55fr_1.1fr_0.78fr_0.78fr] gap-2 border-t border-[rgba(42,54,49,0.1)] px-3 py-3 text-[12px] leading-5 text-[#425048]"
                    >
                      <span className="font-medium text-[#1F241D]">{row.time}</span>
                      <span>{row.activity}</span>
                      <span>{row.amount}</span>
                      <span>{row.signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#9EA7A0] lg:text-left">
        One of the tools available on FintechLawyer.ca.
      </p>
    </div>
  );
}

export default function SiteHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="legal-home-shell min-h-screen px-4 py-6 text-[#1F241D] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <header className="legal-home-nav border-b px-0 pb-4 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <a href={siteConfig.links.home} className="flex shrink-0 items-center">
              <img
                src="/fintechlawyer-logo-rectangle.png"
                alt="FintechLawyer.ca"
                className="h-12 w-auto rounded-[12px] shadow-[0_8px_18px_rgba(16,24,19,0.12)] md:h-14"
              />
            </a>

            <div className="ml-auto flex w-full items-center justify-end gap-3 sm:w-auto md:gap-4 lg:gap-6">
              <nav
                aria-label="Primary"
                className="hidden items-center gap-5 text-sm font-medium text-[#223027] lg:flex"
              >
                {headerLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="transition-colors hover:text-[#516252]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <Button
                asChild
                className="rounded-md border border-[#C7A660] bg-[#E6C989] px-5 text-[#1F241D] shadow-[0_8px_16px_rgba(148,120,54,0.16)] hover:bg-[#dcbc6f] md:px-6"
              >
                <a href={siteConfig.links.finsure}>Explore FinSure</a>
              </Button>

              <button
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(35,49,38,0.14)] bg-[#f8f7f2] text-[#1A1A1A] lg:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isMenuOpen ? (
            <div className="mt-4 grid gap-3 border-t border-[rgba(35,49,38,0.1)] pt-4 lg:hidden">
              {headerLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-[#223027] transition-colors hover:text-[#516252]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </header>

        <main className="space-y-5 md:space-y-6">
          <section className="legal-home-hero-panel overflow-hidden rounded-[20px] border px-6 py-8 md:px-8 md:py-10 lg:px-10">
            <div className="mx-auto grid max-w-[1080px] gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(560px,1.12fr)] lg:items-start">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-[2.95rem] leading-[0.94] text-[#F4F2EC] sm:text-[3.4rem] md:text-[4.65rem]">
                    Canadian FinTech Infrastructure and Tools
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[#D9E2D6] md:text-[1.15rem]">
                    Legal guidance, compliance systems, and tools for regulated fintech
                    operators in Canada.
                  </p>
                  <p className="max-w-xl text-sm leading-7 text-[#B7C3B7] md:text-base">
                    Start with FinSure for STR drafting, then move into our enterprise
                    systems that support real-world AML work.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-md border border-[#C7A660] bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_10px_20px_rgba(148,120,54,0.16)] hover:bg-[#dcbc6f]"
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
                    className="rounded-md border-[rgba(255,255,255,0.16)] bg-transparent px-8 text-[#E2E5DF] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#F4F2EC]"
                  >
                    <a href={siteConfig.links.useCases}>
                      Browse Resources
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
                  {proofPoints.map((point) => (
                    <div
                      key={point.label}
                      className="border-l border-white/10 pl-4 first:border-l-0 first:pl-0"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9EA7A0]">
                        {point.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#EEF0EB]">{point.value}</p>
                    </div>
                  ))}
                </div>

                <div className="max-w-2xl border-l-2 border-[#C7A660] pl-4 text-sm leading-7 text-[#D9E1D7]">
                  Designed for operators who need legal framing, usable workflows, and outputs
                  that feel ready for the next step, not like a generic compliance demo.
                </div>
              </div>

              <FinsureWorkspacePreview />
            </div>
          </section>

          <section
            id="use-cases"
            className="legal-home-panel-alt rounded-[20px] border px-6 py-14 md:px-8 md:py-16 lg:px-10"
          >
            <div className="mx-auto max-w-[1080px]">
              <div className="mx-auto max-w-[760px] space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9F8A55]">
                  Industries
                </p>
                <h2 className="text-[2.35rem] leading-[1.02] text-[#1B2118] md:text-[3rem]">
                  Where FintechLawyer.ca Is Active
                </h2>
                <p className="mx-auto max-w-[620px] text-base leading-7 text-[#5F675C]">
                  FintechLawyer works across regulated fintech industries in Canada.
                </p>
              </div>

              <div className="mt-10 grid gap-4 border-t border-[rgba(35,49,38,0.09)] pt-8 md:grid-cols-2 lg:grid-cols-3">
                {useCaseCards.map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className="legal-home-card flex cursor-pointer flex-col justify-between rounded-[16px] border p-6 transition-colors hover:border-[rgba(159,138,85,0.42)]"
                  >
                    <div>
                      <h3 className="text-[1.55rem] leading-tight text-[#1F241D]">
                        {card.title}
                      </h3>
                      <ul className="mt-5 space-y-3 text-sm leading-6 text-[#5F675C]">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2 h-px w-4 bg-[#9F8A55]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="mt-6 border-t border-[rgba(35,49,38,0.08)] pt-4 text-sm font-semibold text-[#1F241D]">
                      View details
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section
            id="offerings"
            className="legal-home-panel rounded-[20px] border px-6 py-14 md:px-8 md:py-16 lg:px-10"
          >
            <div className="mx-auto max-w-[1080px]">
              <div className="mx-auto max-w-[780px] space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9F8A55]">
                  Platform Overview
                </p>
                <h2 className="text-[2.35rem] leading-[1.02] text-[#1B2118] md:text-[3rem]">
                  What FintechLawyer.ca Provides
                </h2>
                <p className="mx-auto max-w-[660px] text-base leading-7 text-[#5F675C]">
                  FintechLawyer.ca brings together legal information, compliance
                  infrastructure, and productized tools for regulated fintech operators in
                  Canada.
                </p>
              </div>

              <div className="mt-10 grid gap-4 border-t border-[rgba(35,49,38,0.09)] pt-8 md:grid-cols-2 lg:grid-cols-3">
                {platformPillars.map((pillar) => (
                  <article
                    key={pillar.number}
                    className="legal-home-card flex h-full flex-col rounded-[16px] border p-6"
                  >
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#9F8A55]">
                      {pillar.number}
                    </p>
                    <h3 className="mt-4 text-[1.65rem] leading-tight text-[#1F241D]">
                      {pillar.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-[#5F675C]">{pillar.body}</p>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6B6B6B]">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-px w-4 bg-[#9F8A55]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={pillar.href}
                      className="mt-6 inline-flex items-center gap-2 border-t border-[rgba(35,49,38,0.08)] pt-4 text-sm font-semibold text-[#1F241D] transition-colors hover:text-[#516252]"
                    >
                      {pillar.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="legal-home-feature-panel rounded-[20px] border px-6 py-14 md:px-8 md:py-16 lg:px-10">
            <div className="mx-auto grid max-w-[1080px] gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(560px,1.12fr)] lg:items-start">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9B27C]">
                    Featured Tool
                  </p>
                  <h2 className="text-[2.35rem] leading-[1.02] text-[#F4F2EC] md:text-[3rem]">
                    FinSure
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-[#D8E1D6]">
                    A productized tool for suspicious transaction reporting and related AML
                    workflows.
                  </p>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9B27C]">
                    Currently Featured
                  </p>
                  <h3 className="text-[1.8rem] leading-tight text-[#F4F2EC]">
                    {siteConfig.productName}
                  </h3>
                  <p className="text-lg text-[#F4F2EC]">
                    Structured STR drafting for Canadian AML workflows.
                  </p>
                  <p className="max-w-2xl text-base leading-7 text-[#D8E1D6]">
                    FinSure is a guided interface for drafting suspicious transaction reports
                    using structured intake, deterministic red flags, editable narrative logic,
                    and export-oriented workflow design.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {featuredToolItems.map((item) => (
                    <div
                      key={item.eyebrow}
                      className="legal-home-feature-card rounded-[14px] p-5"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6D775F]">
                        {item.eyebrow}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#556055]">{item.title}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-md border border-[#C7A660] bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_10px_20px_rgba(148,120,54,0.16)] hover:bg-[#dcbc6f]"
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
                    className="rounded-md border-[rgba(255,255,255,0.16)] bg-transparent px-8 text-[#E2E5DF] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#F4F2EC]"
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

              <FinsureWorkspacePreview />
            </div>
          </section>

          <section
            id="approach"
            className="legal-home-panel-alt rounded-[20px] border px-6 py-14 md:px-8 md:py-16 lg:px-10"
          >
            <div className="mx-auto max-w-[1080px]">
              <div className="mx-auto max-w-[760px] space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9F8A55]">
                  Expertise
                </p>
                <h2 className="text-[2.35rem] leading-[1.02] text-[#1B2118] md:text-[3rem]">
                  Used across FinTech and Compliance Workflows
                </h2>
                <p className="mx-auto max-w-[620px] text-base leading-7 text-[#5F675C]">
                  Applied across payments, crypto, and AML workflows in regulated environments.
                </p>
              </div>

              <div className="mt-10 grid gap-4 border-t border-[rgba(35,49,38,0.09)] pt-8 md:grid-cols-2 lg:grid-cols-3">
                {validationCards.map((card) => (
                  <article
                    key={card.role}
                    className="legal-home-card flex h-full flex-col rounded-[16px] border p-6"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6C756A]">
                      {card.role}
                    </p>
                    <p className="mt-4 text-[1.02rem] leading-8 text-[#1F241D]">
                      "{card.quote}"
                    </p>
                    <p className="mt-6 border-t border-[rgba(35,49,38,0.08)] pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9F8A55]">
                      {card.tag}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[rgba(35,49,38,0.09)] pt-5">
                {validationTags.map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#667060]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section
            id="contact"
            className="legal-home-panel rounded-[20px] border bg-[#F8F7F2] px-6 py-16 text-center md:px-8 md:py-20 lg:px-10"
          >
            <div className="mx-auto max-w-[720px]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9F8A55]">
                START HERE
              </p>
              <h2 className="mt-4 text-[2.35rem] leading-[1.02] text-[#1B2118] md:text-[3rem]">
                Start with FinSure
              </h2>
              <p className="mx-auto mt-5 max-w-[680px] text-base leading-7 text-[#5F675C]">
                Use structured workflows for suspicious transaction reporting and related AML
                processes.
              </p>

              <div className="mt-8 flex justify-center">
                <Button
                  asChild
                  size="lg"
                  className="rounded-md border border-[#C7A660] bg-[#E6C989] px-12 text-[#1F241D] shadow-[0_10px_20px_rgba(148,120,54,0.16)] hover:bg-[#dcbc6f]"
                >
                  <a href={siteConfig.links.finsure}>
                    Explore FinSure
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="mt-6 text-sm text-[#5F675C]">
                Structured intake, deterministic flags, and export-ready drafting.
              </p>
              <p className="mx-auto mt-10 max-w-[680px] border-t border-[rgba(35,49,38,0.08)] pt-6 text-xs text-[#7A8176]">
                Built by Levine Law for informational and workflow support purposes only.
              </p>
            </div>
          </section>
        </main>

        <SiteFooter className="rounded-[16px] border-[rgba(35,49,38,0.1)] bg-[#f7f6f1]" />
      </div>
    </div>
  );
}
