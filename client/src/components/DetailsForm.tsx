import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuoteData } from "@/components/QuoteBuilder";
import { User, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface DetailsFormProps {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DetailsForm({ quoteData, onUpdate, onNext, onBack }: DetailsFormProps) {
  return (
    <div className="space-y-5 ds-reveal">

      {/* Client contact */}
      <div className="ds-card">
        <div className="ds-card-header">
          <div className="ds-icon-badge"><User className="h-4 w-4" /></div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Client Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">Contact information for the quote record</p>
          </div>
        </div>
        <div className="ds-card-body space-y-4">

          <div className="ds-field">
            <label htmlFor="clientName" className="ds-label">Full Name</label>
            <div className="ds-input-wrap">
              <Input
                id="clientName"
                type="text"
                value={quoteData.clientName}
                onChange={(e) => onUpdate({ clientName: e.target.value })}
                placeholder="Client full name"
              />
            </div>
          </div>

          <div className="ds-field">
            <label htmlFor="clientEmail" className="ds-label">Email Address</label>
            <div className="ds-input-wrap">
              <Input
                id="clientEmail"
                type="email"
                value={quoteData.clientEmail}
                onChange={(e) => onUpdate({ clientEmail: e.target.value })}
                placeholder="client@example.com.au"
              />
            </div>
          </div>

          <div className="ds-field">
            <label htmlFor="clientPhone" className="ds-label">Phone Number</label>
            <div className="ds-input-wrap">
              <Input
                id="clientPhone"
                type="tel"
                value={quoteData.clientPhone}
                onChange={(e) => onUpdate({ clientPhone: e.target.value })}
                placeholder="04xx xxx xxx"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Site address */}
      <div className="ds-card">
        <div className="ds-card-header">
          <div className="ds-icon-badge"><MapPin className="h-4 w-4" /></div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Site Address</h2>
            <p className="text-xs text-gray-400 mt-0.5">Where the work will be carried out</p>
          </div>
        </div>
        <div className="ds-card-body">
          <Input
            id="siteAddress"
            type="text"
            value={quoteData.siteAddress}
            onChange={(e) => onUpdate({ siteAddress: e.target.value })}
            placeholder="e.g. 42 Oak Street, Suburb NSW 2000"
          />
          <p className="text-xs text-gray-400 mt-2">
            Used for scheduling, site visits, and CRM records.
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="ds-card">
        <div className="ds-card-header">
          <div className="ds-icon-badge">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Additional Notes</h2>
            <p className="text-xs text-gray-400 mt-0.5">Any specific requirements, preferences, or site details</p>
          </div>
        </div>
        <div className="ds-card-body">
          <Textarea
            id="notes"
            value={quoteData.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="e.g. Client prefers timber over composite. Property has pool nearby. Access via side gate only."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="ds-btn-ghost">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onNext} className="ds-btn-primary">
          Review Quote <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
