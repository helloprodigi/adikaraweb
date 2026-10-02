"use client";

import { createContext, useContext, useState } from "react";
import { YEARS, getYearData, type YearData } from "./statsData";

type StatisticsContextValue = {
  year: number;
  setYear: (year: number) => void;
  data: YearData;
};

const StatisticsContext = createContext<StatisticsContextValue | null>(null);

export function StatisticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2026 is the default view; its figures are not published yet.
  const [year, setYear] = useState(YEARS[YEARS.length - 1]);

  return (
    <StatisticsContext.Provider value={{ year, setYear, data: getYearData(year) }}>
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error("useStatistics must be used within StatisticsProvider");
  }
  return context;
}
