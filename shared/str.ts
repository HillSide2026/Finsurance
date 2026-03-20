type OptionValue = string;

export const triggerTypeValues = [
  "unusual_transaction",
  "structuring",
  "third_party_involvement",
  "rapid_movement",
  "other",
] as const;

export const amountBandValues = [
  "under_10k",
  "10k_to_50k",
  "50k_to_100k",
  "100k_to_500k",
  "over_500k",
] as const;

export const currencyValues = ["CAD", "USD", "EUR", "GBP", "other"] as const;

export const transactionCountValues = [
  "1",
  "2_to_3",
  "4_to_10",
  "11_plus",
] as const;

export const timeframeValues = [
  "same_day",
  "2_to_7_days",
  "1_to_4_weeks",
  "1_to_3_months",
  "over_3_months",
] as const;

export const clientRelationshipValues = ["new", "existing"] as const;
export const customerTypeValues = ["individual", "business"] as const;

export const jurisdictionValues = [
  "canada",
  "united_states",
  "united_kingdom",
  "europe",
  "caribbean",
  "middle_east",
  "east_asia",
  "high_risk_or_sanctioned",
  "multiple_jurisdictions",
] as const;

export const suspicionIndicatorValues = [
  "inconsistent_behaviour",
  "source_of_funds_unclear",
  "avoidance_tactics",
  "other",
] as const;

export type TriggerType = (typeof triggerTypeValues)[number];
export type AmountBand = (typeof amountBandValues)[number];
export type Currency = (typeof currencyValues)[number];
export type TransactionCount = (typeof transactionCountValues)[number];
export type Timeframe = (typeof timeframeValues)[number];
export type ClientRelationship = (typeof clientRelationshipValues)[number];
export type CustomerType = (typeof customerTypeValues)[number];
export type Jurisdiction = (typeof jurisdictionValues)[number];
export type SuspicionIndicator = (typeof suspicionIndicatorValues)[number];
export type SuspicionLevel = "low" | "medium" | "high";

export type StrIntake = {
  triggerTypes: TriggerType[];
  triggerOtherText: string;
  amountBand: AmountBand | null;
  currency: Currency | null;
  currencyOtherText: string;
  transactionCount: TransactionCount | null;
  timeframe: Timeframe | null;
  clientRelationship: ClientRelationship | null;
  customerType: CustomerType | null;
  jurisdictions: Jurisdiction[];
  suspicionIndicators: SuspicionIndicator[];
  suspicionOtherText: string;
  freeTextNotes: string;
};

export type RedFlag = {
  id: string;
  label: string;
  sentence: string;
  weight: number;
};

export type StrReadiness = {
  canGenerate: boolean;
  totalRequiredFields: number;
  completedFieldCount: number;
  progressPercent: number;
  missingFields: string[];
};

export type StrDraftOutput = {
  redFlags: RedFlag[];
  suspicionLevel: SuspicionLevel;
  checklist: string[];
  missingFields: string[];
  narrativeText: string;
  readiness: StrReadiness;
};

export const triggerTypeLabels: Record<TriggerType, string> = {
  unusual_transaction: "Unusual transaction",
  structuring: "Structuring",
  third_party_involvement: "Third-party involvement",
  rapid_movement: "Rapid movement of funds",
  other: "Other",
};

export const amountBandLabels: Record<AmountBand, string> = {
  under_10k: "under 10,000",
  "10k_to_50k": "10,000 to 50,000",
  "50k_to_100k": "50,000 to 100,000",
  "100k_to_500k": "100,000 to 500,000",
  over_500k: "over 500,000",
};

export const currencyLabels: Record<Currency, string> = {
  CAD: "CAD",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  other: "Other",
};

export const transactionCountLabels: Record<TransactionCount, string> = {
  "1": "1 transaction",
  "2_to_3": "2 to 3 transactions",
  "4_to_10": "4 to 10 transactions",
  "11_plus": "11 or more transactions",
};

export const timeframeLabels: Record<Timeframe, string> = {
  same_day: "the same day",
  "2_to_7_days": "2 to 7 days",
  "1_to_4_weeks": "1 to 4 weeks",
  "1_to_3_months": "1 to 3 months",
  over_3_months: "more than 3 months",
};

export const clientRelationshipLabels: Record<ClientRelationship, string> = {
  new: "New client",
  existing: "Existing client",
};

export const customerTypeLabels: Record<CustomerType, string> = {
  individual: "Individual",
  business: "Entity",
};

export const jurisdictionLabels: Record<Jurisdiction, string> = {
  canada: "Canada",
  united_states: "United States",
  united_kingdom: "United Kingdom",
  europe: "Europe",
  caribbean: "Caribbean",
  middle_east: "Middle East",
  east_asia: "East Asia",
  high_risk_or_sanctioned: "High-risk or sanctioned jurisdiction",
  multiple_jurisdictions: "Multiple jurisdictions",
};

export const suspicionIndicatorLabels: Record<SuspicionIndicator, string> = {
  inconsistent_behaviour: "Inconsistent behaviour",
  source_of_funds_unclear: "Source of funds unclear",
  avoidance_tactics: "Avoidance tactics",
  other: "Other",
};

const requiredFieldChecks = [
  {
    label: "Select at least one triggering concern.",
    isComplete: (input: StrIntake) => input.triggerTypes.length > 0,
  },
  {
    label: "Choose the approximate total amount range.",
    isComplete: (input: StrIntake) => input.amountBand !== null,
  },
  {
    label: "Choose the transaction currency.",
    isComplete: (input: StrIntake) => input.currency !== null,
  },
  {
    label: "Choose the number of transactions.",
    isComplete: (input: StrIntake) => input.transactionCount !== null,
  },
  {
    label: "Choose the timeframe for the activity.",
    isComplete: (input: StrIntake) => input.timeframe !== null,
  },
  {
    label: "Choose whether the client is new or existing.",
    isComplete: (input: StrIntake) => input.clientRelationship !== null,
  },
  {
    label: "Choose whether the subject is an individual or entity.",
    isComplete: (input: StrIntake) => input.customerType !== null,
  },
  {
    label: "Select at least one jurisdiction.",
    isComplete: (input: StrIntake) => input.jurisdictions.length > 0,
  },
  {
    label: "Select at least one basis for suspicion.",
    isComplete: (input: StrIntake) => input.suspicionIndicators.length > 0,
  },
] as const;

type Rule = {
  id: string;
  label: string;
  sentence: string;
  weight: number;
  matches: (input: StrIntake) => boolean;
};

const rules: Rule[] = [
  {
    id: "structuring-pattern",
    label: "Possible structuring to avoid reporting thresholds",
    sentence:
      "The transaction pattern is consistent with possible structuring intended to avoid reporting thresholds.",
    weight: 3,
    matches: (input) => input.triggerTypes.includes("structuring"),
  },
  {
    id: "fragmented-activity",
    label: "Multiple transactions suggest deliberate fragmentation",
    sentence:
      "The number of transactions suggests that funds may have been deliberately fragmented.",
    weight: 2,
    matches: (input) =>
      input.triggerTypes.includes("structuring") &&
      (input.transactionCount === "4_to_10" || input.transactionCount === "11_plus"),
  },
  {
    id: "rapid-fund-movement",
    label: "Rapid movement of funds through the account",
    sentence:
      "Funds appeared to move rapidly through the account with limited apparent economic rationale.",
    weight: 2,
    matches: (input) => input.triggerTypes.includes("rapid_movement"),
  },
  {
    id: "third-party-obscurity",
    label: "Third-party involvement may obscure beneficial ownership",
    sentence:
      "Third-party involvement may have been used to obscure the true source, beneficiary, or controller of the funds.",
    weight: 3,
    matches: (input) => input.triggerTypes.includes("third_party_involvement"),
  },
  {
    id: "large-value-new-client",
    label: "Large-value activity for a new client",
    sentence:
      "The activity involved a significant value of transactions for a client with limited relationship history.",
    weight: 2,
    matches: (input) =>
      input.clientRelationship === "new" &&
      (input.amountBand === "100k_to_500k" || input.amountBand === "over_500k"),
  },
  {
    id: "high-risk-jurisdiction",
    label: "Jurisdictional exposure increases the risk profile",
    sentence:
      "Jurisdictional exposure increased the money laundering or terrorist financing risk profile of the activity.",
    weight: 2,
    matches: (input) => input.jurisdictions.includes("high_risk_or_sanctioned"),
  },
  {
    id: "multi-jurisdiction-activity",
    label: "Multiple jurisdictions reduce transparency",
    sentence:
      "The movement of value across multiple jurisdictions reduced transparency regarding the purpose and destination of the activity.",
    weight: 2,
    matches: (input) =>
      input.jurisdictions.includes("multiple_jurisdictions") ||
      input.jurisdictions.length > 1,
  },
  {
    id: "source-of-funds",
    label: "Source of funds could not be satisfactorily explained",
    sentence:
      "The source of funds could not be clearly established from the information available.",
    weight: 3,
    matches: (input) => input.suspicionIndicators.includes("source_of_funds_unclear"),
  },
  {
    id: "avoidance-of-controls",
    label: "Behaviour suggested avoidance of controls",
    sentence:
      "The subject's behaviour suggested possible attempts to avoid normal compliance controls or questioning.",
    weight: 3,
    matches: (input) => input.suspicionIndicators.includes("avoidance_tactics"),
  },
  {
    id: "profile-mismatch",
    label: "Activity is inconsistent with the expected client profile",
    sentence:
      "The activity appeared inconsistent with the subject's known or expected profile.",
    weight: 2,
    matches: (input) => input.suspicionIndicators.includes("inconsistent_behaviour"),
  },
  {
    id: "short-timeframe-spike",
    label: "Sudden concentration of activity over a short period",
    sentence:
      "A concentrated burst of activity occurred over a short period without a clear explanation.",
    weight: 2,
    matches: (input) =>
      input.triggerTypes.includes("unusual_transaction") &&
      input.timeframe === "same_day" &&
      (input.transactionCount === "4_to_10" || input.transactionCount === "11_plus"),
  },
  {
    id: "other-trigger",
    label: "Additional unusual activity was noted by staff",
    sentence:
      "Additional unusual activity described by staff contributed to the overall suspicion.",
    weight: 1,
    matches: (input) =>
      input.triggerTypes.includes("other") && input.triggerOtherText.trim().length > 0,
  },
];

const checklist = [
  "Confirm identity verification is complete and current.",
  "Confirm transaction records, timestamps, and references are complete.",
  "Confirm internal escalation or MLRO review has been completed.",
  "Confirm supporting documentation has been retained.",
];

export function createEmptyStrIntake(): StrIntake {
  return {
    triggerTypes: [],
    triggerOtherText: "",
    amountBand: null,
    currency: null,
    currencyOtherText: "",
    transactionCount: null,
    timeframe: null,
    clientRelationship: null,
    customerType: null,
    jurisdictions: [],
    suspicionIndicators: [],
    suspicionOtherText: "",
    freeTextNotes: "",
  };
}

export function toggleValue<T extends OptionValue>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

export function buildStrReadiness(input: StrIntake): StrReadiness {
  const missingFields = requiredFieldChecks
    .filter((field) => !field.isComplete(input))
    .map((field) => field.label);

  if (input.triggerTypes.includes("other") && input.triggerOtherText.trim().length === 0) {
    missingFields.push('Add a short note for the "other" triggering concern.');
  }

  if (input.currency === "other" && input.currencyOtherText.trim().length === 0) {
    missingFields.push('Specify the currency when "other" is selected.');
  }

  if (
    input.suspicionIndicators.includes("other") &&
    input.suspicionOtherText.trim().length === 0
  ) {
    missingFields.push('Add a short note for the "other" suspicion basis.');
  }

  const completedFieldCount =
    requiredFieldChecks.length -
    requiredFieldChecks.filter((field) => !field.isComplete(input)).length;

  return {
    canGenerate: missingFields.length === 0,
    totalRequiredFields: requiredFieldChecks.length,
    completedFieldCount,
    progressPercent: Math.round(
      (completedFieldCount / requiredFieldChecks.length) * 100,
    ),
    missingFields,
  };
}

export function detectRedFlags(input: StrIntake): RedFlag[] {
  return rules.filter((rule) => rule.matches(input));
}

export function deriveSuspicionLevel(flags: RedFlag[]): SuspicionLevel {
  const score = flags.reduce((total, flag) => total + flag.weight, 0);

  if (score >= 8 || flags.length >= 4) {
    return "high";
  }

  if (score >= 4 || flags.length >= 2) {
    return "medium";
  }

  return "low";
}

function formatList(values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function getCurrencyLabel(input: StrIntake): string {
  if (input.currency === "other" && input.currencyOtherText.trim().length > 0) {
    return input.currencyOtherText.trim().toUpperCase();
  }

  if (!input.currency) {
    return "the stated currency";
  }

  return currencyLabels[input.currency];
}

function buildSubjectDescription(input: StrIntake): string {
  const relationship = input.clientRelationship ? input.clientRelationship : "new";
  const subjectType = input.customerType === "business" ? "entity" : "individual";
  const jurisdictions = input.jurisdictions.map(
    (jurisdiction) => jurisdictionLabels[jurisdiction],
  );
  const jurisdictionPhrase =
    jurisdictions.length > 0
      ? ` with activity linked to ${formatList(jurisdictions)}`
      : "";

  return `a ${relationship} ${subjectType} client${jurisdictionPhrase}`;
}

function buildTriggerSummary(input: StrIntake): string {
  const triggers = input.triggerTypes
    .map((trigger) => triggerTypeLabels[trigger])
    .filter((trigger) => trigger !== "Other");

  if (input.triggerTypes.includes("other") && input.triggerOtherText.trim().length > 0) {
    triggers.push(input.triggerOtherText.trim());
  }

  return triggers.length > 0
    ? formatList(triggers).toLowerCase()
    : "unusual activity";
}

function buildTransactionSummary(input: StrIntake): string {
  const countLabel = input.transactionCount
    ? transactionCountLabels[input.transactionCount]
    : "an unspecified number of transactions";
  const amountLabel = input.amountBand
    ? amountBandLabels[input.amountBand]
    : "an unspecified amount";
  const timeframeLabel = input.timeframe
    ? timeframeLabels[input.timeframe]
    : "an unspecified period";
  const jurisdictionLabel =
    input.jurisdictions.length > 0
      ? formatList(
          input.jurisdictions.map((jurisdiction) => jurisdictionLabels[jurisdiction]),
        )
      : "the relevant jurisdictions";

  return `Between ${timeframeLabel}, the subject conducted approximately ${countLabel} totaling ${getCurrencyLabel(input)} ${amountLabel}, involving ${jurisdictionLabel}.`;
}

function buildRiskInterpretation(input: StrIntake, flags: RedFlag[]): string {
  const flagIds = new Set(flags.map((flag) => flag.id));

  if (
    flagIds.has("structuring-pattern") ||
    flagIds.has("fragmented-activity") ||
    flagIds.has("rapid-fund-movement")
  ) {
    return "conceal the source, movement, or disposition of funds";
  }

  if (flagIds.has("third-party-obscurity")) {
    return "obscure the identity of the person or entity behind the activity";
  }

  if (flagIds.has("high-risk-jurisdiction") || flagIds.has("multi-jurisdiction-activity")) {
    return "move value through higher-risk or less transparent jurisdictions";
  }

  if (input.suspicionIndicators.includes("source_of_funds_unclear")) {
    return "introduce funds without a clear legitimate origin";
  }

  return "conduct transactions in a manner inconsistent with legitimate personal or business activity";
}

export function buildNarrative(input: StrIntake, flags: RedFlag[]): string {
  const subjectDescription = buildSubjectDescription(input);
  const triggerSummary = buildTriggerSummary(input);
  const suspiciousIndicators = flags.length > 0
    ? flags.map((flag) => `- ${flag.label}`).join("\n")
    : "- The available facts support further review.";
  const suspicionBasis = [
    ...flags.map((flag) => flag.sentence),
    input.freeTextNotes.trim(),
  ]
    .filter((sentence) => sentence.length > 0)
    .join(" ");
  const riskInterpretation = buildRiskInterpretation(input, flags);

  return [
    "[Subject Description]",
    `The reporting entity identified activity involving ${subjectDescription}, who engaged in ${triggerSummary}.`,
    "",
    "[Transaction Summary]",
    buildTransactionSummary(input),
    "",
    "[Suspicious Indicators]",
    "The activity raised suspicion for the following reasons:",
    suspiciousIndicators,
    "",
    "[Basis for Suspicion]",
    `These factors are inconsistent with the expected profile of the client and suggest potential attempts to ${riskInterpretation}.${suspicionBasis ? ` ${suspicionBasis}` : ""}`,
    "",
    "[Conclusion]",
    "Based on the above, the reporting entity has reasonable grounds to suspect that the transactions are related to the commission of a money laundering or terrorist financing offence.",
  ].join("\n");
}

export function buildStrDraft(input: StrIntake): StrDraftOutput {
  const readiness = buildStrReadiness(input);
  const redFlags = detectRedFlags(input);
  const suspicionLevel = deriveSuspicionLevel(redFlags);

  return {
    redFlags,
    suspicionLevel,
    checklist,
    missingFields: readiness.missingFields,
    narrativeText: buildNarrative(input, redFlags),
    readiness,
  };
}
