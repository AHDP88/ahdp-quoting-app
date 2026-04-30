import type { LineItem } from "@/lib/quoteCalculation";

export interface OutputGroup {
  key: string;
  label: string;
  items: LineItem[];
  total: number;
}

export function formatQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(2).replace(/\.?0+$/, "");
}

export function cleanLineItemName(description: string): string {
  const text = description.trim();
  const lower = text.toLowerCase();

  if (lower.startsWith("decking base")) return "Decking boards and installation labour";
  if (lower === "fascia") return "Fascia (Decking)";
  if (lower.includes("fixings") && lower.includes("klevaklip")) return "KlevaKlip fixing system";
  if (lower.includes("fixings") && lower.includes("hidden")) return "Hidden fastener fixing system";
  if (lower.includes("fixings") && lower.includes("colour")) return "Colour screw fixing system";
  if (lower.includes("fixings") && (lower.includes("face") || lower.includes("screw"))) return "Face screw fixing system";
  if (lower.includes("joist upgrade")) return text.replace("Joist upgrade -", "Joist upgrade").trim();
  if (lower.includes("post install modifier")) return "Concrete post install adjustment";
  if (lower.includes("boxed stairs")) return "Boxed deck stairs";
  if (lower.includes("handrail -")) return text.replace("Handrail -", "").trim() + " handrail";
  if (lower.includes("balustrade material") && lower.includes("stainless")) return "Stainless steel wire balustrade";
  if (lower.includes("balustrade material") && lower.includes("timber")) return "Timber slat balustrade";
  if (lower.includes("balustrade material") && lower.includes("aluminium")) return "Aluminium slat balustrade";
  if (lower.includes("balustrade material") && (lower.includes("fc") || lower.includes("fibre"))) return "FC sheet balustrade";
  if (lower.includes("balustrade installation")) return "Balustrade installation labour";
  if (lower.includes("balustrade paint") || lower.includes("balustrade oil")) return "Balustrade painting/oiling";

  const codeLabels: Record<string, string> = {
    "deck.fix.klevaklip": "KlevaKlip fixing system",
    "deck.extra.stairs.boxed": "Boxed deck stairs",
    "deck.extra.handrail.merbau": "Merbau handrail",
    "deck.extra.balustrade.sswire": "Stainless steel wire balustrade",
    "deck.lab.balustrade.install": "Balustrade installation labour",
    "deck.extra.balustrade.finish.paint": "Balustrade painting/oiling",
    "deck.extra.post.install.concrete": "Concrete post install adjustment",
  };

  if (codeLabels[lower]) return codeLabels[lower];
  const joistUpgrade = lower.match(/^subframe\.extra\.joist\.(\d+x\d+)$/);
  if (joistUpgrade) return `Joist upgrade ${joistUpgrade[1]}`;

  return text.replace(/\b[a-z]+\.[a-z0-9.]+\b/gi, "").replace(/\s+/g, " ").trim() || "Quoted item";
}

export function clientSafeWarning(warning: string): string {
  return warning
    .replace(/\b[a-z]+\.[a-z0-9.]+\b/gi, "the required pricing row")
    .replace(/No conditional decking pricing item mapping for/gi, "Pricing has not been set up for")
    .replace(/Missing active pricing item for/gi, "Pricing has not been set up for")
    .replace(/No price is set up for/gi, "Pricing has not been set up for")
    .replace(/\s+/g, " ")
    .trim();
}

export function isCustomQuoteWarning(warning: string): boolean {
  return /custom quote|poa|not auto-priced/i.test(warning);
}

export function splitWarnings(warnings: string[]) {
  const customQuoteItems = warnings.filter(isCustomQuoteWarning).map(clientSafeWarning);
  const pricingNeedsAttention = warnings.filter((warning) => !isCustomQuoteWarning(warning)).map(clientSafeWarning);
  return { customQuoteItems, pricingNeedsAttention };
}

function groupKeyForLineItem(item: LineItem, mode: "summary" | "preview"): string {
  const text = `${item.section} ${item.description}`.toLowerCase();

  if (text.includes("stair") || text.includes("step")) return "stairs";
  if (text.includes("handrail") || text.includes("balustrade")) return "handrails";
  if (item.section === "Screening") return "screening";
  if (item.section === "Verandah") return "verandah";
  if (item.section === "Electrical" || item.section === "Extras") return "other";
  if (text.includes("fixing") || text.includes("joist upgrade") || text.includes("post install") || text.includes("demo") || text.includes("dig") || text.includes("machine") || text.includes("deck light")) return "deckExtras";
  if (item.section === "Decking") return mode === "summary" ? "deckingBase" : "decking";
  return "other";
}

const SUMMARY_GROUPS = [
  ["deckingBase", "Decking Base"],
  ["deckExtras", "Deck Extras"],
  ["handrails", "Handrails / Balustrades"],
  ["stairs", "Stairs"],
  ["screening", "Screening"],
  ["verandah", "Verandah / Roofing"],
  ["other", "Other / POA"],
] as const;

const PREVIEW_GROUPS = [
  ["decking", "Decking"],
  ["deckExtras", "Extras"],
  ["stairs", "Stairs"],
  ["handrails", "Handrails & Balustrades"],
  ["screening", "Screening"],
  ["verandah", "Verandah / Roofing"],
  ["other", "Other"],
] as const;

export function groupLineItems(lineItems: LineItem[], mode: "summary" | "preview"): OutputGroup[] {
  const definitions = mode === "summary" ? SUMMARY_GROUPS : PREVIEW_GROUPS;
  return definitions
    .map(([key, label]) => {
      const items = lineItems.filter((item) => groupKeyForLineItem(item, mode) === key);
      return {
        key,
        label,
        items,
        total: +items.reduce((sum, item) => sum + item.total, 0).toFixed(2),
      };
    })
    .filter((group) => group.items.length > 0);
}

export function buildPricedInclusions(lineItems: LineItem[]): string[] {
  const names = lineItems.map((item) => cleanLineItemName(item.description));
  return Array.from(new Set(names)).filter(Boolean);
}
