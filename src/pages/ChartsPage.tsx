import { useData } from "@/contexts/DataContext";
import ChartCard from "@/components/ChartCard";
import ToolHeader from "@/components/ToolHeader";
import StepNav from "@/components/StepNav";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(222 50% 50%)",
  "hsl(222 40% 65%)",
  "hsl(220 9% 46%)",
  "hsl(222 70% 40%)",
];

const ChartsPage = () => {
  const { rawData, cleanedData, columns } = useData();
  const navigate = useNavigate();
  const data = cleanedData.length > 0 ? cleanedData : rawData;
  const hasData = data.length > 0;

  const { numericCols, categoricalCols } = useMemo(() => {
    const numericCols: string[] = [];
    const categoricalCols: string[] = [];
    for (const col of columns) {
      const nums = data.filter((r) => !isNaN(Number(r[col])) && r[col] !== null && r[col] !== "" && r[col] !== "N/A");
      if (nums.length > data.length * 0.5) numericCols.push(col);
      else categoricalCols.push(col);
    }
    return { numericCols, categoricalCols };
  }, [data, columns]);

  const [selectedNumeric, setSelectedNumeric] = useState<string>("");
  const [selectedCategorical, setSelectedCategorical] = useState<string>("");
  const numCol = selectedNumeric || numericCols[0] || "";
  const catCol = selectedCategorical || categoricalCols[0] || "";

  const barData = useMemo(() => {
    if (!catCol || !numCol) return null;
    const groups: Record<string, number> = {};
    data.slice(0, 50).forEach((r) => {
      const key = String(r[catCol] ?? "Other");
      groups[key] = (groups[key] || 0) + Number(r[numCol] || 0);
    });
    return Object.entries(groups).slice(0, 10).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
  }, [data, catCol, numCol]);

  const lineData = useMemo(() => {
    if (!numCol) return null;
    return data.slice(0, 30).map((r, i) => ({ index: i + 1, value: Number(r[numCol]) || 0 }));
  }, [data, numCol]);

  const pieData = useMemo(() => {
    if (!catCol) return null;
    const freq: Record<string, number> = {};
    data.forEach((r) => { const k = String(r[catCol] ?? "Other"); freq[k] = (freq[k] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
  }, [data, catCol]);

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    color: "hsl(var(--foreground))",
  } as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <StepNav current="charts" nextDisabled={!hasData} />
      <div className="max-w-5xl mx-auto">
        <ToolHeader
          icon={BarChart3}
          title="Data Visualization Tool"
          description="Auto-generated bar, line, and pie charts from your dataset — no setup required."
        />

        {!hasData ? (
          <EmptyHint msg="Import a CSV or Excel file in step 1 to generate charts." />
        ) : (
          <div className="space-y-6">
            {/* Column selectors */}
            <div className="flex flex-wrap gap-3 items-center justify-between p-4 rounded-2xl bg-card border border-border">
              <div className="flex flex-wrap gap-2">
                {numericCols.length > 0 && (
                  <select
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary outline-none"
                    value={numCol}
                    onChange={(e) => setSelectedNumeric(e.target.value)}
                  >
                    {numericCols.map(c => <option key={c} value={c}>{c} (numeric)</option>)}
                  </select>
                )}
                {categoricalCols.length > 0 && (
                  <select
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary outline-none"
                    value={catCol}
                    onChange={(e) => setSelectedCategorical(e.target.value)}
                  >
                    {categoricalCols.map(c => <option key={c} value={c}>{c} (categorical)</option>)}
                  </select>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/custom-chart")}>
                <Sparkles className="w-3.5 h-3.5" /> Build a custom chart
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {barData && (
                <ChartCard title={`${catCol} vs ${numCol}`}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
              {lineData && (
                <ChartCard title={`${numCol} Trend`}>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="index" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
              {pieData && (
                <ChartCard title={`${catCol} Distribution`}>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyHint = ({ msg }: { msg: string }) => (
  <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
    <p className="text-sm text-muted-foreground">{msg}</p>
  </div>
);

export default ChartsPage;
