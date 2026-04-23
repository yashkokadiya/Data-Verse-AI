import { useData } from "@/contexts/DataContext";
import InsightCard from "@/components/InsightCard";
import ToolHeader from "@/components/ToolHeader";
import StepNav from "@/components/StepNav";
import { generateInsights } from "@/lib/insights";
import { useMemo, useState } from "react";
import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import GradientButton from "@/components/GradientButton";

const InsightsPage = () => {
  const { rawData, cleanedData, columns } = useData();
  const data = cleanedData.length > 0 ? cleanedData : rawData;
  const hasData = data.length > 0;

  const insights = useMemo(() => (hasData ? generateInsights(data, columns) : []), [data, columns, hasData]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 900);
  };

  const showInsights = hasData && (generated || insights.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <StepNav current="insights" nextDisabled={!hasData} />
      <div className="max-w-3xl mx-auto">
        <ToolHeader
          icon={Lightbulb}
          title="AI Insights Tool"
          description="Get smart, instant observations on trends, distributions, and data quality."
        />

        {!hasData ? (
          <EmptyHint msg="Import a CSV or Excel file in step 1 to generate insights." />
        ) : !showInsights ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Ready to analyze</p>
            <p className="text-xs text-muted-foreground mb-5">
              AI will scan your dataset and surface key trends and observations.
            </p>
            <GradientButton size="lg" onClick={handleGenerate} disabled={generating}>
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                : <><Sparkles className="w-4 h-4" /> Generate Insights</>}
            </GradientButton>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((ins, i) => (
              <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}>
                <InsightCard text={ins.text} color={ins.color} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyHint = ({ msg }: { msg: string }) => (
  <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
    <p className="text-sm text-muted-foreground">{msg}</p>
  </div>
);

export default InsightsPage;
