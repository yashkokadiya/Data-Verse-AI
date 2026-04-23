import { useMemo, useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { TrendingUp, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GradientButton from "@/components/GradientButton";
import { useNavigate } from "react-router-dom";

const ForecastingPage = () => {
  const { rawData, cleanedData, columns } = useData();
  const navigate = useNavigate();
  const data = cleanedData.length ? cleanedData : rawData;

  const numericCols = useMemo(
    () => columns.filter((c) => data.some((r) => typeof r[c] === "number" || !isNaN(Number(r[c])))),
    [columns, data]
  );

  const [target, setTarget] = useState<string>("");
  const [periods, setPeriods] = useState(6);

  useEffect(() => {
    if (!target && numericCols.length) setTarget(numericCols[0]);
  }, [numericCols, target]);

  const forecast = useMemo(() => {
    if (!target || !data.length) return [];
    const series = data.map((r, i) => ({ x: i, y: Number(r[target]) })).filter((p) => !isNaN(p.y));
    if (series.length < 2) return [];
    const n = series.length;
    const sumX = series.reduce((a, p) => a + p.x, 0);
    const sumY = series.reduce((a, p) => a + p.y, 0);
    const sumXY = series.reduce((a, p) => a + p.x * p.y, 0);
    const sumX2 = series.reduce((a, p) => a + p.x * p.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;

    const historical = series.map((p) => ({
      label: `t${p.x + 1}`,
      actual: Number(p.y.toFixed(2)),
      forecast: null as number | null,
    }));
    const future = Array.from({ length: periods }, (_, i) => {
      const x = n + i;
      return {
        label: `t${x + 1}`,
        actual: null as number | null,
        forecast: Number((intercept + slope * x).toFixed(2)),
      };
    });
    // bridge connection
    if (historical.length) {
      historical[historical.length - 1].forecast = historical[historical.length - 1].actual;
    }
    return [...historical, ...future];
  }, [data, target, periods]);

  const trend = useMemo(() => {
    if (forecast.length < 2) return null;
    const futurePts = forecast.filter((p) => p.actual === null);
    if (!futurePts.length) return null;
    const first = futurePts[0].forecast!;
    const last = futurePts[futurePts.length - 1].forecast!;
    const pct = first ? ((last - first) / Math.abs(first)) * 100 : 0;
    return { direction: pct >= 0 ? "up" : "down", pct: Math.abs(pct).toFixed(1), last };
  }, [forecast]);

  if (!data.length) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">No data loaded</h2>
        <p className="text-muted-foreground mb-6">Import a dataset to generate forecasts.</p>
        <GradientButton onClick={() => navigate("/dashboard/import")}>Import Data</GradientButton>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
          <TrendingUp className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Forecasting</h1>
        <p className="text-muted-foreground">Predict future values from your historical numeric data</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 p-5 rounded-xl bg-card border border-border">
        <div className="space-y-2">
          <Label>Target Column</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger><SelectValue placeholder="Select numeric column" /></SelectTrigger>
            <SelectContent>
              {numericCols.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Forecast Periods</Label>
          <Input
            type="number"
            min={1}
            max={50}
            value={periods}
            onChange={(e) => setPeriods(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
          />
        </div>
      </div>

      {forecast.length > 0 ? (
        <>
          <div className="rounded-xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {target} — Linear trend forecast
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <ReferenceLine
                    x={forecast.find((p) => p.actual !== null && p.forecast !== null)?.label}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="4 4"
                    label={{ value: "Now", position: "top", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Historical" />
                  <Line type="monotone" dataKey="forecast" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3 }} name="Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {trend && (
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat label="Predicted Trend" value={trend.direction === "up" ? "Upward ↑" : "Downward ↓"} />
              <Stat label="Expected Change" value={`${trend.direction === "up" ? "+" : "-"}${trend.pct}%`} />
              <Stat label="End-of-period Estimate" value={trend.last.toFixed(2)} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 rounded-xl bg-card border border-border">
          <p className="text-muted-foreground text-sm">Select a numeric column with at least 2 data points to forecast.</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Forecast uses simple linear regression — for demonstration purposes only.
      </p>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 rounded-xl bg-card border border-border">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-lg font-bold text-foreground">{value}</p>
  </div>
);

export default ForecastingPage;
