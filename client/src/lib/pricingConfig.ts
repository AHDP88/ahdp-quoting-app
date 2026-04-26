/**
 * Database-Ready Centralized Pricing Configuration
 * Supports both API (production) and localStorage (development fallback)
 * Single source of truth for all AHDP pricing
 */

export interface MaterialPrice {
  id: string | number;
  name: string;
  description: string | null;
  price: number; // Price in dollars (will be converted from cents in DB)
  category?: string | null;
  isActive?: boolean;
}

export interface AddonPrice {
  id: string | number;
  name: string;
  description: string | null;
  price: number;
  unit: "linear_meter" | "m2" | "flat";
  category?: string | null;
  isActive?: boolean;
}

export interface LabourRate {
  id: string | number;
  name: string;
  description: string | null;
  price: number;
  unit: "m2" | "linear_meter" | "hour" | "flat";
  category?: string | null;
  isActive?: boolean;
}

export interface PricingData {
  materials: MaterialPrice[];
  addons: AddonPrice[];
  labourRates: LabourRate[];
  version: string;
  lastUpdated: string;
}

// Default pricing from AHDP templates (in dollars, not cents)
export const defaultPricingData: PricingData = {
  version: "2.0",
  lastUpdated: new Date().toISOString(),
  materials: [
    {
      id: "std-hardwood",
      name: "Standard Hardwood",
      description: "Durable local timber, perfect for traditional decks",
      price: 180,
      category: "Hardwood",
      isActive: true,
    },
    {
      id: "prem-hardwood",
      name: "Premium Hardwood",
      description: "Premium-grade hardwood with superior durability",
      price: 220,
      category: "Hardwood",
      isActive: true,
    },
    {
      id: "std-composite",
      name: "Standard Composite",
      description: "Low-maintenance composite material with good durability",
      price: 240,
      category: "Composite",
      isActive: true,
    },
    {
      id: "prem-composite",
      name: "Premium Composite",
      description: "Top-tier composite with lifetime warranty",
      price: 290,
      category: "Composite",
      isActive: true,
    },
    {
      id: "treated-pine",
      name: "Treated Pine",
      description: "Pressure treated pine decking material",
      price: 120,
      category: "Timber",
      isActive: true,
    },
  ],
  addons: [
    {
      id: "railing",
      name: "Railing System",
      description: "Add safety railings around your deck",
      price: 220,
      unit: "linear_meter",
      category: "Railings",
      isActive: true,
    },
    {
      id: "stairs",
      name: "Stairs",
      description: "Add stairs to your deck design",
      price: 150,
      unit: "flat",
      category: "Stairs",
      isActive: true,
    },
    {
      id: "sealant",
      name: "Weather Sealant",
      description: "Professional-grade weather protection",
      price: 8,
      unit: "m2",
      category: "Finishing",
      isActive: true,
    },
    {
      id: "lights-std",
      name: "Deck Lights (Standard)",
      description: "Standard LED deck lights per meter",
      price: 75,
      unit: "linear_meter",
      category: "Lighting",
      isActive: true,
    },
    {
      id: "lights-prem",
      name: "Deck Lights (Premium)",
      description: "Premium LED deck lights per meter",
      price: 120,
      unit: "linear_meter",
      category: "Lighting",
      isActive: true,
    },
    {
      id: "fascia-std",
      name: "Standard Fascia",
      description: "Standard fascia per meter",
      price: 45,
      unit: "linear_meter",
      category: "Fascia",
      isActive: true,
    },
    {
      id: "handrail-std",
      name: "Standard Handrail",
      description: "Standard handrail per meter",
      price: 220,
      unit: "linear_meter",
      category: "Railings",
      isActive: true,
    },
  ],
  labourRates: [
    {
      id: "labour-install-deck",
      name: "Deck Installation",
      description: "Labour for deck installation",
      price: 50,
      unit: "m2",
      category: "Installation",
      isActive: true,
    },
    {
      id: "labour-install-verandah",
      name: "Verandah/Pergola Installation",
      description: "Labour for verandah/pergola installation",
      price: 60,
      unit: "m2",
      category: "Installation",
      isActive: true,
    },
    {
      id: "labour-painting",
      name: "Painting",
      description: "Labour for painting and finishing",
      price: 25,
      unit: "m2",
      category: "Finishing",
      isActive: true,
    },
  ],
};

/**
 * Try to load pricing from API (production)
 * Fall back to localStorage (development)
 * Fall back to defaults if both fail
 */
export async function loadPricingData(): Promise<PricingData> {
  // Try API first (production)
  try {
    const [materialsRes, addonsRes, labourRes] = await Promise.all([
      fetch("/api/pricing/materials"),
      fetch("/api/pricing/addons"),
      fetch("/api/pricing/labour-rates"),
    ]);

    if (materialsRes.ok && addonsRes.ok && labourRes.ok) {
      const materials = await materialsRes.json();
      const addons = await addonsRes.json();
      const labourRates = await labourRes.json();

      // Convert cents to dollars if needed
      return {
        version: "2.0",
        lastUpdated: new Date().toISOString(),
        materials: materials.map((m: any) => ({
          ...m,
          price: m.pricePerM2 / 100,
        })),
        addons: addons.map((a: any) => ({
          ...a,
          price: a.price / 100,
        })),
        labourRates: labourRates.map((l: any) => ({
          ...l,
          price: l.pricePerUnit / 100,
        })),
      };
    }
  } catch (error) {
    // API not available, fall back to localStorage
  }

  // Fall back to localStorage (development)
  const stored = localStorage.getItem("pricingData");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse pricing data from localStorage:", e);
    }
  }

  // Fall back to defaults
  return defaultPricingData;
}

/**
 * Save pricing data to localStorage (development)
 */
export function savePricingData(data: PricingData): void {
  localStorage.setItem("pricingData", JSON.stringify(data));
}

/**
 * Get all active materials (uses cached data)
 */
export async function getActiveMaterials(): Promise<MaterialPrice[]> {
  const data = await loadPricingData();
  return data.materials.filter((m) => m.isActive !== false);
}

/**
 * Get all active addons (uses cached data)
 */
export async function getActiveAddons(): Promise<AddonPrice[]> {
  const data = await loadPricingData();
  return data.addons.filter((a) => a.isActive !== false);
}

/**
 * Get all active labour rates (uses cached data)
 */
export async function getActiveLabourRates(): Promise<LabourRate[]> {
  const data = await loadPricingData();
  return data.labourRates.filter((l) => l.isActive !== false);
}

/**
 * Get material by ID
 */
export async function getMaterialById(id: string | number): Promise<MaterialPrice | undefined> {
  const data = await loadPricingData();
  return data.materials.find((m) => m.id === id || m.id?.toString() === id?.toString());
}

/**
 * Get addon by ID
 */
export async function getAddonById(id: string | number): Promise<AddonPrice | undefined> {
  const data = await loadPricingData();
  return data.addons.find((a) => a.id === id || a.id?.toString() === id?.toString());
}

/**
 * Get labour rate by ID
 */
export async function getLabourRateById(id: string | number): Promise<LabourRate | undefined> {
  const data = await loadPricingData();
  return data.labourRates.find((l) => l.id === id || l.id?.toString() === id?.toString());
}

/**
 * Reset all pricing to defaults
 */
export function resetPricingToDefaults(): void {
  savePricingData(defaultPricingData);
}

// =====================================================================
// SYNCHRONOUS FUNCTIONS — safe for use directly in React render
// These return defaults immediately without any async operations.
// Components should prefer usePricing() hook for live data.
// =====================================================================

export function getActiveMaterialsSync(): MaterialPrice[] {
  return defaultPricingData.materials.filter((m) => m.isActive !== false);
}

export function getActiveAddonsSync(): AddonPrice[] {
  return defaultPricingData.addons.filter((a) => a.isActive !== false);
}

export function getActiveLabourRatesSync(): LabourRate[] {
  return defaultPricingData.labourRates.filter((l) => l.isActive !== false);
}

export function getMaterialByIdSync(id: string | number): MaterialPrice | undefined {
  return defaultPricingData.materials.find(
    (m) => m.id === id || m.id?.toString() === id?.toString()
  );
}

export function getAddonByIdSync(id: string | number): AddonPrice | undefined {
  return defaultPricingData.addons.find(
    (a) => a.id === id || a.id?.toString() === id?.toString()
  );
}
