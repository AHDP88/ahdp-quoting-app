import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  
  // Basic Info
  projectType: text("project_type").notNull(), // deck, pergola, deck-pergola, carport
  
  // ********** Decking Section **********
  deckingRequired: boolean("decking_required"),
  length: text("length").notNull(),
  width: text("width").notNull(),
  height: text("height").notNull(),
  joistSize: text("joist_size"),
  bearerSize: text("bearer_size"),
  boardSize: text("board_size"),
  customBoardSize: text("custom_board_size"),
  deckingType: text("decking_type"), // Timber, Composite, etc.
  boardType: text("board_type"),
  boardDirection: text("board_direction"),
  subframePainted: boolean("subframe_painted"),
  joistProtectionTape: boolean("joist_protection_tape"),
  
  // Fascia/Screening
  fasciaRequired: boolean("fascia_required"),
  fasciaType: text("fascia_type"),
  fasciaTypeOther: text("fascia_type_other"),
  
  // Fixing & Ground
  fixingType: text("fixing_type"),
  fixingTypeOther: text("fixing_type_other"),
  groundType: text("ground_type"),
  postInstallation: text("post_installation"),
  
  // Dig Out
  digOutRequired: boolean("dig_out_required"),
  digOutSize: text("dig_out_size"),
  
  // Steps/Ramps
  stepRampRequired: boolean("step_ramp_required"),
  numberOfSteps: integer("number_of_steps"),
  stepHeight: text("step_height"),
  stepWidth: text("step_width"),
  stepLength: text("step_length"),
  treadMaterial: text("tread_material"),
  handrailRequired: boolean("handrail_required"),
  handrailType: text("handrail_type"),
  ballustradeType: text("balustrade_type"),
  
  // Deck Lights and Demo
  deckLights: boolean("deck_lights"),
  demolitionRequired: boolean("demolition_required"),
  existingDeckSize: text("existing_deck_size"),
  
  // ********** Verandah Section **********
  verandahRequired: boolean("verandah_required"),
  structureType: text("structure_type"), // Verandah, Pergola, Carport, Other
  materialType: text("material_type"), // Steel, Timber
  structureStyle: text("structure_style"), // Flat, Straight Gable, Intersecting Gable, Split Gable
  
  // Roof details
  roofType: text("roof_type"), // CGI, Poly-Standard, Poly-Premium, etc.
  roofColorUp: text("roof_color_up"),
  roofColorDown: text("roof_color_down"),
  roofSpan: text("roof_span"),
  roofLength: text("roof_length"),
  roofPitch: text("roof_pitch"),
  
  // Frame details
  beamSize: text("beam_size"),
  rafterSize: text("rafter_size"),
  postSize: text("post_size"),
  
  // Gutter details
  gutterType: text("gutter_type"),
  gutterColor: text("gutter_color"),
  
  // Painting
  paintingRequired: text("painting_required"), // Not Required, By Client, By AHDP
  paintColor: text("paint_color"),
  
  // ********** Walls & Screening **********
  screeningRequired: boolean("screening_required"),
  wallType: text("wall_type"), // FC Cladding, Decking, Rendered Blueboard, etc.
  screenMaterial: text("screen_material"), // Merbau, Treated Pine, Hardwood, etc.
  claddingHeight: text("cladding_height"),
  numberOfBays: integer("number_of_bays"),
  paintStainRequired: text("paint_stain_required"), // Yes - By AHDP, Yes - By Client, No
  paintStainColor: text("paint_stain_color"),
  
  // ********** Construction Details **********
  constructionAccess: text("construction_access"),
  subfloorHeight: text("subfloor_height"),
  concreteFootingsRequired: boolean("concrete_footings_required"),
  oversizedPostsRequired: boolean("oversized_posts_required"),
  slabCuttingRequired: boolean("slab_cutting_required"),
  constructionNotes: text("construction_notes"),
  
  // ********** Site Requirements **********
  siteAccess: text("site_access"),
  groundConditions: text("ground_conditions"),
  councilApproval: boolean("council_approval"),
  powerWaterAvailable: boolean("power_water_available"),
  siteNotes: text("site_notes"),
  
  // ********** Extras Section **********
  extrasRequired: boolean("extras_required"),
  binHireRequired: boolean("bin_hire_required"),
  rubbishRemoval: boolean("rubbish_removal"),
  pavingCutRequired: boolean("paving_cut_required"),
  landscapingRetainingRequired: boolean("landscaping_retaining_required"),
  electricalWorkRequired: boolean("electrical_work_required"),
  plumbingWorkRequired: boolean("plumbing_work_required"),
  asbestosRemovalRequired: boolean("asbestos_removal_required"),
  coreDrillingRequired: boolean("core_drilling_required"),
  extraExcavationRequired: boolean("extra_excavation_required"),
  stairHandrailFixRequired: boolean("stair_handrail_fix_required"),
  miscellaneousNotes: text("miscellaneous_notes"),
  
  // Extra trades required
  extraTradesRequired: jsonb("extra_trades_required"),
  extraTradesOther: text("extra_trades_other"),
  
  // Original fields
  materialId: text("material_id").notNull(),
  options: jsonb("options").notNull(),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  siteAddress: text("site_address"),
  notes: text("notes"),
  totalAmount: integer("total_amount"), // Calculated total in cents (ex-GST)
  totalAmountInc: integer("total_amount_inc"), // Calculated total in cents (inc-GST)
  
  // CRM / Workflow automation fields
  quoteReference: text("quote_reference"), // e.g. AHDP-2026-0004
  status: text("status").default("draft"), // draft | sent | approved | declined
  scopeSummaryText: text("scope_summary_text"), // Natural language scope for CRM

  // Quote lifecycle timestamps
  sentAt: timestamp("sent_at"),
  approvedAt: timestamp("approved_at"),
  declinedAt: timestamp("declined_at"),

  // Job handover fields (populated after approval)
  depositPaid: boolean("deposit_paid").default(false),
  depositAmount: integer("deposit_amount"), // in cents — typically 20% of totalAmountInc
  siteInspectionDate: text("site_inspection_date"),
  estimatedStartDate: text("estimated_start_date"),
  assignedTo: text("assigned_to"),     // Estimator / sales rep name
  followUpDate: text("follow_up_date"),
  jobReference: text("job_reference"), // e.g. JOB-2026-0001 — assigned on conversion

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

// ========== PRICING CATALOG (central source of truth) ==========

export const pricingItems = pgTable("pricing_items", {
  id: serial("id").primaryKey(),
  itemCode: text("item_code").unique(), // e.g. "deck.material.merbau.under45"
  name: text("name").notNull(),
  category: text("category").notNull(), // Decking | Verandah | Screening | Electrical | Extras
  subcategory: text("subcategory"),     // Material | Labour | Extra | Electrical
  displayGroup: text("display_group"),  // e.g. "Decking Boards" — for UI grouping
  supplier: text("supplier"),           // e.g. "AHDP", "Sanctuary Outdoor Living"
  unitCost: integer("unit_cost"),       // Supplier cost in cents (optional)
  sellRate: integer("sell_rate").notNull(), // Sell rate used in quotes, in cents
  wasteFactor: integer("waste_factor"), // Waste % as integer (e.g. 10 = 10%)
  unit: text("unit"),                   // m² | LM | each | job | bin
  notes: text("notes"),
  mappingStatus: text("mapping_status"),
  calculationRole: text("calculation_role"),
  tier: text("tier"),
  isActive: boolean("is_active").default(true).notNull(),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by"),
  source: text("source").default("seed"), // seed | manual | import
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPricingItemSchema = createInsertSchema(pricingItems).omit({ id: true, createdAt: true });
export type InsertPricingItem = z.infer<typeof insertPricingItemSchema>;
export type PricingItem = typeof pricingItems.$inferSelect;

// ========== SUPPLIER IMPORTS ==========

export const supplierImports = pgTable("supplier_imports", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  supplierName: text("supplier_name"),
  importedBy: text("imported_by"),
  totalRows: integer("total_rows"),
  matchedRows: integer("matched_rows"),
  updatedRows: integer("updated_rows"),
  unmatchedRows: integer("unmatched_rows"),
  status: text("status").default("pending"), // pending | applied | cancelled
  previewData: jsonb("preview_data"),         // array of preview rows
  columnMapping: jsonb("column_mapping"),     // { itemCode: "SKU", name: "Product", sellRate: "Price" }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  appliedAt: timestamp("applied_at"),
});

export const insertSupplierImportSchema = createInsertSchema(supplierImports).omit({ id: true, createdAt: true });
export type InsertSupplierImport = z.infer<typeof insertSupplierImportSchema>;
export type SupplierImport = typeof supplierImports.$inferSelect;

// ========== PRICING CHANGELOG ==========

export const pricingChangelog = pgTable("pricing_changelog", {
  id: serial("id").primaryKey(),
  itemCode: text("item_code").notNull(),
  itemName: text("item_name"),
  fieldChanged: text("field_changed"), // "sellRate" | "unitCost" | "wasteFactor" | "name" etc.
  oldValue: text("old_value"),
  newValue: text("new_value"),
  changedBy: text("changed_by").default("admin"),
  source: text("source").default("manual"), // manual | import
  importId: integer("import_id"),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

export const insertPricingChangelogSchema = createInsertSchema(pricingChangelog).omit({ id: true });
export type InsertPricingChangelog = z.infer<typeof insertPricingChangelogSchema>;
export type PricingChangelogEntry = typeof pricingChangelog.$inferSelect;

// ========== PRICING TABLES (legacy — materials / addons / labourRates) ==========

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pricePerM2: integer("price_per_m2").notNull(), // Price in cents to avoid floating point issues
  category: text("category"), // e.g., "Hardwood", "Composite", "Timber"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const addons = pgTable("addons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Price in cents
  unitType: text("unit_type").notNull(), // "linear_meter", "m2", "flat"
  category: text("category"), // e.g., "Railings", "Lighting", "Stairs"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const labourRates = pgTable("labour_rates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pricePerUnit: integer("price_per_unit").notNull(), // Price in cents
  unitType: text("unit_type").notNull(), // "m2", "linear_meter", "hour", "flat"
  category: text("category"), // e.g., "Installation", "Assembly", "Finishing"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for pricing
export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  createdAt: true,
});

export const insertAddonSchema = createInsertSchema(addons).omit({
  id: true,
  createdAt: true,
});

export const insertLabourRateSchema = createInsertSchema(labourRates).omit({
  id: true,
  createdAt: true,
});

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type Addon = typeof addons.$inferSelect;
export type InsertAddon = z.infer<typeof insertAddonSchema>;

export type LabourRate = typeof labourRates.$inferSelect;
export type InsertLabourRate = z.infer<typeof insertLabourRateSchema>;
