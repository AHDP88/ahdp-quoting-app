import React from "react";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/usePricing";
import { formatCurrency } from "@/lib/utils";

interface MaterialsFormProps {
  materialId: string;
  onUpdate: (materialId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MaterialsForm({ materialId, onUpdate, onNext, onBack }: MaterialsFormProps) {
  const { materials } = usePricing();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-[#333333] mb-6">Step 2: Materials</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow ${
              materialId === material.id ? 'border-[#005b4f] ring-2 ring-[#005b4f]' : 'border-gray-200'
            }`}
            onClick={() => onUpdate(String(material.id))}
          >
            <div className="aspect-w-16 aspect-h-9 mb-3">
              <div className="bg-[#f5f5f5] rounded-md h-40 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 12h16M4 6h16M4 18h16" />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-lg mb-1">{material.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-[#005b4f] font-medium">{formatCurrency(material.price)}/m²</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          className="border-[#005b4f] text-[#005b4f]"
          onClick={onBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-[#005b4f] hover:bg-[#007f6e]"
        >
          Next: Enter Details
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
