import { useNavigate } from "react-router-dom";
import { Sparkles, Brush, BarChart3, Lightbulb, Database, ArrowRight, Trash2, FileWarning, Type, TrendingUp, PieChart, Zap, FileText, Upload } from "lucide-react";
import GradientButton from "@/components/GradientButton";

const sections = [
  {
    title: "Data Cleaning",
    icon: Brush,
    color: "primary",
    items: [
      { icon: Trash2, label: "Remove Duplicates", desc: "Automatically detect and remove duplicate rows from your dataset." },
      { icon: FileWarning, label: "Handle Missing Values", desc: "Fill empty cells with mean, median, mode, or custom 'N/A' values." },
      { icon: Type, label: "Fix Data Types", desc: "Trim whitespace, normalize text, and ensure consistent column formats." },
    ],
  },
  {
    title: "Visualization",
    icon: BarChart3,
    color: "secondary",
    items: [
      { icon: BarChart3, label: "Auto Charts", desc: "Bar, line, and pie charts generated automatically from your data columns." },
      { icon: PieChart, label: "Smart Suggestions", desc: "System detects numeric and categorical columns to pick the best chart type." },
      { icon: TrendingUp, label: "Interactive Filters", desc: "Select columns, adjust filters, and explore your data visually." },
    ],
  },
  {
    title: "AI Insights",
    icon: Lightbulb,
    color: "primary",
    items: [
      { icon: Zap, label: "Summary", desc: "Get an automatic overview of your dataset's key statistics and structure." },
      { icon: TrendingUp, label: "Trends & Patterns", desc: "Detect highest/lowest values, distributions, and frequent categories." },
      { icon: Lightbulb, label: "Suggestions", desc: "Receive actionable recommendations about data quality and outliers." },
    ],
  },
  {
    title: "Multi-Source Data",
    icon: Database,
    color: "secondary",
    items: [
      { icon: Upload, label: "CSV Upload", desc: "Drag & drop CSV files with automatic header detection and parsing." },
      { icon: FileText, label: "Excel Support", desc: "Upload .xlsx and .xls files with multi-sheet support." },
      { icon: Database, label: "Database Ready", desc: "Architecture supports future database connections for enterprise use." },
    ],
  },
];

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 glass sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">DataVerse AI</span>
        </div>
        <GradientButton onClick={() => navigate("/dashboard")}>Get Started</GradientButton>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Everything You Need to <span className="gradient-text">Understand Your Data</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A complete data intelligence toolkit — from cleaning to insights, all in one place.
          </p>
        </div>

        <div className="space-y-20">
          {sections.map((section, si) => (
            <div key={section.title} className="animate-slide-up" style={{ animationDelay: `${si * 100}ms`, animationFillMode: "backwards" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.color === "primary" ? "gradient-primary" : "bg-secondary/20"}`}>
                  <section.icon className={`w-5 h-5 ${section.color === "primary" ? "text-primary-foreground" : "text-secondary"}`} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {section.items.map((item) => (
                  <div key={item.label} className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                    <item.icon className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <GradientButton size="lg" onClick={() => navigate("/dashboard")}>
            Start Using DataVerse AI <ArrowRight className="w-4 h-4" />
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
