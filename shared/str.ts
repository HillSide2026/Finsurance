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
export type StrReadinessStatus =
  | "insufficient_information"
  | "guidance_only"
  | "ready_to_draft";

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
  status: StrReadinessStatus;
  summary: string;
  canGenerate: boolean;
  canReviewRiskSignals: boolean;
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
  factsProvided: string[];
  qualityWarnings: string[];
  missingFields: string[];
  missingInfoPrompts: string[];
  narrativeText: string;
  readiness: StrReadiness;
  narrativeSections: StrNarrativeSections;
};

export type StrDraftPackageOptions = {
  productName?: string;
  sessionId?: string;
  sessionTimestamp?: string;
  narrativeText?: string;
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

const timeframeNarrativeLabels: Record<Timeframe, string> = {
  same_day: "Over the same day",
  "2_to_7_days": "Over 2 to 7 days",
  "1_to_4_weeks": "Over 1 to 4 weeks",
  "1_to_3_months": "Over 1 to 3 months",
  over_3_months: "Over more than 3 months",
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

type RequiredFieldCheck = {
  label: string;
  isComplete: (input: StrIntake) => boolean;
};

const requiredFieldChecks: RequiredFieldCheck[] = [
  {
    label: "Select at least one triggering concern.",
    isComplete: (input) => input.triggerTypes.length > 0,
  },
  {
    label: "Choose the approximate total amount range.",
    isComplete: (input) => input.amountBand !== null,
  },
  {
    label: "Choose the transaction currency.",
    isComplete: (input) => input.currency !== null,
  },
  {
    label: "Choose the number of transactions.",
    isComplete: (input) => input.transactionCount !== null,
  },
  {
    label: "Choose the timeframe for the activity.",
    isComplete: (input) => input.timeframe !== null,
  },
  {
    label: "Select at least one transaction channel.",
    isComplete: (input) => input.transactionChannels.length > 0,
  },
  {
    label: "Choose whether the client is new or existing.",
    isComplete: (input) => input.clientRelationship !== null,
  },
  {
    label: "Choose whether the subject is an individual or entity.",
    isComplete: (input) => input.customerType !== null,
  },
  {
    label: "Select at least one jurisdiction.",
    isComplete: (input) => input.jurisdictions.length > 0,
  },
  {
    label: "Select at least one basis for suspicion.",
    isComplete: (input) => input.suspicionIndicators.length > 0,
  },
] as const;

type Rule = RedFlag & {
  matches: (input: StrIntake) => boolean;
};

const electronicTransactionChannels: readonly TransactionChannel[] = [
  "wire_transfer",
  "eft",
  "crypto",
] as const;

const rules: Rule[] = [
  {
    id: "structuring-pattern",
    label: "Possible structuring to avoid reporting thresholds",
    sentence:
      "The transaction pattern was consistent with possible structuring intended to avoid reporting thresholds.",
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
    id: "new-client-pass-through",
    label: "New relationship showed rapid onward movement of funds",
    sentence:
      "Rapid movement of funds through a newly established relationship increased concern that the account was being used as a pass-through vehicle.",
    weight: 2,
    matches: (input) =>
      input.clientRelationship === "new" &&
      input.triggerTypes.includes("rapid_movement") &&
      (usesElectronicChannels(input) || hasElevatedTransactionVolume(input)),
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
    matches: (input) => input.clientRelationship === "new" && hasHighValueActivity(input),
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
    label: "Cross-border movement reduced transparency",
    sentence:
      "Movement of value across jurisdictions reduced transparency regarding the purpose, destination, or counterparties involved.",
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
      input.customerData.occupationOrBusiness.length > 0,
  },
  {
    id: "high-value-profile-mismatch",
    label: "Transaction size materially exceeded the stated customer profile",
    sentence:
      "The size of the activity materially exceeded what would ordinarily be expected from the stated customer profile or anticipated account use.",
    weight: 2,
    matches: (input) =>
      input.suspicionIndicators.includes("inconsistent_behaviour") &&
      hasHighValueActivity(input) &&
      (input.customerData.occupationOrBusiness.length > 0 ||
        input.customerData.expectedActivity.length > 0),
  },
  {
    id: "electronic-layering",
    label: "Electronic transfer activity increased layering concerns",
    sentence:
      "The use of rapid electronic transfer channels increased concerns that the activity was intended to layer or obscure value.",
    weight: 2,
    matches: (input) =>
      input.triggerTypes.includes("rapid_movement") &&
      usesElectronicChannels(input),
  },
  {
    id: "cash-to-electronic-conversion",
    label: "Cash activity was followed by electronic movement of value",
    sentence:
      "The combination of cash activity and electronic movement of value reduced transparency and increased layering concerns.",
    weight: 2,
    matches: (input) =>
      input.transactionChannels.includes("cash") &&
      usesElectronicChannels(input) &&
      (input.triggerTypes.includes("rapid_movement") ||
        input.triggerTypes.includes("structuring")),
  },
  {
    id: "other-trigger",
    label: "Additional unusual facts were noted by staff",
    sentence:
      "Additional unusual facts documented by staff contributed to the overall suspicion.",
    weight: 1,
    matches: (input) =>
      input.triggerTypes.includes("other") && input.triggerOtherText.length > 0,
  },
] as const;

function isOneOf<T extends string>(value: string, values: readonly T[]): value is T {
  return (values as readonly string[]).includes(value);
}

function normalizeWhitespace(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function normalizeNullableSelection<T extends string>(
  value: unknown,
  values: readonly T[],
): T | null {
  return typeof value === "string" && isOneOf(value, values) ? value : null;
}

function normalizeOptionList<T extends string>(
  values: unknown,
  allowedValues: readonly T[],
): T[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set<T>();

  for (const value of values) {
    if (typeof value === "string" && isOneOf(value, allowedValues)) {
      seen.add(value);
    }
  }

  return Array.from(seen);
}

function capitalizeFirst(value: string): string {
  return value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

function normalizeSentence(text: string): string {
  const trimmed = normalizeWhitespace(text);
  if (trimmed.length === 0) {
    return "";
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
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

function hasHighValueActivity(input: StrIntake): boolean {
  return input.amountBand === "100k_to_500k" || input.amountBand === "over_500k";
}

function hasElevatedTransactionVolume(input: StrIntake): boolean {
  return input.transactionCount === "4_to_10" || input.transactionCount === "11_plus";
}

function usesElectronicChannels(input: StrIntake): boolean {
  return electronicTransactionChannels.some((channel) =>
    input.transactionChannels.includes(channel),
  );
}

function hasCrossBorderExposure(input: StrIntake): boolean {
  return (
    input.jurisdictions.includes("high_risk_or_sanctioned") ||
    input.jurisdictions.includes("multiple_jurisdictions") ||
    input.jurisdictions.length > 1
  );
}

function notesContainAny(input: StrIntake, terms: string[]): boolean {
  const note = input.freeTextNotes.toLowerCase();
  return terms.some((term) => note.includes(term));
}

function createEmptyNarrativeSections(): StrNarrativeSections {
  return {
    subjectDescription: "",
    transactionSummary: "",
    suspiciousIndicators: [],
    basisForSuspicion: "",
    conclusion: "",
  };
}

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

function normalizeCustomerData(value: unknown): StrCustomerData {
  const customerData = value && typeof value === "object" ? value : {};

  return {
    name: normalizeWhitespace((customerData as Partial<StrCustomerData>).name),
    referenceId: normalizeWhitespace(
      (customerData as Partial<StrCustomerData>).referenceId,
    ),
    dateOfBirthOrIncorporation: normalizeWhitespace(
      (customerData as Partial<StrCustomerData>).dateOfBirthOrIncorporation,
    ),
    occupationOrBusiness: normalizeWhitespace(
      (customerData as Partial<StrCustomerData>).occupationOrBusiness,
    ),
    expectedActivity: normalizeWhitespace(
      (customerData as Partial<StrCustomerData>).expectedActivity,
    ),
  };
}

export function normalizeStrIntake(input: Partial<StrIntake> | null | undefined): StrIntake {
  const empty = createEmptyStrIntake();
  const raw = input ?? empty;
  const triggerTypes = normalizeOptionList(raw.triggerTypes, triggerTypeValues);
  const transactionChannels = normalizeOptionList(
    raw.transactionChannels,
    transactionChannelValues,
  );
  const suspicionIndicators = normalizeOptionList(
    raw.suspicionIndicators,
    suspicionIndicatorValues,
  );

  return {
    scenarioPresetId: normalizeWhitespace(raw.scenarioPresetId) || null,
    triggerTypes,
    triggerOtherText: triggerTypes.includes("other")
      ? normalizeWhitespace(raw.triggerOtherText)
      : "",
    amountBand: normalizeNullableSelection(raw.amountBand, amountBandValues),
    currency: normalizeNullableSelection(raw.currency, currencyValues),
    currencyOtherText:
      raw.currency === "other" ? normalizeWhitespace(raw.currencyOtherText).toUpperCase() : "",
    transactionCount: normalizeNullableSelection(
      raw.transactionCount,
      transactionCountValues,
    ),
    timeframe: normalizeNullableSelection(raw.timeframe, timeframeValues),
    transactionChannels,
    transactionChannelOtherText: transactionChannels.includes("other")
      ? normalizeWhitespace(raw.transactionChannelOtherText)
      : "",
    clientRelationship: normalizeNullableSelection(
      raw.clientRelationship,
      clientRelationshipValues,
    ),
    customerType: normalizeNullableSelection(raw.customerType, customerTypeValues),
    jurisdictions: normalizeOptionList(raw.jurisdictions, jurisdictionValues),
    suspicionIndicators,
    suspicionOtherText: suspicionIndicators.includes("other")
      ? normalizeWhitespace(raw.suspicionOtherText)
      : "",
    customerData: normalizeCustomerData(raw.customerData),
    freeTextNotes: normalizeWhitespace(raw.freeTextNotes),
  };
}

function createPresetIntake(
  overrides: Omit<Partial<StrIntake>, "customerData"> & {
    customerData?: Partial<StrCustomerData>;
  },
): StrIntake {
  const empty = createEmptyStrIntake();

  return normalizeStrIntake({
    ...empty,
    ...overrides,
    customerData: {
      ...empty.customerData,
      ...overrides.customerData,
    },
  });
}

export const strScenarioPresets: StrScenarioPreset[] = [
  {
    id: "cash-structuring",
    name: "Cash Structuring",
    description:
      "Repeated cash deposits just below expected reporting thresholds by a newly onboarded client.",
    highlights: ["High suspicion", "Structuring", "Cash", "Same-day repetition"],
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
    highlights: ["High suspicion", "Third party", "Wire transfer", "Multiple jurisdictions"],
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
    highlights: ["High suspicion", "Existing client", "Activity spike", "Cross-border movement"],
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
    highlights: ["High suspicion", "High-risk geography", "Rapid movement", "Source unclear"],
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
    highlights: ["Medium suspicion", "New relationship", "Large value", "Profile mismatch"],
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
  {
    id: "medium-risk-purpose-gap",
    name: "Medium-Risk Purpose Gap",
    description:
      "An existing client moves funds cross-border with an unclear transaction purpose but without the strongest structuring indicators.",
    highlights: ["Medium suspicion", "Cross-border", "Purpose gap", "Existing client"],
    intake: createPresetIntake({
      scenarioPresetId: "medium-risk-purpose-gap",
      triggerTypes: ["unusual_transaction", "rapid_movement"],
      amountBand: "50k_to_100k",
      currency: "USD",
      transactionCount: "2_to_3",
      timeframe: "2_to_7_days",
      transactionChannels: ["eft"],
      clientRelationship: "existing",
      customerType: "individual",
      jurisdictions: ["canada", "united_states"],
      suspicionIndicators: ["source_of_funds_unclear"],
      customerData: {
        name: "Elm Street Holdings",
        referenceId: "MID-2274",
        occupationOrBusiness: "Property management",
        expectedActivity: "Domestic rent collection and ordinary property expenses",
      },
      freeTextNotes:
        "Staff could not obtain a clear explanation for the business purpose of the outbound transfer instructions.",
    }),
  },
  {
    id: "low-information-walk-in",
    name: "Low-Information Walk-In",
    description:
      "A walk-in cash scenario with enough signal for preliminary guidance but not enough detail to assemble a draft.",
    highlights: ["Guidance only", "Insufficient detail", "Source unclear"],
    intake: createPresetIntake({
      scenarioPresetId: "low-information-walk-in",
      triggerTypes: ["unusual_transaction"],
      amountBand: "10k_to_50k",
      currency: "CAD",
      transactionChannels: ["cash"],
      suspicionIndicators: ["source_of_funds_unclear"],
      freeTextNotes:
        "The customer could not satisfactorily explain the source of the funds at the counter.",
    }),
  },
  {
    id: "conflicting-structuring-intake",
    name: "Conflicting Structuring Intake",
    description:
      "A complete intake that contains weak or conflicting facts so the operator can see the quality warnings before drafting.",
    highlights: ["Conflict check", "Quality warning", "QA preset"],
    intake: createPresetIntake({
      scenarioPresetId: "conflicting-structuring-intake",
      triggerTypes: ["structuring"],
      amountBand: "under_10k",
      currency: "CAD",
      transactionCount: "1",
      timeframe: "over_3_months",
      transactionChannels: ["bank_draft"],
      clientRelationship: "existing",
      customerType: "business",
      jurisdictions: ["multiple_jurisdictions"],
      suspicionIndicators: ["source_of_funds_unclear"],
      customerData: {
        name: "North Harbour Services Ltd.",
        referenceId: "QA-1190",
      },
      freeTextNotes:
        "The intake described the activity as structuring, but only a single transaction was entered and the jurisdictions were not named.",
    }),
  },
];

export function cloneStrIntake(intake: StrIntake): StrIntake {
  return normalizeStrIntake(intake);
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

function buildConditionalFieldChecks(input: StrIntake): RequiredFieldCheck[] {
  const checks: RequiredFieldCheck[] = [];

  if (input.triggerTypes.includes("other")) {
    checks.push({
      label: 'Add a short note for the "other" triggering concern.',
      isComplete: (draftInput) => draftInput.triggerOtherText.length > 0,
    });
  }

  if (input.currency === "other") {
    checks.push({
      label: 'Specify the currency when "other" is selected.',
      isComplete: (draftInput) => draftInput.currencyOtherText.length > 0,
    });
  }

  if (input.transactionChannels.includes("other")) {
    checks.push({
      label: 'Specify the transaction channel when "other" is selected.',
      isComplete: (draftInput) => draftInput.transactionChannelOtherText.length > 0,
    });
  }

  if (input.suspicionIndicators.includes("other")) {
    checks.push({
      label: 'Add a short note for the "other" suspicion basis.',
      isComplete: (draftInput) => draftInput.suspicionOtherText.length > 0,
    });
  }

  return checks;
}

function deriveReadinessStatus(
  input: StrIntake,
  missingFields: string[],
): Pick<StrReadiness, "status" | "summary" | "canGenerate" | "canReviewRiskSignals"> {
  if (missingFields.length === 0) {
    return {
      status: "ready_to_draft",
      summary: "The intake is complete enough to generate a draft narrative.",
      canGenerate: true,
      canReviewRiskSignals: true,
    };
  }

  const hasTransactionContext =
    input.transactionChannels.length > 0 ||
    [input.amountBand, input.currency, input.transactionCount, input.timeframe].filter(
      Boolean,
    ).length >= 2;
  const hasCustomerContext =
    input.clientRelationship !== null ||
    input.customerType !== null ||
    input.jurisdictions.length > 0 ||
    input.customerData.name.length > 0 ||
    input.customerData.referenceId.length > 0;
  const signalCount = [
    input.triggerTypes.length > 0,
    hasTransactionContext,
    hasCustomerContext,
    input.suspicionIndicators.length > 0,
  ].filter(Boolean).length;

  if (input.triggerTypes.length > 0 && input.suspicionIndicators.length > 0 && signalCount >= 3) {
    return {
      status: "guidance_only",
      summary:
        "There is enough information to surface preliminary risk signals, but key intake fields still need to be completed before drafting.",
      canGenerate: false,
      canReviewRiskSignals: true,
    };
  }

  return {
    status: "insufficient_information",
    summary:
      "There is not yet enough structured information to assess the scenario reliably. Start by capturing the trigger, transaction pattern, and basis for suspicion.",
    canGenerate: false,
    canReviewRiskSignals: false,
  };
}

export function buildStrReadiness(input: StrIntake): StrReadiness {
  const normalizedInput = normalizeStrIntake(input);
  const allChecks = [
    ...requiredFieldChecks,
    ...buildConditionalFieldChecks(normalizedInput),
  ];
  const missingFields = allChecks
    .filter((field) => !field.isComplete(normalizedInput))
    .map((field) => field.label);
  const completedFieldCount = allChecks.filter((field) =>
    field.isComplete(normalizedInput),
  ).length;
  const totalRequiredFields = allChecks.length;
  const readinessState = deriveReadinessStatus(normalizedInput, missingFields);

  return {
    ...readinessState,
    totalRequiredFields,
    completedFieldCount,
    progressPercent:
      totalRequiredFields === 0
        ? 0
        : Math.round((completedFieldCount / totalRequiredFields) * 100),
    missingFields,
  };
}

export function detectRedFlags(input: StrIntake): RedFlag[] {
  const normalizedInput = normalizeStrIntake(input);

  return rules
    .filter((rule) => rule.matches(normalizedInput))
    .map(({ matches: _matches, ...flag }) => flag);
}

export function deriveSuspicionLevel(flags: RedFlag[]): SuspicionLevel {
  const score = flags.reduce((total, flag) => total + flag.weight, 0);

  if (score >= 12 || flags.length >= 6) {
    return "high";
  }

  if (score >= 6 || flags.length >= 3) {
    return "medium";
  }

  return "low";
}

function getCurrencyLabel(input: StrIntake): string {
  if (input.currency === "other" && input.currencyOtherText.length > 0) {
    return input.currencyOtherText;
  }

  if (!input.currency) {
    return "the stated currency";
  }

  return currencyLabels[input.currency];
}

function getChannelNarrative(input: StrIntake): string {
  const channels = input.transactionChannels
    .map((channel) => {
      if (channel === "other" && input.transactionChannelOtherText.length > 0) {
        return input.transactionChannelOtherText;
      }

      return transactionChannelNarrativeLabels[channel];
    })
    .filter((value) => value.length > 0);

  return channels.length > 0 ? formatList(channels) : "the available channels";
}

function getJurisdictionNarrative(input: StrIntake): string {
  const jurisdictionCopy = input.jurisdictions
    .map((jurisdiction) => jurisdictionLabels[jurisdiction])
    .filter((value) => value.length > 0);

  return jurisdictionCopy.length > 0
    ? formatList(jurisdictionCopy)
    : "the relevant jurisdictions";
}

function buildSubjectDescription(input: StrIntake): string {
  const relationship =
    input.clientRelationship !== null
      ? clientRelationshipLabels[input.clientRelationship].toLowerCase()
      : "client";
  const typeLabel = input.customerType === "business" ? "entity client" : "individual client";
  const jurisdictionPhrase =
    input.jurisdictions.length > 0
      ? ` associated with ${getJurisdictionNarrative(input)}`
      : "";
  const identifiers: string[] = [];

  if (input.customerData.referenceId.length > 0) {
    identifiers.push(`client reference ${input.customerData.referenceId}`);
  }

  if (input.customerData.dateOfBirthOrIncorporation.length > 0) {
    identifiers.push(
      `DOB/incorporation ${input.customerData.dateOfBirthOrIncorporation}`,
    );
  }

  const identitySuffix = identifiers.length > 0 ? ` (${identifiers.join("; ")})` : "";

  if (input.customerData.name.length > 0) {
    return `${input.customerData.name}${identitySuffix}, a ${relationship} ${typeLabel}${jurisdictionPhrase}`;
  }

  return `a ${relationship} ${typeLabel}${jurisdictionPhrase}${identitySuffix}`;
}

function buildTriggerSummary(input: StrIntake): string {
  const triggers = input.triggerTypes
    .map((trigger) => triggerTypeLabels[trigger])
    .filter((label) => label !== "Other");

  if (input.triggerTypes.includes("other") && input.triggerOtherText.length > 0) {
    triggers.push(input.triggerOtherText);
  }

  return triggers.length > 0 ? formatList(triggers).toLowerCase() : "unusual activity";
}

function buildTransactionSummary(input: StrIntake): string {
  const timeframeLead = input.timeframe
    ? timeframeNarrativeLabels[input.timeframe]
    : "Over an unspecified period";
  const countLabel = input.transactionCount
    ? transactionCountLabels[input.transactionCount]
    : "an unspecified number of transactions";
  const amountLabel = input.amountBand
    ? amountBandLabels[input.amountBand]
    : "an unspecified amount";

  return `${timeframeLead}, the subject conducted approximately ${countLabel} totaling ${getCurrencyLabel(input)} ${amountLabel} through ${getChannelNarrative(input)}, involving ${getJurisdictionNarrative(input)}.`;
}

function buildRiskInterpretation(input: StrIntake, flags: RedFlag[]): string {
  const flagIds = new Set(flags.map((flag) => flag.id));

  if (flagIds.has("cash-to-electronic-conversion")) {
    return "layer or obscure the movement of value across cash and electronic channels";
  }

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

  if (flagIds.has("new-client-pass-through")) {
    return "move value rapidly through a newly established relationship before the activity can be properly understood";
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

  if (flagIds.has("high-value-profile-mismatch")) {
    return "conduct activity materially out of line with the stated customer profile";
  }

  return "conduct transactions in a manner inconsistent with legitimate personal or business activity";
}

function buildSuspiciousIndicatorList(input: StrIntake, flags: RedFlag[]): string[] {
  const items = flags.map((flag) => `- ${flag.label}`);

  if (items.length === 0) {
    const fallbackItems = input.suspicionIndicators
      .map((indicator) => suspicionIndicatorLabels[indicator])
      .filter((label) => label !== "Other")
      .map((label) => `- ${label}`);
    items.push(...fallbackItems);
  }

  if (input.suspicionIndicators.includes("other") && input.suspicionOtherText.length > 0) {
    items.push(`- ${normalizeSentence(input.suspicionOtherText).replace(/[.]$/, "")}`);
  }

  return items.length > 0 ? items : ["- The available facts support further review."];
}

function buildFactsProvided(input: StrIntake): string[] {
  const facts: string[] = [];
  const subjectIdentifiers: string[] = [];

  if (input.triggerTypes.length > 0) {
    facts.push(`Triggering concerns: ${capitalizeFirst(buildTriggerSummary(input))}.`);
  }

  if (
    input.amountBand !== null ||
    input.currency !== null ||
    input.transactionCount !== null ||
    input.timeframe !== null ||
    input.transactionChannels.length > 0
  ) {
    facts.push(`Transaction pattern: ${buildTransactionSummary(input)}`);
  }

  if (input.customerData.name.length > 0) {
    subjectIdentifiers.push(`name ${input.customerData.name}`);
  }

  if (input.customerData.referenceId.length > 0) {
    subjectIdentifiers.push(`internal reference ${input.customerData.referenceId}`);
  }

  if (input.customerData.dateOfBirthOrIncorporation.length > 0) {
    subjectIdentifiers.push(
      `DOB/incorporation ${input.customerData.dateOfBirthOrIncorporation}`,
    );
  }

  if (subjectIdentifiers.length > 0) {
    facts.push(`Subject identifiers: ${capitalizeFirst(formatList(subjectIdentifiers))}.`);
  }

  const contextParts: string[] = [];

  if (input.clientRelationship !== null) {
    contextParts.push(clientRelationshipLabels[input.clientRelationship].toLowerCase());
  }

  if (input.customerType !== null) {
    contextParts.push(customerTypeLabels[input.customerType].toLowerCase());
  }

  if (input.jurisdictions.length > 0) {
    contextParts.push(`associated with ${getJurisdictionNarrative(input)}`);
  }

  if (contextParts.length > 0) {
    facts.push(`Customer context: ${capitalizeFirst(contextParts.join(" "))}.`);
  }

  if (input.customerData.occupationOrBusiness.length > 0) {
    facts.push(
      `Stated occupation or business: ${normalizeSentence(
        input.customerData.occupationOrBusiness,
      )}`,
    );
  }

  if (input.customerData.expectedActivity.length > 0) {
    facts.push(
      `Expected activity: ${normalizeSentence(input.customerData.expectedActivity)}`,
    );
  }

  if (input.freeTextNotes.length > 0) {
    facts.push(`Staff observations: ${normalizeSentence(input.freeTextNotes)}`);
  }

  return facts;
}

function buildQualityWarnings(input: StrIntake): string[] {
  const warnings: string[] = [];

  if (
    input.triggerTypes.includes("structuring") &&
    (input.transactionCount === "1" || input.transactionCount === null)
  ) {
    warnings.push(
      "Structuring usually involves multiple transactions. Confirm the transaction count or reconsider the structuring trigger.",
    );
  }

  if (
    input.triggerTypes.includes("rapid_movement") &&
    (input.timeframe === "1_to_3_months" || input.timeframe === "over_3_months")
  ) {
    warnings.push(
      "Rapid movement is usually concentrated over a shorter period. Confirm the timeframe or the trigger selection.",
    );
  }

  if (input.suspicionIndicators.includes("inconsistent_behaviour")) {
    if (input.customerData.expectedActivity.length === 0) {
      warnings.push(
        "Add the customer's expected activity so the draft can explain why the transactions were inconsistent with the profile.",
      );
    }

    if (input.customerData.occupationOrBusiness.length === 0) {
      warnings.push(
        "Add the stated occupation or business activity so the profile mismatch can be explained concretely.",
      );
    }
  }

  if (
    input.suspicionIndicators.includes("source_of_funds_unclear") &&
    input.freeTextNotes.length === 0
  ) {
    warnings.push(
      "Add a short factual note describing what source-of-funds explanation or documents were requested and why they were not satisfactory.",
    );
  }

  if (
    input.triggerTypes.includes("third_party_involvement") &&
    input.freeTextNotes.length === 0
  ) {
    warnings.push(
      "Add a short note describing the third party's role or why the third-party involvement reduced transparency.",
    );
  }

  if (
    input.jurisdictions.includes("multiple_jurisdictions") &&
    input.jurisdictions.length === 1
  ) {
    warnings.push(
      "Name the jurisdictions involved rather than relying only on the generic multiple-jurisdictions selection.",
    );
  }

  if (input.customerType === "business" && input.customerData.occupationOrBusiness.length === 0) {
    warnings.push(
      "Add the entity's line of business so the activity can be compared against the stated customer profile.",
    );
  }

  if (
    input.clientRelationship === "new" &&
    hasHighValueActivity(input) &&
    input.customerData.expectedActivity.length === 0
  ) {
    warnings.push(
      "Add the expected activity established at onboarding, or note that none was documented, so the draft can explain why the early high-value activity was unusual.",
    );
  }

  if (
    usesElectronicChannels(input) &&
    (input.triggerTypes.includes("rapid_movement") || hasCrossBorderExposure(input)) &&
    !notesContainAny(input, [
      "origin",
      "destination",
      "counterparty",
      "beneficiary",
      "sender",
      "recipient",
      "wallet",
      "account",
    ])
  ) {
    warnings.push(
      "Add the origin and destination account, wallet, or counterparty details if they are known. Those facts materially improve rapid-movement and cross-border drafts.",
    );
  }

  if (
    (input.triggerTypes.includes("unusual_transaction") ||
      input.suspicionIndicators.includes("inconsistent_behaviour")) &&
    !notesContainAny(input, [
      "purpose",
      "rationale",
      "invoice",
      "business reason",
      "commercial rationale",
      "reason",
    ])
  ) {
    warnings.push(
      "Add the stated purpose or commercial rationale that was given for the transaction, even if the explanation was incomplete or not credible.",
    );
  }

  if (input.freeTextNotes.length === 0 && input.triggerTypes.length > 0) {
    warnings.push(
      "Add a concise staff note describing what was observed, said, or requested. It will materially improve the draft narrative.",
    );
  }

  return Array.from(new Set(warnings));
}

function buildMissingInfoPrompts(input: StrIntake): string[] {
  const prompts: string[] = [];

  if (input.customerData.name.length === 0) {
    prompts.push("Add the subject's full name or legal name if it is available.");
  }

  if (input.customerData.referenceId.length === 0) {
    prompts.push(
      "Add the internal client, account, or case reference used by the reporting entity.",
    );
  }

  if (input.customerData.occupationOrBusiness.length === 0) {
    prompts.push("Add the customer's stated occupation or business activity.");
  }

  if (input.customerData.expectedActivity.length === 0) {
    prompts.push(
      "Add the expected account activity or business profile used for comparison, if known.",
    );
  }

  if (input.suspicionIndicators.includes("source_of_funds_unclear")) {
    prompts.push(
      "Document what source-of-funds information was requested and why the explanation was not satisfactory.",
    );
  }

  if (
    input.triggerTypes.includes("unusual_transaction") ||
    input.suspicionIndicators.includes("inconsistent_behaviour")
  ) {
    prompts.push(
      "Capture the stated purpose of the transaction(s) and why that explanation did not fit the observed activity.",
    );
  }

  if (input.triggerTypes.includes("third_party_involvement")) {
    prompts.push(
      "Record the identity of the third party and the stated relationship to the customer, if known.",
    );
  }

  if (
    input.triggerTypes.includes("rapid_movement") ||
    usesElectronicChannels(input)
  ) {
    prompts.push(
      "Identify the origin and destination accounts, wallets, or counterparties if that information is available.",
    );
  }

  if (
    input.jurisdictions.includes("high_risk_or_sanctioned") ||
    input.jurisdictions.includes("multiple_jurisdictions") ||
    input.jurisdictions.length > 1
  ) {
    prompts.push(
      "Record the specific jurisdictions involved and the role each jurisdiction played in the movement of value.",
    );
  }

  if (input.transactionChannels.includes("cash")) {
    prompts.push(
      "Confirm cash ticket numbers, instrument references, or branch details for the cash activity.",
    );
  }

  if (input.clientRelationship === "new" && hasHighValueActivity(input)) {
    prompts.push(
      "Record what activity was expected at onboarding and whether the reported transaction matched that expectation.",
    );
  }

  if (input.transactionChannels.includes("cash") && usesElectronicChannels(input)) {
    prompts.push(
      "Document whether cash activity was followed by outgoing electronic movement, including the timing between those steps and any linked references.",
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

  if (
    input.triggerTypes.includes("rapid_movement") ||
    input.transactionChannels.includes("wire_transfer") ||
    input.transactionChannels.includes("eft") ||
    input.transactionChannels.includes("crypto")
  ) {
    checklist.push(
      "Retain origin and destination account details, instructions, and related counterparty information.",
    );
  }

  return Array.from(new Set(checklist));
}

function buildBasisForSuspicion(input: StrIntake, flags: RedFlag[]): string {
  const flagIds = new Set(flags.map((flag) => flag.id));
  const riskDrivers: string[] = [];

  if (
    flagIds.has("structuring-pattern") ||
    flagIds.has("cash-structuring") ||
    flagIds.has("fragmented-activity")
  ) {
    riskDrivers.push("a transaction pattern consistent with possible structuring");
  }

  if (flagIds.has("rapid-fund-movement") || flagIds.has("same-day-pass-through")) {
    riskDrivers.push("rapid movement of funds with limited apparent economic rationale");
  }

  if (flagIds.has("new-client-pass-through")) {
    riskDrivers.push("rapid movement through a newly established client relationship");
  }

  if (flagIds.has("third-party-obscurity")) {
    riskDrivers.push("third-party involvement that reduced transparency");
  }

  if (
    flagIds.has("high-risk-jurisdiction") ||
    flagIds.has("multi-jurisdiction-movement")
  ) {
    riskDrivers.push("cross-border movement that reduced transparency");
  }

  if (flagIds.has("source-of-funds")) {
    riskDrivers.push("an unsatisfactory explanation for the source of funds");
  }

  if (flagIds.has("avoidance-of-controls")) {
    riskDrivers.push("behaviour that suggested avoidance of normal compliance questioning");
  }

  if (flagIds.has("profile-mismatch") || flagIds.has("stated-business-mismatch")) {
    riskDrivers.push("activity that did not align with the stated customer profile");
  }

  if (flagIds.has("high-value-profile-mismatch")) {
    riskDrivers.push("transaction size that materially exceeded the stated customer profile");
  }

  if (flagIds.has("cash-to-electronic-conversion")) {
    riskDrivers.push("cash activity followed by electronic movement that reduced transparency");
  }

  const basisParts = [
    riskDrivers.length > 0
      ? `Taken together, the available facts indicated ${formatList(
          riskDrivers,
        )} and were consistent with possible attempts to ${buildRiskInterpretation(
          input,
          flags,
        )}.`
      : `Taken together, the available facts were consistent with possible attempts to ${buildRiskInterpretation(
          input,
          flags,
        )}.`,
  ];

  if (
    input.suspicionIndicators.includes("inconsistent_behaviour") &&
    (input.customerData.occupationOrBusiness.length > 0 ||
      input.customerData.expectedActivity.length > 0)
  ) {
    basisParts.push(
      "The observed activity did not align with the stated customer profile or expected activity.",
    );
  }

  if (input.freeTextNotes.length > 0) {
    basisParts.push(normalizeSentence(input.freeTextNotes));
  }

  return basisParts.join(" ");
}

export function buildNarrativeSections(
  input: StrIntake,
  flags: RedFlag[],
): StrNarrativeSections {
  const normalizedInput = normalizeStrIntake(input);

  return {
    subjectDescription: `The reporting entity identified activity involving ${buildSubjectDescription(
      normalizedInput,
    )}, who engaged in ${buildTriggerSummary(normalizedInput)}.`,
    transactionSummary: buildTransactionSummary(normalizedInput),
    suspiciousIndicators: buildSuspiciousIndicatorList(normalizedInput, flags),
    basisForSuspicion: buildBasisForSuspicion(normalizedInput, flags),
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

const draftPackageReadinessLabels: Record<StrReadinessStatus, string> = {
  insufficient_information: "Insufficient information",
  guidance_only: "Preliminary guidance only",
  ready_to_draft: "Ready to draft",
};

const draftPackageSuspicionLabels: Record<SuspicionLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function buildPackageList(items: string[], emptyCopy: string): string[] {
  if (items.length === 0) {
    return [`- ${emptyCopy}`];
  }

  return items.map((item) => (item.startsWith("- ") ? item : `- ${item}`));
}

function formatSessionTimestamp(value: string | undefined): string {
  if (!value) {
    return "";
  }

  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? value : timestamp.toISOString();
}

export function buildDraftPackageText(
  draft: StrDraftOutput,
  options: StrDraftPackageOptions = {},
): string {
  const lines: string[] = [];
  const packageNarrative =
    typeof options.narrativeText === "string"
      ? options.narrativeText.trim()
      : draft.narrativeText.trim();

  if (options.productName) {
    lines.push(`${options.productName} STR Draft Package`);
  } else {
    lines.push("STR Draft Package");
  }

  if (options.sessionId) {
    lines.push(`Session: ${options.sessionId}`);
  }

  const formattedTimestamp = formatSessionTimestamp(options.sessionTimestamp);
  if (formattedTimestamp) {
    lines.push(`Session started: ${formattedTimestamp}`);
  }

  lines.push(`Readiness: ${draftPackageReadinessLabels[draft.readiness.status]}`);
  lines.push(`Suspicion strength: ${draftPackageSuspicionLabels[draft.suspicionLevel]}`);
  lines.push("");
  lines.push("[Facts Provided]");
  lines.push(...buildPackageList(draft.factsProvided, "No fact summary is available."));
  lines.push("");
  lines.push("[Detected Red Flags]");
  lines.push(
    ...buildPackageList(
      draft.redFlags.map((flag) => flag.label),
      "No deterministic red flags were generated from the current intake.",
    ),
  );
  lines.push("");
  lines.push("[Input Quality Notes]");
  lines.push(
    ...buildPackageList(
      draft.qualityWarnings,
      "No input quality warnings were generated from the current intake.",
    ),
  );
  lines.push("");
  lines.push("[Draft Narrative]");
  lines.push(
    packageNarrative.length > 0
      ? packageNarrative
      : "Narrative not generated. Complete the missing required fields before drafting.",
  );
  lines.push("");
  lines.push("[Missing Information / Follow-Up]");
  lines.push(
    ...buildPackageList(
      draft.missingInfoPrompts,
      "No additional follow-up prompts were generated from the current intake.",
    ),
  );
  lines.push("");
  lines.push("[Compliance Checklist]");
  lines.push(
    ...buildPackageList(
      draft.checklist,
      "No compliance checklist items were generated from the current intake.",
    ),
  );

  return lines.join("\n");
}

export function buildStrDraft(input: StrIntake): StrDraftOutput {
  const normalizedInput = normalizeStrIntake(input);
  const readiness = buildStrReadiness(normalizedInput);
  const redFlags = detectRedFlags(normalizedInput);
  const suspicionLevel = deriveSuspicionLevel(redFlags);
  const narrativeSections = readiness.canGenerate
    ? buildNarrativeSections(normalizedInput, redFlags)
    : createEmptyNarrativeSections();

  return {
    redFlags,
    suspicionLevel,
    checklist: buildChecklist(normalizedInput),
    factsProvided: buildFactsProvided(normalizedInput),
    qualityWarnings: buildQualityWarnings(normalizedInput),
    missingFields: readiness.missingFields,
    missingInfoPrompts: buildMissingInfoPrompts(normalizedInput),
    narrativeText: readiness.canGenerate
      ? buildNarrative(normalizedInput, redFlags)
      : "",
    readiness,
    narrativeSections,
  };
}
