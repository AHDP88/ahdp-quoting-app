import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import * as XLSX from "xlsx";

// ── SEED DATA — all rates from ahdpPricing.ts converted to pricingItems ──────

const SEED_ITEMS = [
  // === DECKING — MATERIAL RATES (per m²) ===
  { itemCode: "deck.mat.clearPine.under45",     name: "Clear Pine 90mm — Under 45m²",       category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 38000,  unit: "m²" },
  { itemCode: "deck.mat.clearPine.45to65",      name: "Clear Pine 90mm — 45–65m²",          category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 36000,  unit: "m²" },
  { itemCode: "deck.mat.clearPine.over65",      name: "Clear Pine 90mm — Over 65m²",        category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 33500,  unit: "m²" },
  { itemCode: "deck.mat.merbau.under45",        name: "Merbau 90mm — Under 45m²",           category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 43000,  unit: "m²" },
  { itemCode: "deck.mat.merbau.45to65",         name: "Merbau 90mm — 45–65m²",             category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 40000,  unit: "m²" },
  { itemCode: "deck.mat.merbau.over65",         name: "Merbau 90mm — Over 65m²",           category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 37000,  unit: "m²" },
  { itemCode: "deck.mat.spottedGum.under45",    name: "Spotted Gum 90mm — Under 45m²",     category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 47000,  unit: "m²" },
  { itemCode: "deck.mat.spottedGum.45to65",     name: "Spotted Gum 90mm — 45–65m²",       category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 44000,  unit: "m²" },
  { itemCode: "deck.mat.spottedGum.over65",     name: "Spotted Gum 90mm — Over 65m²",     category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 42000,  unit: "m²" },
  { itemCode: "deck.mat.blackbutt.under45",     name: "Blackbutt 90mm — Under 45m²",       category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 50000,  unit: "m²" },
  { itemCode: "deck.mat.blackbutt.45to65",      name: "Blackbutt 90mm — 45–65m²",         category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 47000,  unit: "m²" },
  { itemCode: "deck.mat.blackbutt.over65",      name: "Blackbutt 90mm — Over 65m²",       category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 45000,  unit: "m²" },
  { itemCode: "deck.mat.modwood.under45",       name: "Modwood 88mm — Under 45m²",         category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 49000, unit: "m²" },
  { itemCode: "deck.mat.modwood.45to65",        name: "Modwood 88mm — 45–65m²",           category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 47000, unit: "m²" },
  { itemCode: "deck.mat.modwood.over65",        name: "Modwood 88mm — Over 65m²",         category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 45000, unit: "m²" },
  { itemCode: "deck.mat.evalast.under45",       name: "Evalast 140mm — Under 45m²",        category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Evalast", sellRate: 49000, unit: "m²" },
  { itemCode: "deck.mat.evalast.over65",        name: "Evalast 140mm — Over 65m²",        category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Evalast", sellRate: 45000, unit: "m²" },
  { itemCode: "deck.mat.modwoodFlame.under45",  name: "Modwood Flame Shield — Under 45m²", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 62500, unit: "m²" },
  { itemCode: "deck.mat.modwoodFlame.over65",   name: "Modwood Flame Shield — Over 65m²", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 58500, unit: "m²" },
  { itemCode: "deck.mat.inex.under45",          name: "INEX Cement Sheeting — Under 45m²", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "INEX", sellRate: 33000,   unit: "m²" },
  { itemCode: "deck.mat.inex.over65",           name: "INEX Cement Sheeting — Over 65m²", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "INEX", sellRate: 27000,   unit: "m²" },
  // === DECKING — LABOUR RATES (per m²) ===
  { itemCode: "deck.labour.carpenter.pine",     name: "Carpenter — Clear Pine deck",        category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour",   supplier: "AHDP", sellRate: 7000,  unit: "m²" },
  { itemCode: "deck.labour.carpenter.merbau",   name: "Carpenter — Merbau/Hardwood deck",  category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour",   supplier: "AHDP", sellRate: 8500,  unit: "m²" },
  { itemCode: "deck.labour.carpenter.evalast",  name: "Carpenter — Evalast deck",          category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour",   supplier: "AHDP", sellRate: 9500,  unit: "m²" },
  { itemCode: "deck.labour.carpenter.inex",     name: "Carpenter — INEX/Replace Boards",   category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour",   supplier: "AHDP", sellRate: 5400,  unit: "m²" },
  { itemCode: "deck.labour.oilStain",           name: "Painter — Deck oil/stain",           category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour",   supplier: "AHDP", sellRate: 3600,  unit: "m²" },
  { itemCode: "deck.labour.stairs",             name: "Carpenter — Steps/Ramp",             category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour",   supplier: "AHDP", sellRate: 18000, unit: "m²" },
  // === DECKING — EXTRAS ===
  { itemCode: "deck.extra.height600",       name: "Height surcharge >600mm",          category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 1500,  unit: "m²" },
  { itemCode: "deck.extra.height1200",      name: "Height surcharge >1200mm",         category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 3000,  unit: "m²" },
  { itemCode: "deck.extra.demo",            name: "Demolition — existing deck",        category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 2000,  unit: "m²" },
  { itemCode: "deck.extra.dingo",           name: "Dingo dig to 300mm",               category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 2200,  unit: "m²" },
  { itemCode: "deck.extra.soilBin",         name: "Soil bin hire",                    category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 60000, unit: "bin" },
  { itemCode: "deck.extra.handrailMerbau",  name: "Handrail — Merbau",                category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 7000,  unit: "LM" },
  { itemCode: "deck.extra.handrailSpGum",   name: "Handrail — Spotted Gum",           category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 11500, unit: "LM" },
  { itemCode: "deck.extra.balustSS",        name: "Balustrade — Stainless Steel wire", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 23000, unit: "LM" },
  { itemCode: "deck.extra.balustTimber",    name: "Balustrade — Timber",              category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 24000, unit: "LM" },
  // === VERANDAH — TIMBER (per m²) ===
  { itemCode: "ver.timber.cgiFlatStd.under40",   name: "Timber Verandah — CGI Flat Std — Under 40m²",   category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 32500, unit: "m²" },
  { itemCode: "ver.timber.cgiFlatStd.40to65",    name: "Timber Verandah — CGI Flat Std — 40–65m²",     category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 30000, unit: "m²" },
  { itemCode: "ver.timber.cgiFlatStd.over65",    name: "Timber Verandah — CGI Flat Std — Over 65m²",   category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 27000, unit: "m²" },
  { itemCode: "ver.timber.straightGable.under40", name: "Timber Verandah — Straight Gable — Under 40m²", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 39000, unit: "m²" },
  { itemCode: "ver.timber.straightGable.over65",  name: "Timber Verandah — Straight Gable — Over 65m²", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 31500, unit: "m²" },
  { itemCode: "ver.timber.flatSolarspan.under40", name: "Timber Verandah — Solarspan Flat — Under 40m²", category: "Verandah", subcategory: "Material", displayGroup: "Insulated Roof", supplier: "Solarspan", sellRate: 69000, unit: "m²" },
  { itemCode: "ver.timber.flatSolarspan.over65",  name: "Timber Verandah — Solarspan Flat — Over 65m²", category: "Verandah", subcategory: "Material", displayGroup: "Insulated Roof", supplier: "Solarspan", sellRate: 47000, unit: "m²" },
  { itemCode: "ver.timber.allMerbauFrame.under40", name: "Timber Verandah — All Merbau Frame — Under 40m²", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 78500, unit: "m²" },
  { itemCode: "ver.timber.allMerbauFrame.over65",  name: "Timber Verandah — All Merbau Frame — Over 65m²", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 66500, unit: "m²" },
  // === VERANDAH — LABOUR (per m²) ===
  { itemCode: "ver.labour.carpenter.r1",   name: "Carpenter Rating 1 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 3400,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r2",   name: "Carpenter Rating 2 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 4600,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r3",   name: "Carpenter Rating 3 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 5800,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r4",   name: "Carpenter Rating 4 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 6600,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r5",   name: "Carpenter Rating 5 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 7500,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r6",   name: "Carpenter Rating 6 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 8000,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r7",   name: "Carpenter Rating 7 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 9000,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r8",   name: "Carpenter Rating 8 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 9500,  unit: "m²" },
  { itemCode: "ver.labour.carpenter.r9",   name: "Carpenter Rating 9 — Verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 10800, unit: "m²" },
  { itemCode: "ver.labour.painter.1col",   name: "Painter — 1 colour (verandah)",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 3900,  unit: "m²" },
  { itemCode: "ver.labour.painter.2col",   name: "Painter — 2 colours (verandah)", category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 4300,  unit: "m²" },
  { itemCode: "ver.labour.demo",           name: "Demolition — existing verandah",  category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 2000,  unit: "m²" },
  // === VERANDAH — STEEL (per m²) ===
  { itemCode: "ver.steel.sanctuary.under24",   name: "Steel Sanctuary — Under 24m²",   category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 19000, unit: "m²" },
  { itemCode: "ver.steel.sanctuary.24to40",    name: "Steel Sanctuary — 24–40m²",     category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 17000, unit: "m²" },
  { itemCode: "ver.steel.sanctuary.40to65",    name: "Steel Sanctuary — 40–65m²",     category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 16000, unit: "m²" },
  { itemCode: "ver.steel.sanctuary.over65",    name: "Steel Sanctuary — Over 65m²",   category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 15000, unit: "m²" },
  { itemCode: "ver.steel.labour.flat",         name: "Steel Verandah — Carpenter flat",  category: "Verandah", subcategory: "Labour", displayGroup: "Steel Roof", supplier: "AHDP", sellRate: 4200, unit: "m²" },
  { itemCode: "ver.steel.labour.gable",        name: "Steel Verandah — Carpenter gable", category: "Verandah", subcategory: "Labour", displayGroup: "Steel Roof", supplier: "AHDP", sellRate: 6800, unit: "m²" },
  // === VERANDAH — EXTRAS ===
  { itemCode: "ver.extra.ceiling.flat",        name: "Ceiling lining — Flat",           category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 20500, unit: "m²" },
  { itemCode: "ver.extra.ceiling.raked",       name: "Ceiling lining — Raked",          category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 17500, unit: "m²" },
  { itemCode: "ver.extra.ceiling.bulkhead",    name: "Ceiling lining — Bulkhead",       category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 52000, unit: "m²" },
  { itemCode: "ver.extra.flushing",            name: "Roof flushing",                   category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 5400,  unit: "m²", notes: "Minimum $500" },
  { itemCode: "ver.extra.gableInfillSlats",    name: "Gable infill — Timber slats",     category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 15000, unit: "end" },
  { itemCode: "ver.extra.gableInfillSolid",    name: "Gable infill — Solid",            category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 30000, unit: "end" },
  // === SCREENING (per m²) ===
  { itemCode: "screen.mat.merbauH.single",     name: "Merbau Horizontal — Single-sided", category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 32500, unit: "m²" },
  { itemCode: "screen.mat.merbauH.double",     name: "Merbau Horizontal — Double-sided", category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 50000, unit: "m²" },
  { itemCode: "screen.mat.treatedPine.single", name: "Treated Pine — Single-sided",      category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 28500, unit: "m²" },
  { itemCode: "screen.mat.treatedPine.double", name: "Treated Pine — Double-sided",      category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 39500, unit: "m²" },
  { itemCode: "screen.mat.fc.single",          name: "FC/CFC Sheeting — Single-sided",   category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "James Hardie", sellRate: 20500, unit: "m²" },
  { itemCode: "screen.mat.colorbond.single",   name: "Colorbond — Single-sided",         category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "Bluescope", sellRate: 20500, unit: "m²" },
  { itemCode: "screen.mat.aluminium.single",   name: "Aluminium Slatting — Single",      category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 30000, unit: "m²" },
  { itemCode: "screen.labour.single",          name: "Carpenter — Screen single-sided",  category: "Screening", subcategory: "Labour", displayGroup: "Screening Labour", supplier: "AHDP", sellRate: 5000, unit: "m²" },
  { itemCode: "screen.labour.double",          name: "Carpenter — Screen double-sided",  category: "Screening", subcategory: "Labour", displayGroup: "Screening Labour", supplier: "AHDP", sellRate: 5600, unit: "m²" },
  { itemCode: "screen.labour.paint.timber",    name: "Painter — Timber screen per side", category: "Screening", subcategory: "Labour", displayGroup: "Screening Labour", supplier: "AHDP", sellRate: 3900, unit: "m²" },
  { itemCode: "screen.labour.paint.fc",        name: "Painter — FC/Hardie screen",       category: "Screening", subcategory: "Labour", displayGroup: "Screening Labour", supplier: "AHDP", sellRate: 2700, unit: "m²" },
  // === ELECTRICAL (each) ===
  { itemCode: "elec.fan.baysiLagoon132",   name: "Ceiling Fan — Bayside Lagoon 132cm",           category: "Electrical", subcategory: "Material", displayGroup: "Ceiling Fans", supplier: "Beacon Lighting", sellRate: 36500,  unit: "each" },
  { itemCode: "elec.fan.whitehaven142",    name: "Ceiling Fan — Whitehaven 142cm",               category: "Electrical", subcategory: "Material", displayGroup: "Ceiling Fans", supplier: "Beacon Lighting", sellRate: 49000,  unit: "each" },
  { itemCode: "elec.fan.atlanta142",       name: "Ceiling Fan+Light — Atlanta 142cm 7 Blade",    category: "Electrical", subcategory: "Material", displayGroup: "Ceiling Fans", supplier: "Beacon Lighting", sellRate: 73800,  unit: "each" },
  { itemCode: "elec.fan.labour",           name: "Electrician — Fan installation",               category: "Electrical", subcategory: "Labour",   displayGroup: "Ceiling Fans", supplier: "AHDP", sellRate: 50000,  unit: "each" },
  { itemCode: "elec.light.downlightTri",   name: "Downlight — Tri-colour",                       category: "Electrical", subcategory: "Material", displayGroup: "Lighting",     supplier: "Beacon Lighting", sellRate: 5200,   unit: "each" },
  { itemCode: "elec.light.downlightIns",   name: "Downlight — Insulated Panel Std",              category: "Electrical", subcategory: "Material", displayGroup: "Lighting",     supplier: "Beacon Lighting", sellRate: 12000,  unit: "each" },
  { itemCode: "elec.light.labour",         name: "Electrician — Light installation",             category: "Electrical", subcategory: "Labour",   displayGroup: "Lighting",     supplier: "AHDP", sellRate: 16500,  unit: "each" },
  { itemCode: "elec.heater.2400W",         name: "Radiant Heater — 2400W",                       category: "Electrical", subcategory: "Material", displayGroup: "Heaters",      supplier: "Beacon Lighting", sellRate: 60500,  unit: "each" },
  { itemCode: "elec.heater.3000W",         name: "Radiant Heater — 3000W",                       category: "Electrical", subcategory: "Material", displayGroup: "Heaters",      supplier: "Beacon Lighting", sellRate: 65500,  unit: "each" },
  { itemCode: "elec.heater.labour",        name: "Electrician — Heater installation",            category: "Electrical", subcategory: "Labour",   displayGroup: "Heaters",      supplier: "AHDP", sellRate: 49500,  unit: "each" },
  { itemCode: "elec.gpo.supply",           name: "Twin Exterior GPO — supply",                   category: "Electrical", subcategory: "Material", displayGroup: "Power Points", supplier: "AHDP", sellRate: 5000,   unit: "each" },
  { itemCode: "elec.gpo.labour",           name: "Electrician — GPO installation",               category: "Electrical", subcategory: "Labour",   displayGroup: "Power Points", supplier: "AHDP", sellRate: 29800,  unit: "each" },
  { itemCode: "elec.deckLight.warmWhite",  name: "Deck light 30mm — Warm White",                 category: "Electrical", subcategory: "Material", displayGroup: "Deck Lights",  supplier: "AHDP", sellRate: 6400,   unit: "each" },
  { itemCode: "elec.deckLight.labour",     name: "Electrician — Deck light installation",        category: "Electrical", subcategory: "Labour",   displayGroup: "Deck Lights",  supplier: "AHDP", sellRate: 5000,   unit: "each" },
  // === EXTRAS ===
  { itemCode: "extras.skipBin.demo",       name: "Skip bin hire — Demolition",    category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 65000,  unit: "bin" },
  { itemCode: "extras.skipBin.soil.sm",    name: "Skip bin hire — Soil 2.5m³",   category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 60000,  unit: "bin" },
  { itemCode: "extras.skipBin.soil.lg",    name: "Skip bin hire — Soil 4m³",     category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 85000,  unit: "bin" },
  { itemCode: "extras.council",            name: "Council DA/CDC approval",       category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "Council", sellRate: 176000, unit: "job" },
  { itemCode: "extras.indemnity.12k",      name: "Indemnity insurance — $12k",    category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 120000, unit: "job" },
  { itemCode: "extras.delivery.zone1",     name: "Delivery — Zone 1",             category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 30000,  unit: "job" },
  { itemCode: "extras.hourlyRate",         name: "Hourly rate — extra work",      category: "Extras", subcategory: "Labour", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 7600,  unit: "hour" },
  { itemCode: "extras.minimumJob",         name: "Minimum job charge",            category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 100000, unit: "job" },
];

// Helper: auto-detect column mapping from CSV headers
function detectColumnMapping(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  const h = headers.map(h => h.toLowerCase().trim());
  const find = (candidates: string[]) => headers[h.findIndex(x => candidates.some(c => x.includes(c)))] ?? "";

  map.itemCode   = find(["code", "sku", "item code", "itemcode", "product code"]);
  map.name       = find(["name", "description", "product name", "item name", "product"]);
  map.sellRate   = find(["sell", "sell rate", "sell price", "price", "rate", "cost", "amount"]);
  map.unitCost   = find(["unit cost", "cost price", "supplier cost", "buy"]);
  map.unit       = find(["unit", "uom", "unit of"]);
  map.supplier   = find(["supplier", "vendor", "brand"]);
  map.category   = find(["category", "type", "section"]);
  map.notes      = find(["notes", "comments", "remarks"]);
  return map;
}

export function registerSettingsRoutes(app: Express) {

  // ── PRICING CATALOG ──────────────────────────────────────────────────────────

  app.get("/api/settings/pricing", async (req, res) => {
    try {
      const { search, category, supplier, active } = req.query;
      const items = await storage.getAllPricingItems({
        search: search as string | undefined,
        category: category as string | undefined,
        supplier: supplier as string | undefined,
        isActive: active === "true" ? true : active === "false" ? false : undefined,
      });
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: "Failed to load pricing items" });
    }
  });

  app.post("/api/settings/pricing", async (req, res) => {
    try {
      const item = req.body;
      if (!item.name || !item.category || item.sellRate === undefined) {
        return res.status(400).json({ message: "name, category, and sellRate are required" });
      }
      const created = await storage.createPricingItem({
        ...item,
        sellRate: Math.round(Number(item.sellRate) * 100),
        unitCost: item.unitCost ? Math.round(Number(item.unitCost) * 100) : undefined,
        source: "manual",
        updatedBy: "admin",
        lastUpdatedAt: new Date(),
      });
      await storage.addChangelogEntry({ itemCode: created.itemCode ?? String(created.id), itemName: created.name, fieldChanged: "created", oldValue: null, newValue: String(created.sellRate), source: "manual" });
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ message: "Failed to create pricing item" });
    }
  });

  app.patch("/api/settings/pricing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const existing = await storage.getPricingItem(id);
      if (!existing) return res.status(404).json({ message: "Item not found" });

      const updates: Record<string, unknown> = { ...req.body, source: "manual", updatedBy: "admin" };
      if (updates.sellRate !== undefined) updates.sellRate = Math.round(Number(updates.sellRate) * 100);
      if (updates.unitCost !== undefined) updates.unitCost = Math.round(Number(updates.unitCost) * 100);

      const updated = await storage.updatePricingItem(id, updates as any);

      // Log changes
      for (const field of ["sellRate", "unitCost", "name", "notes", "wasteFactor"] as const) {
        const oldVal = existing[field];
        const newVal = updated?.[field];
        if (oldVal !== newVal && newVal !== undefined) {
          await storage.addChangelogEntry({
            itemCode: existing.itemCode ?? String(id),
            itemName: existing.name,
            fieldChanged: field,
            oldValue: String(oldVal ?? ""),
            newValue: String(newVal ?? ""),
            source: "manual",
          });
        }
      }

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update pricing item" });
    }
  });

  app.delete("/api/settings/pricing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const deleted = await storage.deletePricingItem(id);
      if (!deleted) return res.status(404).json({ message: "Item not found" });
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete pricing item" });
    }
  });

  app.get("/api/settings/pricing/meta", async (_req, res) => {
    try {
      const [categories, suppliers, count] = await Promise.all([
        storage.getPricingCategories(),
        storage.getPricingSuppliers(),
        storage.countPricingItems(),
      ]);
      res.json({ categories, suppliers, count });
    } catch (err) {
      res.status(500).json({ message: "Failed to load meta" });
    }
  });

  // Seed — idempotent: only inserts items that don't already exist by itemCode
  app.post("/api/settings/pricing/seed", async (_req, res) => {
    try {
      let inserted = 0;
      let skipped = 0;
      for (const item of SEED_ITEMS) {
        const existing = await storage.getPricingItemByCode(item.itemCode);
        if (existing) { skipped++; continue; }
        await storage.createPricingItem({
          ...item,
          isActive: true,
          source: "seed",
          updatedBy: "system",
          lastUpdatedAt: new Date(),
        });
        inserted++;
      }
      res.json({ inserted, skipped, total: SEED_ITEMS.length });
    } catch (err) {
      res.status(500).json({ message: "Seed failed" });
    }
  });

  // ── SUPPLIER IMPORT ───────────────────────────────────────────────────────────

  // Upload CSV or Excel → parse → store as pending import → return preview
  app.post("/api/settings/pricing/import/upload", async (req, res) => {
    try {
      const { filename, contentBase64, supplierName, columnMapping: userMapping } = req.body;
      if (!filename || !contentBase64) return res.status(400).json({ message: "filename and contentBase64 are required" });

      const buf = Buffer.from(contentBase64, "base64");
      const ext = filename.split(".").pop()?.toLowerCase() ?? "";

      let rows: Record<string, string>[] = [];

      if (ext === "csv") {
        const text = buf.toString("utf-8");
        const lines = text.split(/\r?\n/).filter(Boolean);
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
        rows = lines.slice(1).map(line => {
          const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
          const row: Record<string, string> = {};
          headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
          return row;
        });
      } else if (ext === "xlsx" || ext === "xls") {
        const wb = XLSX.read(buf, { type: "buffer" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
      } else {
        return res.status(400).json({ message: "Only CSV and XLSX files are supported" });
      }

      if (rows.length === 0) return res.status(400).json({ message: "File appears to be empty" });

      const headers = Object.keys(rows[0]);
      const autoMapping = detectColumnMapping(headers);
      const mapping = userMapping ?? autoMapping;

      // Preview: match each row against existing pricingItems
      const preview = [];
      let matched = 0; let unmatched = 0;

      for (const row of rows.slice(0, 500)) { // cap at 500 rows for preview
        const itemCode = mapping.itemCode ? row[mapping.itemCode]?.trim() : "";
        const name     = mapping.name     ? row[mapping.name]?.trim()     : "";
        const rateRaw  = mapping.sellRate ? row[mapping.sellRate]?.trim() : "";
        const rateNum  = parseFloat(rateRaw.replace(/[$,]/g, ""));
        const newRate  = isNaN(rateNum) ? null : Math.round(rateNum * 100);

        // Try to match by itemCode first, then by name
        let existing = itemCode ? await storage.getPricingItemByCode(itemCode) : undefined;
        if (!existing && name) {
          const all = await storage.getAllPricingItems({ search: name });
          existing = all.find(i => i.name.toLowerCase() === name.toLowerCase());
        }

        const status = existing ? (newRate !== null && newRate !== existing.sellRate ? "update" : "no-change") : "unmatched";
        if (existing) matched++; else unmatched++;

        preview.push({
          rowIndex: rows.indexOf(row),
          itemCode: itemCode || name,
          name: name || itemCode,
          existingId:  existing?.id ?? null,
          existingName: existing?.name ?? null,
          existingRate: existing?.sellRate ?? null,
          newRate,
          status,
          rawRow: row,
        });
      }

      const importRecord = await storage.createSupplierImport({
        filename,
        supplierName: supplierName ?? null,
        importedBy: "admin",
        totalRows: rows.length,
        matchedRows: matched,
        updatedRows: 0,
        unmatchedRows: unmatched,
        status: "pending",
        previewData: preview as any,
        columnMapping: mapping as any,
      });

      res.json({
        importId: importRecord.id,
        headers,
        detectedMapping: autoMapping,
        columnMapping: mapping,
        preview,
        stats: { total: rows.length, matched, unmatched },
      });
    } catch (err: any) {
      res.status(500).json({ message: `Import failed: ${err.message}` });
    }
  });

  // Apply pending import
  app.post("/api/settings/pricing/import/:id/apply", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid import ID" });

      const importRecord = await storage.getSupplierImport(id);
      if (!importRecord) return res.status(404).json({ message: "Import not found" });
      if (importRecord.status !== "pending") return res.status(400).json({ message: "Import already applied or cancelled" });

      const preview = (importRecord.previewData as any[]) ?? [];
      let updated = 0;
      const { applyRows } = req.body; // optional: array of rowIndexes to apply (if empty, apply all updates)

      for (const row of preview) {
        if (row.status !== "update") continue;
        if (applyRows && !applyRows.includes(row.rowIndex)) continue;
        if (!row.existingId || row.newRate === null) continue;

        const existing = await storage.getPricingItem(row.existingId);
        if (!existing) continue;

        await storage.updatePricingItem(row.existingId, {
          sellRate: row.newRate,
          source: "import",
          updatedBy: `import-${id}`,
        });

        await storage.addChangelogEntry({
          itemCode: existing.itemCode ?? String(existing.id),
          itemName: existing.name,
          fieldChanged: "sellRate",
          oldValue: String(existing.sellRate),
          newValue: String(row.newRate),
          source: "import",
          importId: id,
        });

        updated++;
      }

      await storage.updateSupplierImport(id, { status: "applied", updatedRows: updated, appliedAt: new Date() });

      res.json({ updated, importId: id });
    } catch (err: any) {
      res.status(500).json({ message: `Apply failed: ${err.message}` });
    }
  });

  // Cancel import
  app.post("/api/settings/pricing/import/:id/cancel", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await storage.updateSupplierImport(id, { status: "cancelled" });
      if (!updated) return res.status(404).json({ message: "Import not found" });
      res.json({ message: "Import cancelled" });
    } catch (err) {
      res.status(500).json({ message: "Failed to cancel import" });
    }
  });

  // Import history
  app.get("/api/settings/imports", async (_req, res) => {
    try {
      const imports = await storage.getAllSupplierImports();
      res.json(imports);
    } catch (err) {
      res.status(500).json({ message: "Failed to load import history" });
    }
  });

  // Changelog
  app.get("/api/settings/pricing/changelog", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const entries = await storage.getChangelog(limit);
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: "Failed to load changelog" });
    }
  });
}
