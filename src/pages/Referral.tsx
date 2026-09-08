import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
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

// Five sections, never three.
const STEPS = [
  { index: "01", title: "Referring organization" },
  { index: "02", title: "Your contact details" },
  { index: "03", title: "About the youth" },
  { index: "04", title: "Reason for referral" },
  { index: "05", title: "Notes and consent" },
];

const PURPOSES = [
  "Assessing eligibility and suitability for Project Premier programs",
  "Contacting the referring organization and the referred youth regarding program participation",
  "Facilitating program intake, scheduling, and support services",
  "Evaluating program effectiveness and reporting (in a de-identified manner)",
];

const fieldClass =
  "peer w-full bg-transparent py-3 text-h4 font-normal text-fg outline-none placeholder:text-grey/70 " +
  "border-b border-fg/30 transition-[border-color,box-shadow] duration-250 focus:border-fg focus:[box-shadow:0_1px_0_0_currentColor]";

type FieldProps = { id: keyof Values; label: string; error?: string; required?: boolean; children: ReactNode };
const Field = ({ id, label, error, required, children }: FieldProps) => (
  <div>
    <label htmlFor={id} className="meta block text-grey">
      {label}{required && <span aria-hidden="true">{"\u00A0*"}</span>}
    </label>
    <div className={cn(error && "[&>*]:border-fg [&>*]:[box-shadow:0_1px_0_0_currentColor]")}>{children}</div>
    <p id={`${id}-error`} role="alert" className={cn("meta mt-2 min-h-[1.3em] text-fg transition-opacity", error ? "opacity-100" : "opacity-0")}>
      {error ? `! ${error}` : ""}
    </p>
  </div>
);

const Referral = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(0);
  const steps = useRef<HTMLFieldSetElement[]>([]);

  const form = useForm<Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "", jobTitle: "", referralPhone: "", referralEmail: "", participantPhone: "",
      youthName: "", age: "", reasonForReferral: "", otherReason: "", additionalNotes: "",
    },
  });
  const { register, handleSubmit, watch, reset, formState: { errors } } = form;
  const reason = watch("reasonForReferral");

  // Which section the reader is in: drives the sticky step list and the progress line.
  useEffect(() => {
    const els = steps.current.filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sent]);

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

  return (
    <>
      <main>
        <section data-theme="paper" className="wrap grid gap-10 pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section md:grid-cols-12 md:gap-8 lg:pt-[calc(theme(spacing.nav)+5rem)]">
          {/* Sticky step list */}
          <aside className="md:col-span-3 md:sticky md:top-32 md:self-start">
            <div className="meta text-grey">Refer a Youth</div>
            {!sent && (
              <>
                <div className="mt-6 h-px w-full bg-fg/15">
                  <div className="h-[2px] -translate-y-px bg-fg transition-[width] duration-600 ease-out" style={{ width: `${((active + 1) / STEPS.length) * 100}%` }} />
                </div>
                <ol className="mt-6 hidden md:block">
                  {STEPS.map((s, i) => (
                    <li key={s.index} className={cn("meta flex gap-4 py-2 transition-colors duration-250", i === active ? "text-fg" : "text-grey")}>
                      <span className="tnum">{s.index}</span>
                      <span>{s.title}</span>
                    </li>
                  ))}
                </ol>
                <p className="meta mt-6 text-grey md:hidden">Section {STEPS[active].index} of 05</p>
              </>
            )}
          </aside>

          <div className="md:col-span-8 md:col-start-5">
            {sent ? (
              <div className="min-h-[50vh]">
                <SplitReveal as="h1" trigger="load" className="max-w-[14ch] text-display">Thank you. We'll be in <em>touch</em> soon.</SplitReveal>
                <Reveal trigger="load" delay={0.6} className="mt-10 max-w-prose text-body text-fg2">
                  Your referral has been received. Our team will contact the referring organization and the referred youth regarding program participation.
                </Reveal>
                <Reveal trigger="load" delay={0.8} className="mt-10 flex flex-wrap gap-6">
                  <Button variant="link" onClick={() => setSent(false)}>Refer someone else</Button>
                  <Button variant="link" to="/programs">Our Programs</Button>
                </Reveal>
              </div>
            ) : (
              <>
                <SplitReveal as="h1" trigger="load" delay={0.2} className="max-w-[13ch] text-display">
                  Connect a youth to a <em>transformative</em> opportunity.
                </SplitReveal>
                <Reveal trigger="load" delay={0.8} className="mt-10 max-w-prose text-body text-fg2 md:text-[1.125rem]">
                  Help connect youth with our programs through this secure referral process. Your referral can make a meaningful difference in a young person's life.
                </Reveal>
                <Reveal trigger="load" delay={1} className="mt-6 max-w-prose text-body text-grey">
                  Please provide accurate information to ensure proper program placement and communication.
                </Reveal>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-20 md:mt-28">
                  {/* 01 */}
                  <fieldset ref={(n) => { if (n) steps.current[0] = n; }} data-step={0} className="hair-t py-12 md:py-16">
                    <legend className="sr-only">01 Referring organization</legend>
                    <div className="flex items-baseline gap-4"><span className="meta text-grey">01</span><span className="text-h3">Referring organization</span></div>
                    <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
                      <Field id="organizationName" label="Name of Referring Organization/Individual" required error={err("organizationName")}>
                        <input id="organizationName" {...register("organizationName")} className={fieldClass} placeholder="Enter organization or individual name" autoComplete="organization" aria-invalid={!!err("organizationName")} aria-describedby="organizationName-error" />
                      </Field>
                      <Field id="jobTitle" label="Job Title/Position" required error={err("jobTitle")}>
                        <input id="jobTitle" {...register("jobTitle")} className={fieldClass} placeholder="Enter job title or position" autoComplete="organization-title" aria-invalid={!!err("jobTitle")} aria-describedby="jobTitle-error" />
                      </Field>
                    </div>
                  </fieldset>

                  {/* 02 */}
                  <fieldset ref={(n) => { if (n) steps.current[1] = n; }} data-step={1} className="hair-t py-12 md:py-16">
                    <legend className="sr-only">02 Your contact details</legend>
                    <div className="flex items-baseline gap-4"><span className="meta text-grey">02</span><span className="text-h3">Your contact details</span></div>
                    <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
                      <Field id="referralPhone" label="Referral Contact Phone Number" error={err("referralPhone")}>
                        <input id="referralPhone" type="tel" {...register("referralPhone")} className={fieldClass} placeholder="Enter phone number" autoComplete="tel" />
                      </Field>
                      <Field id="referralEmail" label="Referral Contact Email" error={err("referralEmail")}>
                        <input id="referralEmail" type="email" {...register("referralEmail")} className={fieldClass} placeholder="Enter contact email" autoComplete="email" aria-invalid={!!err("referralEmail")} aria-describedby="referralEmail-error" />
                      </Field>
                    </div>
                  </fieldset>

                  {/* 03 */}
                  <fieldset ref={(n) => { if (n) steps.current[2] = n; }} data-step={2} className="hair-t py-12 md:py-16">
                    <legend className="sr-only">03 About the youth</legend>
                    <div className="flex items-baseline gap-4"><span className="meta text-grey">03</span><span className="text-h3">About the youth</span></div>
                    <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
                      <Field id="youthName" label="Youth's First and Last Name" required error={err("youthName")}>
                        <input id="youthName" {...register("youthName")} className={fieldClass} placeholder="Enter youth's full name" autoComplete="off" aria-invalid={!!err("youthName")} aria-describedby="youthName-error" />
                      </Field>
                      <Field id="age" label="Age" required error={err("age")}>
                        <input id="age" inputMode="numeric" {...register("age")} className={fieldClass} placeholder="Enter age" aria-invalid={!!err("age")} aria-describedby="age-error" />
                      </Field>
                      <Field id="participantPhone" label="Participant Phone Number" required error={err("participantPhone")}>
                        <input id="participantPhone" type="tel" {...register("participantPhone")} className={fieldClass} placeholder="Enter phone number" aria-invalid={!!err("participantPhone")} aria-describedby="participantPhone-error" />
                      </Field>
                    </div>
                  </fieldset>

                  {/* 04 */}
                  <fieldset ref={(n) => { if (n) steps.current[3] = n; }} data-step={3} className="hair-t py-12 md:py-16">
                    <legend className="sr-only">04 Reason for referral</legend>
                    <div className="flex items-baseline gap-4"><span className="meta text-grey">04</span><span className="text-h3">Reason for referral</span></div>
                    <div role="radiogroup" aria-labelledby="reason-label" aria-describedby="reasonForReferral-error" className="mt-10">
                      <span id="reason-label" className="meta block text-grey">Reason for Referral<span aria-hidden="true">{"\u00A0*"}</span></span>
                      <div className="mt-4 hair-b">
                        {REASONS.map((r) => (
                          <label key={r} className="group flex cursor-pointer items-center justify-between gap-6 hair-t py-5 transition-colors duration-250 hover:text-fg2">
                            <span className="text-h4 font-normal">{r}</span>
                            <input type="radio" value={r} {...register("reasonForReferral")} className="peer sr-only" />
                            <span aria-hidden="true" className="relative h-4 w-4 shrink-0 rounded-full border border-fg/50 transition-colors duration-250 peer-checked:border-fg peer-checked:bg-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-current" />
                          </label>
                        ))}
                      </div>
                      <p id="reasonForReferral-error" role="alert" className={cn("meta mt-3 min-h-[1.3em] text-fg", err("reasonForReferral") ? "opacity-100" : "opacity-0")}>
                        {err("reasonForReferral") ? `! ${err("reasonForReferral")}` : ""}
                      </p>
                    </div>
                    {reason === "Other" && (
                      <div className="mt-6">
                        <Field id="otherReason" label="Please specify other reason" error={err("otherReason")}>
                          <input id="otherReason" {...register("otherReason")} className={fieldClass} placeholder="Enter other reason" />
                        </Field>
                      </div>
                    )}
                  </fieldset>

                  {/* 05 */}
                  <fieldset ref={(n) => { if (n) steps.current[4] = n; }} data-step={4} className="hair-t hair-b py-12 md:py-16">
                    <legend className="sr-only">05 Notes and consent</legend>
                    <div className="flex items-baseline gap-4"><span className="meta text-grey">05</span><span className="text-h3">Notes and consent</span></div>
                    <div className="mt-10">
                      <Field id="additionalNotes" label="Additional Notes" error={err("additionalNotes")}>
                        <textarea id="additionalNotes" rows={4} {...register("additionalNotes")} className={cn(fieldClass, "resize-y")} placeholder="Please provide any additional information that may be helpful for program placement..." />
                      </Field>
                    </div>
                    <p className="mt-10 max-w-prose text-body text-fg2">
                      By submitting this referral form, you confirm that you have obtained consent from the referred youth (or their legal guardian if under 18) to share their personal information with Project Premier.
                    </p>
                    <div className="mt-10">
                      <Button type="submit" disabled={isSubmitting} magnetic>{isSubmitting ? "Submitting..." : "Submit Referral"}</Button>
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
            <ol className="mt-8">
              {PURPOSES.map((p, i) => (
                <Reveal key={i} as="li" className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 hair-t py-5 text-body text-fg2 last:hair-b">
                  <span className="meta pt-1 text-grey">0{i + 1}</span>
                  <span>{p}</span>
                </Reveal>
              ))}
            </ol>
            <Reveal className="mt-8 text-body text-fg2">
              Personal information will not be shared with third parties without the individual's or their legal guardian's consent, except where required by law (e.g., in cases of risk of harm or legal obligations). All collected data will be stored securely and retained only for as long as necessary to fulfill program purposes or meet legal requirements.
            </Reveal>
            <Reveal className="mt-8 text-body text-fg2">
              If you have any questions about our privacy policies or wish to request access to, correct, or withdraw personal information, please contact{" "}
              <a href="mailto:info@projectpremier.org" className="text-fg underline underline-offset-4 decoration-fg/40 transition-colors hover:decoration-fg">info@projectpremier.org</a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Referral;
