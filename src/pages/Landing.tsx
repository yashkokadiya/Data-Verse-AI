import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Sparkles, Brush, BarChart3, Lightbulb, Rocket,
  Upload, Wand2, LineChart, Brain, TrendingUp, Settings2, Database,
  CheckCircle2, ShieldCheck, Zap, Code2, Lock, FileSpreadsheet,
  LayoutDashboard, GraduationCap, Briefcase, Building2, FlaskConical,
  ArrowDown,
} from "lucide-react";
import GradientButton from "@/components/GradientButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import TypingLoop from "@/components/landing/TypingLoop";
import CountUp from "@/components/landing/CountUp";

const actionCards = [
  {
    icon: Brush, title: "Clean Data", emoji: "🧹",
    desc: "Remove duplicates, fix missing values, and normalize columns in one click.",
    impact: "Fix 90% of issues automatically",
    to: "/auth", cta: "Start Cleaning",
  },
  {
    icon: BarChart3, title: "Visualize Data", emoji: "📊",
    desc: "Auto-generate beautiful, interactive charts tailored to your dataset.",
    impact: "Generate charts in seconds",
    to: "/auth", cta: "Start Visualizing",
  },
  {
    icon: Lightbulb, title: "AI Insights", emoji: "🤖",
    desc: "Smart observations on trends, anomalies, and quality of your data.",
    impact: "Understand your data instantly",
    to: "/auth", cta: "Get Insights",
  },
  {
    icon: Rocket, title: "Full AI Pipeline", emoji: "🚀",
    desc: "Run the entire guided workflow — upload to insights — end-to-end.",
    impact: "Everything, fully automated",
    to: "/auth", cta: "Launch Pipeline", highlight: true,
  },
];

const keyFeatures = [
  { icon: Database, title: "Connect Database", desc: "Connect to PostgreSQL, MySQL, MongoDB or SQL Server in a few clicks." },
  { icon: Upload, title: "Upload CSV / Excel", desc: "Drag & drop spreadsheets — automatic parsing and column detection." },
  { icon: Wand2, title: "Data Cleaning", desc: "Remove duplicates, handle missing values and normalize columns." },
  { icon: LineChart, title: "Data Visualization", desc: "Auto-generated bar, line and pie charts crafted from your dataset." },
  { icon: Brain, title: "Data Insights", desc: "Smart statistical summaries, distributions and quality observations." },
  { icon: TrendingUp, title: "Forecasting", desc: "Predict trends and future values from historical numeric data." },
  { icon: Settings2, title: "Custom Visualization", desc: "Build your own charts with full control over chart type and axes." },
];

const howItWorks = [
  { n: "01", icon: Upload, title: "Upload or Connect Data", desc: "Drop a CSV or connect a database — we handle parsing and validation." },
  { n: "02", icon: Brain, title: "AI Cleans & Analyzes", desc: "The pipeline cleans, profiles, and analyzes your dataset automatically." },
  { n: "03", icon: LayoutDashboard, title: "Get Dashboard + Insights", desc: "Explore charts, insights, and forecasts to act on what matters." },
];

const trustPoints = [
  { icon: Code2, title: "No coding required", desc: "Visual workflows for everyone — zero scripts." },
  { icon: Database, title: "Works with any dataset", desc: "CSV, Excel, SQL — bring whatever you have." },
  { icon: Lock, title: "Secure & private", desc: "Your data stays yours. Encrypted in transit." },
  { icon: Zap, title: "Fast AI processing", desc: "Insights in seconds, not hours." },
];

const targetUsers = [
  { icon: GraduationCap, label: "Students", desc: "Ace projects with ready-made analysis." },
  { icon: Briefcase, label: "Analysts", desc: "Skip the setup — go straight to insights." },
  { icon: Building2, label: "Businesses", desc: "Decisions backed by data, not guesswork." },
  { icon: FlaskConical, label: "Researchers", desc: "Explore datasets visually and statistically." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="relative px-6 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Powered by AI Insights Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-foreground">
            Turn Raw Data into <br className="hidden md:block" />
            <span className="gradient-text">Actionable Insights</span> in Seconds
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
            Upload CSV, clean automatically, generate dashboards, and get AI-powered insights — no coding required.
          </p>

          <div className="mb-8 flex justify-center">
            <TypingLoop />
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-3">
            <GradientButton size="lg" onClick={() => navigate("/auth")}>
              Get Started Free <Rocket className="w-4 h-4" />
            </GradientButton>
            <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
              Sign In to Dashboard
            </Button>
          </div>
          <p className="text-xs text-muted-foreground italic mb-7">Your personal AI data analyst</p>

          {/* feature badges */}
          <div className="flex justify-center gap-2 flex-wrap">
            {[
              { icon: Zap, label: "Auto Data Cleaning", emoji: "⚡" },
              { icon: BarChart3, label: "Instant Dashboards", emoji: "📊" },
              { icon: Brain, label: "AI Insights", emoji: "🤖" },
            ].map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-foreground hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <span aria-hidden>{b.emoji}</span> {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Demo experience */}
      <section id="demo" className="px-6 md:px-12 pb-16">
        <div className="max-w-4xl mx-auto rounded-2xl border border-primary/20 bg-card p-6 md:p-8 text-center glow-hover">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" /> Get started in seconds
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Sign up free. No credit card required.</h2>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            Create your account and start analyzing your data with the full AI pipeline.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/auth")}>
              <FileSpreadsheet className="w-4 h-4" /> Upload Your CSV
            </Button>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              <LayoutDashboard className="w-4 h-4" /> View Dashboard
            </Button>
            <GradientButton onClick={() => navigate("/auth")}>
              <Sparkles className="w-4 h-4" /> Generate AI Insights
            </GradientButton>
          </div>
        </div>
      </section>

      {/* 4 Action cards */}
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actionCards.map((c, i) => (
              <div
                key={c.title}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl animate-slide-up ${
                  c.highlight
                    ? "gradient-primary border-transparent text-primary-foreground glow-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                    : "bg-card border-border hover:border-primary/40"
                }`}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
              >
                {c.highlight && (
                  <span className="absolute -top-2 right-4 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-card text-primary border border-primary/30 shadow-sm">
                    Most Used
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl transition-transform group-hover:scale-110 ${c.highlight ? "bg-primary-foreground/15" : "bg-primary/10"}`}>
                  <span aria-hidden>{c.emoji}</span>
                </div>
                <h3 className={`font-bold text-lg mb-1.5 ${c.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                  {c.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-3 ${c.highlight ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                  {c.desc}
                </p>
                <p className={`text-xs font-semibold mb-5 inline-flex items-center gap-1 ${c.highlight ? "text-primary-foreground/95" : "text-primary"}`}>
                  <Sparkles className="w-3 h-3" /> {c.impact}
                </p>
                <button
                  onClick={() => navigate(c.to)}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    c.highlight ? "text-primary-foreground hover:opacity-80" : "text-primary hover:opacity-80"
                  }`}
                >
                  {c.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated mock dashboard preview */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl border border-border bg-card p-6 md:p-8 shadow-xl glow-hover">
            <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-primary/30 text-xs text-primary font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Real-time AI Analysis
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-2">
              <div className="md:col-span-2 p-5 rounded-2xl gradient-primary text-primary-foreground glow-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-90">AI Summary</span>
                </div>
                <p className="text-base md:text-lg font-medium leading-relaxed">
                  Sales grew <span className="font-bold">+<CountUp end={18} />.4%</span> last quarter, driven by a surge in the
                  <span className="font-bold"> West region</span>. Data quality is high (<CountUp end={96} />%) with only <CountUp end={12} /> outliers detected.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Data Quality</p>
                <div className="flex items-baseline gap-1 mb-3">
                  <CountUp end={96} className="text-3xl font-extrabold text-foreground" />
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
                <Progress value={96} className="h-2" />
                <p className="text-xs text-muted-foreground mt-3">12 outliers · 4 missing fields</p>
              </div>

              <div className="md:col-span-2 p-5 rounded-2xl bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-4">Top Trend · Monthly Revenue</p>
                <div className="flex items-end gap-2 h-28">
                  {[40, 55, 48, 62, 70, 65, 78, 85, 80, 92, 88, 96].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md gradient-primary opacity-90 hover:opacity-100 transition-all"
                      style={{ height: `${v}%`, animation: `slide-up 600ms ease-out ${i * 50}ms backwards` }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Key Insights</p>
                <ul className="space-y-2 text-sm text-foreground">
                  {["Revenue trending upward", "West region outperforming", "12 outliers detected"].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GradientButton onClick={() => navigate("/auth")}>
                Analyze your data <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="px-6 md:px-12 py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Key Features</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Seven powerful capabilities to analyze every aspect of your data.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {keyFeatures.map((f, i) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up"
                style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
              >
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 glow-primary group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From raw file to confident decision in three steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {howItWorks.map((s, i) => (
              <div key={s.n} className="relative">
                <div
                  className="relative p-6 rounded-2xl bg-card border border-border animate-slide-up h-full hover:border-primary/40 hover:shadow-lg transition-all"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-5xl font-extrabold gradient-text leading-none select-none">{s.n}</div>
                    <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                      <s.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <>
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-6 text-primary/40 z-10" />
                    <ArrowDown className="md:hidden mx-auto my-2 w-5 h-5 text-primary/40" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose / trust */}
      <section className="px-6 md:px-12 py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Why DataVerse AI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Why Choose DataVerse AI?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Built for clarity, speed, and trust — from first upload to final insight.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustPoints.map((t, i) => (
              <div
                key={t.title}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <t.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">{t.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built For */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Built For</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Whoever you are, your data has a story. We help you tell it.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {targetUsers.map((u, i) => (
              <div
                key={u.label}
                className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all animate-slide-up"
                style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
                  <u.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="font-bold text-foreground mb-1">{u.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-12 py-20 bg-muted/40">
        <div className="max-w-2xl mx-auto text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stop Guessing. Start Understanding Your Data.
          </h2>
          <p className="text-muted-foreground mb-8">Create your free account and start analyzing in seconds.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <GradientButton size="lg" onClick={() => navigate("/auth")}>
              Create Free Account <Rocket className="w-4 h-4" />
            </GradientButton>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Landing;