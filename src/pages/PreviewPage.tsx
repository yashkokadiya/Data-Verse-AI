import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/DataTable";
import GradientButton from "@/components/GradientButton";
import StepNav from "@/components/StepNav";
import { Upload, Table, Columns, Rows3, AlertTriangle } from "lucide-react";

const PreviewPage = () => {
  const { rawData, columns } = useData();
  const navigate = useNavigate();

  if (rawData.length === 0) {
    return (
      <div className="space-y-6">
        <StepNav current="preview" nextDisabled />
        <div className="text-center py-20 animate-fade-in">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-4">Import data first to preview</p>
          <GradientButton onClick={() => navigate("/dashboard/import")}>
            <Upload className="w-4 h-4" /> Go to Import
          </GradientButton>
        </div>
      </div>
    );
  }

  const missingCount = rawData.reduce((acc, row) => {
    return acc + columns.filter(c => row[c] === null || row[c] === undefined || row[c] === "").length;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <StepNav current="preview" />
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
            <Table className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Data Preview</h1>
          <p className="text-muted-foreground">Review your imported dataset</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Rows3} label="Rows" value={rawData.length} color="primary" />
          <StatCard icon={Columns} label="Columns" value={columns.length} color="secondary" />
          <StatCard icon={AlertTriangle} label="Missing Values" value={missingCount} color="destructive" />
        </div>

        <DataTable data={rawData} columns={columns} />
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
  <div className="p-4 rounded-xl bg-card border border-border/50 flex items-center gap-3 animate-count-up hover:border-primary/30 transition-all duration-300">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
      color === "primary" ? "bg-primary/10 text-primary" :
      color === "secondary" ? "bg-secondary/10 text-secondary" :
      "bg-destructive/10 text-destructive"
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default PreviewPage;
