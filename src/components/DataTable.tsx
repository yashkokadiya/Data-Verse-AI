import { useState } from "react";
import { DataRow } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  data: DataRow[];
  columns: string[];
  pageSize?: number;
}

const DataTable = ({ data, columns, pageSize = 10 }: Props) => {
  const [page, setPage] = useState(0);
  if (data.length === 0) return <p className="text-muted-foreground text-center py-8">No data to display</p>;

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * pageSize;
  const rows = data.slice(start, start + pageSize);

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/50">
              {columns.map((col) => (
                <TableHead key={col} className="font-semibold whitespace-nowrap text-foreground">{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={start + i} className="border-b border-border/30 transition-colors hover:bg-muted/20">
                {columns.map((col) => {
                  const val = row[col];
                  const isEmpty = val === null || val === undefined || val === "";
                  // Always render via React text node — never raw HTML.
                  return (
                    <TableCell key={col} className={`whitespace-nowrap ${isEmpty ? "text-destructive/60 italic" : "text-foreground"}`}>
                      {isEmpty ? "—" : String(val)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Showing {start + 1}–{Math.min(start + pageSize, data.length)} of {data.length.toLocaleString()} rows
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums px-1">
            {safePage + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
