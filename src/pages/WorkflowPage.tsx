import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Upload, Eye, Brush, BarChart3, Lightbulb,
  ArrowRight, ArrowLeft, Check, SkipForward, Wand2, Loader2, Rocket, CheckCircle2,
} from "lucide-react";
import GradientButton from "@/components/GradientButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";
import FileUploader from "@/components/FileUploader";

const steps = [
  { key: "upload", label: "Upload Data", icon: Upload, desc: "Bring in a CSV or Excel file." },
  { key: "preview", label: "Data Preview", icon: Eye, desc: "Inspect rows, columns, and types." },
  { key: "clean", label: "Cleaning", icon: Brush, desc: "Remove duplicates and fix gaps." },
  { key: "visualize", label: "Visualization", icon: BarChart3, desc: "Auto-generate charts." },
  { key: "insights", label: "AI Insights", icon: Lightbulb, desc: "Get smart observations." },
];

const WorkflowPage = () => {
  const navigate = useNavigate();
  const { rawData, columns, fileName } = useData();
  const [stepIdx, setStepIdx] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoDone, setAutoDone] = useState(false);

  const progressPct = ((stepIdx + 1) / steps.length) * 100;
  const step = steps[stepIdx];
  const hasData = rawData.length > 0;

  const next = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setStepIdx((i) => Math.max(i - 1, 0));
  const skip = () => next();

  const runAuto = async () => {
    setAutoRunning(true);
    setAutoDone(false);
    for (let i = 0; i < steps.length; i++) {
      setStepIdx(i);
      // mock processing per step
      await new Promise((r) => setTimeout(r, 700));
    }
    setAutoRunning(false);
    setAutoDone(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 glass sticky top-0 z-50">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">DataVerse AI</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card">
            <Wand2 className={cn("w-4 h-4", autoMode ? "text-primary" : "text-muted-foreground")} />
            <span className="text-xs font-semibold text-foreground">Auto mode</span>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-3">
            <Rocket className="w-3 h-3" /> Full AI Pipeline
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Your guided <span className="gradient-text">data workflow</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Move through five guided steps — or flip on Auto mode and let AI handle everything.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Step {stepIdx + 1} of {steps.length}</span>
          <span>{Math.round(progressPct)}% complete</span>
        </div>
        <Progress value={progressPct} className="h-2 mb-6" />

        {/* Stepper */}
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5 mb-6">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {steps.map((s, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setStepIdx(i)}
                  className="flex items-center gap-2 shrink-0"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      done && "gradient-primary text-primary-foreground glow-primary",
                      active && "border-2 border-primary text-primary bg-primary/10",
                      !done && !active && "border border-border text-muted-foreground bg-muted/30",
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold hidden md:inline",
                    active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground",
                  )}>{s.label}</span>
                  {i < steps.length - 1 && (
                    <div className="w-6 md:w-10 h-px bg-border mx-1 hidden sm:block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Auto mode banner */}
        {autoMode && (
          <div className="mb-6 p-5 rounded-2xl gradient-primary text-primary-foreground glow-primary flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Wand2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold opacity-90">Auto mode</span>
              </div>
              <p className="text-sm md:text-base font-medium">
                AI will run every step end-to-end and surface the final insights for you.
              </p>
            </div>
            <Button
              onClick={runAuto}
              disabled={autoRunning}
              className="bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground border-0"
            >
              {autoRunning ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</>
                : autoDone ? <><CheckCircle2 className="w-4 h-4" /> Run again</>
                : <><Rocket className="w-4 h-4" /> Run pipeline</>}
            </Button>
          </div>
        )}

        {/* Step body */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 min-h-[280px] animate-fade-in">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center glow-primary shrink-0">
              <step.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{step.label}</h2>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </div>

          <StepContent
            stepKey={step.key}
            hasData={hasData}
            rowCount={rawData.length}
            colCount={columns.length}
            fileName={fileName}
            autoRunning={autoRunning}
          />
        </div>

        {/* Footer controls */}
        <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
          <Button variant="ghost" onClick={prev} disabled={stepIdx === 0}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={skip} disabled={stepIdx === steps.length - 1}>
              <SkipForward className="w-4 h-4" /> Skip step
            </Button>
            {stepIdx === steps.length - 1 ? (
              <GradientButton onClick={() => navigate("/dashboard/insights")}>
                Finish <Check className="w-4 h-4" />
              </GradientButton>
            ) : (
              <GradientButton onClick={next}>
                Next step <ArrowRight className="w-4 h-4" />
              </GradientButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StepContent = ({
  stepKey, hasData, rowCount, colCount, fileName, autoRunning,
}: { stepKey: string; hasData: boolean; rowCount: number; colCount: number; fileName: string; autoRunning: boolean }) => {
  if (autoRunning) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-semibold text-foreground">AI is processing this step…</p>
        <p className="text-xs text-muted-foreground mt-1">This usually takes a few seconds.</p>
      </div>
    );
  }

  switch (stepKey) {
    case "upload":
      return (
        <div className="space-y-4">
          <FileUploader />
          <p className="text-xs text-muted-foreground text-center">
            Already imported? You can skip this step.
          </p>
        </div>
      );
    case "preview":
      return hasData ? (
        <MockGrid title={`${fileName || "Dataset"} preview`} stats={[
          { k: "Rows", v: rowCount.toLocaleString() },
          { k: "Columns", v: String(colCount) },
          { k: "Types detected", v: "Yes" },
        ]} />
      ) : <Empty msg="Import a file in step 1 to preview your data." />;
    case "clean":
      return hasData ? (
        <MockGrid title="Cleaning summary" stats={[
          { k: "Duplicates removed", v: "12" },
          { k: "Missing filled", v: "34" },
          { k: "Whitespace fixed", v: "58" },
        ]} />
      ) : <Empty msg="No data to clean yet — go back to step 1." />;
    case "visualize":
      return hasData ? (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Suggested chart</p>
          <div className="flex items-end gap-2 h-32">
            {[35, 50, 44, 60, 70, 65, 78, 85, 80, 92, 88, 96].map((v, i) => (
              <div key={i} className="flex-1 rounded-t-md gradient-primary opacity-90" style={{ height: `${v}%` }} />
            ))}
          </div>
        </div>
      ) : <Empty msg="Import data first to generate charts." />;
    case "insights":
      return (
        <div className="space-y-3">
          {[
            "Strong upward trend across the latest period",
            "Quality score holds steady at 96/100",
            "12 outliers worth reviewing in column 'amount'",
          ].map((t) => (
            <div key={t} className="flex items-start gap-2 p-3 rounded-xl bg-muted/40 border border-border">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{t}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const MockGrid = ({ title, stats }: { title: string; stats: { k: string; v: string }[] }) => (
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">{title}</p>
    <div className="grid sm:grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.k} className="p-4 rounded-xl bg-muted/40 border border-border">
          <p className="text-xs text-muted-foreground">{s.k}</p>
          <p className="text-xl font-bold text-foreground mt-1">{s.v}</p>
        </div>
      ))}
    </div>
  </div>
);

const Empty = ({ msg }: { msg: string }) => (
  <div className="text-center py-8">
    <p className="text-sm text-muted-foreground">{msg}</p>
  </div>
);

export default WorkflowPage;
