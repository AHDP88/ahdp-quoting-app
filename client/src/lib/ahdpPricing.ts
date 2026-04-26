/**
 * AHDP Pricing Data — sourced directly from AHDP_Pricing_Sheet[2].xlsx
 * All prices in AUD dollars (ex GST unless noted).
 */

// ─── DECKING MATERIAL RATES (per m²) ─────────────────────────────────────────
// Price varies by board type and project size band

export type DeckSizeBand = "under45" | "45to65" | "over65" | "concreteUnder45" | "concreteOver45";

export const DECK_MATERIAL_RATES: Record<string, Record<DeckSizeBand, number>> = {
  clearPine:      { under45: 380, "45to65": 360, over65: 335, concreteUnder45: 335, concreteOver45: 310 },
  kapur:          { under45: 375, "45to65": 355, over65: 330, concreteUnder45: 330, concreteOver45: 305 },
  merbau:         { under45: 430, "45to65": 400, over65: 370, concreteUnder45: 370, concreteOver45: 355 },
  spottedGum:     { under45: 470, "45to65": 440, over65: 420, concreteUnder45: 420, concreteOver45: 395 },
  blackbutt:      { under45: 500, "45to65": 470, over65: 450, concreteUnder45: 450, concreteOver45: 425 },
  whiteMahogany:  { under45: 500, "45to65": 470, over65: 450, concreteUnder45: 450, concreteOver45: 425 },
  modwood:        { under45: 490, "45to65": 470, over65: 450, concreteUnder45: 450, concreteOver45: 425 },
  evalast:        { under45: 490, "45to65": 470, over65: 450, concreteUnder45: 450, concreteOver45: 425 },
  modwoodFlame:   { under45: 625, "45to65": 610, over65: 585, concreteUnder45: 585, concreteOver45: 565 },
  inex:           { under45: 330, "45to65": 290, over65: 270, concreteUnder45: 270, concreteOver45: 255 },
  replaceBoards:  { under45: 245, "45to65": 245, over65: 245, concreteUnder45: 245, concreteOver45: 245 },
};

// Board type label for display
export const DECK_MATERIAL_LABELS: Record<string, string> = {
  clearPine: "Clear Pine 90mm",
  kapur: "Kapur 90mm",
  merbau: "Merbau 90mm",
  spottedGum: "Spotted Gum 90mm",
  blackbutt: "Blackbutt 90mm",
  whiteMahogany: "White Mahogany 86mm",
  modwood: "Modwood 88mm",
  evalast: "Evalast 140mm",
  modwoodFlame: "Modwood Flame Shield 137mm",
  inex: "INEX 16mm Cement Sheeting",
  replaceBoards: "Replace Boards Only",
};

// Map form boardType values → internal key
export function getBoardKey(boardType: string): string {
  const map: Record<string, string> = {
    "Timber-Pine": "clearPine",
    "Timber-Kapur": "kapur",
    "Timber-Merbau": "merbau",
    "Timber-Spotted Gum": "spottedGum",
    "Timber-Jarrah": "spottedGum",
    "Timber-Blackbutt": "blackbutt",
    "Timber-White Mahogany": "whiteMahogany",
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

export function getDeckSizeBand(area: number): DeckSizeBand {
  if (area < 45) return "under45";
  if (area <= 65) return "45to65";
  return "over65";
}

// ─── DECKING LABOUR RATES (per m²) ───────────────────────────────────────────

export const DECK_CARPENTER_RATE: Record<string, number> = {
  clearPine: 70,
  kapur: 70,
  merbau: 85,
  spottedGum: 85,
  blackbutt: 85,
  whiteMahogany: 85,
  modwood: 85,
  evalast: 95,
  modwoodFlame: 85,
  inex: 54,
  replaceBoards: 54,
};

export const DECK_OIL_STAIN_RATE = 36; // per m² (painter)

// ─── DECK EXTRAS ─────────────────────────────────────────────────────────────

export const DECK_BALUSTRADE = {
  stainlessWire: 230,   // per LM
  timberBalustrade: 240, // per LM
  merbauHandrail: 70,   // per LM
  spottedGumHandrail: 115, // per LM
  freestandingPost: 250, // each
};

export const DECK_STAIRS_RATE = 180;  // per m² (carpenter steps)
export const DECK_DEMOLITION_RATE = 20; // per m² (deck demo)
export const DECK_DIG_DINGO_RATE = 22;  // per m² (dingo dig)
export const DECK_SOIL_BIN = 600;       // per bin
export const DECK_HEIGHT_EXTRA_600 = 15;    // per m² (>600mm high)
export const DECK_HEIGHT_EXTRA_1200 = 30;   // per m² (>1200mm high)

// ─── TIMBER VERANDAH RATES (per m²) ──────────────────────────────────────────

export type VerandahSizeBand = "under40" | "40to65" | "over65";

export interface TimberVerandahRate {
  under40: number;
  "40to65": number;
  over65: number;
  carpenterRating: number; // 1–9, used to look up TIMBER_VER_CARPENTER_RATE
}

export const TIMBER_VER_RATES: Record<string, TimberVerandahRate> = {
  openFlat:         { under40: 185, "40to65": 165, over65: 155, carpenterRating: 1 },
  openGable:        { under40: 195, "40to65": 175, over65: 165, carpenterRating: 2 },
  flatShadecloth:   { under40: 205, "40to65": 185, over65: 175, carpenterRating: 3 },
  gableShadecloth:  { under40: 225, "40to65": 205, over65: 195, carpenterRating: 4 },
  cgiFlatStd:       { under40: 325, "40to65": 300, over65: 270, carpenterRating: 5 },
  cgiFlatWide:      { under40: 345, "40to65": 320, over65: 290, carpenterRating: 5 },
  straightGable:    { under40: 390, "40to65": 345, over65: 315, carpenterRating: 4 },
  taperedFlat:      { under40: 370, "40to65": 325, over65: 295, carpenterRating: 5 },
  spanGable:        { under40: 415, "40to65": 385, over65: 355, carpenterRating: 5 },
  flatSolarspan:    { under40: 690, "40to65": 540, over65: 470, carpenterRating: 6 },
  gazebo:           { under40: 415, "40to65": 385, over65: 355, carpenterRating: 7 },
  multiwallPoly:    { under40: 590, "40to65": 550, over65: 490, carpenterRating: 8 },
  gableSolarspan:   { under40: 770, "40to65": 640, over65: 550, carpenterRating: 7 },
  allMerbauFrame:   { under40: 785, "40to65": 705, over65: 665, carpenterRating: 9 },
};

// Carpenter labour rates for timber verandah (per m²)
export const TIMBER_VER_CARPENTER_RATE: Record<number, number> = {
  1: 34, 2: 46, 3: 58, 4: 66, 5: 75, 6: 80, 7: 90, 8: 95, 9: 108,
};

// Painter rates for timber verandah (per m²)
export const TIMBER_VER_PAINTER_RATE = {
  oneColour: 39,
  twoColours: 43,
  threeColours: 47,
  stain: 59,
};

// Map form fields → timber verandah rate key
export function getTimberVerRate(structureStyle: string, roofType: string, roofSpan: number): string {
  const style = structureStyle.toLowerCase();
  const roof = roofType.toLowerCase();

  if (style.includes("gable")) {
    if (roof.includes("insulated") || roof.includes("solarspan")) return "gableSolarspan";
    if (roof.includes("poly") || roof.includes("multiwall")) return "multiwallPoly";
    if (roof.includes("shade")) return "gableShadecloth";
    if (style.includes("straight")) return "straightGable";
    return "spanGable";
  }
  if (style.includes("flat") || style.includes("skillion") || style.includes("fly")) {
    if (roof.includes("insulated") || roof.includes("solarspan")) return "flatSolarspan";
    if (roof.includes("shade")) return "flatShadecloth";
    if (roof.includes("cgi")) return roofSpan > 4 ? "cgiFlatWide" : "cgiFlatStd";
    if (roof.includes("poly")) return "multiwallPoly";
    return "taperedFlat";
  }
  if (style.includes("hip")) return "spanGable";
  if (style.includes("dutch")) return "straightGable";
  if (style.includes("gazebo")) return "gazebo";
  return "cgiFlatStd";
}

export function getVerandahSizeBand(area: number): VerandahSizeBand {
  if (area < 40) return "under40";
  if (area <= 65) return "40to65";
  return "over65";
}

// ─── STEEL VERANDAH RATES (Sanctuary, per m²) ────────────────────────────────

export const STEEL_VER_SANCTUARY_RATE = (area: number): number => {
  if (area < 24) return 190;
  if (area < 40) return 170;
  if (area <= 65) return 160;
  return 150;
};

// Steel verandah labour rates (per m²)
export const STEEL_VER_LABOUR_RATE = {
  flat: 42,
  gable: 68,
};

// ─── VERANDAH EXTRAS ─────────────────────────────────────────────────────────

export const VER_HIP_VALLEY_EXTRA = 300;   // each (materials)
export const VER_DEMOLITION_RATE = 20;     // per m²
export const VER_POST_HOLE_STD = 200;      // each (timber) / 110 (steel)
export const VER_FLUSHING_MIN = 500;       // minimum
export const VER_FLUSHING_RATE = 54;       // per m² (timber)

// ─── SCREENING RATES (per m²) ────────────────────────────────────────────────

export const SCREENING_MATERIAL_RATES: Record<string, { single: number; double: number }> = {
  "Merbau Horizontal":   { single: 325, double: 500 },
  "Merbau Vertical":     { single: 325, double: 500 },
  "Treated Pine":        { single: 285, double: 395 },
  "FC Sheeting":         { single: 205, double: 225 },
  "CFC Cladding":        { single: 205, double: 225 },
  "Weatherboards":       { single: 205, double: 225 },
  "Rendered Blueboard":  { single: 205, double: 225 },
  "Aluminium Slatting":  { single: 300, double: 300 },
  "Colorbond":           { single: 205, double: 225 },
};

// Carpenter/installer rates for screening (per m²)
export const SCREENING_LABOUR_RATE = { single: 50, double: 56 };

// Screening painter rates (per m²)
export const SCREENING_PAINTER_RATE = {
  hardieflex: 27,
  hardieLattice: 33,
  timberSlatsPerSide: 39,
  timberSlatStain: 47,
  shadeCloth: 15,
};

// ─── ELECTRICAL PRICES ───────────────────────────────────────────────────────

export const ELECTRICAL = {
  // Fan supply
  fans: {
    "Bayside Lagoon 132cm Fan Only": 365,
    "Aria 132cm Fan Only": 365,
    "Whitehaven 142cm Fan Only": 490,
    "Whitehaven 142cm Fan+Light": 537,
    "Atlanta 142cm 7 Blade Fan+Light": 738,
    "Atlanta 183cm 7 Blade Fan+Light": 1053,
  },
  // Fan install labour (electrician)
  fanInstallLabour: 500,

  // Light supply
  lights: {
    "Downlight Tri-Colour": 52,
    "Downlight Insulated Panel Std": 120,
    "Downlight Insulated Panel Large": 212,
    "Small 3W Beam Lights": 95,
    "Eave Mount Light 900mm": 137,
    "Eave Mount Light 1200mm": 160,
  },
  // Light install labour (electrician)
  lightInstallLabour: 165, // per light

  // Heater supply
  heaters: {
    "2400W Radiant Heater": 605,
    "3000W Radiant Heater": 655,
  },
  // Heater install labour
  heaterInstallLabour: 495, // per heater

  // Power points
  gpoSupply: 50,        // Twin Exterior GPO
  gpoInstallLabour: 298, // per GPO

  // Deck lights
  deckLightWarmWhite: 64,    // each (30mm warm white)
  deckLightMulticolour: 79,  // each (30mm multicolour)
  deckLightInstallLabour: 50, // per light
};

// ─── EXTRAS & MISC ───────────────────────────────────────────────────────────

export const EXTRAS = {
  skipBinDemolition: 650,  // per bin
  skipBinSoilSmall: 600,   // per bin (2.5m3)
  skipBinSoilLarge: 850,   // per bin (4m3)
  councilApproval: 1760,
  indemnityInsurance12k: 1200,
  indemnityInsurance25k: 1500,
  delivery: 300,           // Zone 1
  deliveryZone2: 600,
  extraHourlyRate: 76,
  minimumJob: 1000,
};
