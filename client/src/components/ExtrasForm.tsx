import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuoteData } from "@/components/QuoteBuilder";
import { Wrench, Zap, ChevronLeft, ChevronRight } from "lucide-react";

interface ExtrasFormProps {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ToggleRow = ({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="ds-toggle-row">
    <Label htmlFor={id} className="ds-toggle-label cursor-pointer">{label}</Label>
    <Switch id={id} checked={checked} onCheckedChange={onChange} />
  </div>
);

const CounterRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded-md border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 font-medium text-sm transition-colors"
      >−</button>
      <span className="w-8 text-center font-semibold text-gray-900 text-sm">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-md border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 font-medium text-sm transition-colors"
      >+</button>
    </div>
  </div>
);

export default function ExtrasForm({ quoteData, onUpdate, onNext, onBack }: ExtrasFormProps) {
  return (
    <div className="space-y-5 ds-reveal">

      {/* Basic Extras */}
      <div className="ds-card">
        <div className="ds-card-header">
          <div className="ds-icon-badge"><Wrench className="h-4 w-4" /></div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Extras & Additional Work</h2>
            <p className="text-xs text-gray-400 mt-0.5">Select any additional services needed for this project</p>
          </div>
        </div>
        <div className="ds-card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <ToggleRow id="binHireRequired" label="Bin Hire Required" checked={quoteData.binHireRequired} onChange={(v) => onUpdate({ binHireRequired: v })} />
            <ToggleRow id="rubbishRemoval" label="Rubbish Removal" checked={quoteData.rubbishRemoval} onChange={(v) => onUpdate({ rubbishRemoval: v })} />
            <ToggleRow id="pavingCutRequired" label="Paving Cut Required" checked={quoteData.pavingCutRequired} onChange={(v) => onUpdate({ pavingCutRequired: v })} />
            <ToggleRow id="landscapingRetainingRequired" label="Landscaping / Retaining Wall" checked={quoteData.landscapingRetainingRequired} onChange={(v) => onUpdate({ landscapingRetainingRequired: v })} />
            <ToggleRow id="plumbingWorkRequired" label="Plumbing Work Required" checked={quoteData.plumbingWorkRequired} onChange={(v) => onUpdate({ plumbingWorkRequired: v })} />
            <ToggleRow id="asbestosRemovalRequired" label="Asbestos Removal" checked={quoteData.asbestosRemovalRequired} onChange={(v) => onUpdate({ asbestosRemovalRequired: v })} />
            <ToggleRow id="coreDrillingRequired" label="Core Drilling Required" checked={quoteData.coreDrillingRequired} onChange={(v) => onUpdate({ coreDrillingRequired: v })} />
            <ToggleRow id="extraExcavationRequired" label="Extra Excavation Required" checked={quoteData.extraExcavationRequired} onChange={(v) => onUpdate({ extraExcavationRequired: v })} />
            <ToggleRow id="stairHandrailFixRequired" label="Stair / Handrail Fix" checked={quoteData.stairHandrailFixRequired} onChange={(v) => onUpdate({ stairHandrailFixRequired: v })} />
          </div>
        </div>
      </div>

      {/* Electrical */}
      <div className="ds-card">
        <div className="ds-card-header">
          <div className="ds-icon-badge"><Zap className="h-4 w-4" /></div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Electrical Items</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ceiling fans, heaters, lights and power points</p>
          </div>
        </div>
        <div className="ds-card-body space-y-4">
          <div className="ds-toggle-row">
            <Label htmlFor="electricalWorkRequired" className="ds-toggle-label cursor-pointer">Electrical Work Required?</Label>
            <Switch id="electricalWorkRequired" checked={quoteData.electricalWorkRequired} onCheckedChange={(v) => onUpdate({ electricalWorkRequired: v })} />
          </div>

          {quoteData.electricalWorkRequired && (
            <div className="ds-reveal border border-gray-100 rounded-lg p-4 bg-gray-50/50 space-y-3">
              <CounterRow label="Ceiling Fans" value={quoteData.numCeilingFans} onChange={(v) => onUpdate({ numCeilingFans: v })} />
              <CounterRow label="Heaters" value={quoteData.numHeaters} onChange={(v) => onUpdate({ numHeaters: v })} />
              <CounterRow label="Lights" value={quoteData.numLights} onChange={(v) => onUpdate({ numLights: v })} />
              <CounterRow label="Power Points" value={quoteData.numPowerPoints} onChange={(v) => onUpdate({ numPowerPoints: v })} />
              <div className="pt-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Electrical Notes</label>
                <Textarea
                  value={quoteData.electricalItemNotes}
                  onChange={(e) => onUpdate({ electricalItemNotes: e.target.value })}
                  placeholder="Special requirements for electrical items…"
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="pt-1">
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Miscellaneous Notes</label>
            <Textarea
              value={quoteData.miscellaneousNotes}
              onChange={(e) => onUpdate({ miscellaneousNotes: e.target.value })}
              placeholder="Any additional details or special requirements…"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="ds-btn-ghost">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onNext} className="ds-btn-primary">
          Next: Construction <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
