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
import { db } from "./db";
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
    return rows.map(r => r.category).filter(Boolean);
  }

  async getPricingSuppliers(): Promise<string[]> {
    const rows = await db.selectDistinct({ supplier: pricingItems.supplier }).from(pricingItems).orderBy(pricingItems.supplier);
    return rows.map(r => r.supplier).filter(Boolean) as string[];
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

export const storage = new DatabaseStorage();
