import { DataRow } from "@/contexts/DataContext";

export function cleanData(data: DataRow[], columns: string[]) {
  const rowsBefore = data.length;
  let missingHandled = 0;

  // Remove duplicate rows
  const seen = new Set<string>();
  let cleaned = data.filter((row) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const duplicatesRemoved = rowsBefore - cleaned.length;

  // Handle missing values & trim text
  cleaned = cleaned.map((row) => {
    const newRow: DataRow = {};
    for (const col of columns) {
      let val = row[col];
      if (val === null || val === undefined || val === "") {
        const nums = data
          .map((d) => d[col])
          .filter((v) => v !== null && v !== undefined && v !== "")
          .map((v) => Number(v))
          .filter((n) => !isNaN(n));
        if (nums.length > 0) {
          val = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
        } else {
          val = "N/A";
        }
        missingHandled++;
      } else if (typeof val === "string") {
        val = val.trim();
      }
      newRow[col] = val;
    }
    return newRow;
  });

  return {
    cleaned,
    stats: { rowsBefore, rowsAfter: cleaned.length, duplicatesRemoved, missingHandled },
  };
}
