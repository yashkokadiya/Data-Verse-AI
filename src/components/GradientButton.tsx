import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gradient" | "outline" | "ghost";
  size?: "default" | "lg" | "sm";
}

const GradientButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, children, variant = "gradient", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:scale-[1.03] active:scale-[0.98]",
        variant === "gradient" && "gradient-primary text-primary-foreground glow-hover shadow-lg",
        variant === "outline" && "border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60",
        variant === "ghost" && "text-muted-foreground hover:text-foreground hover:bg-muted/30",
        size === "default" && "h-11 px-6 text-sm",
        size === "lg" && "h-13 px-8 text-base",
        size === "sm" && "h-9 px-4 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

GradientButton.displayName = "GradientButton";
export default GradientButton;
