import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import GradientButton from "@/components/GradientButton";
import StepProgress from "@/components/StepProgress";

export const STEP_ORDER = [
  { key: "import", path: "/dashboard/import", label: "Import" },
  { key: "preview", path: "/dashboard/preview", label: "Preview" },
  { key: "clean", path: "/dashboard/clean", label: "Clean" },
  { key: "charts", path: "/dashboard/charts", label: "Visualize" },
  { key: "insights", path: "/dashboard/insights", label: "Insights" },
  { key: "export", path: "/dashboard/export", label: "Export" },
] as const;

export type StepKey = (typeof STEP_ORDER)[number]["key"];

interface Props {
  current: StepKey;
  nextDisabled?: boolean;
  onFinish?: () => void;
}

const StepNav = ({ current, nextDisabled, onFinish }: Props) => {
  const navigate = useNavigate();
  const idx = STEP_ORDER.findIndex((s) => s.key === current);
  const prev = STEP_ORDER[idx - 1];
  const next = STEP_ORDER[idx + 1];
  const isLast = idx === STEP_ORDER.length - 1;

  return (
    <div className="space-y-4">
      <StepProgress currentStep={idx} />
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto pt-2">
        <Button
          variant="ghost"
          onClick={() => prev && navigate(prev.path)}
          disabled={!prev}
          aria-label="Previous step"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {isLast ? (
          <GradientButton onClick={() => (onFinish ? onFinish() : navigate("/dashboard"))}>
            Finish <Check className="w-4 h-4" />
          </GradientButton>
        ) : (
          <GradientButton
            onClick={() => next && navigate(next.path)}
            disabled={nextDisabled}
            aria-label="Next step"
          >
            Next: {next?.label} <ArrowRight className="w-4 h-4" />
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default StepNav;
