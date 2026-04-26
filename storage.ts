import {
  users,
  type User,
  type InsertUser,
  quotes,
  type Quote,
  type InsertQuote,
  materials,
  type Material,
  type InsertMaterial,
  addons,
  type Addon,
  type InsertAddon,
  labourRates,
  type LabourRate,
  type InsertLabourRate,
  pricingItems,
  type PricingItem,
  type InsertPricingItem,
  supplierImports,
  type SupplierImport,
  type InsertSupplierImport,
  pricingChangelog,
  type PricingChangelogEntry,
  type InsertPricingChangelog,
} from "@shared/schema";
import { db, hasDatabaseUrl } from "./db";
import { eq, desc, ilike, and, or, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quote-related methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: number): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuote(id: number, quote: InsertQuote): Promise<Quote | undefined>;
  patchQuote(id: number, data: Partial<Record<string, unknown>>): Promise<Quote | undefined>;
  deleteQuote(id: number): Promise<boolean>;

  // Material-related methods
  createMaterial(material: InsertMaterial): Promise<Material>;
  getMaterial(id: number): Promise<Material | undefined>;
  getAllMaterials(): Promise<Material[]>;
  getActiveMaterials(): Promise<Material[]>;
  updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material | undefined>;
  deleteMaterial(id: number): Promise<boolean>;

  // Addon-related methods
  createAddon(addon: InsertAddon): Promise<Addon>;
  getAddon(id: number): Promise<Addon | undefined>;
  getAllAddons(): Promise<Addon[]>;
  getActiveAddons(): Promise<Addon[]>;
  updateAddon(id: number, addon: Partial<InsertAddon>): Promise<Addon | undefined>;
  deleteAddon(id: number): Promise<boolean>;

  // Labour rate-related methods
  createLabourRate(rate: InsertLabourRate): Promise<LabourRate>;
  getLabourRate(id: number): Promise<LabourRate | undefined>;
  getAllLabourRates(): Promise<LabourRate[]>;
  getActiveLabourRates(): Promise<LabourRate[]>;
  updateLabourRate(id: number, rate: Partial<InsertLabourRate>): Promise<LabourRate | undefined>;
  deleteLabourRate(id: number): Promise<boolean>;

  // Pricing catalog methods
  getAllPricingItems(filters?: { search?: string; category?: string; supplier?: string; isActive?: boolean }): Promise<PricingItem[]>;
  getPricingItem(id: number): Promise<PricingItem | undefined>;
  getPricingItemByCode(code: string): Promise<PricingItem | undefined>;
  createPricingItem(item: InsertPricingItem): Promise<PricingItem>;
  updatePricingItem(id: number, item: Partial<InsertPricingItem>): Promise<PricingItem | undefined>;
  deletePricingItem(id: number): Promise<boolean>;
  getPricingCategories(): Promise<string[]>;
  getPricingSuppliers(): Promise<string[]>;
  countPricingItems(): Promise<number>;

  // Supplier imports
  createSupplierImport(data: InsertSupplierImport): Promise<SupplierImport>;
  getSupplierImport(id: number): Promise<SupplierImport | undefined>;
  getAllSupplierImports(): Promise<SupplierImport[]>;
  updateSupplierImport(id: number, data: Partial<InsertSupplierImport>): Promise<SupplierImport | undefined>;

  // Pricing changelog
  addChangelogEntry(entry: InsertPricingChangelog): Promise<PricingChangelogEntry>;
  getChangelog(limit?: number): Promise<PricingChangelogEntry[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    // For jsonb fields, ensure the data is properly formatted
    const preparedQuote = {
      ...insertQuote,
      // Ensure all nullable fields are explicitly set to null if undefined
      clientName: insertQuote.clientName || null,
      clientEmail: insertQuote.clientEmail || null,
      clientPhone: insertQuote.clientPhone || null,
      notes: insertQuote.notes || null,
      options: Array.isArray(insertQuote.options) 
        ? insertQuote.options 
        : []
    };
    
    const [quote] = await db
      .insert(quotes)
      .values(preparedQuote)
      .returning();
      
    return quote;
  }
  
  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || undefined;
  }
  
  async getAllQuotes(): Promise<Quote[]> {
    return db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }
  
  async updateQuote(id: number, insertQuote: InsertQuote): Promise<Quote | undefined> {
    const [quote] = await db
      .update(quotes)
      .set(insertQuote)
      .where(eq(quotes.id, id))
      .returning();
    return quote || undefined;
  }
  
  async patchQuote(id: number, data: Partial<Record<string, unknown>>): Promise<Quote | undefined> {
    const [quote] = await db
      .update(quotes)
      .set(data as any)
      .where(eq(quotes.id, id))
      .returning();
    return quote || undefined;
  }

  async deleteQuote(id: number): Promise<boolean> {
    const result = await db
      .delete(quotes)
      .where(eq(quotes.id, id))
      .returning();
    return result.length > 0;
  }

  // ===== MATERIAL METHODS =====
  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const [material] = await db
      .insert(materials)
      .values(insertMaterial)
      .returning();
    return material;
  }

  async getMaterial(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material || undefined;
  }

  async getAllMaterials(): Promise<Material[]> {
    return db.select().from(materials).orderBy(desc(materials.createdAt));
  }

  async getActiveMaterials(): Promise<Material[]> {
    return db
      .select()
      .from(materials)
      .where(eq(materials.isActive, true))
      .orderBy(desc(materials.createdAt));
  }

  async updateMaterial(id: number, insertMaterial: Partial<InsertMaterial>): Promise<Material | undefined> {
    const [material] = await db
      .update(materials)
      .set(insertMaterial)
      .where(eq(materials.id, id))
      .returning();
    return material || undefined;
  }

  async deleteMaterial(id: number): Promise<boolean> {
    const result = await db
      .delete(materials)
      .where(eq(materials.id, id))
      .returning();
    return result.length > 0;
  }

  // ===== ADDON METHODS =====
  async createAddon(insertAddon: InsertAddon): Promise<Addon> {
    const [addon] = await db
      .insert(addons)
      .values(insertAddon)
      .returning();
    return addon;
  }

  async getAddon(id: number): Promise<Addon | undefined> {
    const [addon] = await db.select().from(addons).where(eq(addons.id, id));
    return addon || undefined;
  }

  async getAllAddons(): Promise<Addon[]> {
    return db.select().from(addons).orderBy(desc(addons.createdAt));
  }

  async getActiveAddons(): Promise<Addon[]> {
    return db
      .select()
      .from(addons)
      .where(eq(addons.isActive, true))
      .orderBy(desc(addons.createdAt));
  }

  async updateAddon(id: number, insertAddon: Partial<InsertAddon>): Promise<Addon | undefined> {
    const [addon] = await db
      .update(addons)
      .set(insertAddon)
      .where(eq(addons.id, id))
      .returning();
    return addon || undefined;
  }

  async deleteAddon(id: number): Promise<boolean> {
    const result = await db
      .delete(addons)
      .where(eq(addons.id, id))
      .returning();
    return result.length > 0;
  }

  // ===== LABOUR RATE METHODS =====
  async createLabourRate(insertRate: InsertLabourRate): Promise<LabourRate> {
    const [rate] = await db
      .insert(labourRates)
      .values(insertRate)
      .returning();
    return rate;
  }

  async getLabourRate(id: number): Promise<LabourRate | undefined> {
    const [rate] = await db.select().from(labourRates).where(eq(labourRates.id, id));
    return rate || undefined;
  }

  async getAllLabourRates(): Promise<LabourRate[]> {
    return db.select().from(labourRates).orderBy(desc(labourRates.createdAt));
  }

  async getActiveLabourRates(): Promise<LabourRate[]> {
    return db
      .select()
      .from(labourRates)
      .where(eq(labourRates.isActive, true))
      .orderBy(desc(labourRates.createdAt));
  }

  async updateLabourRate(id: number, insertRate: Partial<InsertLabourRate>): Promise<LabourRate | undefined> {
    const [rate] = await db
      .update(labourRates)
      .set(insertRate)
      .where(eq(labourRates.id, id))
      .returning();
    return rate || undefined;
  }

  async deleteLabourRate(id: number): Promise<boolean> {
    const result = await db
      .delete(labourRates)
      .where(eq(labourRates.id, id))
      .returning();
    return result.length > 0;
  }

  // ===== PRICING CATALOG METHODS =====

  async getAllPricingItems(filters?: { search?: string; category?: string; supplier?: string; isActive?: boolean }): Promise<PricingItem[]> {
    const conditions = [];
    if (filters?.search) {
      conditions.push(or(
        ilike(pricingItems.name, `%${filters.search}%`),
        ilike(pricingItems.itemCode, `%${filters.search}%`),
        ilike(pricingItems.displayGroup, `%${filters.search}%`),
      ));
    }
    if (filters?.category) conditions.push(eq(pricingItems.category, filters.category));
    if (filters?.supplier) conditions.push(eq(pricingItems.supplier, filters.supplier));
    if (filters?.isActive !== undefined) conditions.push(eq(pricingItems.isActive, filters.isActive));
    if (conditions.length > 0) {
      return db.select().from(pricingItems).where(and(...conditions)).orderBy(pricingItems.category, pricingItems.name);
    }
    return db.select().from(pricingItems).orderBy(pricingItems.category, pricingItems.name);
  }

  async getPricingItem(id: number): Promise<PricingItem | undefined> {
    const [item] = await db.select().from(pricingItems).where(eq(pricingItems.id, id));
    return item || undefined;
  }

  async getPricingItemByCode(code: string): Promise<PricingItem | undefined> {
    const [item] = await db.select().from(pricingItems).where(eq(pricingItems.itemCode, code));
    return item || undefined;
  }

  async createPricingItem(item: InsertPricingItem): Promise<PricingItem> {
    const [created] = await db.insert(pricingItems).values(item).returning();
    return created;
  }

  async updatePricingItem(id: number, item: Partial<InsertPricingItem>): Promise<PricingItem | undefined> {
    const [updated] = await db
      .update(pricingItems)
      .set({ ...item, lastUpdatedAt: new Date() })
      .where(eq(pricingItems.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePricingItem(id: number): Promise<boolean> {
    const result = await db.delete(pricingItems).where(eq(pricingItems.id, id)).returning();
    return result.length > 0;
  }

  async getPricingCategories(): Promise<string[]> {
    const rows = await db.selectDistinct({ category: pricingItems.category }).from(pricingItems).orderBy(pricingItems.category);
    return rows.map((r: { category: string | null }) => r.category).filter(Boolean);
  }

  async getPricingSuppliers(): Promise<string[]> {
    const rows = await db.selectDistinct({ supplier: pricingItems.supplier }).from(pricingItems).orderBy(pricingItems.supplier);
    return rows.map((r: { supplier: string | null }) => r.supplier).filter(Boolean) as string[];
  }

  async countPricingItems(): Promise<number> {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(pricingItems);
    return Number(row?.count ?? 0);
  }

  // ===== SUPPLIER IMPORTS =====

  async createSupplierImport(data: InsertSupplierImport): Promise<SupplierImport> {
    const [created] = await db.insert(supplierImports).values(data).returning();
    return created;
  }

  async getSupplierImport(id: number): Promise<SupplierImport | undefined> {
    const [item] = await db.select().from(supplierImports).where(eq(supplierImports.id, id));
    return item || undefined;
  }

  async getAllSupplierImports(): Promise<SupplierImport[]> {
    return db.select().from(supplierImports).orderBy(desc(supplierImports.createdAt));
  }

  async updateSupplierImport(id: number, data: Partial<InsertSupplierImport>): Promise<SupplierImport | undefined> {
    const [updated] = await db.update(supplierImports).set(data as any).where(eq(supplierImports.id, id)).returning();
    return updated || undefined;
  }

  // ===== PRICING CHANGELOG =====

  async addChangelogEntry(entry: InsertPricingChangelog): Promise<PricingChangelogEntry> {
    const [created] = await db.insert(pricingChangelog).values(entry).returning();
    return created;
  }

  async getChangelog(limit = 100): Promise<PricingChangelogEntry[]> {
    return db.select().from(pricingChangelog).orderBy(desc(pricingChangelog.changedAt)).limit(limit);
  }
}

const LOCAL_PRICING_ITEMS: InsertPricingItem[] = [
  { itemCode: "deck.mat.clearPine.under45", name: "Clear Pine 90mm - Under 45m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 38000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.clearPine.45to65", name: "Clear Pine 90mm - 45-65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 36000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.clearPine.over65", name: "Clear Pine 90mm - Over 65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 33500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.merbau.under45", name: "Merbau 90mm - Under 45m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 43000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.merbau.45to65", name: "Merbau 90mm - 45-65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 40000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.merbau.over65", name: "Merbau 90mm - Over 65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 37000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.spottedGum.under45", name: "Spotted Gum 90mm - Under 45m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 47000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.spottedGum.45to65", name: "Spotted Gum 90mm - 45-65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 44000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.spottedGum.over65", name: "Spotted Gum 90mm - Over 65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 42000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.blackbutt.under45", name: "Blackbutt 90mm - Under 45m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 50000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.blackbutt.45to65", name: "Blackbutt 90mm - 45-65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 47000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.blackbutt.over65", name: "Blackbutt 90mm - Over 65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "AHDP", sellRate: 45000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.modwood.under45", name: "Modwood 88mm - Under 45m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 49000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.modwood.45to65", name: "Modwood 88mm - 45-65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 47000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.modwood.over65", name: "Modwood 88mm - Over 65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Modwood", sellRate: 45000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.evalast.under45", name: "Evalast 140mm - Under 45m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Evalast", sellRate: 49000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.evalast.45to65", name: "Evalast 140mm - 45-65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Evalast", sellRate: 47000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.evalast.over65", name: "Evalast 140mm - Over 65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "Evalast", sellRate: 45000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.inex.under45", name: "INEX Cement Sheeting - Under 45m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "INEX", sellRate: 33000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.inex.45to65", name: "INEX Cement Sheeting - 45-65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "INEX", sellRate: 30000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.mat.inex.over65", name: "INEX Cement Sheeting - Over 65m2", category: "Decking", subcategory: "Material", displayGroup: "Decking Boards", supplier: "INEX", sellRate: 27000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.labour.carpenter.pine", name: "Carpenter - Clear Pine deck", category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour", supplier: "AHDP", sellRate: 7000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.labour.carpenter.merbau", name: "Carpenter - Merbau/Hardwood deck", category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour", supplier: "AHDP", sellRate: 8500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.labour.carpenter.evalast", name: "Carpenter - Evalast deck", category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour", supplier: "AHDP", sellRate: 9500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.labour.carpenter.inex", name: "Carpenter - INEX/Replace Boards", category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour", supplier: "AHDP", sellRate: 5400, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.labour.oilStain", name: "Painter - Deck oil/stain", category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour", supplier: "AHDP", sellRate: 3600, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.labour.stairs", name: "Carpenter - Steps/Ramp", category: "Decking", subcategory: "Labour", displayGroup: "Deck Labour", supplier: "AHDP", sellRate: 18000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.height600", name: "Height surcharge >600mm", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 1500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.height1200", name: "Height surcharge >1200mm", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 3000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.demo", name: "Demolition - existing deck", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 2000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.dingo", name: "Dingo dig to 300mm", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 2200, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.soilBin", name: "Soil bin hire", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 60000, unit: "bin", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.handrailMerbau", name: "Handrail - Merbau", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 7000, unit: "LM", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.handrailSpGum", name: "Handrail - Spotted Gum", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 11500, unit: "LM", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.balustSS", name: "Balustrade - Stainless Steel wire", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 23000, unit: "LM", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "deck.extra.balustTimber", name: "Balustrade - Timber", category: "Decking", subcategory: "Extra", displayGroup: "Deck Extras", supplier: "AHDP", sellRate: 24000, unit: "LM", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.cgiFlatStd.under40", name: "Timber Verandah - CGI Flat Std - Under 40m2", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 32500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.cgiFlatStd.40to65", name: "Timber Verandah - CGI Flat Std - 40-65m2", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 30000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.cgiFlatStd.over65", name: "Timber Verandah - CGI Flat Std - Over 65m2", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 27000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.straightGable.under40", name: "Timber Verandah - Straight Gable - Under 40m2", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 39000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.straightGable.40to65", name: "Timber Verandah - Straight Gable - 40-65m2", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 35000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.straightGable.over65", name: "Timber Verandah - Straight Gable - Over 65m2", category: "Verandah", subcategory: "Material", displayGroup: "Timber Roof", supplier: "AHDP", sellRate: 31500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.flatSolarspan.under40", name: "Timber Verandah - Solarspan Flat - Under 40m2", category: "Verandah", subcategory: "Material", displayGroup: "Insulated Roof", supplier: "Solarspan", sellRate: 69000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.flatSolarspan.40to65", name: "Timber Verandah - Solarspan Flat - 40-65m2", category: "Verandah", subcategory: "Material", displayGroup: "Insulated Roof", supplier: "Solarspan", sellRate: 58000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.timber.flatSolarspan.over65", name: "Timber Verandah - Solarspan Flat - Over 65m2", category: "Verandah", subcategory: "Material", displayGroup: "Insulated Roof", supplier: "Solarspan", sellRate: 47000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  ...Array.from({ length: 9 }, (_, i) => ({ itemCode: `ver.labour.carpenter.r${i + 1}`, name: `Carpenter Rating ${i + 1} - Verandah`, category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: [3400, 4600, 5800, 6600, 7500, 8000, 9000, 9500, 10800][i], unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() })),
  { itemCode: "ver.labour.painter.2col", name: "Painter - 2 colours (verandah)", category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 4300, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.labour.demo", name: "Demolition - existing verandah", category: "Verandah", subcategory: "Labour", displayGroup: "Verandah Labour", supplier: "AHDP", sellRate: 2000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.steel.sanctuary.under24", name: "Steel Sanctuary - Under 24m2", category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 19000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.steel.sanctuary.24to40", name: "Steel Sanctuary - 24-40m2", category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 17000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.steel.sanctuary.40to65", name: "Steel Sanctuary - 40-65m2", category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 16000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.steel.sanctuary.over65", name: "Steel Sanctuary - Over 65m2", category: "Verandah", subcategory: "Material", displayGroup: "Steel Roof", supplier: "Sanctuary Outdoor Living", sellRate: 15000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.steel.labour.flat", name: "Steel Verandah - Carpenter flat", category: "Verandah", subcategory: "Labour", displayGroup: "Steel Roof", supplier: "AHDP", sellRate: 4200, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.steel.labour.gable", name: "Steel Verandah - Carpenter gable", category: "Verandah", subcategory: "Labour", displayGroup: "Steel Roof", supplier: "AHDP", sellRate: 6800, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.extra.ceiling.flat", name: "Ceiling lining - Flat", category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 20500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.extra.ceiling.raked", name: "Ceiling lining - Raked", category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 17500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.extra.ceiling.bulkhead", name: "Ceiling lining - Bulkhead", category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 52000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.extra.flushing", name: "Roof flushing", category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 5400, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.extra.gableInfillSlats", name: "Gable infill - Timber slats", category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 15000, unit: "end", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "ver.extra.gableInfillSolid", name: "Gable infill - Solid", category: "Verandah", subcategory: "Extra", displayGroup: "Verandah Extras", supplier: "AHDP", sellRate: 30000, unit: "end", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.mat.merbauH.single", name: "Merbau Horizontal - Single-sided", category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 32500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.mat.treatedPine.single", name: "Treated Pine - Single-sided", category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 28500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.mat.fc.single", name: "FC/CFC Sheeting - Single-sided", category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "James Hardie", sellRate: 20500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.mat.colorbond.single", name: "Colorbond - Single-sided", category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "Bluescope", sellRate: 20500, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.mat.aluminium.single", name: "Aluminium Slatting - Single", category: "Screening", subcategory: "Material", displayGroup: "Screening Materials", supplier: "AHDP", sellRate: 30000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.labour.single", name: "Carpenter - Screen single-sided", category: "Screening", subcategory: "Labour", displayGroup: "Screening Labour", supplier: "AHDP", sellRate: 5000, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.labour.paint.timber", name: "Painter - Timber screen per side", category: "Screening", subcategory: "Labour", displayGroup: "Screening Labour", supplier: "AHDP", sellRate: 3900, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "screen.labour.paint.fc", name: "Painter - FC/Hardie screen", category: "Screening", subcategory: "Labour", displayGroup: "Screening Labour", supplier: "AHDP", sellRate: 2700, unit: "m2", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.fan.baysiLagoon132", name: "Ceiling Fan - Bayside Lagoon 132cm", category: "Electrical", subcategory: "Material", displayGroup: "Ceiling Fans", supplier: "Beacon Lighting", sellRate: 36500, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.fan.labour", name: "Electrician - Fan installation", category: "Electrical", subcategory: "Labour", displayGroup: "Ceiling Fans", supplier: "AHDP", sellRate: 50000, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.light.downlightTri", name: "Downlight - Tri-colour", category: "Electrical", subcategory: "Material", displayGroup: "Lighting", supplier: "Beacon Lighting", sellRate: 5200, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.light.labour", name: "Electrician - Light installation", category: "Electrical", subcategory: "Labour", displayGroup: "Lighting", supplier: "AHDP", sellRate: 16500, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.heater.2400W", name: "Radiant Heater - 2400W", category: "Electrical", subcategory: "Material", displayGroup: "Heaters", supplier: "Beacon Lighting", sellRate: 60500, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.heater.labour", name: "Electrician - Heater installation", category: "Electrical", subcategory: "Labour", displayGroup: "Heaters", supplier: "AHDP", sellRate: 49500, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.gpo.supply", name: "Twin Exterior GPO - supply", category: "Electrical", subcategory: "Material", displayGroup: "Power Points", supplier: "AHDP", sellRate: 5000, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.gpo.labour", name: "Electrician - GPO installation", category: "Electrical", subcategory: "Labour", displayGroup: "Power Points", supplier: "AHDP", sellRate: 29800, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.deckLight.warmWhite", name: "Deck light 30mm - Warm White", category: "Electrical", subcategory: "Material", displayGroup: "Deck Lights", supplier: "AHDP", sellRate: 6400, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "elec.deckLight.labour", name: "Electrician - Deck light installation", category: "Electrical", subcategory: "Labour", displayGroup: "Deck Lights", supplier: "AHDP", sellRate: 5000, unit: "each", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "extras.skipBin.demo", name: "Skip bin hire - Demolition", category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "AHDP", sellRate: 65000, unit: "bin", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
  { itemCode: "extras.council", name: "Council DA/CDC approval", category: "Extras", subcategory: "Extra", displayGroup: "Extras & Misc", supplier: "Council", sellRate: 176000, unit: "job", isActive: true, source: "seed", updatedBy: "system", lastUpdatedAt: new Date() },
];

class MemoryStorage implements IStorage {
  private users: User[] = [];
  private quotes: Quote[] = [];
  private materials: Material[] = [];
  private addons: Addon[] = [];
  private labourRates: LabourRate[] = [];
  private pricingItems: PricingItem[] = [];
  private supplierImports: SupplierImport[] = [];
  private changelog: PricingChangelogEntry[] = [];
  private ids = { users: 1, quotes: 1, materials: 1, addons: 1, labourRates: 1, pricingItems: 1, supplierImports: 1, changelog: 1 };

  constructor() {
    for (const item of LOCAL_PRICING_ITEMS) this.createPricingItemSync(item);
  }

  private createPricingItemSync(item: InsertPricingItem): PricingItem {
    const now = new Date();
    const created = {
      unitCost: null,
      wasteFactor: null,
      notes: null,
      isActive: true,
      source: "seed",
      createdAt: now,
      lastUpdatedAt: now,
      ...item,
      id: this.ids.pricingItems++,
    } as PricingItem;
    this.pricingItems.push(created);
    return created;
  }

  private sortNewest<T extends { createdAt: Date }>(items: T[]): T[] {
    return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUser(id: number) { return this.users.find(user => user.id === id); }
  async getUserByUsername(username: string) { return this.users.find(user => user.username === username); }
  async createUser(user: InsertUser) {
    const created = { ...user, id: this.ids.users++ } as User;
    this.users.push(created);
    return created;
  }

  async createQuote(quote: InsertQuote) {
    const created = {
      ...quote,
      id: this.ids.quotes++,
      options: Array.isArray(quote.options) ? quote.options : [],
      clientName: quote.clientName || null,
      clientEmail: quote.clientEmail || null,
      clientPhone: quote.clientPhone || null,
      notes: quote.notes || null,
      status: quote.status ?? "draft",
      depositPaid: quote.depositPaid ?? false,
      createdAt: new Date(),
    } as Quote;
    this.quotes.push(created);
    return created;
  }
  async getQuote(id: number) { return this.quotes.find(quote => quote.id === id); }
  async getAllQuotes() { return this.sortNewest(this.quotes); }
  async updateQuote(id: number, quote: InsertQuote) {
    const existing = await this.getQuote(id);
    if (!existing) return undefined;
    Object.assign(existing, quote);
    return existing;
  }
  async patchQuote(id: number, data: Partial<Record<string, unknown>>) {
    const existing = await this.getQuote(id);
    if (!existing) return undefined;
    Object.assign(existing, data);
    return existing;
  }
  async deleteQuote(id: number) {
    const before = this.quotes.length;
    this.quotes = this.quotes.filter(quote => quote.id !== id);
    return this.quotes.length !== before;
  }

  async createMaterial(material: InsertMaterial) {
    const created = { ...material, id: this.ids.materials++, isActive: material.isActive ?? true, createdAt: new Date() } as Material;
    this.materials.push(created);
    return created;
  }
  async getMaterial(id: number) { return this.materials.find(item => item.id === id); }
  async getAllMaterials() { return this.sortNewest(this.materials); }
  async getActiveMaterials() { return this.sortNewest(this.materials.filter(item => item.isActive)); }
  async updateMaterial(id: number, material: Partial<InsertMaterial>) {
    const existing = await this.getMaterial(id);
    if (!existing) return undefined;
    Object.assign(existing, material);
    return existing;
  }
  async deleteMaterial(id: number) {
    const before = this.materials.length;
    this.materials = this.materials.filter(item => item.id !== id);
    return this.materials.length !== before;
  }

  async createAddon(addon: InsertAddon) {
    const created = { ...addon, id: this.ids.addons++, isActive: addon.isActive ?? true, createdAt: new Date() } as Addon;
    this.addons.push(created);
    return created;
  }
  async getAddon(id: number) { return this.addons.find(item => item.id === id); }
  async getAllAddons() { return this.sortNewest(this.addons); }
  async getActiveAddons() { return this.sortNewest(this.addons.filter(item => item.isActive)); }
  async updateAddon(id: number, addon: Partial<InsertAddon>) {
    const existing = await this.getAddon(id);
    if (!existing) return undefined;
    Object.assign(existing, addon);
    return existing;
  }
  async deleteAddon(id: number) {
    const before = this.addons.length;
    this.addons = this.addons.filter(item => item.id !== id);
    return this.addons.length !== before;
  }

  async createLabourRate(rate: InsertLabourRate) {
    const created = { ...rate, id: this.ids.labourRates++, isActive: rate.isActive ?? true, createdAt: new Date() } as LabourRate;
    this.labourRates.push(created);
    return created;
  }
  async getLabourRate(id: number) { return this.labourRates.find(item => item.id === id); }
  async getAllLabourRates() { return this.sortNewest(this.labourRates); }
  async getActiveLabourRates() { return this.sortNewest(this.labourRates.filter(item => item.isActive)); }
  async updateLabourRate(id: number, rate: Partial<InsertLabourRate>) {
    const existing = await this.getLabourRate(id);
    if (!existing) return undefined;
    Object.assign(existing, rate);
    return existing;
  }
  async deleteLabourRate(id: number) {
    const before = this.labourRates.length;
    this.labourRates = this.labourRates.filter(item => item.id !== id);
    return this.labourRates.length !== before;
  }

  async getAllPricingItems(filters?: { search?: string; category?: string; supplier?: string; isActive?: boolean }) {
    const search = filters?.search?.toLowerCase();
    return this.pricingItems
      .filter(item => filters?.isActive === undefined || item.isActive === filters.isActive)
      .filter(item => !filters?.category || item.category === filters.category)
      .filter(item => !filters?.supplier || item.supplier === filters.supplier)
      .filter(item => !search || [item.name, item.itemCode, item.displayGroup].some(value => value?.toLowerCase().includes(search)))
      .sort((a, b) => `${a.category}${a.name}`.localeCompare(`${b.category}${b.name}`));
  }
  async getPricingItem(id: number) { return this.pricingItems.find(item => item.id === id); }
  async getPricingItemByCode(code: string) { return this.pricingItems.find(item => item.itemCode === code); }
  async createPricingItem(item: InsertPricingItem) { return this.createPricingItemSync(item); }
  async updatePricingItem(id: number, item: Partial<InsertPricingItem>) {
    const existing = await this.getPricingItem(id);
    if (!existing) return undefined;
    Object.assign(existing, item, { lastUpdatedAt: new Date() });
    return existing;
  }
  async deletePricingItem(id: number) {
    const before = this.pricingItems.length;
    this.pricingItems = this.pricingItems.filter(item => item.id !== id);
    return this.pricingItems.length !== before;
  }
  async getPricingCategories() {
    return Array.from(new Set(this.pricingItems.map(item => item.category).filter(Boolean))).sort();
  }
  async getPricingSuppliers() {
    return Array.from(new Set(this.pricingItems.map(item => item.supplier).filter(Boolean))).sort() as string[];
  }
  async countPricingItems() { return this.pricingItems.length; }

  async createSupplierImport(data: InsertSupplierImport) {
    const created = { ...data, id: this.ids.supplierImports++, status: data.status ?? "pending", createdAt: new Date(), appliedAt: data.appliedAt ?? null } as SupplierImport;
    this.supplierImports.push(created);
    return created;
  }
  async getSupplierImport(id: number) { return this.supplierImports.find(item => item.id === id); }
  async getAllSupplierImports() { return this.sortNewest(this.supplierImports); }
  async updateSupplierImport(id: number, data: Partial<InsertSupplierImport>) {
    const existing = await this.getSupplierImport(id);
    if (!existing) return undefined;
    Object.assign(existing, data);
    return existing;
  }

  async addChangelogEntry(entry: InsertPricingChangelog) {
    const created = { ...entry, id: this.ids.changelog++, changedBy: entry.changedBy ?? "admin", source: entry.source ?? "manual", changedAt: new Date() } as PricingChangelogEntry;
    this.changelog.push(created);
    return created;
  }
  async getChangelog(limit = 100) {
    return [...this.changelog].sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime()).slice(0, limit);
  }
}

export const storage: IStorage = hasDatabaseUrl ? new DatabaseStorage() : new MemoryStorage();
