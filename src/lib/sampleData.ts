import type { DataRow } from "@/contexts/DataContext";

/** Generates a small realistic sales sample dataset for guest / sample-data flows. */
export function getSampleDataset(): { data: DataRow[]; columns: string[]; fileName: string } {
  const regions = ["North", "South", "East", "West"];
  const products = ["Alpha", "Beta", "Gamma", "Delta"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data: DataRow[] = [];
  let id = 1;
  for (const m of months) {
    for (const r of regions) {
      for (const p of products) {
        data.push({
          id: id++,
          month: m,
          region: r,
          product: p,
          units: Math.round(40 + Math.random() * 260),
          revenue: Math.round((1000 + Math.random() * 9000) * 100) / 100,
          customers: Math.round(10 + Math.random() * 90),
        });
      }
    }
  }
  return {
    data,
    columns: ["id", "month", "region", "product", "units", "revenue", "customers"],
    fileName: "sample_sales_2024.csv",
  };
}
