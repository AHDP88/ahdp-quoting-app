import { QuoteData } from "@/components/QuoteBuilder";
import {
  DECK_MATERIAL_RATES,
  DECK_MATERIAL_LABELS,
  DECK_CARPENTER_RATE,
  DECK_OIL_STAIN_RATE,
  DECK_HEIGHT_EXTRA_600,
  DECK_HEIGHT_EXTRA_1200,
  DECK_DEMOLITION_RATE,
  DECK_STAIRS_RATE,
  TIMBER_VER_RATES,
  TIMBER_VER_CARPENTER_RATE,
  TIMBER_VER_PAINTER_RATE,
  VER_DEMOLITION_RATE,
  STEEL_VER_SANCTUARY_RATE,
  STEEL_VER_LABOUR_RATE,
  SCREENING_MATERIAL_RATES,
  SCREENING_LABOUR_RATE,
  ELECTRICAL,
  EXTRAS,
  getBoardKey,
  getDeckSizeBand,
  getTimberVerRate,
  getVerandahSizeBand,
} from "./ahdpPricing";

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
}

function li(section: string, description: string, qty: number, unit: string, unitRate: number): LineItem {
  return { section, description, qty, unit, unitRate, total: +(qty * unitRate).toFixed(2) };
}

export function calculateQuoteTotal(q: QuoteData): QuoteCalculation {
  const items: LineItem[] = [];

  // ── DECKING ──────────────────────────────────────────────────────────────
  if (q.deckingRequired && q.length > 0 && q.width > 0) {
    const area = +(q.length * q.width).toFixed(2);
    const boardKey = getBoardKey(q.boardType || q.deckingType || "");
    const sizeBand = getDeckSizeBand(area);
    const matRate = DECK_MATERIAL_RATES[boardKey]?.[sizeBand] ?? DECK_MATERIAL_RATES.merbau[sizeBand];
    const labourRate = DECK_CARPENTER_RATE[boardKey] ?? 85;
    const boardLabel = DECK_MATERIAL_LABELS[boardKey] ?? "Decking Boards";

    items.push(li("Decking", `${boardLabel} (materials)`, area, "m²", matRate));
    items.push(li("Decking", "Carpenter — deck installation", area, "m²", labourRate));

    // Height extras
    if (q.height > 1.2) {
      items.push(li("Decking", "Height surcharge >1200mm", area, "m²", DECK_HEIGHT_EXTRA_1200));
    } else if (q.height > 0.6) {
      items.push(li("Decking", "Height surcharge >600mm", area, "m²", DECK_HEIGHT_EXTRA_600));
    }

    // Painting/staining of deck
    if (q.paintingRequired === "by-ahdp") {
      items.push(li("Decking", "Painter — oil/stain", area, "m²", DECK_OIL_STAIN_RATE));
    }

    // Demolition
    if (q.demolitionRequired && q.existingDeckSize > 0) {
      items.push(li("Decking", "Demolition of existing deck", q.existingDeckSize, "m²", DECK_DEMOLITION_RATE));
    }

    // Steps
    if (q.stepRampRequired && q.stepLength > 0 && q.stepWidth > 0) {
      const stepArea = +(q.stepLength * q.stepWidth).toFixed(2);
      items.push(li("Decking", "Steps/Ramp — boxed/tread (carpenter)", stepArea, "m²", DECK_STAIRS_RATE));
    }

    // Handrail
    if (q.handrailRequired) {
      const perim = +(2 * (q.length + q.width)).toFixed(2);
      const handrailRate =
        q.handrailType?.toLowerCase().includes("merbau") ? 70 :
        q.handrailType?.toLowerCase().includes("spotted") ? 115 : 70;
      items.push(li("Decking", `Handrail — ${q.handrailType || "Merbau"}`, perim, "LM", handrailRate));
    }

    // Balustrade
    if (q.ballustradeType) {
      const perim = +(2 * (q.length + q.width)).toFixed(2);
      const balRate =
        q.ballustradeType === "Stainless Steel" ? 230 :
        q.ballustradeType === "Timber" ? 240 : 230;
      items.push(li("Decking", `Balustrade — ${q.ballustradeType}`, perim, "LM", balRate));
    }

    // Dig out
    if (q.digOutRequired && q.digOutSize > 0) {
      items.push(li("Decking", "Dingo dig to 300mm", q.digOutSize, "m²", 22));
      items.push(li("Decking", "Soil bin (per bin)", 1, "bin", 600));
    }
  }

  // ── VERANDAH / PERGOLA ───────────────────────────────────────────────────
  if (q.verandahRequired && q.roofSpan > 0 && q.roofLength > 0) {
    const area = +(q.roofSpan * q.roofLength).toFixed(2);

    if (q.materialType === "Steel") {
      const matRate = STEEL_VER_SANCTUARY_RATE(area);
      items.push(li("Verandah", "Steel Sanctuary — materials", area, "m²", matRate));

      const style = q.structureStyle?.toLowerCase() ?? "";
      const labRate = style.includes("gable") ? STEEL_VER_LABOUR_RATE.gable : STEEL_VER_LABOUR_RATE.flat;
      items.push(li("Verandah", `Steel Verandah — carpenter (${style.includes("gable") ? "gable" : "flat"})`, area, "m²", labRate));
    } else {
      // Timber verandah
      const rateKey = getTimberVerRate(q.structureStyle ?? "", q.roofType ?? "", q.roofSpan);
      const sizeBand = getVerandahSizeBand(area);
      const rateObj = TIMBER_VER_RATES[rateKey] ?? TIMBER_VER_RATES.cgiFlatStd;
      const matRate = rateObj[sizeBand];
      const rating = rateObj.carpenterRating;
      const carpRate = TIMBER_VER_CARPENTER_RATE[rating] ?? 75;

      items.push(li("Verandah", `Timber Verandah — ${rateKey} (materials)`, area, "m²", matRate));
      items.push(li("Verandah", `Carpenter Rating ${rating}`, area, "m²", carpRate));

      // Painting
      if (q.paintingRequired === "by-ahdp") {
        items.push(li("Verandah", "Painter — 2 colours", area, "m²", TIMBER_VER_PAINTER_RATE.twoColours));
      }

      // Gable infill
      if (q.gableInfill && q.structureStyle?.toLowerCase().includes("gable")) {
        const infillCost = q.gableInfill === "Slats - Timber" ? 150 : 300;
        items.push(li("Verandah", `Gable infill — ${q.gableInfill}`, 1, "end", infillCost));
      }
    }

    // Demolition
    if (q.demolitionRequired && q.existingDeckSize > 0) {
      items.push(li("Verandah", "Demolition (existing structure)", q.existingDeckSize, "m²", VER_DEMOLITION_RATE));
    }

    // Ceiling
    if (q.ceilingType && !q.ceilingType.toLowerCase().includes("exposed")) {
      const ceilRate =
        q.ceilingType.toLowerCase().includes("flat") ? 205 :
        q.ceilingType.toLowerCase().includes("raked") ? 175 : 520;
      items.push(li("Verandah", `Ceiling — ${q.ceilingType}`, q.roofSpan * q.roofLength, "m²", ceilRate));
    }

    // Flushing
    if (q.flashingRequired) {
      items.push(li("Verandah", "Flushing (min $500)", Math.max(q.roofSpan, 10), "m²", 54));
    }
  }

  // ── SCREENING / WALLS ─────────────────────────────────────────────────────
  if (q.screeningRequired && q.claddingHeight > 0 && q.numberOfBays > 0) {
    const bayWidth = parseFloat(q.postSpacing?.replace("mm", "") ?? "2400") / 1000;
    const screenArea = +(q.claddingHeight * q.numberOfBays * (bayWidth || 2.4)).toFixed(2);
    const matKey = q.screenMaterial || "Merbau Horizontal";
    const rates = SCREENING_MATERIAL_RATES[matKey] ?? SCREENING_MATERIAL_RATES["Merbau Horizontal"];

    items.push(li("Screening", `${matKey} — single-sided (materials)`, screenArea, "m²", rates.single));
    items.push(li("Screening", "Carpenter/Installer — single-sided screen", screenArea, "m²", SCREENING_LABOUR_RATE.single));

    // Painting/staining of screens
    if (q.paintStainRequired === "by-ahdp") {
      const paintRate = matKey.toLowerCase().includes("merbau") || matKey.toLowerCase().includes("pine")
        ? 39 : 27;
      items.push(li("Screening", "Painter — screen (per side)", screenArea, "m²", paintRate));
    }
  }

  // ── ELECTRICAL ────────────────────────────────────────────────────────────
  if (q.electricalWorkRequired) {
    if (q.numCeilingFans > 0) {
      const fanSupply = ELECTRICAL.fans["Bayside Lagoon 132cm Fan Only"];
      items.push(li("Electrical", "Ceiling fan (Bayside Lagoon 132cm)", q.numCeilingFans, "each", fanSupply));
      items.push(li("Electrical", "Electrician — fan installation", q.numCeilingFans, "each", ELECTRICAL.fanInstallLabour));
    }
    if (q.numLights > 0) {
      items.push(li("Electrical", "Downlight (tri-colour)", q.numLights, "each", ELECTRICAL.lights["Downlight Tri-Colour"]));
      items.push(li("Electrical", "Electrician — light installation", q.numLights, "each", ELECTRICAL.lightInstallLabour));
    }
    if (q.numHeaters > 0) {
      items.push(li("Electrical", "2400W Radiant heater", q.numHeaters, "each", ELECTRICAL.heaters["2400W Radiant Heater"]));
      items.push(li("Electrical", "Electrician — heater installation", q.numHeaters, "each", ELECTRICAL.heaterInstallLabour));
    }
    if (q.numPowerPoints > 0) {
      items.push(li("Electrical", "Twin exterior GPO", q.numPowerPoints, "each", ELECTRICAL.gpoSupply));
      items.push(li("Electrical", "Electrician — GPO installation", q.numPowerPoints, "each", ELECTRICAL.gpoInstallLabour));
    }
    if (q.deckLights) {
      items.push(li("Electrical", "Deck lights (warm white 30mm)", 8, "each", ELECTRICAL.deckLightWarmWhite));
      items.push(li("Electrical", "Electrician — deck light install", 8, "each", ELECTRICAL.deckLightInstallLabour));
    }
  }

  // ── EXTRAS ────────────────────────────────────────────────────────────────
  if (q.binHireRequired) {
    items.push(li("Extras", "Skip bin hire", 1, "bin", EXTRAS.skipBinDemolition));
  }
  if (q.councilApproval) {
    items.push(li("Extras", "Council approval", 1, "job", EXTRAS.councilApproval));
  }

  // ── TOTALS ────────────────────────────────────────────────────────────────
  const sum = (section: string) =>
    items.filter(i => i.section === section).reduce((acc, i) => acc + i.total, 0);

  const deckingSubtotal = sum("Decking");
  const verandahSubtotal = sum("Verandah");
  const screeningSubtotal = sum("Screening");
  const electricalSubtotal = sum("Electrical");
  const extrasSubtotal = sum("Extras");
  const grandTotal = deckingSubtotal + verandahSubtotal + screeningSubtotal + electricalSubtotal + extrasSubtotal;

  return {
    lineItems: items,
    deckingSubtotal: +deckingSubtotal.toFixed(2),
    verandahSubtotal: +verandahSubtotal.toFixed(2),
    screeningSubtotal: +screeningSubtotal.toFixed(2),
    electricalSubtotal: +electricalSubtotal.toFixed(2),
    extrasSubtotal: +extrasSubtotal.toFixed(2),
    grandTotal: +grandTotal.toFixed(2),
  };
}
