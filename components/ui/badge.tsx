import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#14A800] text-white hover:bg-[#108A00]",
        secondary:
          "border-transparent bg-[#F1FAF0] text-[#14A800]",
        destructive:
          "border-transparent bg-[#FEE2E2] text-[#DC2626]",
        outline: "text-[#3C4043] border-[#E5E7EB]",
        warning: "border-transparent bg-[#FEF3C7] text-[#B45309]",
        info: "border-transparent bg-[#E0E7FF] text-[#4338CA]",
        neutral: "border-transparent bg-[#F3F4F6] text-[#4B5563]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
