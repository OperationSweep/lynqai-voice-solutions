import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GradientButtonProps {
  className?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  glow?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      glow = false,
      disabled,
      type = "button",
      onClick,
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    const variantClasses = {
      primary:
        "gradient-primary text-white font-semibold hover:shadow-glow",
      secondary:
        "bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90",
      outline:
        "border border-primary/50 bg-transparent text-primary hover:bg-primary/10 font-medium",
      ghost:
        "bg-transparent text-foreground hover:bg-muted font-medium",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={disabled || isLoading ? undefined : { scale: 1.02 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          glow && "animate-pulse-glow",
          className
        )}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

GradientButton.displayName = "GradientButton";
