import OpenAI from "openai";
import {
  type IntakeReadiness,
  type NdaIntake,
  type NdaIntakePatch,
  ndaIntakeFieldLabels,
  ndaIntakeFieldOrder,
  ndaIntakePatchSchema,
  ndaMutualityLabels,
  ndaProvinceLabels,
  ndaReturnOfInformationLabels,
} from "@shared/schema";

const INTAKE_EXTRACTION_PROMPT = `You extract structured NDA intake facts from a user's latest message.
Return a JSON object with zero or more of these keys only:
- disclosingPartyName
- receivingPartyName
- purpose
- governingLawProvince
- confidentialityTerm
- mutuality
- returnOfInformation
- confidentialInformationCategories
- additionalContext

Rules:
- Only include values if the latest message states them clearly.
- Do not guess missing facts.
- Do not infer a province unless the user explicitly names it.
- governingLawProvince must be one of: ontario, british_columbia, alberta.
- mutuality must be one of: mutual, unilateral.
- returnOfInformation must be one of: return, destroy, return_or_destroy.
- confidentialInformationCategories must be an array of short strings.
- If no fields can be extracted confidently, return {}.`;

function formatPromptValue(value: string | string[] | null): string {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not provided";
  }

  return value ?? "Not provided";
}

function humanizeIntake(intake: NdaIntake): string {
  return ndaIntakeFieldOrder
    .map((field) => {
      let value: string | string[] | null;

      switch (field) {
        case "governingLawProvince":
          value = intake.governingLawProvince
            ? ndaProvinceLabels[intake.governingLawProvince]
            : null;
          break;
        case "mutuality":
          value = intake.mutuality
            ? ndaMutualityLabels[intake.mutuality]
            : null;
          break;
        case "returnOfInformation":
          value = intake.returnOfInformation
            ? ndaReturnOfInformationLabels[intake.returnOfInformation]
            : null;
          break;
        default:
          value = intake[field];
          break;
      }

      return `- ${ndaIntakeFieldLabels[field]}: ${formatPromptValue(value)}`;
    })
    .join("\n");
}

export function buildChatSystemPrompt(
  intake: NdaIntake,
  readiness: IntakeReadiness,
): string {
  const nextStep = readiness.canGenerate
    ? `All required intake fields are complete. Tell the user the consultation is ready for generation, summarise the collected terms briefly, and direct them to the Generate NDA action. Do not draft the NDA in chat.`
    : `Ask one focused follow-up question that helps collect the highest-priority missing field. Missing fields: ${readiness.missingFieldLabels.join(", ")}.`;

  return `You are NDA Esq, a legal assistant focused on Canadian NDAs.
Use the structured intake below as the source of truth for collected facts.
If the user asks a direct question, answer it briefly and then continue the intake flow when appropriate.
Use Canadian spelling, be concise, and keep the user moving toward a completed intake.

Structured intake:
${humanizeIntake(intake)}

Current completion:
- Completed required fields: ${readiness.completedFieldCount}/${readiness.totalRequiredFields}
- Status: ${readiness.status}

Instruction:
${nextStep}`;
}

export async function extractIntakePatchFromMessage(
  openai: OpenAI,
  intake: NdaIntake,
  latestUserMessage: string,
): Promise<NdaIntakePatch | null> {
  if (!latestUserMessage.trim()) {
    return null;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: INTAKE_EXTRACTION_PROMPT },
      {
        role: "user",
        content: `Current intake:\n${humanizeIntake(intake)}\n\nLatest user message:\n${latestUserMessage}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content);
    return ndaIntakePatchSchema.parse(parsed);
  } catch {
    return null;
  }
}
