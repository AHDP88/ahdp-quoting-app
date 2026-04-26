import { storage } from "./storage";
import type { PricingItem } from "@shared/schema";

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

type RawQuoteInput = Record<string, unknown>;
type PricingMap = Map<string, PricingItem>;

function asNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true";
}

function lineItem(section: string, description: string, qty: number, unit: string, unitRate: number): LineItem {
  return {
    section,
    description,
    qty,
    unit,
    unitRate,
    total: +(qty * unitRate).toFixed(2),
  };
}

function getDeckSizeBand(area: number): "under45" | "45to65" | "over65" {
  if (area < 45) return "under45";
  if (area <= 65) return "45to65";
  return "over65";
}

function getVerandahSizeBand(area: number): "under40" | "40to65" | "over65" {
  if (area < 40) return "under40";
  if (area <= 65) return "40to65";
  return "over65";
}

function getSteelVerandahBand(area: number): "under24" | "24to40" | "40to65" | "over65" {
  if (area < 24) return "under24";
  if (area < 40) return "24to40";
  if (area <= 65) return "40to65";
  return "over65";
}

function getBoardKey(boardType: string): string {
  const map: Record<string, string> = {
    "Timber-Pine": "clearPine",
    "Timber-Kapur": "clearPine",
    "Timber-Merbau": "merbau",
    "Timber-Spotted Gum": "spottedGum",
    "Timber-Jarrah": "spottedGum",
    "Timber-Blackbutt": "blackbutt",
    "Timber-White Mahogany": "blackbutt",
    "Composite-Modwood": "modwood",
    "Composite-Evalast": "evalast",
    "Composite-Trex": "modwood",
    "Composite-Millboard": "modwood",
    "Composite-Ecodeck": "modwood",
    "FibreCement-HardieDeck": "inex",
    "Aluminium-DecoSlat": "modwood",
  };
  return map[boardType] ?? "merbau";
}

function getTimberVerRate(structureStyle: string, roofType: string, roofSpan: number): string {
  const style = structureStyle.toLowerCase();
  const roof = roofType.toLowerCase();

  if (style.includes("gable")) {
    if (roof.includes("insulated") || roof.includes("solarspan")) return "flatSolarspan";
    if (style.includes("straight")) return "straightGable";
    return "straightGable";
  }
  if (style.includes("flat") || style.includes("skillion") || style.includes("fly")) {
    if (roof.includes("insulated") || roof.includes("solarspan")) return "flatSolarspan";
    if (roof.includes("cgi")) return "cgiFlatStd";
    return roofSpan > 4 ? "cgiFlatStd" : "cgiFlatStd";
  }
  return "cgiFlatStd";
}

function getTimberCarpenterRating(rateKey: string): number {
  const ratings: Record<string, number> = {
    cgiFlatStd: 5,
    straightGable: 4,
    flatSolarspan: 6,
    allMerbauFrame: 9,
  };
  return ratings[rateKey] ?? 5;
}

function dollarsFromCents(cents: number | null): number {
  return (cents ?? 0) / 100;
}

function rate(
  prices: PricingMap,
  codes: string[],
  warnings: string[],
  description: string,
): number {
  for (const code of codes) {
    const item = prices.get(code);
    if (item?.isActive !== false && item?.sellRate !== null && item?.sellRate !== undefined) {
      return dollarsFromCents(item.sellRate);
    }
  }
  warnings.push(`Missing active pricing item for ${description}: ${codes.join(", ")}`);
  return 0;
}

async function getPricingMap(): Promise<PricingMap> {
  const pricing = await storage.getAllPricingItems({ isActive: true });
  return new Map(
    pricing
      .filter((item) => item.itemCode)
      .map((item) => [item.itemCode as string, item]),
  );
}

export async function calculateQuoteTotals(rawQuote: RawQuoteInput): Promise<QuoteCalculation> {
  const prices = await getPricingMap();
  const warnings: string[] = [];
  const items: LineItem[] = [];

  if (asBoolean(rawQuote.deckingRequired) && asNumber(rawQuote.length) > 0 && asNumber(rawQuote.width) > 0) {
    const length = asNumber(rawQuote.length);
    const width = asNumber(rawQuote.width);
    const height = asNumber(rawQuote.height);
    const area = +(length * width).toFixed(2);
    const boardKey = getBoardKey(asString(rawQuote.boardType) || asString(rawQuote.deckingType));
    const sizeBand = getDeckSizeBand(area);

    const materialRate = rate(
      prices,
      [`deck.mat.${boardKey}.${sizeBand}`, `deck.mat.${boardKey}.under45`, `deck.mat.merbau.${sizeBand}`, "deck.mat.merbau.under45"],
      warnings,
      "decking material",
    );
    const labourRate = rate(
      prices,
      [`deck.labour.carpenter.${boardKey}`, "deck.labour.carpenter.merbau"],
      warnings,
      "decking labour",
    );

    items.push(lineItem("Decking", "Decking boards (materials)", area, "m2", materialRate));
    items.push(lineItem("Decking", "Carpenter - deck installation", area, "m2", labourRate));

    if (height > 1.2) {
      items.push(lineItem("Decking", "Height surcharge >1200mm", area, "m2", rate(prices, ["deck.extra.height1200"], warnings, "deck height surcharge")));
    } else if (height > 0.6) {
      items.push(lineItem("Decking", "Height surcharge >600mm", area, "m2", rate(prices, ["deck.extra.height600"], warnings, "deck height surcharge")));
    }

    if (asString(rawQuote.paintingRequired) === "by-ahdp") {
      items.push(lineItem("Decking", "Painter - oil/stain", area, "m2", rate(prices, ["deck.labour.oilStain"], warnings, "deck oil/stain")));
    }

    if (asBoolean(rawQuote.demolitionRequired) && asNumber(rawQuote.existingDeckSize) > 0) {
      items.push(lineItem("Decking", "Demolition of existing deck", asNumber(rawQuote.existingDeckSize), "m2", rate(prices, ["deck.extra.demo"], warnings, "deck demolition")));
    }

    if (asBoolean(rawQuote.stepRampRequired) && asNumber(rawQuote.stepLength) > 0 && asNumber(rawQuote.stepWidth) > 0) {
      const stepArea = +(asNumber(rawQuote.stepLength) * asNumber(rawQuote.stepWidth)).toFixed(2);
      items.push(lineItem("Decking", "Steps/Ramp - boxed/tread (carpenter)", stepArea, "m2", rate(prices, ["deck.labour.stairs"], warnings, "deck stairs")));
    }

    if (asBoolean(rawQuote.handrailRequired)) {
      const perim = +(2 * (length + width)).toFixed(2);
      const handrailType = asString(rawQuote.handrailType).toLowerCase();
      const code = handrailType.includes("spotted") ? "deck.extra.handrailSpGum" : "deck.extra.handrailMerbau";
      items.push(lineItem("Decking", `Handrail - ${asString(rawQuote.handrailType) || "Merbau"}`, perim, "LM", rate(prices, [code], warnings, "deck handrail")));
    }

    const balustradeType = asString(rawQuote.ballustradeType);
    if (balustradeType) {
      const perim = +(2 * (length + width)).toFixed(2);
      const code = balustradeType === "Timber" ? "deck.extra.balustTimber" : "deck.extra.balustSS";
      items.push(lineItem("Decking", `Balustrade - ${balustradeType}`, perim, "LM", rate(prices, [code], warnings, "deck balustrade")));
    }

    if (asBoolean(rawQuote.digOutRequired) && asNumber(rawQuote.digOutSize) > 0) {
      items.push(lineItem("Decking", "Dingo dig to 300mm", asNumber(rawQuote.digOutSize), "m2", rate(prices, ["deck.extra.dingo"], warnings, "deck dig out")));
      items.push(lineItem("Decking", "Soil bin (per bin)", 1, "bin", rate(prices, ["deck.extra.soilBin", "extras.skipBin.soil.sm"], warnings, "soil bin")));
    }
  }

  if (asBoolean(rawQuote.verandahRequired) && asNumber(rawQuote.roofSpan) > 0 && asNumber(rawQuote.roofLength) > 0) {
    const roofSpan = asNumber(rawQuote.roofSpan);
    const roofLength = asNumber(rawQuote.roofLength);
    const area = +(roofSpan * roofLength).toFixed(2);

    if (asString(rawQuote.materialType) === "Steel") {
      const band = getSteelVerandahBand(area);
      const style = asString(rawQuote.structureStyle).toLowerCase();
      const labourCode = style.includes("gable") ? "ver.steel.labour.gable" : "ver.steel.labour.flat";
      items.push(lineItem("Verandah", "Steel Sanctuary - materials", area, "m2", rate(prices, [`ver.steel.sanctuary.${band}`], warnings, "steel verandah materials")));
      items.push(lineItem("Verandah", `Steel Verandah - carpenter (${style.includes("gable") ? "gable" : "flat"})`, area, "m2", rate(prices, [labourCode], warnings, "steel verandah labour")));
    } else {
      const rateKey = getTimberVerRate(asString(rawQuote.structureStyle), asString(rawQuote.roofType), roofSpan);
      const band = getVerandahSizeBand(area);
      const rating = getTimberCarpenterRating(rateKey);
      items.push(lineItem("Verandah", `Timber Verandah - ${rateKey} (materials)`, area, "m2", rate(prices, [`ver.timber.${rateKey}.${band}`, `ver.timber.${rateKey}.under40`, "ver.timber.cgiFlatStd.under40"], warnings, "timber verandah materials")));
      items.push(lineItem("Verandah", `Carpenter Rating ${rating}`, area, "m2", rate(prices, [`ver.labour.carpenter.r${rating}`], warnings, "timber verandah labour")));

      if (asString(rawQuote.paintingRequired) === "by-ahdp") {
        items.push(lineItem("Verandah", "Painter - 2 colours", area, "m2", rate(prices, ["ver.labour.painter.2col"], warnings, "verandah painting")));
      }

      const gableInfill = asString(rawQuote.gableInfill);
      if (gableInfill && asString(rawQuote.structureStyle).toLowerCase().includes("gable")) {
        const code = gableInfill === "Slats - Timber" ? "ver.extra.gableInfillSlats" : "ver.extra.gableInfillSolid";
        items.push(lineItem("Verandah", `Gable infill - ${gableInfill}`, 1, "end", rate(prices, [code], warnings, "gable infill")));
      }
    }

    if (asBoolean(rawQuote.demolitionRequired) && asNumber(rawQuote.existingDeckSize) > 0) {
      items.push(lineItem("Verandah", "Demolition (existing structure)", asNumber(rawQuote.existingDeckSize), "m2", rate(prices, ["ver.labour.demo"], warnings, "verandah demolition")));
    }

    const ceilingType = asString(rawQuote.ceilingType);
    if (ceilingType && !ceilingType.toLowerCase().includes("exposed")) {
      const code = ceilingType.toLowerCase().includes("raked")
        ? "ver.extra.ceiling.raked"
        : ceilingType.toLowerCase().includes("bulkhead")
          ? "ver.extra.ceiling.bulkhead"
          : "ver.extra.ceiling.flat";
      items.push(lineItem("Verandah", `Ceiling - ${ceilingType}`, area, "m2", rate(prices, [code], warnings, "verandah ceiling")));
    }

    if (asBoolean(rawQuote.flashingRequired)) {
      items.push(lineItem("Verandah", "Flushing (min $500)", Math.max(roofSpan, 10), "m2", rate(prices, ["ver.extra.flushing"], warnings, "verandah flashing")));
    }
  }

  if (asBoolean(rawQuote.screeningRequired) && asNumber(rawQuote.claddingHeight) > 0 && asNumber(rawQuote.numberOfBays) > 0) {
    const bayWidth = parseFloat(asString(rawQuote.postSpacing).replace("mm", "")) / 1000 || 2.4;
    const screenArea = +(asNumber(rawQuote.claddingHeight) * asNumber(rawQuote.numberOfBays) * bayWidth).toFixed(2);
    const material = asString(rawQuote.screenMaterial);
    const materialCode = material.toLowerCase().includes("pine")
      ? "screen.mat.treatedPine.single"
      : material.toLowerCase().includes("fc") || material.toLowerCase().includes("cfc")
        ? "screen.mat.fc.single"
        : material.toLowerCase().includes("colorbond")
          ? "screen.mat.colorbond.single"
          : material.toLowerCase().includes("aluminium")
            ? "screen.mat.aluminium.single"
            : "screen.mat.merbauH.single";

    items.push(lineItem("Screening", `${material || "Merbau Horizontal"} - single-sided (materials)`, screenArea, "m2", rate(prices, [materialCode], warnings, "screening material")));
    items.push(lineItem("Screening", "Carpenter/Installer - single-sided screen", screenArea, "m2", rate(prices, ["screen.labour.single"], warnings, "screening labour")));

    if (asString(rawQuote.paintStainRequired) === "by-ahdp") {
      const code = material.toLowerCase().includes("merbau") || material.toLowerCase().includes("pine")
        ? "screen.labour.paint.timber"
        : "screen.labour.paint.fc";
      items.push(lineItem("Screening", "Painter - screen (per side)", screenArea, "m2", rate(prices, [code], warnings, "screening paint/stain")));
    }
  }

  if (asBoolean(rawQuote.electricalWorkRequired)) {
    const fanCount = asNumber(rawQuote.numCeilingFans);
    const lightCount = asNumber(rawQuote.numLights);
    const heaterCount = asNumber(rawQuote.numHeaters);
    const gpoCount = asNumber(rawQuote.numPowerPoints);

    if (fanCount > 0) {
      items.push(lineItem("Electrical", "Ceiling fan (Bayside Lagoon 132cm)", fanCount, "each", rate(prices, ["elec.fan.baysiLagoon132"], warnings, "ceiling fan supply")));
      items.push(lineItem("Electrical", "Electrician - fan installation", fanCount, "each", rate(prices, ["elec.fan.labour"], warnings, "ceiling fan installation")));
    }
    if (lightCount > 0) {
      items.push(lineItem("Electrical", "Downlight (tri-colour)", lightCount, "each", rate(prices, ["elec.light.downlightTri"], warnings, "downlight supply")));
      items.push(lineItem("Electrical", "Electrician - light installation", lightCount, "each", rate(prices, ["elec.light.labour"], warnings, "downlight installation")));
    }
    if (heaterCount > 0) {
      items.push(lineItem("Electrical", "2400W Radiant heater", heaterCount, "each", rate(prices, ["elec.heater.2400W"], warnings, "heater supply")));
      items.push(lineItem("Electrical", "Electrician - heater installation", heaterCount, "each", rate(prices, ["elec.heater.labour"], warnings, "heater installation")));
    }
    if (gpoCount > 0) {
      items.push(lineItem("Electrical", "Twin exterior GPO", gpoCount, "each", rate(prices, ["elec.gpo.supply"], warnings, "GPO supply")));
      items.push(lineItem("Electrical", "Electrician - GPO installation", gpoCount, "each", rate(prices, ["elec.gpo.labour"], warnings, "GPO installation")));
    }
    if (asBoolean(rawQuote.deckLights)) {
      items.push(lineItem("Electrical", "Deck lights (warm white 30mm)", 8, "each", rate(prices, ["elec.deckLight.warmWhite"], warnings, "deck lights supply")));
      items.push(lineItem("Electrical", "Electrician - deck light install", 8, "each", rate(prices, ["elec.deckLight.labour"], warnings, "deck lights installation")));
    }
  }

  if (asBoolean(rawQuote.binHireRequired)) {
    items.push(lineItem("Extras", "Skip bin hire", 1, "bin", rate(prices, ["extras.skipBin.demo"], warnings, "skip bin hire")));
  }
  if (asBoolean(rawQuote.councilApproval)) {
    items.push(lineItem("Extras", "Council approval", 1, "job", rate(prices, ["extras.council"], warnings, "council approval")));
  }

  const sectionTotal = (section: string) =>
    items.filter((item) => item.section === section).reduce((sum, item) => sum + item.total, 0);

  const deckingSubtotal = +sectionTotal("Decking").toFixed(2);
  const verandahSubtotal = +sectionTotal("Verandah").toFixed(2);
  const screeningSubtotal = +sectionTotal("Screening").toFixed(2);
  const electricalSubtotal = +sectionTotal("Electrical").toFixed(2);
  const extrasSubtotal = +sectionTotal("Extras").toFixed(2);
  const grandTotal = +(deckingSubtotal + verandahSubtotal + screeningSubtotal + electricalSubtotal + extrasSubtotal).toFixed(2);

  return {
    lineItems: items,
    deckingSubtotal,
    verandahSubtotal,
    screeningSubtotal,
    electricalSubtotal,
    extrasSubtotal,
    grandTotal,
    totalAmount: Math.round(grandTotal * 100),
    totalAmountInc: Math.round(grandTotal * 1.1 * 100),
    warnings,
  };
}
