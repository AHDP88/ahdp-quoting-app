import { useQuery } from "@tanstack/react-query";
import { MaterialPrice, AddonPrice, LabourRate, defaultPricingData } from "@/lib/pricingConfig";

/**
 * usePricing — React hook that loads pricing from the API with default fallbacks.
 * Replaces all direct calls to async pricingConfig functions inside components.
 */
export function usePricing() {
  const { data: materials = defaultPricingData.materials } = useQuery<MaterialPrice[]>({
    queryKey: ["/api/pricing/materials"],
    select: (data: any[]) =>
      data.length > 0
        ? data.map((m) => ({
            id: m.id,
            name: m.name,
            description: m.description ?? null,
            price: m.pricePerM2 / 100,
            category: m.category ?? null,
            isActive: m.isActive,
          }))
        : defaultPricingData.materials,
  });

  const { data: addons = defaultPricingData.addons } = useQuery<AddonPrice[]>({
    queryKey: ["/api/pricing/addons"],
    select: (data: any[]) =>
      data.length > 0
        ? data.map((a) => ({
            id: a.id,
            name: a.name,
            description: a.description ?? null,
            price: a.price / 100,
            unit: a.unitType as AddonPrice["unit"],
            category: a.category ?? null,
            isActive: a.isActive,
          }))
        : defaultPricingData.addons,
  });

  const { data: labourRates = defaultPricingData.labourRates } = useQuery<LabourRate[]>({
    queryKey: ["/api/pricing/labour-rates"],
    select: (data: any[]) =>
      data.length > 0
        ? data.map((l) => ({
            id: l.id,
            name: l.name,
            description: l.description ?? null,
            price: l.pricePerUnit / 100,
            unit: l.unitType as LabourRate["unit"],
            category: l.category ?? null,
            isActive: l.isActive,
          }))
        : defaultPricingData.labourRates,
  });

  const getMaterialById = (id: string | number): MaterialPrice | undefined =>
    materials.find((m) => m.id === id || m.id?.toString() === id?.toString());

  const getAddonById = (id: string | number): AddonPrice | undefined =>
    addons.find((a) => a.id === id || a.id?.toString() === id?.toString());

  return {
    materials: materials.filter((m) => m.isActive !== false),
    addons: addons.filter((a) => a.isActive !== false),
    labourRates: labourRates.filter((l) => l.isActive !== false),
    getMaterialById,
    getAddonById,
  };
}
