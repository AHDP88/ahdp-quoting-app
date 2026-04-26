import { useQuery } from "@tanstack/react-query";
import type { QuoteData } from "@/components/QuoteBuilder";
import { emptyQuoteCalculation, type QuoteCalculation } from "@/lib/quoteCalculation";

export function useQuoteCalculation(quoteData: QuoteData) {
  const query = useQuery<QuoteCalculation>({
    queryKey: ["/api/quotes/calculate", quoteData],
    queryFn: async () => {
      const response = await fetch("/api/quotes/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to calculate quote");
      }

      return response.json();
    },
  });

  return {
    ...query,
    calculation: query.data ?? emptyQuoteCalculation,
  };
}
