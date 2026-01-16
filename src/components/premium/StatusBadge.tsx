import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string }> = {
  success: {
    bg: "bg-accent/20",
    text: "text-accent",
    dot: "bg-accent",
  },
  warning: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  error: {
    bg: "bg-destructive/20",
    text: "text-destructive",
    dot: "bg-destructive",
  },
  info: {
    bg: "bg-primary/20",
    text: "text-primary",
    dot: "bg-primary",
  },
  neutral: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export const StatusBadge = ({
  status,
  label,
  pulse = false,
  className,
}: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              config.dot
            )}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full h-2 w-2", config.dot)}
        />
      </span>
      {label}
    </span>
  );
};
