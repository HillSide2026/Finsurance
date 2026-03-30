const canonicalOrigin = "https://fintechlawyer.ca";
const homePath = "/";
const homeUrl = `${canonicalOrigin}${homePath}`;
const productPath = "/finsure";
const productUrl = `${canonicalOrigin}${productPath}`;
const complianceChecklistPath = "/compliance-checklist";
const complianceChecklistUrl = `${canonicalOrigin}${complianceChecklistPath}`;
const complianceChecklistStartPath = "/compliance-checklist/start";
const complianceChecklistStartUrl = `${canonicalOrigin}${complianceChecklistStartPath}`;
const billingSuccessPath = "/billing/success";
const billingSuccessUrl = `${canonicalOrigin}${billingSuccessPath}`;
const privacyPolicyPath = "/privacy-policy";
const privacyPolicyUrl = `${canonicalOrigin}${privacyPolicyPath}`;
const termsOfServicePath = "/terms-of-service";
const termsOfServiceUrl = `${canonicalOrigin}${termsOfServicePath}`;
const disclaimerPath = "/disclaimer";
const disclaimerUrl = `${canonicalOrigin}${disclaimerPath}`;

export type SitePage =
  | "home"
  | "product"
  | "complianceChecklist"
  | "complianceChecklistStart"
  | "billingSuccess"
  | "privacyPolicy"
  | "termsOfService"
  | "disclaimer";

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
  title: "FintechLawyer.ca | Counsel for FinTech Operators",
  description:
    "FintechLawyer.ca combines counsel, compliance systems, and productized tools for regulated fintech operators navigating AML, payments, and launch risk.",
  canonicalUrl: homeUrl,
  openGraphTitle: "FintechLawyer.ca | Counsel for FinTech Operators",
  openGraphDescription:
    "Counsel, compliance systems, and productized tools for regulated fintech operators.",
  openGraphUrl: homeUrl,
  twitterTitle: "FintechLawyer.ca | Counsel for FinTech Operators",
  twitterDescription:
    "Counsel, compliance systems, and productized tools for regulated fintech operators.",
};

const productPageMetadata: SitePageMetadata = {
  title: "FinSure | Suspicious transaction drafting",
  description:
    "FinSure helps you generate Suspicious Transaction Report drafts faster.",
  canonicalUrl: productUrl,
  openGraphTitle: "FinSure | Suspicious transaction drafting",
  openGraphDescription:
    "FinSure helps you generate Suspicious Transaction Report drafts faster.",
  openGraphUrl: productUrl,
  twitterTitle: "FinSure | Suspicious transaction drafting",
  twitterDescription:
    "FinSure helps you generate Suspicious Transaction Report drafts faster.",
};

const complianceChecklistPageMetadata: SitePageMetadata = {
  title: "Generate Your Compliance Checklist | FintechLawyer.ca",
  description:
    "A product validation funnel for fintech founders to scope FINTRAC, MSB, and AML checklist needs before launch.",
  canonicalUrl: complianceChecklistUrl,
  openGraphTitle: "Generate Your Compliance Checklist | FintechLawyer.ca",
  openGraphDescription:
    "Scope your Canadian fintech compliance checklist before you overspend on legal or compliance rework.",
  openGraphUrl: complianceChecklistUrl,
  twitterTitle: "Generate Your Compliance Checklist | FintechLawyer.ca",
  twitterDescription:
    "Scope your Canadian fintech compliance checklist before you overspend on legal or compliance rework.",
};

const complianceChecklistStartPageMetadata: SitePageMetadata = {
  title: "Compliance Checklist Assessment | FintechLawyer.ca",
  description:
    "Answer a few structured questions, see indicative compliance requirements, and reach the pricing or support decision point.",
  canonicalUrl: complianceChecklistStartUrl,
  openGraphTitle: "Compliance Checklist Assessment | FintechLawyer.ca",
  openGraphDescription:
    "A pseudo-product validation page that tests product willingness to pay before scale.",
  openGraphUrl: complianceChecklistStartUrl,
  twitterTitle: "Compliance Checklist Assessment | FintechLawyer.ca",
  twitterDescription:
    "A pseudo-product validation page that tests product willingness to pay before scale.",
};

const privacyPolicyPageMetadata: SitePageMetadata = {
  title: "Privacy Policy | FintechLawyer.ca",
  description:
    "Read how FintechLawyer.ca and FinSure handle contact information, product inputs, and privacy-related requests.",
  canonicalUrl: privacyPolicyUrl,
  openGraphTitle: "Privacy Policy | FintechLawyer.ca",
  openGraphDescription:
    "How FintechLawyer.ca and FinSure handle contact information, product inputs, and privacy-related requests.",
  openGraphUrl: privacyPolicyUrl,
  twitterTitle: "Privacy Policy | FintechLawyer.ca",
  twitterDescription:
    "How FintechLawyer.ca and FinSure handle contact information, product inputs, and privacy-related requests.",
};

const billingSuccessPageMetadata: SitePageMetadata = {
  title: "Payment Confirmed | FinSure",
  description:
    "Confirm your Stripe Checkout session and continue into FinSure after payment.",
  canonicalUrl: billingSuccessUrl,
  openGraphTitle: "Payment Confirmed | FinSure",
  openGraphDescription:
    "Confirm your Stripe Checkout session and continue into FinSure after payment.",
  openGraphUrl: billingSuccessUrl,
  twitterTitle: "Payment Confirmed | FinSure",
  twitterDescription:
    "Confirm your Stripe Checkout session and continue into FinSure after payment.",
};

const termsOfServicePageMetadata: SitePageMetadata = {
  title: "Terms of Service | FintechLawyer.ca",
  description:
    "Review the terms governing use of FintechLawyer.ca and the FinSure workflow.",
  canonicalUrl: termsOfServiceUrl,
  openGraphTitle: "Terms of Service | FintechLawyer.ca",
  openGraphDescription:
    "The terms governing use of FintechLawyer.ca and the FinSure workflow.",
  openGraphUrl: termsOfServiceUrl,
  twitterTitle: "Terms of Service | FintechLawyer.ca",
  twitterDescription:
    "The terms governing use of FintechLawyer.ca and the FinSure workflow.",
};

const disclaimerPageMetadata: SitePageMetadata = {
  title: "Disclaimer | FintechLawyer.ca",
  description:
    "Read the general legal and product disclaimer for FintechLawyer.ca and FinSure.",
  canonicalUrl: disclaimerUrl,
  openGraphTitle: "Disclaimer | FintechLawyer.ca",
  openGraphDescription:
    "The general legal and product disclaimer for FintechLawyer.ca and FinSure.",
  openGraphUrl: disclaimerUrl,
  twitterTitle: "Disclaimer | FintechLawyer.ca",
  twitterDescription:
    "The general legal and product disclaimer for FintechLawyer.ca and FinSure.",
};

export function normalizeSitePath(pathname: string): string {
  const normalized = pathname.trim().replace(/\/+$/, "");
  return normalized.length > 0 ? normalized : homePath;
}

export function resolveSitePage(pathname: string): SitePage {
  switch (normalizeSitePath(pathname)) {
    case productPath:
      return "product";
    case complianceChecklistPath:
      return "complianceChecklist";
    case complianceChecklistStartPath:
      return "complianceChecklistStart";
    case billingSuccessPath:
      return "billingSuccess";
    case privacyPolicyPath:
      return "privacyPolicy";
    case termsOfServicePath:
      return "termsOfService";
    case disclaimerPath:
      return "disclaimer";
    default:
      return "home";
  }
}

export function buildSitePageMetadata(page: SitePage): SitePageMetadata {
  switch (page) {
    case "product":
      return productPageMetadata;
    case "complianceChecklist":
      return complianceChecklistPageMetadata;
    case "complianceChecklistStart":
      return complianceChecklistStartPageMetadata;
    case "billingSuccess":
      return billingSuccessPageMetadata;
    case "privacyPolicy":
      return privacyPolicyPageMetadata;
    case "termsOfService":
      return termsOfServicePageMetadata;
    case "disclaimer":
      return disclaimerPageMetadata;
    default:
      return homePageMetadata;
  }
}

export const siteConfig = {
  siteName: "FintechLawyer.ca",
  productName: "FinSure",
  canonicalOrigin,
  canonicalUrl: homeUrl,
  homeUrl,
  productPath,
  productUrl,
  complianceChecklistPath,
  complianceChecklistUrl,
  complianceChecklistStartPath,
  complianceChecklistStartUrl,
  billingSuccessPath,
  billingSuccessUrl,
  wwwUrl: "https://www.fintechlawyer.ca",
  supportEmail: "hello@fintechlawyer.ca",
  links: {
    home: homePath,
    useCases: `${homePath}#use-cases`,
    offerings: `${homePath}#offerings`,
    approach: `${homePath}#approach`,
    contact: `${homePath}#contact`,
    privacyPolicy: privacyPolicyPath,
    termsOfService: termsOfServicePath,
    disclaimer: disclaimerPath,
    finsure: productPath,
    complianceChecklist: complianceChecklistPath,
    complianceChecklistStart: complianceChecklistStartPath,
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
