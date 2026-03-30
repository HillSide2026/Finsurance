export type CaptureBusinessType =
  | "crypto"
  | "payments"
  | "marketplace"
  | "lending"
  | "embedded_finance"
  | "other";

export type CaptureStage = "idea" | "launching" | "live";

export type CapturePrimaryNeed =
  | "self_serve"
  | "camlo"
  | "compliance_service"
  | "legal"
  | "not_sure";

export type CaptureRoute = "product" | "camlo" | "compliance_service" | "legal";

export type CaptureQuestionnaire = {
  businessType: CaptureBusinessType | null;
  stage: CaptureStage | null;
  servesCanada: boolean | null;
  primaryNeed: CapturePrimaryNeed | null;
};

export type CaptureRecommendation = {
  summary: string;
  readinessLabel: string;
  recommendedRoute: CaptureRoute;
  productFit: "strong" | "moderate" | "service_led";
  requirements: string[];
  highlights: string[];
  pricingLabel: string;
};

export const captureBusinessTypeOptions: Array<{
  value: CaptureBusinessType;
  label: string;
  description: string;
}> = [
  {
    value: "crypto",
    label: "Crypto app",
    description: "Exchange, wallet, stablecoin, or crypto-enabled product.",
  },
  {
    value: "payments",
    label: "Payments",
    description: "Money movement, merchant payouts, payment processing, or PSP tooling.",
  },
  {
    value: "marketplace",
    label: "Marketplace",
    description: "Platform model with counterparties, settlement, or stored value exposure.",
  },
  {
    value: "lending",
    label: "Lending",
    description: "Credit, advances, or financing workflows with onboarding and monitoring needs.",
  },
  {
    value: "embedded_finance",
    label: "Embedded finance",
    description: "Fintech infrastructure embedded inside a broader software product.",
  },
  {
    value: "other",
    label: "Other fintech",
    description: "A regulated or borderline-regulated financial product not covered above.",
  },
] as const;

export const captureStageOptions: Array<{
  value: CaptureStage;
  label: string;
  description: string;
}> = [
  {
    value: "idea",
    label: "Idea stage",
    description: "You are scoping launch requirements before product build or go-live.",
  },
  {
    value: "launching",
    label: "Launching",
    description: "You are getting ready to onboard users, counterparties, or payment flows.",
  },
  {
    value: "live",
    label: "Already live",
    description: "You need a live-program gap review, remediation path, or support escalation.",
  },
] as const;

export const captureNeedOptions: Array<{
  value: CapturePrimaryNeed;
  label: string;
  description: string;
}> = [
  {
    value: "self_serve",
    label: "Self-serve checklist",
    description: "I want a structured checklist and decision support first.",
  },
  {
    value: "camlo",
    label: "CAMLO support",
    description: "I want CAMLO as a Service or designated officer support.",
  },
  {
    value: "compliance_service",
    label: "Managed compliance",
    description: "I need ongoing compliance program help, not just a checklist.",
  },
  {
    value: "legal",
    label: "Legal guidance",
    description: "I need direct legal support from Levine Law.",
  },
  {
    value: "not_sure",
    label: "Not sure yet",
    description: "I want to understand the requirements before deciding the path.",
  },
] as const;

export const emptyCaptureQuestionnaire = (): CaptureQuestionnaire => ({
  businessType: null,
  stage: null,
  servesCanada: null,
  primaryNeed: null,
});

function baseRequirements(stage: CaptureStage, servesCanada: boolean): string[] {
  const requirements = [
    "Determine whether FINTRAC or MSB registration analysis is required for your model.",
    "Map the AML compliance program controls you need before onboarding customers or moving funds.",
    "Define recordkeeping, suspicious transaction escalation, and governance ownership early.",
  ];

  if (servesCanada) {
    requirements.push("Review Canadian onboarding, verification, and reporting touchpoints before launch.");
  } else {
    requirements.push("Assess whether Canadian users, flows, or counterparties still create Canadian compliance exposure.");
  }

  if (stage === "idea") {
    requirements.push("Build a pre-launch checklist so product and compliance decisions happen before go-live.");
  } else if (stage === "launching") {
    requirements.push("Create a launch-ready control list for onboarding, monitoring, and internal escalation.");
  } else {
    requirements.push("Run a live-program gap review and identify remediation priorities for existing operations.");
  }

  return requirements;
}

function businessTypeRequirements(businessType: CaptureBusinessType): string[] {
  switch (businessType) {
    case "crypto":
      return [
        "Assess virtual currency dealer obligations, wallet or exchange controls, and transaction monitoring scope.",
        "Clarify how registration, KYC, sanctions, and suspicious activity workflows fit your crypto product model.",
      ];
    case "payments":
      return [
        "Clarify money movement exposure, payment processor dependencies, and reporting responsibilities.",
        "Map payout, settlement, and third-party flow risks before launch or scale.",
      ];
    case "marketplace":
      return [
        "Define platform versus operator responsibilities where users, counterparties, and funds intersect.",
        "Map who controls onboarding, monitoring, and escalation across marketplace participants.",
      ];
    case "lending":
      return [
        "Review onboarding, source-of-funds, monitoring, and suspicious activity escalation for credit workflows.",
        "Clarify how borrower onboarding and servicing create AML or reporting obligations.",
      ];
    case "embedded_finance":
      return [
        "Map regulatory exposure created by the embedded financial feature, not just the core software product.",
        "Clarify third-party dependencies and where compliance ownership really sits.",
      ];
    default:
      return [
        "Clarify the exact product motion before launch so the right registration and program obligations are scoped early.",
      ];
  }
}

function buildSummary(input: CaptureQuestionnaire): string {
  const businessTypeLabel =
    captureBusinessTypeOptions.find((option) => option.value === input.businessType)?.label ?? "Fintech";
  const stageLabel =
    captureStageOptions.find((option) => option.value === input.stage)?.label ?? "current stage";

  return `${businessTypeLabel} operators in ${stageLabel.toLowerCase()} typically need early clarity on registration, AML program scope, onboarding controls, and reporting obligations before they spend legal budget in the wrong place.`;
}

function buildHighlights(input: CaptureQuestionnaire): string[] {
  const highlights = [
    input.servesCanada
      ? "Canadian exposure is present, so local registration and program questions need to be resolved early."
      : "Canadian exposure still needs to be tested even if the product is not Canada-first.",
  ];

  if (input.stage === "live") {
    highlights.push("Because the product is already live, remediation urgency is higher than for a pre-launch team.");
  } else if (input.stage === "launching") {
    highlights.push("This is the right stage to lock the checklist before operational habits harden.");
  } else {
    highlights.push("Pre-launch teams benefit most from a checklist because it prevents expensive rework later.");
  }

  return highlights;
}

export function buildCaptureRecommendation(input: CaptureQuestionnaire): CaptureRecommendation {
  if (
    input.businessType === null ||
    input.stage === null ||
    input.servesCanada === null ||
    input.primaryNeed === null
  ) {
    throw new Error("Complete all capture questions before generating the recommendation.");
  }

  const requirements = [
    ...baseRequirements(input.stage, input.servesCanada),
    ...businessTypeRequirements(input.businessType),
  ];

  const summary = buildSummary(input);
  const highlights = buildHighlights(input);

  if (input.primaryNeed === "camlo") {
    return {
      summary,
      readinessLabel: "Managed support recommended",
      recommendedRoute: "camlo",
      productFit: "service_led",
      requirements,
      highlights,
      pricingLabel: "$99 early access remains available if you still want the self-serve checklist.",
    };
  }

  if (input.primaryNeed === "compliance_service") {
    return {
      summary,
      readinessLabel: "Service path recommended",
      recommendedRoute: "compliance_service",
      productFit: "service_led",
      requirements,
      highlights,
      pricingLabel: "$99 early access remains available if you still want the self-serve checklist.",
    };
  }

  if (input.primaryNeed === "legal") {
    return {
      summary,
      readinessLabel: "Counsel path recommended",
      recommendedRoute: "legal",
      productFit: "service_led",
      requirements,
      highlights,
      pricingLabel: "$99 early access remains available if you still want the self-serve checklist.",
    };
  }

  if (input.primaryNeed === "not_sure") {
    return {
      summary,
      readinessLabel: "Checklist first",
      recommendedRoute: "product",
      productFit: "moderate",
      requirements,
      highlights,
      pricingLabel: "$99 early access",
    };
  }

  return {
    summary,
    readinessLabel: "Strong checklist fit",
    recommendedRoute: "product",
    productFit: "strong",
    requirements,
    highlights,
    pricingLabel: "$99 early access",
  };
}

export function buildCaptureEnquirySourcePath(route: CaptureRoute): string {
  return `/compliance-checklist/start?intent=${route}`;
}

export const captureRouteCopy: Record<
  CaptureRoute,
  {
    label: string;
    title: string;
    description: string;
    successTitle: string;
    successDescription: string;
  }
> = {
  product: {
    label: "Self-serve checklist",
    title: "Reserve checklist access",
    description: "Primary path. Use pricing and early-access intent to validate willingness to pay.",
    successTitle: "Checklist request received",
    successDescription: "We saved your early-access request for the self-serve checklist.",
  },
  camlo: {
    label: "CAMLO as a Service",
    title: "Request CAMLO follow-up",
    description: "Secondary path for teams that need designated officer or managed CAMLO support.",
    successTitle: "CAMLO request received",
    successDescription: "We saved your CAMLO as a Service follow-up request.",
  },
  compliance_service: {
    label: "Compliance as a Service",
    title: "Request compliance follow-up",
    description: "Secondary path for teams that need ongoing human-led compliance support.",
    successTitle: "Compliance request received",
    successDescription: "We saved your Compliance as a Service follow-up request.",
  },
  legal: {
    label: "Levine Law",
    title: "Request legal follow-up",
    description: "Secondary path for teams that need direct legal support.",
    successTitle: "Legal request received",
    successDescription: "We saved your Levine Law follow-up request.",
  },
};
