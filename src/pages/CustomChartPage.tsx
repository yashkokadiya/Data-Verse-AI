import { useData } from "@/contexts/DataContext";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, PieChart as PieIcon } from "lucide-react";
import GradientButton from "@/components/GradientButton";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["hsl(239,84%,67%)", "hsl(187,92%,43%)", "hsl(270,70%,65%)", "hsl(340,65%,60%)", "hsl(160,60%,50%)"];
const CHART_TYPES = ["Bar", "Line", "Pie"] as const;

const CustomChartPage = () => {
  const { rawData, cleanedData, columns } = useData();
  const navigate = useNavigate();
  const data = cleanedData.length > 0 ? cleanedData : rawData;

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

  const [chartType, setChartType] = useState<typeof CHART_TYPES[number]>("Bar");
  const [xAxis, setXAxis] = useState(categoricalCols[0] || columns[0] || "");
  const [yAxis, setYAxis] = useState(numericCols[0] || columns[1] || "");

  const chartData = useMemo(() => {
    if (!xAxis || !yAxis) return [];
    const groups: Record<string, number> = {};
    data.slice(0, 50).forEach((r) => {
      const key = String(r[xAxis] ?? "Other");
      groups[key] = (groups[key] || 0) + Number(r[yAxis] || 0);
    });
    return Object.entries(groups).slice(0, 12).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
  }, [data, xAxis, yAxis]);

  const tooltipStyle = { backgroundColor: "hsl(222,47%,13%)", border: "1px solid hsl(217,33%,20%)", borderRadius: "8px", color: "#F9FAFB" };

  if (data.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground mb-4">Upload data to create custom charts</p>
        <GradientButton onClick={() => navigate("/dashboard")}>
          <Upload className="w-4 h-4" /> Upload Data
        </GradientButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
          <PieIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Custom Chart Builder</h1>
        <p className="text-muted-foreground">Select chart type, axes, and see live results</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Chart Type</label>
          <select
            className="w-full bg-card border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary/50 outline-none"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
          >
            {CHART_TYPES.map(t => <option key={t} value={t}>{t} Chart</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">X-Axis</label>
          <select
            className="w-full bg-card border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary/50 outline-none"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
          >
            {columns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Y-Axis</label>
          <select
            className="w-full bg-card border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-primary/50 outline-none"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
          >
            {columns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Live Chart Preview */}
      <div className="p-6 rounded-xl bg-card border border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4">{xAxis} vs {yAxis} — {chartType} Chart</h3>
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "Bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,20%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="hsl(239,84%,67%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : chartType === "Line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,20%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="hsl(187,92%,43%)" strokeWidth={2} dot={{ fill: "hsl(187,92%,43%)" }} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={{ fontSize: 11, fill: "#9CA3AF" }}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomChartPage;
