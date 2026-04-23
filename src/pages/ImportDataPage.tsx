import { useState } from "react";
import { Upload, Database, ArrowLeft } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import ConnectDatabasePage from "./ConnectDatabasePage";
import { Button } from "@/components/ui/button";
import StepNav from "@/components/StepNav";
import { useData } from "@/contexts/DataContext";

type Mode = "choose" | "upload" | "database";

const ImportDataPage = () => {
  const [mode, setMode] = useState<Mode>("choose");
  const { rawData } = useData();
  const hasData = rawData.length > 0;

  let body: JSX.Element;
  if (mode === "upload") {
    body = (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => setMode("choose")} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
            <Upload className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Upload File</h1>
          <p className="text-muted-foreground">Upload a CSV or Excel file to get started</p>
        </div>
        <FileUploader />
      </div>
    );
  } else if (mode === "database") {
    body = (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => setMode("choose")} className="text-muted-foreground max-w-2xl mx-auto block">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <ConnectDatabasePage />
      </div>
    );
  } else {
    body = (
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Import Your Data</h1>
          <p className="text-muted-foreground">Choose how you'd like to bring data into DataVerse AI</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <ChoiceCard
            icon={Upload}
            title="Upload File"
            desc="Import a CSV or Excel file directly from your computer with automatic parsing."
            cta="Upload CSV / Excel"
            onClick={() => setMode("upload")}
          />
          <ChoiceCard
            icon={Database}
            title="Connect Database"
            desc="Connect to PostgreSQL, MySQL, MongoDB or SQL Server and import live data."
            cta="Connect Database"
            onClick={() => setMode("database")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepNav current="import" nextDisabled={!hasData} />
      {body}
    </div>
  );
};

const ChoiceCard = ({
  icon: Icon, title, desc, cta, onClick,
}: { icon: any; title: string; desc: string; cta: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group text-left p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 glow-primary group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-primary-foreground" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{desc}</p>
    <span className="text-sm font-semibold text-primary group-hover:underline">
      {cta} →
    </span>
  </button>
);

export default ImportDataPage;
