import type { ReactNode } from "react";
import { siteConfig } from "@shared/site";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export function CapturePageShell({
  action,
  children,
}: {
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="legal-home-shell min-h-screen px-4 py-6 text-[#1F241D] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="legal-home-panel rounded-[32px] border px-8 py-5 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <a href={siteConfig.links.home} className="flex items-center">
                <img
                  src="/fintechlawyer-logo-rectangle.png"
                  alt="FintechLawyer.ca"
                  className="h-12 w-auto rounded-[18px] shadow-[0_14px_28px_rgba(16,24,19,0.14)] md:h-14"
                />
              </a>
              <div className="hidden text-sm text-[#596255] md:block">
                Product validation funnel
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.links.home}
                className="text-sm font-medium text-[#596255] transition-colors hover:text-[#E6C989]"
              >
                Home
              </a>
              <a
                href={siteConfig.links.finsure}
                className="text-sm font-medium text-[#596255] transition-colors hover:text-[#E6C989]"
              >
                FinSure
              </a>
              <a
                href={siteConfig.links.levineLaw}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-[#596255] transition-colors hover:text-[#E6C989]"
              >
                Levine Law
              </a>
              {action ?? (
                <Button
                  asChild
                  className="rounded-2xl bg-[#E6C989] px-6 text-[#1F241D] shadow-[0_14px_28px_rgba(230,201,137,0.2)] hover:bg-[#dcbc6f]"
                >
                  <a href={siteConfig.links.complianceChecklistStart}>Start the checklist</a>
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="space-y-8">{children}</main>

        <SiteFooter />
      </div>
    </div>
  );
}
