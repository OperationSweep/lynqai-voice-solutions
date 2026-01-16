import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface MiniChartProps {
  data: DataPoint[];
  color?: "primary" | "accent" | "secondary";
  height?: number;
  showTooltip?: boolean;
}

const colorConfig = {
  primary: {
    stroke: "hsl(239 84% 67%)",
    fill: "url(#primaryGradient)",
    gradientStart: "hsl(239 84% 67%)",
    gradientEnd: "hsl(239 84% 67% / 0)",
  },
  accent: {
    stroke: "hsl(160 84% 39%)",
    fill: "url(#accentGradient)",
    gradientStart: "hsl(160 84% 39%)",
    gradientEnd: "hsl(160 84% 39% / 0)",
  },
  secondary: {
    stroke: "hsl(258 90% 66%)",
    fill: "url(#secondaryGradient)",
    gradientStart: "hsl(258 90% 66%)",
    gradientEnd: "hsl(258 90% 66% / 0)",
  },
};

export const MiniChart = ({
  data,
  color = "primary",
  height = 80,
  showTooltip = true,
}: MiniChartProps) => {
  const config = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(258 90% 66%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(258 90% 66%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                background: "hsl(240 17% 8%)",
                border: "1px solid hsl(0 0% 100% / 0.1)",
                borderRadius: "8px",
                boxShadow: "0 10px 40px -10px hsl(0 0% 0% / 0.5)",
              }}
              labelStyle={{ color: "hsl(0 0% 100%)" }}
              itemStyle={{ color: config.stroke }}
            />
          )}
          <XAxis dataKey="name" hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.stroke}
            strokeWidth={2}
            fill={config.fill}
            dot={false}
            activeDot={{
              r: 4,
              fill: config.stroke,
              stroke: "hsl(240 17% 8%)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
