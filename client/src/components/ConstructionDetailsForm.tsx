import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuoteData } from "@/components/QuoteBuilder";
import { HardHat, ChevronLeft, ChevronRight } from "lucide-react";

interface ConstructionDetailsFormProps {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ConstructionDetailsForm({ quoteData, onUpdate, onNext, onBack }: ConstructionDetailsFormProps) {
  return (
    <div className="space-y-5 ds-reveal">
      {/* Section card */}
      <div className="ds-card">
        <div className="ds-card-header">
          <div className="ds-icon-badge"><HardHat className="h-4 w-4" /></div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Construction Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">Site access and structural requirements</p>
          </div>
        </div>
        <div className="ds-card-body space-y-4">

          <div className="ds-field">
            <label className="ds-label">Construction Access</label>
            <div className="ds-input-wrap">
              <Select value={quoteData.constructionAccess} onValueChange={(v) => onUpdate({ constructionAccess: v as any })}>
                <SelectTrigger><SelectValue placeholder="Select access difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="difficult">Difficult</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="ds-field">
            <label className="ds-label">Subfloor Height</label>
            <div className="ds-input-wrap ds-input-unit">
              <Input
                type="number"
                value={quoteData.subfloorHeight}
                onChange={(e) => onUpdate({ subfloorHeight: parseFloat(e.target.value) || 0 })}
                step="1" min="0"
              />
              <span className="unit">mm</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: "concreteFootingsRequired", label: "Concrete Footings Required?", field: "concreteFootingsRequired" },
              { id: "oversizedPostsRequired", label: "Oversized Posts Required?", field: "oversizedPostsRequired" },
              { id: "slabCuttingRequired", label: "Slab Cutting Required?", field: "slabCuttingRequired" },
            ].map(({ id, label, field }) => (
              <div key={id} className="ds-toggle-row">
                <Label htmlFor={id} className="ds-toggle-label cursor-pointer">{label}</Label>
                <Switch
                  id={id}
                  checked={(quoteData as any)[field]}
                  onCheckedChange={(v) => onUpdate({ [field]: v } as any)}
                />
              </div>
            ))}
          </div>

          <div className="ds-field items-start">
            <label className="ds-label pt-2">Construction Notes</label>
            <div className="ds-input-wrap">
              <Textarea
                value={quoteData.constructionNotes}
                onChange={(e) => onUpdate({ constructionNotes: e.target.value })}
                placeholder="Any additional construction details or special requirements…"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="ds-btn-ghost">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onNext} className="ds-btn-primary">
          Next: Site Requirements <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
