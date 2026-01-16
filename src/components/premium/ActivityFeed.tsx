import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Phone, Calendar, UserPlus, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "call" | "appointment" | "lead" | "success" | "failed" | "message";
  title: string;
  description: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

const iconMap = {
  call: Phone,
  appointment: Calendar,
  lead: UserPlus,
  success: CheckCircle2,
  failed: XCircle,
  message: MessageSquare,
};

const colorMap = {
  call: "bg-primary/20 text-primary",
  appointment: "bg-secondary/20 text-secondary",
  lead: "bg-accent/20 text-accent",
  success: "bg-accent/20 text-accent",
  failed: "bg-destructive/20 text-destructive",
  message: "bg-muted text-muted-foreground",
};

export const ActivityFeed = ({ activities, className }: ActivityFeedProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("space-y-4", className)}
    >
      {activities.map((activity) => {
        const Icon = iconMap[activity.type];
        return (
          <motion.div
            key={activity.id}
            variants={item}
            className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                colorMap[activity.type]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
