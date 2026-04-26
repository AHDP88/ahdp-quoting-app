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

interface PricedLineInput {
  section: string;
  description: string;
  qty: number;
  unit: string;
  itemCode: string | undefined;
  warnings: string[];
  missingLabel: string;
}

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

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function lineItem(section: string, description: string, qty: number, unit: string, item: PricingItem): LineItem {
  const unitRate = dollarsFromCents(item.sellRate);

  return {
    section,
    description,
    qty,
    unit,
    unitRate,
    total: +(qty * unitRate).toFixed(2),
  };
}

function manualLineItem(section: string, description: string, qty: number, unit: string, unitRate: number): LineItem {
  return {
    section,
    description,
    qty,
    unit,
    unitRate,
    total: +(qty * unitRate).toFixed(2),
  };
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
    "Timber-Merbau": "merbau",
    "Timber-Spotted Gum": "spottedGum",
    "Timber-Blackbutt": "blackbutt",
    "Composite-Modwood": "modwood",
    "Composite-Evalast": "evalast",
    "FibreCement-HardieDeck": "inex",
  };
  return map[boardType] ?? "";
}

function getBoardWidthFactor(boardSize: string): number | undefined {
  const width = parseInt(boardSize.split("x")[0], 10);
  if (!Number.isFinite(width)) return undefined;
  if (width <= 90) return 1.05;
  if (width >= 135 && width <= 145) return 1;
  return undefined;
}

function getFixingCode(fixingType: string): string | undefined {
  const normalized = normalizeKey(fixingType);
  if (normalized.includes("facescrewed") || normalized.includes("facescrew")) return "deck.fixing.faceScrews";
  if (normalized.includes("hidden")) return "deck.fixing.hiddenFasteners";
  if (normalized.includes("joiststrip")) return "deck.fixing.joistStrips";
  return undefined;
}

function getBoltDownSystemCode(systemType: string): string | undefined {
  const normalized = normalizeKey(systemType);
  if (normalized.includes("lowdeckbracket") || normalized.includes("bracketshoe")) return "deck.post.boltDown.lowDeckBracketShoe";
  if (normalized.includes("adjustable")) return "deck.post.boltDown.adjustableBootShoe";
  if (normalized.includes("click") || normalized.includes("aluminium")) return "deck.post.boltDown.lowDeckClickAluminium";
  return undefined;
}

function getFasciaCode(fasciaType: string): string | undefined {
  const normalized = normalizeKey(fasciaType);
  if (normalized.includes("deckingboards")) return "deck.fascia.deckingBoards";
  if (normalized.includes("timberfascia")) return "deck.fascia.timber";
  if (normalized.includes("fcsheet")) return "deck.fascia.fcSheet";
  if (normalized.includes("cgisheet")) return "deck.fascia.cgiSheet";
  if (normalized === "no") return undefined;
  return undefined;
}

function getDeckLabourKey(boardKey: string): string {
  const map: Record<string, string> = {
    clearPine: "pine",
    merbau: "merbau",
    spottedGum: "merbau",
    blackbutt: "merbau",
    modwood: "merbau",
    evalast: "evalast",
    inex: "inex",
  };
  return map[boardKey] ?? "";
}

function getScreenMaterialCode(material: string): string | undefined {
  const normalized = material.toLowerCase();
  if (normalized.includes("pine")) return "screen.mat.treatedPine.single";
  if (normalized.includes("fc") || normalized.includes("cfc")) return "screen.mat.fc.single";
  if (normalized.includes("rendered blueboard")) return "screen.mat.fc.single";
  if (normalized.includes("colorbond")) return "screen.mat.colorbond.single";
  if (normalized.includes("aluminium")) return "screen.mat.aluminium.single";
  if (normalized.includes("merbau")) return "screen.mat.merbauH.single";
  return undefined;
}

function getTimberVerRate(structureStyle: string, roofType: string): string {
  const style = structureStyle.toLowerCase();
  const roof = roofType.toLowerCase();

  if (style.includes("gable")) {
    if (roof.includes("insulated") || roof.includes("solarspan")) return "flatSolarspan";
    if (style.includes("straight")) return "straightGable";
    return "straightGable";
  }
  if (style.includes("flat") || style.includes("skillion") || style.includes("fly")) {
    if (roof.includes("insulated") || roof.includes("solarspan")) return "flatSolarspan";
    return "cgiFlatStd";
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

function getSizeBandCode(area: number, bands: string[]): string {
  if (bands.length === 2) return area < 45 ? bands[0] : bands[1];
  if (bands.length === 3) {
    if (bands[0].startsWith("under40")) {
      if (area < 40) return bands[0];
      if (area <= 65) return bands[1];
      return bands[2];
    }
    if (area < 45) return bands[0];
    if (area <= 65) return bands[1];
    return bands[2];
  }
  return "";
}

function dollarsFromCents(cents: number): number {
  return cents / 100;
}

function pricingItem(prices: PricingMap, itemCode: string | undefined, warnings: string[], missingLabel: string): PricingItem | undefined {
  if (!itemCode) {
    warnings.push(`No pricing item mapping configured for ${missingLabel}`);
    return undefined;
  }

  const item = prices.get(itemCode);
  if (!item) {
    warnings.push(`Missing active pricing item for ${missingLabel}: ${itemCode}`);
    return undefined;
  }

  if (item.sellRate === null || item.sellRate === undefined) {
    warnings.push(`Pricing item is missing sellRate for ${missingLabel}: ${itemCode}`);
    return undefined;
  }

  return item;
}

function addPricedLineItem(prices: PricingMap, items: LineItem[], input: PricedLineInput) {
  const item = pricingItem(prices, input.itemCode, input.warnings, input.missingLabel);
  if (!item) return;
  items.push(lineItem(input.section, input.description, input.qty, input.unit, item));
}

function addPricedOrWarning(prices: PricingMap, items: LineItem[], input: PricedLineInput) {
  addPricedLineItem(prices, items, input);
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
    const boardType = asString(rawQuote.boardType) || asString(rawQuote.deckingType);
    const boardSize = asString(rawQuote.boardSize) || asString(rawQuote.customBoardSize);
    const boardKey = getBoardKey(boardType);
    const sizeBand = getSizeBandCode(area, ["under45", "45to65", "over65"]);
    const labourKey = getDeckLabourKey(boardKey);
    const boardWidthFactor = getBoardWidthFactor(boardSize);

    if (!boardType) warnings.push("Decking board type is required before decking can be priced.");
    if (!boardSize) warnings.push("Decking board width/size is required before decking can be priced.");
    if (boardType.includes("Kapur") || boardType.includes("Jarrah")) warnings.push(`No pricing item mapping configured for decking material (${boardType}). Seed a matching pricing_items code before using this board.`);
    if (boardType.includes("Trex") || boardType.includes("Millboard") || boardType.includes("Ecodeck")) warnings.push(`No pricing item mapping configured for composite decking material (${boardType}). Seed a matching pricing_items code before using this board.`);
    if (boardType.includes("Aluminium")) warnings.push(`Aluminium decking is not currently priced. Remove it from the quote or seed a pricing_items entry before using ${boardType}.`);
    if (boardType.includes("HardieDeck") || boardKey === "inex") warnings.push("HardieDeck currently maps to INEX fibre cement pricing. Review this business mapping/rate before relying on it.");
    if (boardSize && boardWidthFactor === undefined) warnings.push(`No board-width pricing rule configured for board size ${boardSize}.`);

    if (boardType && boardSize && boardKey && boardWidthFactor !== undefined) {
      addPricedLineItem(prices, items, {
        section: "Decking",
        description: `Decking boards (materials, ${boardSize})`,
        qty: +(area * boardWidthFactor).toFixed(2),
        unit: "m2",
        itemCode: `deck.mat.${boardKey}.${sizeBand}`,
        warnings,
        missingLabel: `decking material (${boardType})`,
      });
      addPricedLineItem(prices, items, {
        section: "Decking",
        description: "Carpenter - deck installation",
        qty: area,
        unit: "m2",
        itemCode: labourKey ? `deck.labour.carpenter.${labourKey}` : undefined,
        warnings,
        missingLabel: `decking labour (${boardType})`,
      });
    }

    if (asString(rawQuote.joistSize)) {
      addPricedOrWarning(prices, items, { section: "Decking", description: `Joists - ${asString(rawQuote.joistSize)}`, qty: area, unit: "m2", itemCode: `deck.frame.joist.${asString(rawQuote.joistSize)}`, warnings, missingLabel: `joist size ${asString(rawQuote.joistSize)}` });
    }

    if (asString(rawQuote.bearerSize)) {
      addPricedOrWarning(prices, items, { section: "Decking", description: `Bearers - ${asString(rawQuote.bearerSize)}`, qty: area, unit: "m2", itemCode: `deck.frame.bearer.${asString(rawQuote.bearerSize)}`, warnings, missingLabel: `bearer size ${asString(rawQuote.bearerSize)}` });
    }

    if (asString(rawQuote.fixingType)) {
      addPricedOrWarning(prices, items, { section: "Decking", description: `Fixings - ${asString(rawQuote.fixingType)}`, qty: area, unit: "m2", itemCode: getFixingCode(asString(rawQuote.fixingType)), warnings, missingLabel: `fixing type ${asString(rawQuote.fixingType)}` });
    }

    if (asString(rawQuote.postInstallation) === "Bolt Down") {
      const systemType = asString(rawQuote.boltDownSystemType);
      addPricedOrWarning(prices, items, { section: "Decking", description: `Bolt-down system - ${systemType || "not selected"}`, qty: area, unit: "m2", itemCode: getBoltDownSystemCode(systemType), warnings, missingLabel: `bolt-down system ${systemType || "not selected"}` });
    }

    if (asBoolean(rawQuote.fasciaRequired)) {
      const fasciaType = asString(rawQuote.fasciaType);
      const fasciaLength = asNumber(rawQuote.fasciaLength) > 0 ? asNumber(rawQuote.fasciaLength) : +(2 * (length + width)).toFixed(2);
      const fasciaArea = +(Math.max(height, 0) * fasciaLength).toFixed(2);
      if (!fasciaType || fasciaType === "No") {
        warnings.push("Fascia is marked required but no priced fascia type was selected.");
      } else if (fasciaArea <= 0) {
        warnings.push("Fascia pricing requires deck height and fascia length/exposed perimeter.");
      } else {
        addPricedOrWarning(prices, items, { section: "Decking", description: `Fascia - ${fasciaType}`, qty: fasciaArea, unit: "m2", itemCode: getFasciaCode(fasciaType), warnings, missingLabel: `fascia type ${fasciaType}` });
      }
    }

    if (asBoolean(rawQuote.subframePainted)) {
      items.push(manualLineItem("Decking", "Subframe painted", area, "m2", 25));
    }

    if (asBoolean(rawQuote.joistProtectionTape)) {
      const tapeItem = pricingItem(prices, "deck.extra.joistProtectionTape", [], "joist protection tape");
      if (tapeItem) {
        items.push(lineItem("Decking", "Joist protection tape", area, "roll", tapeItem));
      } else {
        items.push(manualLineItem("Decking", "Joist protection tape allowance", area, "roll", 55));
        warnings.push("Using temporary joist protection tape allowance of 1 roll per m2 at $55 because pricing_items code deck.extra.joistProtectionTape is missing.");
      }
    }

    if (height > 1.2) {
      addPricedLineItem(prices, items, { section: "Decking", description: "Height surcharge >1200mm", qty: area, unit: "m2", itemCode: "deck.extra.height1200", warnings, missingLabel: "deck height surcharge >1200mm" });
    } else if (height > 0.6) {
      addPricedLineItem(prices, items, { section: "Decking", description: "Height surcharge >600mm", qty: area, unit: "m2", itemCode: "deck.extra.height600", warnings, missingLabel: "deck height surcharge >600mm" });
    }

    if (asString(rawQuote.paintingRequired) === "by-ahdp") {
      addPricedLineItem(prices, items, { section: "Decking", description: "Painter - oil/stain", qty: area, unit: "m2", itemCode: "deck.labour.oilStain", warnings, missingLabel: "deck oil/stain" });
    }

    if (asBoolean(rawQuote.demolitionRequired) && asNumber(rawQuote.existingDeckSize) > 0) {
      addPricedLineItem(prices, items, { section: "Decking", description: "Demolition of existing deck", qty: asNumber(rawQuote.existingDeckSize), unit: "m2", itemCode: "deck.extra.demo", warnings, missingLabel: "deck demolition" });
    }

    if (asBoolean(rawQuote.stepRampRequired) && asNumber(rawQuote.stepLength) > 0 && asNumber(rawQuote.stepWidth) > 0) {
      const numberOfSteps = Math.max(asNumber(rawQuote.numberOfSteps), 1);
      const stepWidthM = asNumber(rawQuote.stepWidth) / 1000;
      const stepLengthM = asNumber(rawQuote.stepLength) / 1000;
      const stepArea = +(stepWidthM * stepLengthM * numberOfSteps).toFixed(2);
      if (stepArea > 40 || stepWidthM > 5 || stepLengthM > 5) {
        warnings.push("Step dimensions look too large. Enter step width/length in millimetres; step pricing was skipped to prevent an absurd total.");
      } else {
        addPricedLineItem(prices, items, { section: "Decking", description: "Steps/Ramp - boxed/tread (carpenter)", qty: stepArea, unit: "m2", itemCode: "deck.labour.stairs", warnings, missingLabel: "deck stairs" });
      }
    }

    if (asBoolean(rawQuote.handrailRequired)) {
      const linealMetres = asNumber(rawQuote.handrailLinealMetres);
      const handrailType = asString(rawQuote.handrailType).toLowerCase();
      const code = handrailType.includes("spotted") ? "deck.extra.handrailSpGum" : "deck.extra.handrailMerbau";
      if (linealMetres <= 0) {
        warnings.push("Handrail pricing requires handrail lineal metres. It no longer guesses from deck perimeter.");
      } else {
        addPricedLineItem(prices, items, { section: "Decking", description: `Handrail - ${asString(rawQuote.handrailType) || "Merbau"}`, qty: linealMetres, unit: "LM", itemCode: code, warnings, missingLabel: "deck handrail" });
      }
    }

    const balustradeType = asString(rawQuote.ballustradeType);
    if (balustradeType) {
      const perim = asNumber(rawQuote.handrailLinealMetres);
      const code = balustradeType === "Timber" ? "deck.extra.balustTimber" : "deck.extra.balustSS";
      if (perim > 0) addPricedLineItem(prices, items, { section: "Decking", description: `Balustrade - ${balustradeType}`, qty: perim, unit: "LM", itemCode: code, warnings, missingLabel: `deck balustrade (${balustradeType})` });
    }

    if (asBoolean(rawQuote.digOutRequired) && asNumber(rawQuote.digOutSize) > 0) {
      addPricedLineItem(prices, items, { section: "Decking", description: "Dingo dig to 300mm", qty: asNumber(rawQuote.digOutSize), unit: "m2", itemCode: "deck.extra.dingo", warnings, missingLabel: "deck dig out" });
      addPricedLineItem(prices, items, { section: "Decking", description: "Soil bin (per bin)", qty: 1, unit: "bin", itemCode: "deck.extra.soilBin", warnings, missingLabel: "soil bin" });
    }
    if (asString(rawQuote.machineHireRequired) === "Yes") {
      addPricedOrWarning(prices, items, { section: "Decking", description: "Machine hire", qty: 1, unit: "job", itemCode: "deck.extra.machineHire", warnings, missingLabel: "machine hire" });
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
      addPricedLineItem(prices, items, { section: "Verandah", description: "Steel Sanctuary - materials", qty: area, unit: "m2", itemCode: `ver.steel.sanctuary.${band}`, warnings, missingLabel: `steel verandah materials (${band})` });
      addPricedLineItem(prices, items, { section: "Verandah", description: `Steel Verandah - carpenter (${style.includes("gable") ? "gable" : "flat"})`, qty: area, unit: "m2", itemCode: labourCode, warnings, missingLabel: "steel verandah labour" });
    } else {
      const rateKey = getTimberVerRate(asString(rawQuote.structureStyle), asString(rawQuote.roofType));
      const band = getSizeBandCode(area, ["under40", "40to65", "over65"]);
      const rating = getTimberCarpenterRating(rateKey);
      addPricedLineItem(prices, items, { section: "Verandah", description: `Timber Verandah - ${rateKey} (materials)`, qty: area, unit: "m2", itemCode: `ver.timber.${rateKey}.${band}`, warnings, missingLabel: `timber verandah materials (${rateKey}, ${band})` });
      addPricedLineItem(prices, items, { section: "Verandah", description: `Carpenter Rating ${rating}`, qty: area, unit: "m2", itemCode: `ver.labour.carpenter.r${rating}`, warnings, missingLabel: `timber verandah labour rating ${rating}` });

      if (asString(rawQuote.paintingRequired) === "by-ahdp") {
        addPricedLineItem(prices, items, { section: "Verandah", description: "Painter - 2 colours", qty: area, unit: "m2", itemCode: "ver.labour.painter.2col", warnings, missingLabel: "verandah painting" });
      }

      const gableInfill = asString(rawQuote.gableInfill);
      if (gableInfill && asString(rawQuote.structureStyle).toLowerCase().includes("gable")) {
        const code = gableInfill === "Slats - Timber" ? "ver.extra.gableInfillSlats" : "ver.extra.gableInfillSolid";
        addPricedLineItem(prices, items, { section: "Verandah", description: `Gable infill - ${gableInfill}`, qty: 1, unit: "end", itemCode: code, warnings, missingLabel: `gable infill (${gableInfill})` });
      }
    }

    if (asBoolean(rawQuote.demolitionRequired) && asNumber(rawQuote.existingDeckSize) > 0) {
      addPricedLineItem(prices, items, { section: "Verandah", description: "Demolition (existing structure)", qty: asNumber(rawQuote.existingDeckSize), unit: "m2", itemCode: "ver.labour.demo", warnings, missingLabel: "verandah demolition" });
    }

    const ceilingType = asString(rawQuote.ceilingType);
    if (ceilingType && !ceilingType.toLowerCase().includes("exposed")) {
      const code = ceilingType.toLowerCase().includes("raked")
        ? "ver.extra.ceiling.raked"
        : ceilingType.toLowerCase().includes("bulkhead")
          ? "ver.extra.ceiling.bulkhead"
          : "ver.extra.ceiling.flat";
      addPricedLineItem(prices, items, { section: "Verandah", description: `Ceiling - ${ceilingType}`, qty: area, unit: "m2", itemCode: code, warnings, missingLabel: `verandah ceiling (${ceilingType})` });
    }

    if (asBoolean(rawQuote.flashingRequired)) {
      addPricedLineItem(prices, items, { section: "Verandah", description: "Flushing (min $500)", qty: Math.max(roofSpan, 10), unit: "m2", itemCode: "ver.extra.flushing", warnings, missingLabel: "verandah flashing" });
    }
  }

  if (asBoolean(rawQuote.screeningRequired) && asNumber(rawQuote.claddingHeight) > 0 && asNumber(rawQuote.numberOfBays) > 0) {
    const bayWidth = parseFloat(asString(rawQuote.postSpacing).replace("mm", "")) / 1000 || 2.4;
    const screenArea = +(asNumber(rawQuote.claddingHeight) * asNumber(rawQuote.numberOfBays) * bayWidth).toFixed(2);
    const material = asString(rawQuote.screenMaterial);
    const materialCode = getScreenMaterialCode(material);

    addPricedLineItem(prices, items, { section: "Screening", description: `${material || "Merbau Horizontal"} - single-sided (materials)`, qty: screenArea, unit: "m2", itemCode: materialCode, warnings, missingLabel: `screening material (${material || "Merbau Horizontal"})` });
    addPricedLineItem(prices, items, { section: "Screening", description: "Carpenter/Installer - single-sided screen", qty: screenArea, unit: "m2", itemCode: "screen.labour.single", warnings, missingLabel: "screening labour" });

    if (asString(rawQuote.paintStainRequired) === "by-ahdp") {
      const code = material.toLowerCase().includes("merbau") || material.toLowerCase().includes("pine")
        ? "screen.labour.paint.timber"
        : "screen.labour.paint.fc";
      addPricedLineItem(prices, items, { section: "Screening", description: "Painter - screen (per side)", qty: screenArea, unit: "m2", itemCode: code, warnings, missingLabel: "screening paint/stain" });
    }
  }

  if (asBoolean(rawQuote.electricalWorkRequired)) {
    const fanCount = asNumber(rawQuote.numCeilingFans);
    const lightCount = asNumber(rawQuote.numLights);
    const heaterCount = asNumber(rawQuote.numHeaters);
    const gpoCount = asNumber(rawQuote.numPowerPoints);

    if (fanCount > 0) {
      addPricedLineItem(prices, items, { section: "Electrical", description: "Ceiling fan (Bayside Lagoon 132cm)", qty: fanCount, unit: "each", itemCode: "elec.fan.baysiLagoon132", warnings, missingLabel: "ceiling fan supply" });
      addPricedLineItem(prices, items, { section: "Electrical", description: "Electrician - fan installation", qty: fanCount, unit: "each", itemCode: "elec.fan.labour", warnings, missingLabel: "ceiling fan installation" });
    }
    if (lightCount > 0) {
      addPricedLineItem(prices, items, { section: "Electrical", description: "Downlight (tri-colour)", qty: lightCount, unit: "each", itemCode: "elec.light.downlightTri", warnings, missingLabel: "downlight supply" });
      addPricedLineItem(prices, items, { section: "Electrical", description: "Electrician - light installation", qty: lightCount, unit: "each", itemCode: "elec.light.labour", warnings, missingLabel: "downlight installation" });
    }
    if (heaterCount > 0) {
      addPricedLineItem(prices, items, { section: "Electrical", description: "2400W Radiant heater", qty: heaterCount, unit: "each", itemCode: "elec.heater.2400W", warnings, missingLabel: "heater supply" });
      addPricedLineItem(prices, items, { section: "Electrical", description: "Electrician - heater installation", qty: heaterCount, unit: "each", itemCode: "elec.heater.labour", warnings, missingLabel: "heater installation" });
    }
    if (gpoCount > 0) {
      addPricedLineItem(prices, items, { section: "Electrical", description: "Twin exterior GPO", qty: gpoCount, unit: "each", itemCode: "elec.gpo.supply", warnings, missingLabel: "GPO supply" });
      addPricedLineItem(prices, items, { section: "Electrical", description: "Electrician - GPO installation", qty: gpoCount, unit: "each", itemCode: "elec.gpo.labour", warnings, missingLabel: "GPO installation" });
    }
  }

  if (asBoolean(rawQuote.deckLights)) {
    const deckLightQty = asNumber(rawQuote.deckLightQty);
    if (deckLightQty <= 0) {
      warnings.push("Deck lights are selected but no deck light quantity was entered.");
    } else {
      addPricedLineItem(prices, items, { section: "Electrical", description: "Deck lights (warm white 30mm)", qty: deckLightQty, unit: "each", itemCode: "elec.deckLight.warmWhite", warnings, missingLabel: "deck lights supply" });
      addPricedLineItem(prices, items, { section: "Electrical", description: "Electrician - deck light install", qty: deckLightQty, unit: "each", itemCode: "elec.deckLight.labour", warnings, missingLabel: "deck lights installation" });
    }
  }

  if (asBoolean(rawQuote.binHireRequired)) {
    addPricedLineItem(prices, items, { section: "Extras", description: "Skip bin hire", qty: 1, unit: "bin", itemCode: "extras.skipBin.demo", warnings, missingLabel: "skip bin hire" });
  }
  if (asBoolean(rawQuote.councilApproval)) {
    addPricedLineItem(prices, items, { section: "Extras", description: "Council approval", qty: 1, unit: "job", itemCode: "extras.council", warnings, missingLabel: "council approval" });
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
