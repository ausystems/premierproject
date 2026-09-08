import { Footer } from "@/components/layout/Footer";
import { Article, type ArticleSection } from "@/components/ui-kit/Article";
import { useSeo } from "@/lib/seo";

const EMAIL = <a href="mailto:info@projectpremier.org" className="text-fg underline decoration-fg/40 underline-offset-4 transition-colors hover:decoration-fg">info@projectpremier.org</a>;

const SECTIONS: ArticleSection[] = [
  {
    heading: "Who we are",
    body: [
      <>Project Premier is a Toronto-based nonprofit committed to transforming the lives of marginalized youth across the Greater Toronto Area (GTA) through music, creativity, and business education. Our studio is at 130 Queens Quay East, Toronto, ON, Canada. You can reach us at {EMAIL}.</>,
      "This policy explains what personal information this website collects, how we use it, how it is protected, and the choices you have. Personal information is collected, used and disclosed in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and, where applicable, the Freedom of Information and Protection of Privacy Act (FIPPA).",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "The only personal information this website collects is what you choose to submit through the youth referral form. Depending on the fields you complete, that includes:",
    ],
    items: [
      "The name of the referring organization or individual, and the referrer's job title or position",
      "The referrer's contact phone number and email address",
      "The referred youth's first and last name, age, and phone number",
      "The reason for the referral, any other reason you specify, and any additional notes you provide",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "By completing the referral form, you acknowledge and consent to the collection, use, and disclosure of the provided personal information for the following purposes:",
    ],
    items: [
      "Assessing eligibility and suitability for Project Premier programs",
      "Contacting the referring organization and the referred youth regarding program participation",
      "Facilitating program intake, scheduling, and support services",
      "Evaluating program effectiveness and reporting (in a de-identified manner)",
    ],
  },
  {
    heading: "Consent",
    body: [
      "By submitting a referral, you confirm that you have obtained consent from the referred youth (or their legal guardian if under 18) to share their personal information with Project Premier.",
      "If you are under 18 and are not being referred by an organization or guardian, please ask a parent, guardian, teacher or youth worker to contact us on your behalf.",
    ],
  },
  {
    heading: "How it is transmitted and stored",
    body: [
      "Referral submissions are sent from your browser over an encrypted (HTTPS) connection to our intake workflow, which delivers them to our team. All collected data is stored securely and retained only for as long as necessary to fulfill program purposes or meet legal requirements.",
    ],
  },
  {
    heading: "Sharing",
    body: [
      "Personal information will not be shared with third parties without the individual's or their legal guardian's consent, except where required by law (for example, in cases of risk of harm or legal obligations). We do not sell personal information.",
    ],
  },
  {
    heading: "Cookies and third-party content",
    body: [
      "This website does not use advertising or analytics cookies, and our fonts are served from our own domain. Some pages embed videos hosted on YouTube and link to Instagram and Google Maps. When you interact with embedded or linked content, those services may collect information and set cookies under their own privacy policies.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      <>If you have any questions about our privacy practices or wish to request access to, correct, or withdraw personal information, please contact {EMAIL}. We will respond within a reasonable time and may need to verify your identity before acting on a request.</>,
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The date at the top of this page shows when it was last revised. Continued use of the website after a change means you accept the updated policy.",
    ],
  },
];

const Privacy = () => {
  useSeo("/privacy");
  return (
    <>
      <main id="main">
        <Article
          title={<>Privacy <em>Policy</em>.</>}
          intro="How Project Premier collects, uses, stores and protects personal information, including information submitted through the youth referral form."
          updated="September 8, 2026"
          sections={SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
};

export default Privacy;
