import { Footer } from "@/components/layout/Footer";
import { Article, type ArticleSection } from "@/components/ui-kit/Article";
import { useSeo } from "@/lib/seo";

const EMAIL = <a href="mailto:info@projectpremier.org" className="text-fg underline decoration-fg/40 underline-offset-4 transition-colors hover:decoration-fg">info@projectpremier.org</a>;

const SECTIONS: ArticleSection[] = [
  {
    heading: "Acceptance of these terms",
    body: [
      "This website is operated by Project Premier, a Toronto-based nonprofit serving marginalized youth across the Greater Toronto Area (GTA). By accessing or using the website you agree to these Terms of Use and to our Privacy Policy. If you do not agree, please do not use the website.",
    ],
  },
  {
    heading: "Use of the website",
    body: [
      "You may use the website for lawful, personal and non-commercial purposes, including learning about our programs, contacting us, and referring a young person to our programs. You agree not to interfere with the operation or security of the website, attempt to gain unauthorized access to any part of it, or use automated means to extract content beyond what search engines and similar services ordinarily do.",
    ],
  },
  {
    heading: "Referrals and submissions",
    body: [
      "When you submit a referral, you confirm that the information you provide is accurate to the best of your knowledge and that you have obtained consent from the referred youth (or their legal guardian if under 18) to share their personal information with Project Premier. Submitting a referral does not guarantee acceptance into a program. Personal information you submit is handled as described in our Privacy Policy.",
      "This website is not an emergency service. If a young person is in immediate danger, call 911 or contact local emergency services.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "Unless otherwise noted, the content of this website, including text, photographs, video, graphics and the Project Premier name and logo, belongs to Project Premier or is used with permission, and is protected by copyright and trademark laws. You may view and share links to the website, but you may not reproduce, modify, distribute or publicly display its content without our prior written permission, except as permitted by law.",
    ],
  },
  {
    heading: "Third-party content and links",
    body: [
      "The website embeds videos hosted on YouTube and links to services such as Instagram and Google Maps. Those services are not operated by Project Premier and are governed by their own terms and privacy policies. We are not responsible for the content or practices of third-party sites.",
    ],
  },
  {
    heading: "Disclaimer",
    body: [
      "The website and its content are provided on an as-is and as-available basis for general information. While we work to keep information accurate and current, we make no warranties, express or implied, about the completeness, accuracy, reliability or availability of the website or its content. Program details, schedules and hours may change.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Project Premier and its directors, staff, volunteers and partners will not be liable for any indirect, incidental, special or consequential damages arising out of or related to your use of, or inability to use, the website or its content.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable in it. Any dispute relating to the website will be resolved in the courts of Ontario.",
    ],
  },
  {
    heading: "Changes and contact",
    body: [
      <>We may update these terms from time to time; the date at the top of this page shows when they were last revised. Questions about these terms can be sent to {EMAIL} or to Project Premier, 130 Queens Quay East, Toronto, ON, Canada.</>,
    ],
  },
];

const Terms = () => {
  useSeo("/terms");
  return (
    <>
      <main id="main">
        <Article
          title={<>Terms of <em>Use</em>.</>}
          intro="The terms that apply to your use of the Project Premier website, including referrals and submissions, intellectual property, third-party content and limitations of liability."
          updated="September 8, 2026"
          sections={SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
};

export default Terms;
