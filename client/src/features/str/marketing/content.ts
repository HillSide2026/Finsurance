import type { LucideIcon } from "lucide-react";
import { ArrowRight, FileText, ScanSearch, ShieldAlert } from "lucide-react";

export const strMarketingPainPoints = [
  "Manual reporting slows response times",
  "Unclear requirements create legal exposure",
  "Inconsistent documentation fails audits",
] as const;

export const strMarketingBenefits = [
  "Build an STR draft in under 60 seconds",
  "Structured inputs reduce omissions and errors",
  "Deterministic signals keep the draft grounded in the facts you provide",
  "Move from fact pattern to editable output faster",
] as const;

export const strMarketingWorkflow: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: ScanSearch,
    title: "Input transaction details through guided fields",
    body: "Start with structured intake instead of drafting from scratch.",
  },
  {
    icon: FileText,
    title: "FinSure assembles a structured STR draft",
    body: "The workflow turns the fact pattern you provide into editable report language.",
  },
  {
    icon: ShieldAlert,
    title: "Review the draft before you act",
    body: "Check the signals, narrative, and missing details before deciding what to do next.",
  },
  {
    icon: ArrowRight,
    title: "Export and continue your workflow",
    body: "Move from structured intake to a usable draft package without extra friction.",
  },
] as const;

export const strMarketingAuthorityPoints = [
  "Developed by Levine Law",
  "Years of financial regulatory experience",
  "Built by legal experts behind fintech compliance",
] as const;

export const strMarketingOutputItems = [
  "Structured intake",
  "Risk signals",
  "Draft narrative",
  "Export package",
] as const;
