import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getActiveMaterialsSync, getActiveAddonsSync, getMaterialByIdSync, getAddonByIdSync } from "./pricingConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get all active materials from centralized pricing (synchronous)
 * @deprecated Use usePricing() hook in components instead
 */
export const materialOptions = getActiveMaterialsSync();

/**
 * Get all active addons from centralized pricing (synchronous)
 * @deprecated Use usePricing() hook in components instead
 */
export const additionalOptions = getActiveAddonsSync();

export function calculateTotal(
  length: number,
  width: number,
  materialPrice: number,
  selectedOptions: string[] = []
): {
  area: number;
  materialCost: number;
  optionsCost: number;
  totalCost: number;
  perimeter: number;
  breakdown: { item: string; amount: number; cost: number }[];
} {
  const safeLength = typeof length === 'number' && !isNaN(length) ? length : 0;
  const safeWidth = typeof width === 'number' && !isNaN(width) ? width : 0;
  const safeMaterialPrice = typeof materialPrice === 'number' && !isNaN(materialPrice) ? materialPrice : 0;

  const area = safeLength * safeWidth;
  const perimeter = 2 * (safeLength + safeWidth);
  const materialCost = area * safeMaterialPrice;
  const breakdown: { item: string; amount: number; cost: number }[] = [];

  if (area > 0 && safeMaterialPrice > 0) {
    breakdown.push({ item: "Base deck area", amount: area, cost: materialCost });
  }

  let optionsCost = 0;

  selectedOptions.forEach(optionId => {
    const option = getActiveAddonsSync().find(opt => opt.id === optionId);
    if (option) {
      let cost = 0;
      if (option.unit === "m2") {
        cost = option.price * area;
        breakdown.push({ item: option.name, amount: area, cost });
      } else if (option.unit === "linear_meter") {
        cost = option.price * perimeter;
        breakdown.push({ item: option.name, amount: perimeter, cost });
      } else {
        cost = option.price;
        breakdown.push({ item: option.name, amount: 1, cost });
      }
      optionsCost += cost;
    }
  });

  const totalCost = materialCost + optionsCost;

  return {
    area,
    materialCost,
    optionsCost,
    totalCost,
    perimeter,
    breakdown
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function getMaterialById(materialId: string | null | undefined) {
  if (!materialId) {
    return {
      id: "unknown",
      name: "Unknown Material",
      description: "Material details not available",
      price: 0
    };
  }

  const material = getMaterialByIdSync(materialId);
  return material || {
    id: materialId,
    name: materialId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: "Material details not available",
    price: 0
  };
}

export function getOptionById(optionId: string | null | undefined) {
  if (!optionId) {
    return {
      id: "unknown",
      name: "Unknown Option",
      description: "Option details not available",
      price: 0,
      unit: "flat" as const
    };
  }

  const addon = getAddonByIdSync(optionId);
  return addon || {
    id: optionId,
    name: optionId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: "Option details not available",
    price: 0,
    unit: "flat" as const
  };
}
