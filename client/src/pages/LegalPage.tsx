import { siteConfig, type SitePage } from "@shared/site";
import { SiteFooter } from "@/components/SiteFooter";

type LegalPageKey = Extract<SitePage, "privacyPolicy" | "termsOfService" | "disclaimer">;

type LegalSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

type LegalDocument = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

const legalDocuments: Record<LegalPageKey, LegalDocument> = {
  privacyPolicy: {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    intro:
      "This Privacy Policy explains how FintechLawyer.ca and FinSure handle information submitted through the site and the current MVP workflow.",
    lastUpdated: "March 27, 2026",
    sections: [
      {
        title: "Scope",
        paragraphs: [
          "This policy applies to information collected through FintechLawyer.ca, the FinSure workflow, and direct communications sent to us in connection with the site or product.",
          "It is intended to describe our current practices for the public site and MVP product experience. If we materially change those practices, we may update this policy.",
        ],
      },
      {
        title: "Information We May Collect",
        paragraphs: [
          "We may collect information you choose to provide directly, as well as limited operational information needed to run the site and respond to requests.",
        ],
        bullets: [
          "Name, email address, company details, and any message content you choose to send.",
          "Information included in a mailto request or other direct email communication sent to hello@fintechlawyer.ca.",
          "FinSure account details, saved draft content, session records, enquiry records, and Stripe checkout status records generated through the product.",
        ],
      },
      {
        title: "How We Use Information",
        paragraphs: [
          "We may use information to operate the site, respond to inquiries, coordinate product discussions, improve the experience, maintain security, and comply with legal or regulatory obligations.",
        ],
        bullets: [
          "Responding to product, legal, or compliance-related inquiries.",
          "Responding to product update requests, demo requests, or potential engagement discussions.",
          "Operating, troubleshooting, and improving the site and product workflow.",
          "Saving and restoring account sessions, drafts, and payment confirmation records.",
        ],
      },
      {
        title: "FinSure MVP Data Handling",
        paragraphs: [
          "The current FinSure MVP is not browser-only. When you create an account, sign in, save a draft, submit an enquiry, or return from Stripe Checkout, information is transmitted to the application and stored in the file-backed system currently used by the product.",
          "Saved drafts and related operational records are retained in that application store so they can be reopened later. If you choose to contact us by email, the information included in that communication will also be processed through your email provider and ours.",
        ],
      },
      {
        title: "Sharing and Disclosure",
        paragraphs: [
          "We do not sell personal information. We may disclose information where reasonably necessary to operate the site, protect rights and security, or comply with legal obligations.",
        ],
        bullets: [
          "Service providers or hosting partners that help us operate the site.",
          "Professional advisers where needed for legal, compliance, or operational purposes.",
          "Courts, regulators, or authorities where disclosure is required or appropriate by law.",
        ],
      },
      {
        title: "Retention and Security",
        paragraphs: [
          "We retain information for as long as reasonably necessary for the purposes described above, including responding to requests, maintaining business records, and meeting legal obligations.",
          "No system can guarantee absolute security. You should avoid sending highly sensitive information through public web forms or email unless appropriate controls are in place.",
        ],
      },
      {
        title: "Your Choices and Contact",
        paragraphs: [
          "If you would like to request access to, correction of, or deletion of information you previously submitted to us, contact hello@fintechlawyer.ca.",
          "We will review requests in light of our legal, regulatory, and operational obligations.",
        ],
      },
    ],
  },
  termsOfService: {
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    intro:
      "These Terms govern your use of FintechLawyer.ca and the FinSure workflow unless separate written engagement terms apply.",
    lastUpdated: "March 27, 2026",
    sections: [
      {
        title: "Acceptance and Scope",
        paragraphs: [
          "By accessing or using FintechLawyer.ca or FinSure, you agree to these Terms of Service. If you do not agree, do not use the site or product.",
          "These Terms apply to the public site, the FinSure MVP workflow, and any related informational materials made available through the platform.",
        ],
      },
      {
        title: "Informational Nature of the Site",
        paragraphs: [
          "FintechLawyer.ca provides legal information, workflow support, and productized compliance tools. Use of the site or product alone does not create a solicitor-client, lawyer-client, advisory, fiduciary, or other professional engagement relationship.",
          "Any formal legal engagement must be confirmed separately in writing.",
        ],
      },
      {
        title: "Permitted Use",
        paragraphs: [
          "You may use the site and product for lawful internal evaluation and workflow support purposes.",
        ],
        bullets: [
          "Do not misuse the site, interfere with its operation, or attempt unauthorized access.",
          "Do not upload or submit content you do not have the right to use.",
          "Do not rely on the product as a substitute for required internal review, escalation, or filing judgment.",
        ],
      },
      {
        title: "User Responsibilities",
        paragraphs: [
          "You are responsible for the accuracy, completeness, and appropriateness of the information you provide to the site or product.",
          "You are also responsible for your own regulatory, legal, compliance, operational, and recordkeeping decisions.",
        ],
      },
      {
        title: "Intellectual Property",
        paragraphs: [
          "Unless otherwise stated, the site design, product workflow, written materials, and related branding are owned by or used under authority of FintechLawyer.ca, Levine Law, or their licensors.",
          "These Terms do not transfer any ownership rights to you.",
        ],
      },
      {
        title: "Availability and Changes",
        paragraphs: [
          "We may modify, suspend, or discontinue any part of the site or product at any time, including MVP features, workflows, or documentation.",
          "We may also update these Terms from time to time by posting a revised version on the site.",
        ],
      },
      {
        title: "Disclaimers and Limitation of Liability",
        paragraphs: [
          "The site and product are provided on an as-is and as-available basis to the fullest extent permitted by applicable law.",
          "We do not guarantee uninterrupted availability, error-free operation, or any particular legal, regulatory, business, or filing outcome. To the fullest extent permitted by law, we disclaim liability for losses arising from reliance on the site or product without appropriate independent review.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "Questions about these Terms may be directed to hello@fintechlawyer.ca.",
        ],
      },
    ],
  },
  disclaimer: {
    eyebrow: "Disclaimer",
    title: "Disclaimer",
    intro:
      "This Disclaimer applies to FintechLawyer.ca, FinSure, and related materials made available through the platform.",
    lastUpdated: "March 27, 2026",
    sections: [
      {
        title: "General Information Only",
        paragraphs: [
          "The site and product provide general legal information, workflow support, and productized compliance tools. They are not a substitute for legal advice tailored to your facts, business model, or regulatory posture.",
        ],
      },
      {
        title: "No Lawyer-Client Relationship",
        paragraphs: [
          "Viewing this site, using FinSure, or communicating through informal site channels does not by itself create a lawyer-client or solicitor-client relationship with Levine Law or any affiliated professional.",
          "A formal engagement requires a separate written agreement.",
        ],
      },
      {
        title: "FinSure Outputs Require Independent Review",
        paragraphs: [
          "FinSure is designed to assist with structured drafting and workflow support. It does not replace professional judgment, internal escalation, independent review, or filing decision-making.",
          "You remain responsible for confirming the accuracy, completeness, and suitability of any draft, report, or compliance action.",
        ],
      },
      {
        title: "No Guarantee of Outcome",
        paragraphs: [
          "We do not guarantee that use of the site or product will satisfy regulatory obligations, avoid enforcement risk, or produce any specific business, legal, or operational result.",
        ],
      },
      {
        title: "Third-Party Links and External Services",
        paragraphs: [
          "The site may include links to external websites, providers, or resources. We are not responsible for the content, availability, or practices of third parties.",
        ],
      },
      {
        title: "Contact for Formal Engagement",
        paragraphs: [
          "If you require legal advice or a formal engagement, contact hello@fintechlawyer.ca or visit Levine Law to discuss whether a separate written engagement is appropriate.",
        ],
      },
    ],
  },
};

type LegalPageProps = {
  page: LegalPageKey;
};

export default function LegalPage({ page }: LegalPageProps) {
  const document = legalDocuments[page];

  return (
    <div className="legal-home-shell min-h-screen px-4 py-6 text-[#1F241D] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="legal-home-panel rounded-[32px] border px-8 py-5 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <a href={siteConfig.links.home} className="flex items-center">
              <img
                src="/fintechlawyer-logo.png"
                alt="FintechLawyer.ca"
                className="h-11 w-auto md:h-12"
              />
            </a>

            <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#525B50] md:gap-6">
              <a href={siteConfig.links.home} className="transition-colors hover:text-[#C39A56]">
                Home
              </a>
              <a
                href={siteConfig.links.finsure}
                className="transition-colors hover:text-[#C39A56]"
              >
                FinSure
              </a>
            </nav>
          </div>
        </header>

        <main className="legal-home-panel rounded-[40px] border px-6 py-10 md:px-10 md:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9F8A55]">
              {document.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl leading-tight text-[#1B2118] md:text-5xl">
              {document.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-[#596255]">{document.intro}</p>
            <p className="mt-4 text-sm text-[#7A8176]">Last updated {document.lastUpdated}</p>
          </div>

          <div className="mt-10 space-y-8">
            {document.sections.map((section) => (
              <section key={section.title} className="legal-home-card rounded-[28px] border p-6">
                <h2 className="text-2xl text-[#1F241D]">{section.title}</h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-[#596255]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-[#596255]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#6F8B65]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
