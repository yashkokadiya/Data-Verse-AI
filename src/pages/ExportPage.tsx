import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { Download, FileText, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import GradientButton from "@/components/GradientButton";
import StepNav from "@/components/StepNav";

const ExportPage = () => {
  const { rawData, cleanedData, columns } = useData();
  const navigate = useNavigate();
  const data = cleanedData.length > 0 ? cleanedData : rawData;

  const downloadCSV = () => {
    const header = columns.join(",");
    const rows = data.map((r) => columns.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(","));
    const csv = [header, ...rows].join("\n");
    triggerDownload(csv, "cleaned_data.csv", "text/csv");
    toast({ title: "CSV Downloaded" });
  };

  const downloadJSON = () => {
    const json = JSON.stringify(data, null, 2);
    triggerDownload(json, "cleaned_data.json", "application/json");
    toast({ title: "JSON Downloaded" });
  };

  const triggerDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        <StepNav current="export" />
        <div className="text-center py-20 animate-fade-in">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-4">Import and process data to export</p>
          <GradientButton onClick={() => navigate("/dashboard/import")}>
            <Upload className="w-4 h-4" /> Import Data
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <StepNav current="export" />
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
            <Download className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Export Data</h1>
          <p className="text-muted-foreground">Download your processed data</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-primary/20 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <p className="text-sm text-foreground">{data.length} rows × {columns.length} columns ready for export</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={downloadCSV}
            className="p-6 rounded-xl bg-card border border-border/50 text-left transition-all duration-300 hover:border-primary/30 hover:glow-primary group"
          >
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-foreground mb-1">Download CSV</h3>
            <p className="text-sm text-muted-foreground">{data.length} rows • {columns.length} columns</p>
          </button>
          <button
            onClick={downloadJSON}
            className="p-6 rounded-xl bg-card border border-border/50 text-left transition-all duration-300 hover:border-secondary/30 hover:glow-primary group"
          >
            <div className="w-11 h-11 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-bold text-foreground mb-1">Download JSON</h3>
            <p className="text-sm text-muted-foreground">{data.length} rows • Structured format</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
