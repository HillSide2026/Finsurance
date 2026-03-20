export const siteConfig = {
  siteName: "FintechLawyer.ca",
  productName: "FinSure",
  canonicalOrigin: "https://fintechlawyer.ca",
  canonicalUrl: "https://fintechlawyer.ca/",
  wwwUrl: "https://www.fintechlawyer.ca",
  supportEmail: "hello@fintechlawyer.ca",
  links: {
    start: "#start",
    howItWorks: "#how-it-works",
    presets: "#presets",
    pricing: "#pricing",
    earlyAccess: "#early-access",
    faq: "#faq",
    levineLaw: "https://levinelegal.ca/",
    pilotAccess:
      "mailto:hello@fintechlawyer.ca?subject=FinSure%20early%20access",
  },
  billing: {
    pricingUrl: "https://fintechlawyer.ca/#pricing",
    successUrl:
      "https://fintechlawyer.ca/billing/success?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "https://fintechlawyer.ca/#pricing",
    returnUrl: "https://fintechlawyer.ca/#pricing",
  },
} as const;
