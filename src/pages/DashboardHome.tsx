import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, ArrowRight, Brush, BarChart3, Lightbulb, Rocket,
  Upload, CheckCircle2, TrendingUp, FileText, Clock,
} from "lucide-react";
import GradientButton from "@/components/GradientButton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const DashboardHome = () => {
  const { rawData, columns, fileName, cleaningStats } = useData();
  const navigate = useNavigate();

  const hasData = rawData.length > 0;
  const qualityScore = cleaningStats
    ? Math.round((cleaningStats.rowsAfter / Math.max(cleaningStats.rowsBefore, 1)) * 100)
    : hasData ? 88 : 0;

  // Mock AI summary content driven by whether data is loaded
  const aiSummary = hasData
    ? `Loaded ${rawData.length.toLocaleString()} rows across ${columns.length} columns from ${fileName || "your dataset"}. Initial scan suggests strong structure with a few normalisation opportunities.`
    : "Upload a dataset to unlock a personalised AI summary, key insights, quality score, and trend highlights.";

  const keyInsights = hasData
    ? [
        `${columns.length} columns detected — ${Math.min(columns.length, 3)} look numeric`,
        cleaningStats ? `${cleaningStats.duplicatesRemoved} duplicates removed in cleaning` : "Run cleaning to remove duplicates and fix gaps",
        `Quality score estimated at ${qualityScore}/100`,
      ]
    : [
        "Add data to surface trend, anomaly and quality insights",
        "AI will recommend the best charts for your dataset",
        "Forecasting unlocks once numeric columns are detected",
      ];

  const trendBars = hasData
    ? [38, 52, 46, 60, 72, 68, 80, 86, 82, 91, 88, 95]
    : [20, 28, 24, 32, 40, 36, 44, 50, 46, 54, 50, 58];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3" /> AI Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back to <span className="gradient-text">DataVerse AI</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {hasData ? "Your dataset is ready — explore insights or jump into a tool." : "Bring in some data to get started."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/import")}>
            <Upload className="w-4 h-4" /> Import
          </Button>
          <GradientButton onClick={() => navigate("/workflow")}>
            <Rocket className="w-4 h-4" /> Run Pipeline
          </GradientButton>
        </div>
      </div>

      {/* Top row — AI Summary (hero) + Data Quality */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-6 rounded-2xl gradient-primary text-primary-foreground glow-primary relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3 relative">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-semibold opacity-90">AI Summary</span>
          </div>
          <p className="text-base md:text-lg font-medium leading-relaxed relative">{aiSummary}</p>
          <div className="flex gap-2 mt-5 relative">
            <button
              onClick={() => navigate(hasData ? "/dashboard/insights" : "/dashboard/import")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary-foreground/15 hover:bg-primary-foreground/25 transition-colors px-3 py-1.5 rounded-lg"
            >
              {hasData ? "Generate insights" : "Import data"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate("/workflow")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary-foreground/15 hover:bg-primary-foreground/25 transition-colors px-3 py-1.5 rounded-lg"
            >
              Run pipeline <Rocket className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Data Quality</p>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-4xl font-extrabold text-foreground">{qualityScore}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <Progress value={qualityScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-3">
            {hasData
              ? `${cleaningStats?.duplicatesRemoved ?? 0} duplicates · ${cleaningStats?.missingHandled ?? 0} fixed`
              : "Awaiting data"}
          </p>
        </div>
      </div>

      {/* Mid row — Top Trends + Key Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Top Trend</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {hasData ? `${columns[0] ?? "Series"} over time` : "Sample trend"}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/charts")}
              className="text-xs font-semibold text-primary hover:opacity-80 inline-flex items-center gap-1"
            >
              Explain this chart <Sparkles className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-end gap-2 h-32">
            {trendBars.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md gradient-primary opacity-90 hover:opacity-100 transition-all"
                style={{ height: `${v}%`, animation: `slide-up 700ms ease-out ${i * 50}ms backwards` }}
              />
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Key Insights</p>
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <ul className="space-y-3">
            {keyInsights.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction icon={Brush} label="Clean Data" desc="Fix duplicates & gaps" onClick={() => navigate("/dashboard/clean")} />
          <QuickAction icon={BarChart3} label="Visualize" desc="Auto-generated charts" onClick={() => navigate("/dashboard/charts")} />
          <QuickAction icon={Lightbulb} label="AI Insights" desc="Smart observations" onClick={() => navigate("/dashboard/insights")} />
          <QuickAction icon={TrendingUp} label="Forecasting" desc="Predict future values" onClick={() => navigate("/dashboard/forecasting")} />
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Projects</h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {hasData ? (
            <RecentRow name={fileName || "Untitled dataset"} meta={`${rawData.length.toLocaleString()} rows · ${columns.length} cols`} when="Just now" onOpen={() => navigate("/dashboard/preview")} />
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-4">No projects yet — import data to create your first one.</p>
              <GradientButton onClick={() => navigate("/dashboard/import")}>
                Import Data <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, desc, onClick }: { icon: any; label: string; desc: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group p-4 rounded-2xl bg-card border border-border text-left hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 glow-hover"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <p className="font-semibold text-foreground text-sm">{label}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
  </button>
);

const RecentRow = ({ name, meta, when, onOpen }: { name: string; meta: string; when: string; onOpen: () => void }) => (
  <button onClick={onOpen} className="w-full flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors text-left">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <FileText className="w-4 h-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground truncate">{name}</p>
      <p className="text-xs text-muted-foreground truncate">{meta}</p>
    </div>
    <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock className="w-3 h-3" /> {when}
    </div>
    <ArrowRight className="w-4 h-4 text-muted-foreground" />
  </button>
);

export default DashboardHome;
