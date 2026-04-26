import React from "react";
import { QuoteData } from "@/components/QuoteBuilder";
import type { QuoteCalculation } from "@/lib/quoteCalculation";
import { buildScopeStatement } from "@/lib/scopeSummary";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Loader2, Save, ChevronRight } from "lucide-react";

interface QuoteSummaryProps {
  quoteData: QuoteData;
  material?: { id: string | number; name: string; price: number };
  onSave: () => void;
  isSaving: boolean;
  isLastStep: boolean;
  currentStep: number;
  calculation: QuoteCalculation;
}

const STEP_NEXT_LABELS: Record<number, string> = {
  1: "Continue to Extras",
  2: "Continue to Construction",
  3: "Continue to Site",
  4: "Continue to Client",
  5: "Review & Generate Quote",
};

export default function QuoteSummary({ quoteData, onSave, isSaving, isLastStep, currentStep, calculation: calc }: QuoteSummaryProps) {
  const deckArea = +(quoteData.length * quoteData.width).toFixed(2);
  const verandahArea = +(quoteData.roofSpan * quoteData.roofLength).toFixed(2);
  const subtotal = calc.totalAmount / 100;
  const incGST = calc.totalAmountInc / 100;
  const gst = incGST - subtotal;
  const hasAnyWork = calc.grandTotal > 0;
  const hasPricingWarnings = calc.warnings.length > 0;
  const scopeStatement = buildScopeStatement(quoteData);

  const nextLabel = isLastStep ? "Save Quote" : STEP_NEXT_LABELS[currentStep] ?? "Next Step";

  const ScopeRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className="flex items-start justify-between gap-2">
      <span className="text-sm text-gray-600 flex items-center gap-1.5 flex-shrink-0">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
        {label}
      </span>
      <span className="text-xs font-medium text-gray-500 text-right leading-tight">{value}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden ds-sidebar">
      
      {/* ── Live indicator header ── */}
      <div className="bg-[#1f3d2b] px-5 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">Live Estimate</span>
        </div>

        {/* Big price */}
        {hasAnyWork ? (
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Total (inc GST)</p>
            <p className="text-white font-bold leading-none" style={{ fontSize: "2.25rem" }}>
              {formatCurrency(incGST)}
            </p>
            <div className="flex items-center gap-3 mt-2 text-[11px]">
              <span className="text-white/50">{formatCurrency(subtotal)} ex GST</span>
              <span className="text-white/30">·</span>
              <span className="text-white/50">GST {formatCurrency(gst)}</span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-white/40 text-sm">Enter project details to see your estimate</p>
          </div>
        )}
      </div>

      {/* ── Scope summary ── */}
      {(quoteData.deckingRequired || quoteData.verandahRequired || quoteData.screeningRequired) && (
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="space-y-2">
            {quoteData.deckingRequired && deckArea > 0 && (
              <ScopeRow label="Deck" value={`${quoteData.length}m × ${quoteData.width}m = ${deckArea} m²`} color="bg-[#1f3d2b]" />
            )}
            {quoteData.verandahRequired && verandahArea > 0 && (
              <ScopeRow label={quoteData.structureType || "Verandah"} value={`${quoteData.roofSpan}m × ${quoteData.roofLength}m = ${verandahArea} m²`} color="bg-[#8b5a2b]" />
            )}
            {quoteData.screeningRequired && quoteData.wallType && (
              <ScopeRow label="Screening" value={quoteData.wallType} color="bg-gray-400" />
            )}
            {quoteData.electricalWorkRequired && (
              <ScopeRow label="Electrical" value={[
                quoteData.numCeilingFans > 0 && `${quoteData.numCeilingFans} fan${quoteData.numCeilingFans > 1 ? 's' : ''}`,
                quoteData.numLights > 0 && `${quoteData.numLights} light${quoteData.numLights > 1 ? 's' : ''}`,
                quoteData.numHeaters > 0 && `${quoteData.numHeaters} heater${quoteData.numHeaters > 1 ? 's' : ''}`,
                quoteData.numPowerPoints > 0 && `${quoteData.numPowerPoints} GPO${quoteData.numPowerPoints > 1 ? 's' : ''}`,
              ].filter(Boolean).join(', ') || 'Included'} color="bg-yellow-400" />
            )}
          </div>
        </div>
      )}

      {/* ── Cost breakdown ── */}
      {hasAnyWork && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Cost Breakdown</p>
          <div className="space-y-1.5">
            {calc.deckingSubtotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Decking</span>
                <span className="text-sm font-semibold text-gray-700">{formatCurrency(calc.deckingSubtotal)}</span>
              </div>
            )}
            {calc.verandahSubtotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Verandah / Pergola</span>
                <span className="text-sm font-semibold text-gray-700">{formatCurrency(calc.verandahSubtotal)}</span>
              </div>
            )}
            {calc.screeningSubtotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Screening</span>
                <span className="text-sm font-semibold text-gray-700">{formatCurrency(calc.screeningSubtotal)}</span>
              </div>
            )}
            {calc.electricalSubtotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Electrical</span>
                <span className="text-sm font-semibold text-gray-700">{formatCurrency(calc.electricalSubtotal)}</span>
              </div>
            )}
            {calc.extrasSubtotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Extras</span>
                <span className="text-sm font-semibold text-gray-700">{formatCurrency(calc.extrasSubtotal)}</span>
              </div>
            )}
            <div className="pt-2 mt-1 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Total (inc GST)</span>
              <span className="text-base font-bold text-[#1f3d2b]">{formatCurrency(incGST)}</span>
            </div>
          </div>
        </div>
      )}

      {hasPricingWarnings && (
        <div className="px-5 py-4 border-b border-amber-100 bg-amber-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">Pricing Warnings</p>
              <ul className="space-y-1">
                {calc.warnings.map((warning, index) => (
                  <li key={index} className="text-[11px] leading-relaxed text-amber-800">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Scope note ── */}
      {scopeStatement && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Scope</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">{scopeStatement}</p>
        </div>
      )}

      {/* ── Action ── */}
      <div className="px-5 py-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-[#1f3d2b] hover:bg-[#2d5a3d] active:bg-[#1a3224] disabled:opacity-60 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
          ) : isLastStep ? (
            <><Save className="h-4 w-4" /> {nextLabel}</>
          ) : (
            <>{nextLabel} <ChevronRight className="h-4 w-4" /></>
          )}
        </button>

        {!hasAnyWork && !isLastStep && (
          <p className="text-[10px] text-gray-400 text-center mt-2.5 leading-relaxed">
            Add project details above to see your estimate
          </p>
        )}
        {hasAnyWork && (
          <p className="text-[10px] text-gray-400 text-center mt-2.5 leading-relaxed">
            Estimate only · Subject to site inspection
          </p>
        )}
      </div>
    </div>
  );
}
