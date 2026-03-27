const canonicalOrigin = "https://fintechlawyer.ca";
const homePath = "/";
const homeUrl = `${canonicalOrigin}${homePath}`;
const productPath = "/finsure";
const productUrl = `${canonicalOrigin}${productPath}`;

export type SitePage = "home" | "product";

export type SitePageMetadata = {
  title: string;
  description: string;
  canonicalUrl: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphUrl: string;
  twitterTitle: string;
  twitterDescription: string;
};

const homePageMetadata: SitePageMetadata = {
  title: "FintechLawyer.ca | Counsel for FinTech Teams",
  description:
    "FintechLawyer.ca combines counsel, compliance systems, and productized tools for regulated fintech teams navigating AML, payments, and launch risk.",
  canonicalUrl: homeUrl,
  openGraphTitle: "FintechLawyer.ca | Counsel for FinTech Teams",
  openGraphDescription:
    "Counsel, compliance systems, and productized tools for regulated fintech teams.",
  openGraphUrl: homeUrl,
  twitterTitle: "FintechLawyer.ca | Counsel for FinTech Teams",
  twitterDescription:
    "Counsel, compliance systems, and productized tools for regulated fintech teams.",
};

const productPageMetadata: SitePageMetadata = {
  title: "FinSure | Suspicious transaction drafting",
  description:
    "FinSure generates Suspicious Transaction Report drafts so your team can review and submit faster.",
  canonicalUrl: productUrl,
  openGraphTitle: "FinSure | Suspicious transaction drafting",
  openGraphDescription:
    "FinSure generates Suspicious Transaction Report drafts so your team can review and submit faster.",
  openGraphUrl: productUrl,
  twitterTitle: "FinSure | Suspicious transaction drafting",
  twitterDescription:
    "FinSure generates Suspicious Transaction Report drafts so your team can review and submit faster.",
};

export function normalizeSitePath(pathname: string): string {
  const normalized = pathname.trim().replace(/\/+$/, "");
  return normalized.length > 0 ? normalized : homePath;
}

export function resolveSitePage(pathname: string): SitePage {
  return normalizeSitePath(pathname) === productPath ? "product" : "home";
}

export function buildSitePageMetadata(page: SitePage): SitePageMetadata {
  return page === "product" ? productPageMetadata : homePageMetadata;
}

export const siteConfig = {
  siteName: "FintechLawyer.ca",
  productName: "FinSure",
  canonicalOrigin,
  canonicalUrl: homeUrl,
  homeUrl,
  productPath,
  productUrl,
  wwwUrl: "https://www.fintechlawyer.ca",
  supportEmail: "hello@fintechlawyer.ca",
  links: {
    home: homePath,
    useCases: `${homePath}#use-cases`,
    offerings: `${homePath}#offerings`,
    approach: `${homePath}#approach`,
    contact: `${homePath}#contact`,
    finsure: productPath,
    start: `${productPath}#start`,
    product: `${productPath}#product`,
    howItWorks: `${productPath}#how-it-works`,
    socialProof: `${productPath}#social-proof`,
    expertise: `${productPath}#levine-law`,
    presets: `${productPath}#presets`,
    pricing: `${productPath}#pricing`,
    earlyAccess: `${productPath}#early-access`,
    faq: `${productPath}#faq`,
    levineLaw: "https://levinelegal.ca/",
    pilotAccess:
      "mailto:hello@fintechlawyer.ca?subject=FinSure%20early%20access",
  },
  billing: {
    pricingUrl: `${productUrl}#pricing`,
    successUrl:
      `${canonicalOrigin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${productUrl}#pricing`,
    returnUrl: `${productUrl}#pricing`,
  },
} as const;
