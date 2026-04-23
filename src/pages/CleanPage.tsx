import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { cleanData } from "@/lib/cleaning";
import { toast } from "@/hooks/use-toast";
import GradientButton from "@/components/GradientButton";
import ToolHeader from "@/components/ToolHeader";
import StepNav from "@/components/StepNav";
import {
  ArrowRight, Sparkles, Loader2, CheckCircle2, Trash2, FileWarning,
  Rows3, FileCheck, Brush, Wand2,
} from "lucide-react";

const CleanPage = () => {
  const { rawData, cleaningStats, columns, setCleanedData } = useData();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const hasData = rawData.length > 0;

  const handleClean = () => {
    setProcessing(true);
    setTimeout(() => {
      const result = cleanData(rawData, columns);
      setCleanedData(result.cleaned, result.stats);
      setProcessing(false);
      toast({ title: "Data cleaned!", description: `${result.stats.duplicatesRemoved} duplicates removed, ${result.stats.missingHandled} missing values handled.` });
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <StepNav current="clean" nextDisabled={!hasData} />
      <div className="max-w-3xl mx-auto">
        <ToolHeader
          icon={Brush}
          title="Data Cleaning Tool"
          description="Remove duplicates, fix missing values, and normalize columns — works standalone."
        />

        {!hasData ? (
          <EmptyHint msg="Import a CSV or Excel file in step 1 to start cleaning." />
        ) : !cleaningStats ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Ready to clean</p>
            <p className="text-xs text-muted-foreground mb-5">
              We'll deduplicate rows, fill missing values, and trim whitespace.
            </p>
            <GradientButton size="lg" onClick={handleClean} disabled={processing}>
              {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                : <><Sparkles className="w-4 h-4" /> Run Cleaning</>}
            </GradientButton>
          </div>
        ) : (
          <div className="space-y-5 animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
              <CleanStat icon={Rows3} label="Rows Before" value={cleaningStats.rowsBefore} />
              <CleanStat icon={FileCheck} label="Rows After" value={cleaningStats.rowsAfter} highlight />
              <CleanStat icon={Trash2} label="Duplicates Removed" value={cleaningStats.duplicatesRemoved} />
              <CleanStat icon={FileWarning} label="Missing Handled" value={cleaningStats.missingHandled} />
            </div>

            <div className="p-4 rounded-2xl bg-card border border-primary/20 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">Cleaning complete — your dataset is ready for visualization or insights.</p>
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              <GradientButton onClick={() => navigate("/dashboard/charts")}>
                Visualize <ArrowRight className="w-4 h-4" />
              </GradientButton>
              <GradientButton onClick={() => navigate("/dashboard/insights")}>
                See Insights <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CleanStat = ({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: number; highlight?: boolean }) => (
  <div className={`p-5 rounded-2xl border text-center transition-all ${highlight ? "gradient-primary text-primary-foreground border-transparent glow-primary" : "bg-card border-border"}`}>
    <Icon className={`w-5 h-5 mx-auto mb-2 ${highlight ? "text-primary-foreground" : "text-primary"}`} />
    <p className={`text-3xl font-extrabold ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{value}</p>
    <p className={`text-xs mt-1 ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</p>
  </div>
);

const EmptyHint = ({ msg }: { msg: string }) => (
  <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
    <p className="text-sm text-muted-foreground">{msg}</p>
  </div>
);

export default CleanPage;
