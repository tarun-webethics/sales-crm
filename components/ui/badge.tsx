import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
        secondary:
          "border-transparent bg-[#EFF6FF] text-[#2563eb]",
        destructive:
          "border-transparent bg-[#FEE2E2] text-[#DC2626]",
        outline: "text-[#000000] border-[#CBD5E1] font-medium",
        warning: "border-transparent bg-[#FEF3C7] text-[#B45309]",
        info: "border-transparent bg-[#E0E7FF] text-[#4338CA]",
        neutral: "border-transparent bg-[#F1F5F9] text-[#000000] font-medium",
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
