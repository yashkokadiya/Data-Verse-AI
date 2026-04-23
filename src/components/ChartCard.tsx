import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const ChartCard = ({ title, children }: Props) => (
  <div className="rounded-xl bg-card border border-border/50 p-5 transition-all duration-300 hover:border-primary/30 animate-slide-up">
    <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

export default ChartCard;
