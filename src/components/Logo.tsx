import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

export const Logo = ({ className, size = "md", variant = "default" }: LogoProps) => {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  const textColors = {
    default: "text-foreground",
    white: "text-white",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 40 40"
        className={cn(sizes[size])}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="4" fill="url(#logoGradient)" />
        <circle cx="28" cy="12" r="4" fill="url(#logoGradient)" />
        <circle cx="12" cy="28" r="4" fill="url(#logoGradient)" />
        <circle cx="28" cy="28" r="4" fill="url(#logoGradient)" />
        <path
          d="M16 12h8M12 16v8M28 16v8M16 28h8"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="3" fill="url(#logoGradient)" />
      </svg>
      <span
        className={cn(
          "font-bold tracking-tight",
          sizes[size] === "h-6" ? "text-lg" : sizes[size] === "h-8" ? "text-xl" : "text-2xl",
          textColors[variant]
        )}
      >
        Lynq<span className="gradient-text">AI</span>
      </span>
    </div>
  );
};
