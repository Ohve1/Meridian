import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-elevated text-muted shadow-[var(--shadow-border)]",
        accent: "bg-accent/15 text-accent",
        up: "bg-up/15 text-up",
        down: "bg-down/15 text-down",
        demand: "bg-accent/10 text-accent",
        tech: "bg-elevated text-muted",
        hype: "text-subtle shadow-[var(--shadow-border)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
