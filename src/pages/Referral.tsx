import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

// Schema, field names, messages, webhook and payload are unchanged from the live site.
const formSchema = z.object({
  organizationName: z.string().min(1, "Organization/Individual name is required"),
  jobTitle: z.string().min(1, "Job title/Position is required"),
  referralPhone: z.string().optional(),
  referralEmail: z.string().email().optional().or(z.literal("")),
  participantPhone: z.string().min(1, "Participant phone number is required"),
  youthName: z.string().min(1, "Youth's name is required"),
  age: z.string().min(1, "Age is required"),
  reasonForReferral: z.string().min(1, "Reason for referral is required"),
  otherReason: z.string().optional(),
  additionalNotes: z.string().optional(),
});
type Values = z.infer<typeof formSchema>;

const WEBHOOK = "https://hook.us2.make.com/9le1t8w239j7tbial67epggyqbp3c7o8";
const REASONS = ["In conflict with the law", "Probation", "Expulsion", "Truancy", "Other"];

const PURPOSES = [
  "Assessing eligibility and suitability for Project Premier programs",
  "Contacting the referring organization and the referred youth regarding program participation",
  "Facilitating program intake, scheduling, and support services",
  "Evaluating program effectiveness and reporting (in a de-identified manner)",
];

// Standard bordered controls: 16px text (no zoom on iOS), 48px tall, a clear focus ring.
const control =
  "w-full rounded-[4px] border bg-transparent px-4 py-3 text-base text-fg placeholder:text-grey " +
  "transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/15";

type FieldProps = { id: keyof Values; label: string; error?: string; required?: boolean; children: ReactNode };
const Field = ({ id, label, error, required, children }: FieldProps) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
      {label}{required && <span aria-hidden="true">{" *"}</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-fg">
        {error}
      </p>
    )}
  </div>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className="mt-14 border-0 p-0 first:mt-0">
    <legend className="text-h4 font-medium">{title}</legend>
    <div className="mt-6 grid gap-6 sm:grid-cols-2">{children}</div>
  </fieldset>
);

const Referral = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  useSeo({
    title: "Refer a Youth",
    path: "/referral",
    description: "Refer a young person to Project Premier's programs through our secure referral form. Your referral can make a meaningful difference in a young person's life.",
  });

  const form = useForm<Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "", jobTitle: "", referralPhone: "", referralEmail: "", participantPhone: "",
      youthName: "", age: "", reasonForReferral: "", otherReason: "", additionalNotes: "",
    },
  });
  const { register, handleSubmit, watch, reset, formState: { errors } } = form;
  const reason = watch("reasonForReferral");

  const onSubmit = async (values: Values) => {
    setIsSubmitting(true);
    try {
      const payload = { ...values, timestamp: new Date().toISOString(), submitted_from: window.location.origin };
      console.log("Sending data to Make.com:", payload);
      await fetch(WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, mode: "cors", body: JSON.stringify(payload) });
      toast.success("Referral form submitted successfully! We'll be in touch soon.");
      reset();
      setSent(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const err = (k: keyof Values) => errors[k]?.message as string | undefined;
  const box = (k: keyof Values) => cn(control, err(k) ? "border-2 border-fg" : "border-fg/30");
  const describedBy = (k: keyof Values) => (err(k) ? `${k}-error` : undefined);

  return (
    <>
      <main>
        <section data-theme="paper" className="wrap pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section lg:pt-[calc(theme(spacing.nav)+5rem)]">
          <div className="mx-auto max-w-[46rem]">
            {sent ? (
              <div className="min-h-[50vh]">
                <SplitReveal as="h1" trigger="load" className="text-display">Thank you. We'll be in <em>touch</em> soon.</SplitReveal>
                <Reveal trigger="load" delay={0.6} className="mt-8 text-body text-fg2">
                  Your referral has been received. Our team will contact the referring organization and the referred youth regarding program participation.
                </Reveal>
                <Reveal trigger="load" delay={0.8} className="mt-10 flex flex-wrap gap-6">
                  <Button variant="link" onClick={() => setSent(false)}>Refer someone else</Button>
                  <Button variant="link" to="/programs">Our Programs</Button>
                </Reveal>
              </div>
            ) : (
              <>
                <SplitReveal as="h1" trigger="load" delay={0.2} className="text-display">
                  Connect a youth to a <em>transformative</em> opportunity.
                </SplitReveal>
                <Reveal trigger="load" delay={0.8} className="mt-8 text-body text-fg2 md:text-[1.125rem]">
                  Help connect youth with our programs through this secure referral process. Your referral can make a meaningful difference in a young person's life.
                </Reveal>
                <Reveal trigger="load" delay={1} className="mt-4 text-body text-grey">
                  Please provide accurate information to ensure proper program placement and communication. Fields marked * are required.
                </Reveal>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-14 md:mt-16">
                  <Section title="Referring organization">
                    <Field id="organizationName" label="Name of Referring Organization/Individual" required error={err("organizationName")}>
                      <input id="organizationName" {...register("organizationName")} className={box("organizationName")} placeholder="Enter organization or individual name" autoComplete="organization" aria-invalid={!!err("organizationName")} aria-describedby={describedBy("organizationName")} />
                    </Field>
                    <Field id="jobTitle" label="Job Title/Position" required error={err("jobTitle")}>
                      <input id="jobTitle" {...register("jobTitle")} className={box("jobTitle")} placeholder="Enter job title or position" autoComplete="organization-title" aria-invalid={!!err("jobTitle")} aria-describedby={describedBy("jobTitle")} />
                    </Field>
                  </Section>

                  <Section title="Your contact details">
                    <Field id="referralPhone" label="Referral Contact Phone Number" error={err("referralPhone")}>
                      <input id="referralPhone" type="tel" {...register("referralPhone")} className={box("referralPhone")} placeholder="Enter phone number" autoComplete="tel" />
                    </Field>
                    <Field id="referralEmail" label="Referral Contact Email" error={err("referralEmail")}>
                      <input id="referralEmail" type="email" {...register("referralEmail")} className={box("referralEmail")} placeholder="Enter contact email" autoComplete="email" aria-invalid={!!err("referralEmail")} aria-describedby={describedBy("referralEmail")} />
                    </Field>
                  </Section>

                  <Section title="About the youth">
                    <Field id="youthName" label="Youth's First and Last Name" required error={err("youthName")}>
                      <input id="youthName" {...register("youthName")} className={box("youthName")} placeholder="Enter youth's full name" autoComplete="off" aria-invalid={!!err("youthName")} aria-describedby={describedBy("youthName")} />
                    </Field>
                    <Field id="age" label="Age" required error={err("age")}>
                      <input id="age" inputMode="numeric" {...register("age")} className={box("age")} placeholder="Enter age" aria-invalid={!!err("age")} aria-describedby={describedBy("age")} />
                    </Field>
                    <Field id="participantPhone" label="Participant Phone Number" required error={err("participantPhone")}>
                      <input id="participantPhone" type="tel" {...register("participantPhone")} className={box("participantPhone")} placeholder="Enter phone number" aria-invalid={!!err("participantPhone")} aria-describedby={describedBy("participantPhone")} />
                    </Field>
                  </Section>

                  <fieldset className="mt-14 border-0 p-0">
                    <legend className="text-h4 font-medium">Reason for referral</legend>
                    <div role="radiogroup" aria-labelledby="reason-label" aria-describedby={describedBy("reasonForReferral")} className="mt-6">
                      <span id="reason-label" className="mb-2 block text-sm font-medium text-fg">Reason for Referral<span aria-hidden="true">{" *"}</span></span>
                      <div className={cn("rounded-[4px] border", err("reasonForReferral") ? "border-2 border-fg" : "border-fg/30")}>
                        {REASONS.map((r, i) => (
                          <label key={r} className={cn("flex min-h-[48px] cursor-pointer items-center gap-3 px-4 py-3 text-base", i > 0 && "border-t border-fg/15")}>
                            <input type="radio" value={r} {...register("reasonForReferral")} className="h-4 w-4 shrink-0 accent-ink" />
                            <span>{r}</span>
                          </label>
                        ))}
                      </div>
                      {err("reasonForReferral") && (
                        <p id="reasonForReferral-error" role="alert" className="mt-2 text-sm text-fg">{err("reasonForReferral")}</p>
                      )}
                    </div>
                    {reason === "Other" && (
                      <div className="mt-6">
                        <Field id="otherReason" label="Please specify other reason" error={err("otherReason")}>
                          <input id="otherReason" {...register("otherReason")} className={box("otherReason")} placeholder="Enter other reason" />
                        </Field>
                      </div>
                    )}
                  </fieldset>

                  <fieldset className="mt-14 border-0 p-0">
                    <legend className="text-h4 font-medium">Notes and consent</legend>
                    <div className="mt-6">
                      <Field id="additionalNotes" label="Additional Notes" error={err("additionalNotes")}>
                        <textarea id="additionalNotes" rows={5} {...register("additionalNotes")} className={cn(box("additionalNotes"), "resize-y")} placeholder="Please provide any additional information that may be helpful for program placement..." />
                      </Field>
                    </div>
                    <p className="mt-8 text-body text-fg2">
                      By submitting this referral form, you confirm that you have obtained consent from the referred youth (or their legal guardian if under 18) to share their personal information with Project Premier.
                    </p>
                    <div className="mt-8">
                      <Button type="submit" disabled={isSubmitting} className="w-full justify-center sm:w-auto">
                        {isSubmitting ? "Submitting..." : "Submit Referral"}
                      </Button>
                    </div>
                  </fieldset>
                </form>
              </>
            )}
          </div>
        </section>

        {/* Privacy */}
        <section data-theme="ink" className="wrap grid gap-10 py-section md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
            <SplitReveal as="h2" className="text-h2">Your privacy, <em>protected</em>.</SplitReveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal className="text-body text-fg2">
              Project Premier is committed to protecting the personal information of all individuals referred to our program. The information collected in this referral form is gathered in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and, where applicable, the Freedom of Information and Protection of Privacy Act (FIPPA).
            </Reveal>
            <Reveal className="mt-8 text-body text-fg2">
              By completing this form, you acknowledge and consent to the collection, use, and disclosure of the provided personal information for the following purposes:
            </Reveal>
            <ul className="mt-8">
              {PURPOSES.map((p, i) => (
                <Reveal key={i} as="li" className="hair-t py-4 text-body text-fg2 last:hair-b">
                  {p}
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-8 text-body text-fg2">
              Personal information will not be shared with third parties without the individual's or their legal guardian's consent, except where required by law (e.g., in cases of risk of harm or legal obligations). All collected data will be stored securely and retained only for as long as necessary to fulfill program purposes or meet legal requirements.
            </Reveal>
            <Reveal className="mt-8 text-body text-fg2">
              If you have any questions about our privacy policies or wish to request access to, correct, or withdraw personal information, please contact{" "}
              <a href="mailto:info@projectpremier.org" className="text-fg underline decoration-fg/40 underline-offset-4 transition-colors hover:decoration-fg">info@projectpremier.org</a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Referral;
