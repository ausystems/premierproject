import { type ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Lower tier for compact sections (partners, contact) while keeping one heading style per level. */
  size?: "h2" | "h3";
  id?: string;
};

/** The one section-heading style of the site: a sentence-case heading ending in a period. */
export const SectionTitle = ({ children, className, size = "h2", id }: Props) => (
  <SplitReveal as="h2" id={id} className={cn(size === "h2" ? "text-h2" : "text-h3", className)}>
    {children}
  </SplitReveal>
);
