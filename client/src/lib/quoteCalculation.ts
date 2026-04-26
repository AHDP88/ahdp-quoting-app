export interface LineItem {
  section: string;
  description: string;
  qty: number;
  unit: string;
  unitRate: number;
  total: number;
}

export interface QuoteCalculation {
  lineItems: LineItem[];
  deckingSubtotal: number;
  verandahSubtotal: number;
  screeningSubtotal: number;
  electricalSubtotal: number;
  extrasSubtotal: number;
  grandTotal: number;
  totalAmount: number;
  totalAmountInc: number;
  warnings: string[];
}

export const emptyQuoteCalculation: QuoteCalculation = {
  lineItems: [],
  deckingSubtotal: 0,
  verandahSubtotal: 0,
  screeningSubtotal: 0,
  electricalSubtotal: 0,
  extrasSubtotal: 0,
  grandTotal: 0,
  totalAmount: 0,
  totalAmountInc: 0,
  warnings: [],
};
