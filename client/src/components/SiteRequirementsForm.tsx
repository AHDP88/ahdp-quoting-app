import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuoteData } from "@/components/QuoteBuilder";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface SiteRequirementsFormProps {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SiteRequirementsForm({ quoteData, onUpdate, onNext, onBack }: SiteRequirementsFormProps) {
  return (
    <div className="space-y-5 ds-reveal">
      <div className="ds-card">
        <div className="ds-card-header">
          <div className="ds-icon-badge"><MapPin className="h-4 w-4" /></div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Site Requirements</h2>
            <p className="text-xs text-gray-400 mt-0.5">Location conditions and approval requirements</p>
          </div>
        </div>
        <div className="ds-card-body space-y-4">

          <div className="ds-field">
            <label className="ds-label">Site Access</label>
            <div className="ds-input-wrap">
              <Select value={quoteData.siteAccess} onValueChange={(v) => onUpdate({ siteAccess: v as any })}>
                <SelectTrigger><SelectValue placeholder="Select site access difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="difficult">Difficult</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="ds-field">
            <label className="ds-label">Ground Conditions</label>
            <div className="ds-input-wrap">
              <Select value={quoteData.groundConditions} onValueChange={(v) => onUpdate({ groundConditions: v as any })}>
                <SelectTrigger><SelectValue placeholder="Select ground conditions" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="level">Level</SelectItem>
                  <SelectItem value="sloped">Sloped</SelectItem>
                  <SelectItem value="retaining-wall">Retaining Wall</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="ds-toggle-row">
              <Label htmlFor="councilApproval" className="ds-toggle-label cursor-pointer">Council Approval Required?</Label>
              <Switch id="councilApproval" checked={quoteData.councilApproval} onCheckedChange={(v) => onUpdate({ councilApproval: v })} />
            </div>
            <div className="ds-toggle-row">
              <Label htmlFor="powerWaterAvailable" className="ds-toggle-label cursor-pointer">Power/Water Available On Site?</Label>
              <Switch id="powerWaterAvailable" checked={quoteData.powerWaterAvailable} onCheckedChange={(v) => onUpdate({ powerWaterAvailable: v })} />
            </div>
          </div>

          <div className="ds-field items-start">
            <label className="ds-label pt-2">Site Notes</label>
            <div className="ds-input-wrap">
              <Textarea
                value={quoteData.siteNotes}
                onChange={(e) => onUpdate({ siteNotes: e.target.value })}
                placeholder="Any additional information about the site…"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="ds-btn-ghost">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onNext} className="ds-btn-primary">
          Next: Client Details <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
