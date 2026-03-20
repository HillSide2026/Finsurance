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

export const transactionChannelValues = [
  "cash",
  "wire_transfer",
  "eft",
  "cheque",
  "bank_draft",
  "crypto",
  "other",
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
export type TransactionChannel = (typeof transactionChannelValues)[number];
export type ClientRelationship = (typeof clientRelationshipValues)[number];
export type CustomerType = (typeof customerTypeValues)[number];
export type Jurisdiction = (typeof jurisdictionValues)[number];
export type SuspicionIndicator = (typeof suspicionIndicatorValues)[number];
export type SuspicionLevel = "low" | "medium" | "high";

export type StrCustomerData = {
  name: string;
  referenceId: string;
  dateOfBirthOrIncorporation: string;
  occupationOrBusiness: string;
  expectedActivity: string;
};

export type StrIntake = {
  scenarioPresetId: string | null;
  triggerTypes: TriggerType[];
  triggerOtherText: string;
  amountBand: AmountBand | null;
  currency: Currency | null;
  currencyOtherText: string;
  transactionCount: TransactionCount | null;
  timeframe: Timeframe | null;
  transactionChannels: TransactionChannel[];
  transactionChannelOtherText: string;
  clientRelationship: ClientRelationship | null;
  customerType: CustomerType | null;
  jurisdictions: Jurisdiction[];
  suspicionIndicators: SuspicionIndicator[];
  suspicionOtherText: string;
  customerData: StrCustomerData;
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

export type StrNarrativeSections = {
  subjectDescription: string;
  transactionSummary: string;
  suspiciousIndicators: string[];
  basisForSuspicion: string;
  conclusion: string;
};

export type StrDraftOutput = {
  redFlags: RedFlag[];
  suspicionLevel: SuspicionLevel;
  checklist: string[];
  missingFields: string[];
  missingInfoPrompts: string[];
  narrativeText: string;
  readiness: StrReadiness;
  narrativeSections: StrNarrativeSections;
};

export type StrScenarioPreset = {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  intake: StrIntake;
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

export const transactionChannelLabels: Record<TransactionChannel, string> = {
  cash: "Cash",
  wire_transfer: "Wire transfer",
  eft: "Electronic funds transfer",
  cheque: "Cheque",
  bank_draft: "Bank draft",
  crypto: "Crypto transfer",
  other: "Other",
};

export const transactionChannelNarrativeLabels: Record<TransactionChannel, string> = {
  cash: "cash deposits or withdrawals",
  wire_transfer: "wire transfers",
  eft: "electronic funds transfers",
  cheque: "cheques",
  bank_draft: "bank drafts",
  crypto: "crypto transfers",
  other: "other channels",
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
    label: "Select at least one transaction channel.",
    isComplete: (input: StrIntake) => input.transactionChannels.length > 0,
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
      "The pattern of transactions was consistent with possible structuring intended to avoid reporting thresholds.",
    weight: 3,
    matches: (input) => input.triggerTypes.includes("structuring"),
  },
  {
    id: "cash-structuring",
    label: "Repeated cash activity suggests threshold avoidance",
    sentence:
      "Repeated cash activity appeared calibrated in a manner consistent with threshold avoidance.",
    weight: 3,
    matches: (input) =>
      input.triggerTypes.includes("structuring") &&
      input.transactionChannels.includes("cash") &&
      (input.transactionCount === "4_to_10" || input.transactionCount === "11_plus"),
  },
  {
    id: "fragmented-activity",
    label: "Multiple transactions suggest deliberate fragmentation",
    sentence:
      "The number of transactions suggested that value may have been deliberately fragmented across multiple entries.",
    weight: 2,
    matches: (input) =>
      input.triggerTypes.includes("structuring") &&
      (input.transactionCount === "4_to_10" || input.transactionCount === "11_plus"),
  },
  {
    id: "rapid-fund-movement",
    label: "Rapid movement of funds through the relationship",
    sentence:
      "Funds appeared to move rapidly through the relationship with limited apparent economic rationale.",
    weight: 2,
    matches: (input) => input.triggerTypes.includes("rapid_movement"),
  },
  {
    id: "same-day-pass-through",
    label: "Same-day movement indicates possible pass-through activity",
    sentence:
      "The concentration of same-day transactions indicated potential pass-through activity.",
    weight: 2,
    matches: (input) =>
      input.triggerTypes.includes("rapid_movement") &&
      input.timeframe === "same_day" &&
      (input.transactionCount === "4_to_10" || input.transactionCount === "11_plus"),
  },
  {
    id: "third-party-obscurity",
    label: "Third-party involvement may obscure beneficial ownership",
    sentence:
      "Third-party involvement may have obscured the true source, beneficiary, or controller of the funds.",
    weight: 3,
    matches: (input) => input.triggerTypes.includes("third_party_involvement"),
  },
  {
    id: "new-client-large-value",
    label: "Large-value activity occurred shortly after onboarding",
    sentence:
      "A significant value of activity occurred at an early stage in the client relationship without a clear rationale.",
    weight: 2,
    matches: (input) =>
      input.clientRelationship === "new" &&
      (input.amountBand === "100k_to_500k" || input.amountBand === "over_500k"),
  },
  {
    id: "high-risk-jurisdiction",
    label: "Jurisdictional exposure elevated the risk profile",
    sentence:
      "Jurisdictional exposure elevated the money laundering and terrorist activity financing risk profile of the activity.",
    weight: 2,
    matches: (input) => input.jurisdictions.includes("high_risk_or_sanctioned"),
  },
  {
    id: "multi-jurisdiction-movement",
    label: "Movement across multiple jurisdictions reduced transparency",
    sentence:
      "The movement of value across multiple jurisdictions reduced transparency regarding the purpose and destination of the transactions.",
    weight: 2,
    matches: (input) =>
      input.jurisdictions.includes("multiple_jurisdictions") ||
      input.jurisdictions.length > 1,
  },
  {
    id: "source-of-funds",
    label: "Source of funds could not be satisfactorily established",
    sentence:
      "The source of funds could not be satisfactorily established from the information available.",
    weight: 3,
    matches: (input) => input.suspicionIndicators.includes("source_of_funds_unclear"),
  },
  {
    id: "avoidance-of-controls",
    label: "Behaviour suggested avoidance of compliance controls",
    sentence:
      "The subject's behaviour suggested possible efforts to avoid normal questioning, record collection, or control measures.",
    weight: 3,
    matches: (input) => input.suspicionIndicators.includes("avoidance_tactics"),
  },
  {
    id: "profile-mismatch",
    label: "Observed activity was inconsistent with the expected profile",
    sentence:
      "The observed activity appeared inconsistent with the subject's known or expected profile.",
    weight: 2,
    matches: (input) => input.suspicionIndicators.includes("inconsistent_behaviour"),
  },
  {
    id: "stated-business-mismatch",
    label: "Stated occupation or business did not explain the activity",
    sentence:
      "The stated occupation or business activity did not readily explain the pattern or scale of transactions observed.",
    weight: 2,
    matches: (input) =>
      input.suspicionIndicators.includes("inconsistent_behaviour") &&
      input.customerData.occupationOrBusiness.trim().length > 0,
  },
  {
    id: "electronic-layering",
    label: "Electronic transfer activity increased layering concerns",
    sentence:
      "The use of rapid electronic transfer channels increased concerns that the activity was intended to layer or obscure value.",
    weight: 2,
    matches: (input) =>
      input.triggerTypes.includes("rapid_movement") &&
      (input.transactionChannels.includes("wire_transfer") ||
        input.transactionChannels.includes("eft") ||
        input.transactionChannels.includes("crypto")),
  },
  {
    id: "other-trigger",
    label: "Additional unusual facts were noted by staff",
    sentence:
      "Additional unusual facts documented by staff contributed to the overall suspicion.",
    weight: 1,
    matches: (input) =>
      input.triggerTypes.includes("other") && input.triggerOtherText.trim().length > 0,
  },
];

export function createEmptyCustomerData(): StrCustomerData {
  return {
    name: "",
    referenceId: "",
    dateOfBirthOrIncorporation: "",
    occupationOrBusiness: "",
    expectedActivity: "",
  };
}

export function createEmptyStrIntake(): StrIntake {
  return {
    scenarioPresetId: null,
    triggerTypes: [],
    triggerOtherText: "",
    amountBand: null,
    currency: null,
    currencyOtherText: "",
    transactionCount: null,
    timeframe: null,
    transactionChannels: [],
    transactionChannelOtherText: "",
    clientRelationship: null,
    customerType: null,
    jurisdictions: [],
    suspicionIndicators: [],
    suspicionOtherText: "",
    customerData: createEmptyCustomerData(),
    freeTextNotes: "",
  };
}

function createPresetIntake(
  overrides: Omit<Partial<StrIntake>, "customerData"> & {
    customerData?: Partial<StrCustomerData>;
  },
): StrIntake {
  const empty = createEmptyStrIntake();

  return {
    ...empty,
    ...overrides,
    customerData: {
      ...empty.customerData,
      ...overrides.customerData,
    },
  };
}

export const strScenarioPresets: StrScenarioPreset[] = [
  {
    id: "cash-structuring",
    name: "Cash Structuring",
    description:
      "Repeated cash deposits just below expected reporting thresholds by a newly onboarded client.",
    highlights: ["Structuring", "Cash", "Same-day repetition"],
    intake: createPresetIntake({
      scenarioPresetId: "cash-structuring",
      triggerTypes: ["structuring", "unusual_transaction"],
      amountBand: "10k_to_50k",
      currency: "CAD",
      transactionCount: "4_to_10",
      timeframe: "same_day",
      transactionChannels: ["cash"],
      clientRelationship: "new",
      customerType: "individual",
      jurisdictions: ["canada"],
      suspicionIndicators: ["source_of_funds_unclear", "avoidance_tactics"],
      customerData: {
        name: "Sample Customer",
        referenceId: "CASH-2041",
        occupationOrBusiness: "Self-employed contractor",
        expectedActivity: "Routine salary-sized deposits and everyday personal spending",
      },
      freeTextNotes:
        "Front-line staff recorded that the client gave inconsistent explanations when asked about the source and purpose of the cash activity.",
    }),
  },
  {
    id: "third-party-wire-layering",
    name: "Third-Party Wire Layering",
    description:
      "Funds arrive from and depart to unrelated third parties through a newly established business relationship.",
    highlights: ["Third party", "Wire transfer", "Multiple jurisdictions"],
    intake: createPresetIntake({
      scenarioPresetId: "third-party-wire-layering",
      triggerTypes: ["third_party_involvement", "rapid_movement"],
      amountBand: "100k_to_500k",
      currency: "USD",
      transactionCount: "2_to_3",
      timeframe: "2_to_7_days",
      transactionChannels: ["wire_transfer"],
      clientRelationship: "new",
      customerType: "business",
      jurisdictions: ["canada", "united_states", "multiple_jurisdictions"],
      suspicionIndicators: ["source_of_funds_unclear", "inconsistent_behaviour"],
      customerData: {
        name: "North Corridor Imports Ltd.",
        referenceId: "WIRE-8120",
        dateOfBirthOrIncorporation: "2025-11-12",
        occupationOrBusiness: "Import/export company",
        expectedActivity: "Domestic supplier payments tied to documented invoices",
      },
      freeTextNotes:
        "Staff could not establish a clear commercial rationale for third-party wire instructions or the role of the counterparties involved.",
    }),
  },
  {
    id: "dormant-business-activity-spike",
    name: "Dormant Business Spike",
    description:
      "An existing entity account moves from low routine activity to a concentrated burst of higher-value transfers.",
    highlights: ["Existing client", "Activity spike", "Cross-border movement"],
    intake: createPresetIntake({
      scenarioPresetId: "dormant-business-activity-spike",
      triggerTypes: ["unusual_transaction", "rapid_movement"],
      amountBand: "over_500k",
      currency: "CAD",
      transactionCount: "11_plus",
      timeframe: "1_to_4_weeks",
      transactionChannels: ["eft", "wire_transfer"],
      clientRelationship: "existing",
      customerType: "business",
      jurisdictions: ["canada", "caribbean", "multiple_jurisdictions"],
      suspicionIndicators: ["inconsistent_behaviour", "source_of_funds_unclear"],
      customerData: {
        name: "Harbourline Fabrication Inc.",
        referenceId: "SPIKE-1183",
        occupationOrBusiness: "Metal fabrication business",
        expectedActivity: "Domestic payroll and local vendor payments",
      },
      freeTextNotes:
        "The account had previously shown limited routine business activity before the sudden increase in volume and value.",
    }),
  },
  {
    id: "high-risk-cross-border",
    name: "High-Risk Cross-Border Movement",
    description:
      "Rapid movement of value involving high-risk jurisdictions and limited explanation of the funding source.",
    highlights: ["High-risk geography", "Rapid movement", "Source unclear"],
    intake: createPresetIntake({
      scenarioPresetId: "high-risk-cross-border",
      triggerTypes: ["rapid_movement", "third_party_involvement"],
      amountBand: "50k_to_100k",
      currency: "USD",
      transactionCount: "4_to_10",
      timeframe: "2_to_7_days",
      transactionChannels: ["wire_transfer", "eft"],
      clientRelationship: "existing",
      customerType: "individual",
      jurisdictions: ["canada", "high_risk_or_sanctioned", "multiple_jurisdictions"],
      suspicionIndicators: ["source_of_funds_unclear", "avoidance_tactics"],
      customerData: {
        name: "Sample Individual",
        referenceId: "GEO-4420",
        expectedActivity: "Personal savings and routine domestic banking activity",
      },
      freeTextNotes:
        "The subject resisted providing a clear explanation for the counterparties and ultimate destination of the funds.",
    }),
  },
  {
    id: "new-client-large-transfer",
    name: "New Client Large Transfer",
    description:
      "A new client initiates large-value movement inconsistent with the stated profile and expected account use.",
    highlights: ["New relationship", "Large value", "Profile mismatch"],
    intake: createPresetIntake({
      scenarioPresetId: "new-client-large-transfer",
      triggerTypes: ["unusual_transaction"],
      amountBand: "over_500k",
      currency: "CAD",
      transactionCount: "1",
      timeframe: "same_day",
      transactionChannels: ["bank_draft", "wire_transfer"],
      clientRelationship: "new",
      customerType: "business",
      jurisdictions: ["canada", "united_states"],
      suspicionIndicators: ["inconsistent_behaviour", "source_of_funds_unclear"],
      customerData: {
        name: "Canal Point Consulting Corp.",
        referenceId: "NEW-9017",
        occupationOrBusiness: "Management consulting firm",
        expectedActivity: "Professional services revenue and payroll-related disbursements",
      },
      freeTextNotes:
        "The subject could not provide documentation that connected the size of the transaction to the stated line of business.",
    }),
  },
];

export function cloneStrIntake(intake: StrIntake): StrIntake {
  return {
    ...intake,
    triggerTypes: [...intake.triggerTypes],
    jurisdictions: [...intake.jurisdictions],
    suspicionIndicators: [...intake.suspicionIndicators],
    transactionChannels: [...intake.transactionChannels],
    customerData: {
      ...intake.customerData,
    },
  };
}

export function createIntakeFromPreset(presetId: string): StrIntake {
  const preset = strScenarioPresets.find((item) => item.id === presetId);
  return preset ? cloneStrIntake(preset.intake) : createEmptyStrIntake();
}

export function toggleValue<T extends OptionValue>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

export function buildStrReadiness(input: StrIntake): StrReadiness {
  const missingFields: string[] = requiredFieldChecks
    .filter((field) => !field.isComplete(input))
    .map((field) => field.label);

  if (input.triggerTypes.includes("other") && input.triggerOtherText.trim().length === 0) {
    missingFields.push('Add a short note for the "other" triggering concern.');
  }

  if (input.currency === "other" && input.currencyOtherText.trim().length === 0) {
    missingFields.push('Specify the currency when "other" is selected.');
  }

  if (
    input.transactionChannels.includes("other") &&
    input.transactionChannelOtherText.trim().length === 0
  ) {
    missingFields.push('Specify the transaction channel when "other" is selected.');
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

  if (score >= 10 || flags.length >= 5) {
    return "high";
  }

  if (score >= 5 || flags.length >= 3) {
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

function normalizeSentence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return "";
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
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

function getChannelNarrative(input: StrIntake): string {
  const channels = input.transactionChannels
    .map((channel) => {
      if (channel === "other" && input.transactionChannelOtherText.trim().length > 0) {
        return input.transactionChannelOtherText.trim();
      }

      return transactionChannelNarrativeLabels[channel];
    })
    .filter((value) => value.length > 0);

  return channels.length > 0 ? formatList(channels) : "the available channels";
}

function buildSubjectDescription(input: StrIntake): string {
  const relationship = input.clientRelationship ? `${input.clientRelationship} ` : "";
  const typeLabel = input.customerType === "business" ? "entity client" : "individual client";
  const jurisdictions = input.jurisdictions.map(
    (jurisdiction) => jurisdictionLabels[jurisdiction],
  );
  const jurisdictionPhrase =
    jurisdictions.length > 0
      ? ` associated with ${formatList(jurisdictions)}`
      : "";
  const identifiers: string[] = [];

  if (input.customerData.referenceId.trim().length > 0) {
    identifiers.push(`client reference ${input.customerData.referenceId.trim()}`);
  }

  if (input.customerData.dateOfBirthOrIncorporation.trim().length > 0) {
    identifiers.push(
      `DOB/incorporation ${input.customerData.dateOfBirthOrIncorporation.trim()}`,
    );
  }

  if (input.customerData.name.trim().length > 0) {
    return `${input.customerData.name.trim()}${identifiers.length > 0 ? ` (${identifiers.join("; ")})` : ""}, a ${relationship}${typeLabel}${jurisdictionPhrase}`;
  }

  return `a ${relationship}${typeLabel}${jurisdictionPhrase}${identifiers.length > 0 ? ` (${identifiers.join("; ")})` : ""}`;
}

function buildTriggerSummary(input: StrIntake): string {
  const triggers = input.triggerTypes
    .map((trigger) => triggerTypeLabels[trigger])
    .filter((label) => label !== "Other");

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
  const jurisdictions =
    input.jurisdictions.length > 0
      ? formatList(
          input.jurisdictions.map((jurisdiction) => jurisdictionLabels[jurisdiction]),
        )
      : "the relevant jurisdictions";

  return `Between ${timeframeLabel}, the subject conducted approximately ${countLabel} totaling ${getCurrencyLabel(input)} ${amountLabel} through ${getChannelNarrative(input)}, involving ${jurisdictions}.`;
}

function buildRiskInterpretation(input: StrIntake, flags: RedFlag[]): string {
  const flagIds = new Set(flags.map((flag) => flag.id));

  if (
    flagIds.has("structuring-pattern") ||
    flagIds.has("cash-structuring") ||
    flagIds.has("fragmented-activity")
  ) {
    return "avoid reporting thresholds and fragment the movement of value";
  }

  if (flagIds.has("third-party-obscurity")) {
    return "obscure the identity of the person or entity behind the transactions";
  }

  if (flagIds.has("rapid-fund-movement") || flagIds.has("same-day-pass-through")) {
    return "move funds rapidly through the relationship in a pass-through manner";
  }

  if (
    flagIds.has("high-risk-jurisdiction") ||
    flagIds.has("multi-jurisdiction-movement")
  ) {
    return "move value through higher-risk or less transparent jurisdictions";
  }

  if (input.suspicionIndicators.includes("source_of_funds_unclear")) {
    return "introduce funds without a clearly established legitimate origin";
  }

  return "conduct transactions in a manner inconsistent with legitimate personal or business activity";
}

function buildSuspiciousIndicatorList(
  input: StrIntake,
  flags: RedFlag[],
): string[] {
  const items = flags.map((flag) => `- ${flag.label}`);

  if (
    input.suspicionIndicators.includes("other") &&
    input.suspicionOtherText.trim().length > 0
  ) {
    items.push(`- ${normalizeSentence(input.suspicionOtherText).replace(/[.]$/, "")}`);
  }

  return items.length > 0 ? items : ["- The available facts support further review."];
}

function buildProfileContext(input: StrIntake): string[] {
  const sentences: string[] = [];

  if (input.customerData.occupationOrBusiness.trim().length > 0) {
    sentences.push(
      normalizeSentence(
        `The subject was described as ${input.customerData.occupationOrBusiness.trim()}`,
      ),
    );
  }

  if (input.customerData.expectedActivity.trim().length > 0) {
    sentences.push(
      normalizeSentence(
        `Expected activity on the relationship was described as ${input.customerData.expectedActivity.trim()}`,
      ),
    );
  }

  if (
    input.suspicionIndicators.includes("inconsistent_behaviour") &&
    (input.customerData.occupationOrBusiness.trim().length > 0 ||
      input.customerData.expectedActivity.trim().length > 0)
  ) {
    sentences.push(
      "The observed transactions did not align with the stated customer profile or expected activity.",
    );
  }

  return sentences.filter((sentence) => sentence.length > 0);
}

function buildMissingInfoPrompts(input: StrIntake): string[] {
  const prompts: string[] = [];

  if (input.customerData.name.trim().length === 0) {
    prompts.push("Add the subject's full name or legal name if it is available.");
  }

  if (input.customerData.referenceId.trim().length === 0) {
    prompts.push("Add the internal client, account, or case reference used by the reporting entity.");
  }

  if (input.customerData.occupationOrBusiness.trim().length === 0) {
    prompts.push("Add the customer's stated occupation or business activity.");
  }

  if (input.customerData.expectedActivity.trim().length === 0) {
    prompts.push("Add the expected account activity or business profile used for comparison.");
  }

  if (input.suspicionIndicators.includes("source_of_funds_unclear")) {
    prompts.push(
      "Document what source-of-funds information was requested and why the explanation was not satisfactory.",
    );
  }

  if (input.triggerTypes.includes("third_party_involvement")) {
    prompts.push(
      "Record the identity of the third party and the stated relationship to the customer, if known.",
    );
  }

  if (input.triggerTypes.includes("rapid_movement")) {
    prompts.push(
      "Identify the origin and destination accounts, wallets, or counterparties if that information is available.",
    );
  }

  if (input.transactionChannels.includes("cash")) {
    prompts.push(
      "Confirm cash ticket numbers, instrument references, or branch details for the cash activity.",
    );
  }

  return Array.from(new Set(prompts));
}

function buildChecklist(input: StrIntake): string[] {
  const checklist = [
    "Confirm identity verification is complete and current.",
    "Confirm transaction records, timestamps, and references are complete.",
    "Confirm internal escalation or MLRO review has been completed.",
    "Confirm supporting documentation has been retained.",
  ];

  if (input.suspicionIndicators.includes("source_of_funds_unclear")) {
    checklist.push(
      "Retain source-of-funds enquiries, explanations provided, and any supporting or missing documentation.",
    );
  }

  if (input.triggerTypes.includes("third_party_involvement")) {
    checklist.push(
      "Retain records that identify the third party and explain the reported relationship to the customer.",
    );
  }

  if (input.jurisdictions.includes("high_risk_or_sanctioned")) {
    checklist.push(
      "Retain jurisdictional risk, screening, and sanctions review records relevant to the activity.",
    );
  }

  if (input.triggerTypes.includes("rapid_movement")) {
    checklist.push(
      "Retain origin and destination account details, instructions, and related counterparty information.",
    );
  }

  return Array.from(new Set(checklist));
}

export function buildNarrativeSections(
  input: StrIntake,
  flags: RedFlag[],
): StrNarrativeSections {
  const suspiciousIndicators = buildSuspiciousIndicatorList(input, flags);
  const profileContext = buildProfileContext(input);
  const suspicionBasis = [
    ...flags.map((flag) => flag.sentence),
    ...profileContext,
    normalizeSentence(input.freeTextNotes),
  ]
    .filter((sentence) => sentence.length > 0)
    .join(" ");
  const riskInterpretation = buildRiskInterpretation(input, flags);

  return {
    subjectDescription: `The reporting entity identified activity involving ${buildSubjectDescription(input)}, who engaged in ${buildTriggerSummary(input)}.`,
    transactionSummary: buildTransactionSummary(input),
    suspiciousIndicators,
    basisForSuspicion: `These factors were inconsistent with the expected profile of the client and suggested possible attempts to ${riskInterpretation}.${suspicionBasis ? ` ${suspicionBasis}` : ""}`,
    conclusion:
      "Based on the available information, the reporting entity has reasonable grounds to suspect that the transactions are related to the commission or attempted commission of a money laundering or terrorist activity financing offence.",
  };
}

export function buildNarrative(input: StrIntake, flags: RedFlag[]): string {
  const sections = buildNarrativeSections(input, flags);

  return [
    "[Subject Description]",
    sections.subjectDescription,
    "",
    "[Transaction Summary]",
    sections.transactionSummary,
    "",
    "[Suspicious Indicators]",
    "The activity raised suspicion for the following reasons:",
    ...sections.suspiciousIndicators,
    "",
    "[Basis for Suspicion]",
    sections.basisForSuspicion,
    "",
    "[Conclusion]",
    sections.conclusion,
  ].join("\n");
}

export function buildStrDraft(input: StrIntake): StrDraftOutput {
  const readiness = buildStrReadiness(input);
  const redFlags = detectRedFlags(input);
  const suspicionLevel = deriveSuspicionLevel(redFlags);
  const narrativeSections = buildNarrativeSections(input, redFlags);

  return {
    redFlags,
    suspicionLevel,
    checklist: buildChecklist(input),
    missingFields: readiness.missingFields,
    missingInfoPrompts: buildMissingInfoPrompts(input),
    narrativeText: buildNarrative(input, redFlags),
    readiness,
    narrativeSections,
  };
}
