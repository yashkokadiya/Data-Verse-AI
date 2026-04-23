import { useState } from "react";
import { ChevronDown, Database, Sparkles } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";

interface Props {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  /** Hide the entire upload/use-existing block (e.g. for export) */
  hideUploader?: boolean;
}

/**
 * Standardised header for each modular tool page.
 * - Big icon + title + description
 * - If a dataset is already loaded, shows a compact "use loaded dataset" banner
 *   with an option to swap files via a collapsible uploader.
 * - If no dataset is loaded, shows the FileUploader inline so the tool is fully usable on its own.
 */
const ToolHeader = ({ icon: Icon, title, description, hideUploader }: Props) => {
  const { rawData, columns, fileName } = useData();
  const hasData = rawData.length > 0;
  const [showSwap, setShowSwap] = useState(false);

  return (
    <div className="space-y-5 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center glow-primary shrink-0">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3" /> Modular Tool
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>

      {!hideUploader && (
        hasData ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  Using loaded dataset · {fileName || "Untitled"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rawData.length.toLocaleString()} rows · {columns.length} columns
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSwap((v) => !v)}
                className="text-xs"
              >
                {showSwap ? "Hide" : "Swap file"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSwap ? "rotate-180" : ""}`} />
              </Button>
            </div>
            {showSwap && (
              <div className="border-t border-border p-4 animate-fade-in">
                <FileUploader />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
              Upload data to use this tool
            </p>
            <FileUploader />
          </div>
        )
      )}
    </div>
  );
};

export default ToolHeader;
