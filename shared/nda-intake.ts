import { z } from "zod";

export const ndaProvinceValues = [
  "ontario",
  "british_columbia",
  "alberta",
] as const;

export const ndaMutualityValues = ["mutual", "unilateral"] as const;

export const ndaReturnOfInformationValues = [
  "return",
  "destroy",
  "return_or_destroy",
] as const;

export const consultationStatusValues = [
  "intake_in_progress",
  "ready_for_generation",
  "draft_generated",
] as const;

export const ndaProvinceSchema = z.enum(ndaProvinceValues);
export const ndaMutualitySchema = z.enum(ndaMutualityValues);
export const ndaReturnOfInformationSchema = z.enum(ndaReturnOfInformationValues);
export const consultationStatusSchema = z.enum(consultationStatusValues);

export type NdaProvince = z.infer<typeof ndaProvinceSchema>;
export type NdaMutuality = z.infer<typeof ndaMutualitySchema>;
export type NdaReturnOfInformation = z.infer<
  typeof ndaReturnOfInformationSchema
>;
export type ConsultationStatus = z.infer<typeof consultationStatusSchema>;

const nullableShortTextSchema = z.string().trim().max(200).nullable().optional();
const nullableLongTextSchema = z.string().trim().max(2000).nullable().optional();
const nullableContextSchema = z.string().trim().max(4000).nullable().optional();
const categorySchema = z.string().trim().min(1).max(120);

export const ndaIntakePatchSchema = z
  .object({
    disclosingPartyName: nullableShortTextSchema,
    receivingPartyName: nullableShortTextSchema,
    purpose: nullableLongTextSchema,
    governingLawProvince: ndaProvinceSchema.nullable().optional(),
    confidentialityTerm: nullableShortTextSchema,
    mutuality: ndaMutualitySchema.nullable().optional(),
    returnOfInformation: ndaReturnOfInformationSchema.nullable().optional(),
    confidentialInformationCategories: z
      .array(categorySchema)
      .max(12)
      .optional(),
    additionalContext: nullableContextSchema,
  })
  .strict();

export type NdaIntakePatch = z.infer<typeof ndaIntakePatchSchema>;

export type NdaIntake = {
  disclosingPartyName: string | null;
  receivingPartyName: string | null;
  purpose: string | null;
  governingLawProvince: NdaProvince | null;
  confidentialityTerm: string | null;
  mutuality: NdaMutuality | null;
  returnOfInformation: NdaReturnOfInformation | null;
  confidentialInformationCategories: string[];
  additionalContext: string | null;
};

export const ndaIntakeFieldOrder = [
  "disclosingPartyName",
  "receivingPartyName",
  "purpose",
  "governingLawProvince",
  "confidentialityTerm",
  "mutuality",
  "returnOfInformation",
  "confidentialInformationCategories",
  "additionalContext",
] as const satisfies readonly (keyof NdaIntake)[];

export type NdaIntakeFieldKey = (typeof ndaIntakeFieldOrder)[number];

export const requiredNdaIntakeFields = [
  "disclosingPartyName",
  "receivingPartyName",
  "purpose",
  "governingLawProvince",
  "confidentialityTerm",
  "mutuality",
  "returnOfInformation",
  "confidentialInformationCategories",
] as const satisfies readonly NdaIntakeFieldKey[];

export type RequiredNdaIntakeFieldKey =
  (typeof requiredNdaIntakeFields)[number];

export const ndaIntakeFieldLabels: Record<NdaIntakeFieldKey, string> = {
  disclosingPartyName: "Disclosing party",
  receivingPartyName: "Receiving party",
  purpose: "Purpose",
  governingLawProvince: "Governing law province",
  confidentialityTerm: "Confidentiality term",
  mutuality: "Mutual or unilateral",
  returnOfInformation: "Return of information",
  confidentialInformationCategories: "Confidential information categories",
  additionalContext: "Additional context",
};

export const ndaProvinceLabels: Record<NdaProvince, string> = {
  ontario: "Ontario",
  british_columbia: "British Columbia",
  alberta: "Alberta",
};

export const ndaMutualityLabels: Record<NdaMutuality, string> = {
  mutual: "Mutual",
  unilateral: "Unilateral",
};

export const ndaReturnOfInformationLabels: Record<NdaReturnOfInformation, string> =
  {
    return: "Return information",
    destroy: "Destroy information",
    return_or_destroy: "Return or destroy information",
  };

export const intakeReadinessSchema = z.object({
  status: consultationStatusSchema,
  canGenerate: z.boolean(),
  totalRequiredFields: z.number().int().nonnegative(),
  completedFieldCount: z.number().int().nonnegative(),
  progressPercent: z.number().int().min(0).max(100),
  missingFields: z.array(z.enum(requiredNdaIntakeFields)),
  missingFieldLabels: z.array(z.string()),
});

export type IntakeReadiness = z.infer<typeof intakeReadinessSchema>;

export function createEmptyNdaIntake(): NdaIntake {
  return {
    disclosingPartyName: null,
    receivingPartyName: null,
    purpose: null,
    governingLawProvince: null,
    confidentialityTerm: null,
    mutuality: null,
    returnOfInformation: null,
    confidentialInformationCategories: [],
    additionalContext: null,
  };
}

function normalizeNullableText(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeCategories(
  categories: string[] | undefined,
  fallback: string[],
): string[] {
  if (!categories) {
    return fallback;
  }

  return categories
    .map((category) => category.trim())
    .filter((category) => category.length > 0);
}

export function mergeNdaIntake(
  current: Partial<NdaIntake> | null | undefined,
  patch: NdaIntakePatch | null | undefined,
): NdaIntake {
  const base = normalizeNdaIntake(current);
  if (!patch) {
    return base;
  }

  const parsedPatch = ndaIntakePatchSchema.parse(patch);

  return {
    disclosingPartyName:
      parsedPatch.disclosingPartyName === undefined
        ? base.disclosingPartyName
        : normalizeNullableText(parsedPatch.disclosingPartyName),
    receivingPartyName:
      parsedPatch.receivingPartyName === undefined
        ? base.receivingPartyName
        : normalizeNullableText(parsedPatch.receivingPartyName),
    purpose:
      parsedPatch.purpose === undefined
        ? base.purpose
        : normalizeNullableText(parsedPatch.purpose),
    governingLawProvince:
      parsedPatch.governingLawProvince === undefined
        ? base.governingLawProvince
        : parsedPatch.governingLawProvince,
    confidentialityTerm:
      parsedPatch.confidentialityTerm === undefined
        ? base.confidentialityTerm
        : normalizeNullableText(parsedPatch.confidentialityTerm),
    mutuality:
      parsedPatch.mutuality === undefined
        ? base.mutuality
        : parsedPatch.mutuality,
    returnOfInformation:
      parsedPatch.returnOfInformation === undefined
        ? base.returnOfInformation
        : parsedPatch.returnOfInformation,
    confidentialInformationCategories: normalizeCategories(
      parsedPatch.confidentialInformationCategories,
      base.confidentialInformationCategories,
    ),
    additionalContext:
      parsedPatch.additionalContext === undefined
        ? base.additionalContext
        : normalizeNullableText(parsedPatch.additionalContext),
  };
}

export function normalizeNdaIntake(
  value: Partial<NdaIntake> | null | undefined,
): NdaIntake {
  const parsed = ndaIntakePatchSchema.safeParse(value ?? {});
  const patch = parsed.success ? parsed.data : {};

  return {
    disclosingPartyName: normalizeNullableText(patch.disclosingPartyName),
    receivingPartyName: normalizeNullableText(patch.receivingPartyName),
    purpose: normalizeNullableText(patch.purpose),
    governingLawProvince: patch.governingLawProvince ?? null,
    confidentialityTerm: normalizeNullableText(patch.confidentialityTerm),
    mutuality: patch.mutuality ?? null,
    returnOfInformation: patch.returnOfInformation ?? null,
    confidentialInformationCategories: normalizeCategories(
      patch.confidentialInformationCategories,
      [],
    ),
    additionalContext: normalizeNullableText(patch.additionalContext),
  };
}

export function isIntakeFieldComplete(
  intake: NdaIntake,
  field: NdaIntakeFieldKey,
): boolean {
  const value = intake[field];

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function getMissingIntakeFields(
  intake: NdaIntake,
): RequiredNdaIntakeFieldKey[] {
  return requiredNdaIntakeFields.filter(
    (field) => !isIntakeFieldComplete(intake, field),
  );
}

export function deriveConsultationStatus(
  intake: NdaIntake,
  hasDraft = false,
): ConsultationStatus {
  if (hasDraft) {
    return "draft_generated";
  }

  return getMissingIntakeFields(intake).length === 0
    ? "ready_for_generation"
    : "intake_in_progress";
}

export function buildIntakeReadiness(
  intake: NdaIntake,
  status?: ConsultationStatus,
): IntakeReadiness {
  const missingFields = getMissingIntakeFields(intake);
  const totalRequiredFields = Number(requiredNdaIntakeFields.length);
  const completedFieldCount = totalRequiredFields - missingFields.length;

  return {
    status: status ?? deriveConsultationStatus(intake),
    canGenerate: missingFields.length === 0,
    totalRequiredFields,
    completedFieldCount,
    progressPercent: Math.round(
      (completedFieldCount / totalRequiredFields) * 100,
    ),
    missingFields,
    missingFieldLabels: missingFields.map((field) => ndaIntakeFieldLabels[field]),
  };
}
