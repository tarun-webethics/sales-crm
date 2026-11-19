import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14A800] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#14A800] text-white shadow-sm hover:bg-[#108A00] active:bg-[#0D7300]",
        destructive:
          "bg-[#DC2626] text-white shadow-sm hover:bg-[#B91C1C]",
        outline:
          "border border-[#E5E7EB] bg-white text-[#3C4043] shadow-xs hover:bg-[#F9FAFB] hover:text-[#001E00] hover:border-[#D1D5DB]",
        secondary:
          "bg-[#F1FAF0] text-[#14A800] hover:bg-[#DFF3DC]",
        ghost:
          "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#001E00]",
        link:
          "text-[#14A800] underline-offset-4 hover:underline",
        outlineDestructive:
          "border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#FEF2F2] hover:border-[#DC2626]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-6",
        icon: "h-9 w-9",
        iconSm: "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
