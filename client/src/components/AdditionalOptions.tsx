import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { usePricing } from "@/hooks/usePricing";

interface AdditionalOptionsProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

export default function AdditionalOptions({ selectedOptions, onOptionsChange }: AdditionalOptionsProps) {
  const { addons } = usePricing();

  const handleOptionToggle = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      onOptionsChange(selectedOptions.filter(id => id !== optionId));
    } else {
      onOptionsChange([...selectedOptions, optionId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-[#333333] mb-4">Additional Options</h3>

      <ul className="space-y-3">
        {addons.map(option => (
          <li key={option.id} className="flex items-start">
            <div className="flex h-5 items-center">
              <Checkbox
                id={`option-${option.id}`}
                checked={selectedOptions.includes(String(option.id))}
                onCheckedChange={() => handleOptionToggle(String(option.id))}
                className="text-[#1f3d2b]"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={`option-${option.id}`} className="font-medium text-gray-700 cursor-pointer">
                {option.name}
              </label>
              <p className="text-gray-500">
                {option.description}
                {option.unit === "flat"
                  ? ` (+$${option.price})`
                  : ` (+$${option.price}/${option.unit})`
                }
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
