import type { ReactNode } from "react";
import { siteConfig } from "@shared/site";
import { SiteFooter } from "@/components/SiteFooter";

export function CapturePageShell({
  action,
  children,
}: {
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="capture-funnel-shell min-h-screen px-4 py-5 text-[#1F241D] sm:px-6 lg:px-8">
      <div className="relative z-[1] mx-auto max-w-5xl space-y-6">
        <header className="capture-funnel-header rounded-[24px] border px-6 py-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <a href={siteConfig.links.home} className="flex items-center">
                <img
                  src="/fintechlawyer-logo-rectangle.png"
                  alt="FintechLawyer.ca"
                  className="h-11 w-auto rounded-[14px] shadow-[0_12px_24px_rgba(16,24,19,0.12)] md:h-12"
                />
              </a>
              <div className="hidden md:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F8B65]">
                  Validation Funnel
                </p>
                <p className="mt-1 text-sm text-[#596255]">
                  Product willingness-to-pay capture
                </p>
              </div>
            </div>

            {action !== undefined && action !== null ? (
              <div className="flex flex-wrap items-center gap-4">{action}</div>
            ) : null}
          </div>
        </header>

        <main className="space-y-6">{children}</main>

        <SiteFooter />
      </div>
    </div>
  );
}
