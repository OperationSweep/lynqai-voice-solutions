import { cn } from "@/lib/utils";
import lynqaiLogo from "@/assets/lynqai-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
  showText?: boolean;
}

export const Logo = ({ className, size = "md", variant = "default", showText = true }: LogoProps) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const textColors = {
    default: "text-foreground",
    white: "text-white",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={lynqaiLogo}
        alt="LynqAI Logo"
        className={cn(sizes[size], "w-auto object-contain")}
      />
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            textSizes[size],
            textColors[variant]
          )}
        >
          LynqAI
        </span>
      )}
    </div>
  );
};
