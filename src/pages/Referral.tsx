import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TextEffect } from "@/components/TextEffect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

type ReferralFormValues = z.infer<typeof formSchema>;

const Referral = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      jobTitle: "",
      referralPhone: "",
      referralEmail: "",
      participantPhone: "",
      youthName: "",
      age: "",
      reasonForReferral: "",
      otherReason: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (values: ReferralFormValues) => {
    setIsSubmitting(true);

    try {
      const webhookUrl = "https://hook.us2.make.com/9le1t8w239j7tbial67epggyqbp3c7o8";
      const payload = {
        ...values,
        timestamp: new Date().toISOString(),
        submitted_from: window.location.origin,
      };

      console.log("Sending data to Make.com:", payload);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(payload),
      });

      toast.success("Referral form submitted successfully! We'll be in touch soon.");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = [
    "In conflict with the law",
    "Probation",
    "Expulsion",
    "Truancy",
    "Other",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-premier-white text-premier-black pt-32 md:pt-40 pb-20 md:pb-28">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-10">
              <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
                — Refer A Youth
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
              <TextEffect
                as="h1"
                immediate
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
                highlightClassName="bg-premier-black text-premier-white px-3 py-1"
                segments={[
                  { text: "Connect a youth to a " },
                  { text: "transformative", highlight: true },
                  { text: " opportunity." },
                ]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
                Help connect youth with our programs through this secure referral process. Your
                referral can make a meaningful difference in a young person's life.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-premier-black text-premier-white py-24 md:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <span className="inline-block border border-premier-white/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-white/80">
                — Referral Information
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16">
              <TextEffect
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl"
                highlightClassName="bg-premier-white text-premier-black px-3 py-1"
                segments={[
                  { text: "Submit a " },
                  { text: "referral", highlight: true },
                ]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-white/80 leading-relaxed">
                Please provide accurate information to ensure proper program placement and
                communication.
              </p>
            </div>

            <div className="bg-premier-white text-premier-black border border-premier-white/10 rounded-2xl p-8 md:p-12 [&_input]:text-premier-black [&_textarea]:text-premier-black [&_label]:text-premier-black">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-premier-black border-b border-premier-black/15 pb-3">
                      Referring Organization/Individual
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name of Referring Organization/Individual</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter organization or individual name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title/Position</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter job title or position" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="referralPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referral Contact Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="referralEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referral Contact Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter contact email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-premier-black border-b border-premier-black/15 pb-3">
                      Youth Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="youthName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Youth's First and Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter youth's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter age" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="participantPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Participant Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-premier-black border-b border-premier-black/15 pb-3">
                      Referral Details
                    </h3>

                    <FormField
                      control={form.control}
                      name="reasonForReferral"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Referral</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              {reasonOptions.map((reason) => (
                                <div key={reason} className="flex items-center space-x-2">
                                  <RadioGroupItem value={reason} id={reason} />
                                  <Label htmlFor={reason} className="text-sm font-normal">
                                    {reason}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("reasonForReferral") === "Other" && (
                      <FormField
                        control={form.control}
                        name="otherReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please specify other reason</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter other reason" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide any additional information that may be helpful for program placement..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-start pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 bg-premier-black text-premier-white rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-800 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Referral"}
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>

        <section className="bg-premier-white text-premier-black py-24 md:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
                — Privacy Disclaimer
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-12">
              <TextEffect
                className="lg:col-span-5 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
                highlightClassName="bg-premier-black text-premier-white px-3 py-1"
                segments={[
                  { text: "Your " },
                  { text: "privacy", highlight: true },
                  { text: ", protected." },
                ]}
              />

              <div className="lg:col-span-7 space-y-5 text-premier-gray-700 leading-relaxed text-base md:text-lg">
                <p>
                  Project Premier is committed to protecting the personal information of all
                  individuals referred to our program. The information collected in this referral
                  form is gathered in accordance with the Personal Information Protection and
                  Electronic Documents Act (PIPEDA) and, where applicable, the Freedom of
                  Information and Protection of Privacy Act (FIPPA).
                </p>
                <p>
                  By completing this form, you acknowledge and consent to the collection, use, and
                  disclosure of the provided personal information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Assessing eligibility and suitability for Project Premier programs</li>
                  <li>
                    Contacting the referring organization and the referred youth regarding program
                    participation
                  </li>
                  <li>Facilitating program intake, scheduling, and support services</li>
                  <li>
                    Evaluating program effectiveness and reporting (in a de-identified manner)
                  </li>
                </ul>
                <p>
                  Personal information will not be shared with third parties without the
                  individual's or their legal guardian's consent, except where required by law
                  (e.g., in cases of risk of harm or legal obligations). All collected data will be
                  stored securely and retained only for as long as necessary to fulfill program
                  purposes or meet legal requirements.
                </p>
                <p>
                  If you have any questions about our privacy policies or wish to request access
                  to, correct, or withdraw personal information, please contact{" "}
                  <a
                    href="mailto:info@projectpremier.org"
                    className="underline hover:text-premier-black transition-colors"
                  >
                    info@projectpremier.org
                  </a>
                </p>
                <p className="font-medium text-premier-black">
                  By submitting this referral form, you confirm that you have obtained consent from
                  the referred youth (or their legal guardian if under 18) to share their personal
                  information with Project Premier.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Referral;
