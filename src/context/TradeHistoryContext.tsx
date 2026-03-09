"use client";

import { createContext, useContext } from "react";
import { useTradeHistory } from "@/hooks/useTradeHistory";

type TradeHistoryContextValue = ReturnType<typeof useTradeHistory>;

const TradeHistoryContext = createContext<TradeHistoryContextValue>({
  trades: [],
  recordTrade: async () => {},
});

export function TradeHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useTradeHistory();
  return (
    <TradeHistoryContext.Provider value={value}>
      {children}
    </TradeHistoryContext.Provider>
  );
}

export function useTradeHistoryContext() {
  return useContext(TradeHistoryContext);
}
