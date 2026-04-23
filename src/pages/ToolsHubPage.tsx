import { useNavigate } from "react-router-dom";
import {
  Sparkles, Brush, BarChart3, Lightbulb, Upload, ArrowRight,
  TrendingUp, FileText, Clock, Rocket,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import GradientButton from "@/components/GradientButton";
import { Button } from "@/components/ui/button";

const ToolsHubPage = () => {
  const navigate = useNavigate();
  const { rawData, columns, fileName } = useData();
  const hasData = rawData.length > 0;

  const tools = [
    {
      icon: Brush,
      title: "Data Cleaning Tool",
      desc: "Auto-remove duplicates, fix missing values, normalize columns.",
      cta: "Open Cleaning",
      path: "/dashboard/clean",
      tag: "Smart Cleanup",
    },
    {
      icon: BarChart3,
      title: "Visualization Tool",
      desc: "Auto-generate bar, line, and pie charts from your dataset.",
      cta: "Open Charts",
      path: "/dashboard/charts",
      tag: "Auto Charts",
    },
    {
      icon: Lightbulb,
      title: "AI Insights Tool",
      desc: "Get instant smart observations on trends and quality.",
      cta: "Open Insights",
      path: "/dashboard/insights",
      tag: "AI Powered",
      highlight: true,
    },
    {
      icon: TrendingUp,
      title: "Forecasting Tool",
      desc: "Predict future values based on historical numeric trends.",
      cta: "Open Forecasting",
      path: "/dashboard/forecasting",
      tag: "Beta",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3" /> Workspace
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Choose your <span className="gradient-text">tool</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick a focused workflow, or run the full guided pipeline end-to-end.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/import")}>
            <Upload className="w-4 h-4" /> Import data
          </Button>
          <GradientButton onClick={() => navigate("/workflow")}>
            <Rocket className="w-4 h-4" /> Run pipeline
          </GradientButton>
        </div>
      </div>

      {/* Recent dataset strip */}
      <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          {hasData ? (
            <>
              <p className="text-sm font-semibold text-foreground truncate">
                {fileName || "Untitled dataset"}
              </p>
              <p className="text-xs text-muted-foreground">
                {rawData.length.toLocaleString()} rows · {columns.length} cols
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">No dataset loaded</p>
              <p className="text-xs text-muted-foreground">Import a CSV or Excel file to unlock all tools.</p>
            </>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" /> {hasData ? "Active" : "Empty"}
        </div>
        <Button
          size="sm"
          variant={hasData ? "outline" : "default"}
          onClick={() => navigate(hasData ? "/dashboard/preview" : "/dashboard/import")}
        >
          {hasData ? "Preview" : "Import"} <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Tool cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {tools.map((t) => (
          <button
            key={t.title}
            onClick={() => navigate(t.path)}
            className={`group text-left p-6 rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              t.highlight
                ? "border-primary/40 glow-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <t.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {t.tag}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{t.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
            <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              {t.cta} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolsHubPage;
