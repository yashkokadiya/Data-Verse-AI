import { DataRow } from "@/contexts/DataContext";

export interface Insight {
  text: string;
  color: "primary" | "secondary" | "accent";
}

export function generateInsights(data: DataRow[], columns: string[]): Insight[] {
  if (data.length === 0) return [];
  const insights: Insight[] = [];

  for (const col of columns) {
    const values = data.map((r) => r[col]).filter((v) => v !== null && v !== undefined && v !== "N/A");
    const nums = values.map(Number).filter((n) => !isNaN(n));

    if (nums.length > 0) {
      const max = Math.max(...nums);
      const min = Math.min(...nums);
      const avg = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
      insights.push({ text: `Column "${col}" ranges from ${min} to ${max} with an average of ${avg}.`, color: "primary" });
    } else if (values.length > 0) {
      const freq: Record<string, number> = {};
      values.forEach((v) => { freq[String(v)] = (freq[String(v)] || 0) + 1; });
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      if (top) insights.push({ text: `Most frequent value in "${col}" is "${top[0]}" (${top[1]} occurrences).`, color: "secondary" });
    }

    const missing = data.filter((r) => r[col] === null || r[col] === undefined || r[col] === "" || r[col] === "N/A").length;
    if (missing > 0) {
      insights.push({ text: `Column "${col}" has ${missing} missing/empty values.`, color: "accent" });
    }
  }

  return insights.slice(0, 12);
}
