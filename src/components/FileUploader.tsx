import { useCallback, useState } from "react";
import { Upload, File, X, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useData, DataRow } from "@/contexts/DataContext";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_EXT = ["csv", "xlsx", "xls"] as const;

// Strip control chars and trim — protects against weird header injection / XSS via column names.
const sanitizeKey = (k: string) =>
  String(k ?? "").replace(/[\u0000-\u001F\u007F<>]/g, "").trim().slice(0, 120);

const sanitizeRow = (row: Record<string, unknown>): DataRow => {
  const out: DataRow = {};
  for (const [k, v] of Object.entries(row)) {
    const key = sanitizeKey(k);
    if (!key) continue;
    if (v === null || v === undefined) {
      out[key] = null;
    } else if (typeof v === "number") {
      out[key] = Number.isFinite(v) ? v : null;
    } else {
      // Strings: cap length, strip control chars (no HTML rendered raw anywhere)
      const s = String(v).replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 5000);
      out[key] = s;
    }
  }
  return out;
};

const FileUploader = () => {
  const { setRawData, fileName, fileSize } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);

  const validate = (file: File): string | null => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext as any)) {
      return "Please upload a CSV or Excel file (.csv, .xlsx, .xls).";
    }
    if (file.size === 0) return "The file appears to be empty.";
    if (file.size > MAX_FILE_BYTES) {
      return `File is too large. Max size is ${MAX_FILE_BYTES / 1024 / 1024}MB.`;
    }
    return null;
  };

  const parseFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) {
      toast({ title: "Upload rejected", description: err, variant: "destructive" });
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    setLocalFile(file);

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            toast({ title: "No data", description: "File has no rows.", variant: "destructive" });
            return;
          }
          const rawCols = results.meta.fields || Object.keys(results.data[0] as object);
          const cols = rawCols.map(sanitizeKey).filter(Boolean);
          const rows = (results.data as Record<string, unknown>[]).map(sanitizeRow);
          setRawData(rows, cols, sanitizeKey(file.name) || "dataset.csv", file.size);
          toast({ title: "File loaded!", description: `${rows.length} rows detected.` });
        },
        error: () =>
          toast({ title: "Parse error", description: "Could not read CSV file.", variant: "destructive" }),
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target?.result, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
          if (data.length === 0) {
            toast({ title: "No data", description: "Sheet is empty.", variant: "destructive" });
            return;
          }
          const cols = Object.keys(data[0]).map(sanitizeKey).filter(Boolean);
          const rows = data.map(sanitizeRow);
          setRawData(rows, cols, sanitizeKey(file.name) || "dataset.xlsx", file.size);
          toast({ title: "File loaded!", description: `${rows.length} rows detected.` });
        } catch {
          toast({ title: "Parse error", description: "Could not read Excel file.", variant: "destructive" });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [setRawData]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  }, [parseFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/60 hover:border-primary/40 hover:bg-card/50"
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground mb-1">Drag & drop your file here</p>
        <p className="text-sm text-muted-foreground mb-1">Supports .csv, .xlsx, .xls</p>
        <p className="text-xs text-muted-foreground/80 mb-4">Max 20MB</p>
        <label className="cursor-pointer">
          <span className="inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 h-11 px-6 text-sm hover:scale-[1.03]">
            Browse File
          </span>
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileInput} />
        </label>
      </div>

      {localFile && fileName && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-primary/20 animate-scale-in">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <File className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{fileName}</p>
            <p className="text-sm text-muted-foreground">{formatSize(fileSize)}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <button onClick={() => setLocalFile(null)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Clear selection">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
