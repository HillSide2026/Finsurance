import { useEffect, useState } from "react";
import {
  type IntakeReadiness,
  type NdaIntake,
  type NdaIntakePatch,
  ndaIntakeFieldLabels,
  ndaMutualityLabels,
  ndaMutualityValues,
  ndaProvinceLabels,
  ndaProvinceValues,
  ndaReturnOfInformationLabels,
  ndaReturnOfInformationValues,
} from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type IntakeFormState = {
  disclosingPartyName: string;
  receivingPartyName: string;
  purpose: string;
  governingLawProvince: string;
  confidentialityTerm: string;
  mutuality: string;
  returnOfInformation: string;
  confidentialInformationCategories: string;
  additionalContext: string;
};

interface IntakePanelProps {
  intake: NdaIntake;
  readiness: IntakeReadiness;
  isSaving: boolean;
  isGenerating: boolean;
  hasDraft: boolean;
  onSave: (patch: NdaIntakePatch) => void;
  onGenerate: () => void;
  onOpenDraft: () => void;
  className?: string;
}

function toFormState(intake: NdaIntake): IntakeFormState {
  return {
    disclosingPartyName: intake.disclosingPartyName ?? "",
    receivingPartyName: intake.receivingPartyName ?? "",
    purpose: intake.purpose ?? "",
    governingLawProvince: intake.governingLawProvince ?? "",
    confidentialityTerm: intake.confidentialityTerm ?? "",
    mutuality: intake.mutuality ?? "",
    returnOfInformation: intake.returnOfInformation ?? "",
    confidentialInformationCategories:
      intake.confidentialInformationCategories.join(", "),
    additionalContext: intake.additionalContext ?? "",
  };
}

function toNullableText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseCategories(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function toPatch(form: IntakeFormState): NdaIntakePatch {
  return {
    disclosingPartyName: toNullableText(form.disclosingPartyName),
    receivingPartyName: toNullableText(form.receivingPartyName),
    purpose: toNullableText(form.purpose),
    governingLawProvince:
      form.governingLawProvince.length > 0
        ? (form.governingLawProvince as NdaIntake["governingLawProvince"])
        : null,
    confidentialityTerm: toNullableText(form.confidentialityTerm),
    mutuality:
      form.mutuality.length > 0
        ? (form.mutuality as NdaIntake["mutuality"])
        : null,
    returnOfInformation:
      form.returnOfInformation.length > 0
        ? (form.returnOfInformation as NdaIntake["returnOfInformation"])
        : null,
    confidentialInformationCategories: parseCategories(
      form.confidentialInformationCategories,
    ),
    additionalContext: toNullableText(form.additionalContext),
  };
}

function getStatusCopy(readiness: IntakeReadiness): string {
  if (readiness.status === "draft_generated") {
    return "Draft generated";
  }

  if (readiness.canGenerate) {
    return "Ready for generation";
  }

  return "Intake in progress";
}

export function IntakePanel({
  intake,
  readiness,
  isSaving,
  isGenerating,
  hasDraft,
  onSave,
  onGenerate,
  onOpenDraft,
  className,
}: IntakePanelProps) {
  const [form, setForm] = useState<IntakeFormState>(() => toFormState(intake));

  useEffect(() => {
    setForm(toFormState(intake));
  }, [intake]);

  const patch = toPatch(form);
  const hasChanges = JSON.stringify(patch) !== JSON.stringify(intake);

  return (
    <Card className={cn("border-border/60 shadow-lg shadow-black/5", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl text-primary">Consultation Intake</CardTitle>
            <CardDescription className="mt-1">
              Complete the required facts so generation relies on validated intake, not chat guesswork.
            </CardDescription>
          </div>
          <Badge variant={readiness.canGenerate ? "default" : "secondary"}>
            {getStatusCopy(readiness)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {readiness.completedFieldCount} of {readiness.totalRequiredFields} required fields complete
            </span>
            <span className="text-muted-foreground">
              {readiness.progressPercent}%
            </span>
          </div>
          <Progress value={readiness.progressPercent} className="h-2.5" />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              {ndaIntakeFieldLabels.disclosingPartyName}
            </label>
            <Input
              value={form.disclosingPartyName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  disclosingPartyName: event.target.value,
                }))
              }
              placeholder="Levine Law Inc."
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              {ndaIntakeFieldLabels.receivingPartyName}
            </label>
            <Input
              value={form.receivingPartyName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  receivingPartyName: event.target.value,
                }))
              }
              placeholder="Counterparty legal name"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              {ndaIntakeFieldLabels.purpose}
            </label>
            <Textarea
              value={form.purpose}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  purpose: event.target.value,
                }))
              }
              placeholder="Describe why the parties are sharing confidential information."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                {ndaIntakeFieldLabels.governingLawProvince}
              </label>
              <Select
                value={form.governingLawProvince || undefined}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    governingLawProvince: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {ndaProvinceValues.map((province) => (
                    <SelectItem key={province} value={province}>
                      {ndaProvinceLabels[province]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                {ndaIntakeFieldLabels.mutuality}
              </label>
              <Select
                value={form.mutuality || undefined}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    mutuality: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent>
                  {ndaMutualityValues.map((mutuality) => (
                    <SelectItem key={mutuality} value={mutuality}>
                      {ndaMutualityLabels[mutuality]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                {ndaIntakeFieldLabels.confidentialityTerm}
              </label>
              <Input
                value={form.confidentialityTerm}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    confidentialityTerm: event.target.value,
                  }))
                }
                placeholder="e.g. 2 years"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                {ndaIntakeFieldLabels.returnOfInformation}
              </label>
              <Select
                value={form.returnOfInformation || undefined}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    returnOfInformation: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select obligation" />
                </SelectTrigger>
                <SelectContent>
                  {ndaReturnOfInformationValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {ndaReturnOfInformationLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              {ndaIntakeFieldLabels.confidentialInformationCategories}
            </label>
            <Textarea
              value={form.confidentialInformationCategories}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  confidentialInformationCategories: event.target.value,
                }))
              }
              placeholder="e.g. customer lists, pricing, source code"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Separate categories with commas or line breaks.
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              {ndaIntakeFieldLabels.additionalContext}
            </label>
            <Textarea
              value={form.additionalContext}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  additionalContext: event.target.value,
                }))
              }
              placeholder="Optional business context, negotiation details, or drafting notes."
              rows={3}
            />
          </div>
        </div>

        {readiness.missingFieldLabels.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              Still needed before generation
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {readiness.missingFieldLabels.map((label) => (
                <Badge key={label} variant="outline" className="border-amber-200 text-amber-900">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-sm text-primary">
          This document is automatically generated. It is not legal advice. Consider having a lawyer review before signing.
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => onSave(patch)}
            disabled={!hasChanges || isSaving}
            variant={hasChanges ? "default" : "outline"}
            className="w-full"
          >
            {isSaving ? "Saving intake..." : hasChanges ? "Save Intake Details" : "Intake Saved"}
          </Button>

          <Button
            onClick={onGenerate}
            disabled={!readiness.canGenerate || isGenerating || hasChanges}
            className="w-full"
          >
            {isGenerating
              ? "Generating NDA..."
              : hasDraft && readiness.canGenerate
                ? "Generate Updated Draft"
                : "Generate NDA"}
          </Button>

          {hasDraft && (
            <Button variant="outline" onClick={onOpenDraft} className="w-full">
              Open Latest Draft
            </Button>
          )}

          {hasChanges && (
            <p className="text-xs text-muted-foreground">
              Save the intake before generating so the draft uses the latest structured facts.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
