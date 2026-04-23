import { TrendingUp, ShieldCheck, Eye } from "lucide-react";

interface Props {
  text: string;
  color?: "primary" | "secondary" | "accent";
}

const iconMap = {
  primary: TrendingUp,
  secondary: ShieldCheck,
  accent: Eye,
};

const labelMap = {
  primary: "Trend",
  secondary: "Data Quality",
  accent: "Observation",
};

const borderColorMap = {
  primary: "border-l-primary",
  secondary: "border-l-secondary",
  accent: "border-l-accent",
};

const bgMap = {
  primary: "bg-primary/5",
  secondary: "bg-secondary/5",
  accent: "bg-accent/5",
};

const InsightCard = ({ text, color = "primary" }: Props) => {
  const Icon = iconMap[color];
  return (
    <div className={`flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 border-l-4 ${borderColorMap[color]} transition-all duration-300 hover:border-primary/30 animate-slide-up`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgMap[color]}`}>
        <Icon className={`w-5 h-5 ${
          color === "primary" ? "text-primary" :
          color === "secondary" ? "text-secondary" : "text-accent"
        }`} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{labelMap[color]}</p>
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default InsightCard;
