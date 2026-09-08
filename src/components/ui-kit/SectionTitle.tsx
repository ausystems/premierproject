import { type ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { cn } from "@/lib/utils";

type Props = {
  /** Mono index that sits at the LEFT of the title, never above it. */
  index?: string;
  children: ReactNode;
  className?: string;
  align?: "right" | "left";
  id?: string;
};

/** The one section-heading style of the site: h2 ending in a period, index beside it on the baseline. */
export const SectionTitle = ({ index, children, className, align = "right", id }: Props) => (
  <div className={cn("flex items-end gap-6", align === "right" ? "justify-between" : "justify-start", className)}>
    {index && <span className="meta pb-1.5 text-grey">{index}</span>}
    <SplitReveal as="h2" id={id} className={cn("text-h2", align === "right" && "text-right")}>
      {children}
    </SplitReveal>
  </div>
);
