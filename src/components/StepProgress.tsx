import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Upload", key: "upload" },
  { label: "Preview", key: "preview" },
  { label: "Clean", key: "clean" },
  { label: "Visualize", key: "visualize" },
  { label: "Insights", key: "insights" },
  { label: "Export", key: "export" },
];

interface Props {
  currentStep: number;
}

const StepProgress = ({ currentStep }: Props) => (
  <div className="w-full px-4 py-4">
    <div className="flex items-center justify-between max-w-3xl mx-auto">
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500",
                  done && "gradient-primary text-primary-foreground shadow-lg glow-primary",
                  active && "border-2 border-primary text-primary bg-primary/10 animate-glow-pulse",
                  !done && !active && "border border-border text-muted-foreground bg-muted/30"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors hidden sm:block",
                active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-2 h-[2px] rounded-full overflow-hidden bg-border">
                <div
                  className="h-full gradient-primary transition-all duration-700 ease-out"
                  style={{ width: done ? "100%" : active ? "50%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default StepProgress;
