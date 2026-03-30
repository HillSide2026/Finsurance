import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@shared/site";
import {
  captureBusinessTypeOptions,
  captureNeedOptions,
  captureStageOptions,
  emptyCaptureQuestionnaire,
  saveCaptureResultsSession,
  type CaptureQuestionnaire,
} from "@/features/capture/captureFunnel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type CaptureLeadFormState = {
  email: string;
};

function ChoiceGrid<T extends string | boolean>({
  options,
  selected,
  onSelect,
}: {
  options: Array<{ value: T; label: string; description: string }>;
  selected: T | null;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-[16px] border px-4 py-4 text-left transition-colors",
              isSelected
                ? "border-[#6F8B65] bg-[rgba(111,139,101,0.10)]"
                : "border-[rgba(42,53,46,0.12)] bg-white/90 hover:border-[rgba(111,139,101,0.38)]",
            )}
          >
            <p className="font-semibold text-[#1F241D]">{option.label}</p>
            <p className="mt-2 text-sm leading-6 text-[#596255]">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}

export function ComplianceChecklistQuestionnaire() {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<CaptureQuestionnaire>(() => emptyCaptureQuestionnaire());
  const [leadForm, setLeadForm] = useState<CaptureLeadFormState>({
    email: "",
  });

  const goToResults = () => {
    if (
      answers.businessType === null ||
      answers.stage === null ||
      answers.servesCanada === null ||
      answers.primaryNeed === null
    ) {
      toast({
        title: "Complete the questions first",
        description:
          "We need all four answers before we can move you to the results page.",
        variant: "destructive",
      });
      return;
    }

    const normalizedEmail = leadForm.email.trim();
    if (!normalizedEmail.includes("@")) {
      toast({
        title: "Add your email first",
        description: "We need a valid email before we can show your results.",
        variant: "destructive",
      });
      return;
    }

    const saved = saveCaptureResultsSession({
      answers,
      email: normalizedEmail,
    });

    if (!saved) {
      toast({
        title: "Could not continue",
        description: "We could not prepare the results page right now.",
        variant: "destructive",
      });
      return;
    }

    window.location.assign(siteConfig.links.complianceChecklistStart);
  };

  return (
    <div id="compliance-checklist-questionnaire" className="scroll-mt-24 space-y-8">
      <section className="capture-funnel-panel rounded-[24px] border px-6 py-8 md:px-8 md:py-9">
        <div className="max-w-3xl space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
            Questions
          </p>
          <h2 className="text-4xl leading-[0.96] text-[#1B2118] md:text-[2.9rem]">
            Complete your Checklist
          </h2>
          <p className="text-base leading-8 text-[#596255]">
            This page is intentionally short so we can help you quickly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl">
        <Card className="capture-funnel-card rounded-[22px]">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl text-[#1B2118]">Questions</CardTitle>
            <CardDescription className="text-base leading-7 text-[#596255]">
              This page is intentionally short so we can help you quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#1F241D]">
                1. What kind of fintech are you building?
              </h3>
              <ChoiceGrid
                options={captureBusinessTypeOptions}
                selected={answers.businessType}
                onSelect={(value) => setAnswers((current) => ({ ...current, businessType: value }))}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#1F241D]">2. What stage are you in?</h3>
              <ChoiceGrid
                options={captureStageOptions}
                selected={answers.stage}
                onSelect={(value) => setAnswers((current) => ({ ...current, stage: value }))}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#1F241D]">
                3. Will this product touch Canada directly?
              </h3>
              <ChoiceGrid
                options={[
                  {
                    value: true,
                    label: "Yes, Canada is in scope",
                    description:
                      "Canadian users, flows, counterparties, or launch plans are already in view.",
                  },
                  {
                    value: false,
                    label: "Not directly, but maybe later",
                    description:
                      "Canada is not the immediate market, but exposure still needs to be tested.",
                  },
                ]}
                selected={answers.servesCanada}
                onSelect={(value) => setAnswers((current) => ({ ...current, servesCanada: value }))}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#1F241D]">4. What do you need right now?</h3>
              <ChoiceGrid
                options={captureNeedOptions}
                selected={answers.primaryNeed}
                onSelect={(value) => setAnswers((current) => ({ ...current, primaryNeed: value }))}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#1F241D]" htmlFor="capture-unlock-email">
                Email
              </label>
              <Input
                id="capture-unlock-email"
                type="email"
                value={leadForm.email}
                onChange={(event) =>
                  setLeadForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="you@company.com"
                className="h-12 rounded-[14px] border-border/70 bg-white text-[#1F241D]"
              />
              <p className="text-sm leading-6 text-[#596255]">
                Enter your email before we move you to the results page.
              </p>
            </div>

            <Button
              size="lg"
              className="rounded-xl bg-[#E6C989] px-8 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.18)] hover:bg-[#dcbc6f]"
              onClick={goToResults}
            >
              Explore Results
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
