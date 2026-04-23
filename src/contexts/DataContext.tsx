import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DataRow {
  [key: string]: string | number | null;
}

interface DataState {
  rawData: DataRow[];
  cleanedData: DataRow[];
  columns: string[];
  fileName: string;
  fileSize: number;
  cleaningStats: {
    rowsBefore: number;
    rowsAfter: number;
    duplicatesRemoved: number;
    missingHandled: number;
  } | null;
  setRawData: (data: DataRow[], columns: string[], fileName: string, fileSize: number) => void;
  setCleanedData: (data: DataRow[], stats: DataState["cleaningStats"]) => void;
  reset: () => void;
}

const DataContext = createContext<DataState | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rawData, setRaw] = useState<DataRow[]>([]);
  const [cleanedData, setCleaned] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [cleaningStats, setCleaningStats] = useState<DataState["cleaningStats"]>(null);

  const setRawData = (data: DataRow[], cols: string[], name: string, size: number) => {
    setRaw(data);
    setColumns(cols);
    setFileName(name);
    setFileSize(size);
    setCleaned([]);
    setCleaningStats(null);
  };

  const setCleanedData = (data: DataRow[], stats: DataState["cleaningStats"]) => {
    setCleaned(data);
    setCleaningStats(stats);
  };

  const reset = () => {
    setRaw([]);
    setCleaned([]);
    setColumns([]);
    setFileName("");
    setFileSize(0);
    setCleaningStats(null);
  };

  return (
    <DataContext.Provider value={{ rawData, cleanedData, columns, fileName, fileSize, cleaningStats, setRawData, setCleanedData, reset }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
