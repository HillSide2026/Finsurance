import { siteConfig } from "@shared/site";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  theme?: "light" | "dark";
  className?: string;
};

const footerLinks = [
  { label: "Privacy Policy", href: siteConfig.links.privacyPolicy },
  { label: "Terms of Service", href: siteConfig.links.termsOfService },
  { label: "Disclaimer", href: siteConfig.links.disclaimer },
] as const;

export function SiteFooter({ theme = "light", className }: SiteFooterProps) {
  const isDark = theme === "dark";

  return (
    <footer
      className={cn(
        "rounded-[28px] border px-6 py-5 md:px-8",
        isDark
          ? "border-[rgba(166,190,152,0.18)] bg-[rgba(21,32,23,0.72)] text-[#D7E1D2]"
          : "border-[rgba(96,110,89,0.14)] bg-[rgba(255,252,245,0.7)] text-[#596255]",
        className,
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className={cn("text-sm font-medium", isDark ? "text-[#F7F1E4]" : "text-[#1F241D]")}>
            {siteConfig.siteName}
          </p>
          <p className="text-xs">
            Built by Levine Law for informational and workflow support purposes only.
          </p>
        </div>

        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium"
        >
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "transition-colors hover:text-[#6F8B65]",
                isDark ? "text-[#F7F1E4]" : "text-[#1F241D]",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
