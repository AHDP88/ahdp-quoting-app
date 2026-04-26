import React from "react";
import { QuoteData } from "@/components/QuoteBuilder";
import type { QuoteCalculation } from "@/lib/quoteCalculation";
import {
  buildScopeStatement,
  buildInclusionsChecklist,
  buildExclusionsList,
  buildAssumptionsList,
} from "@/lib/scopeSummary";
import { formatCurrency } from "@/lib/utils";
import {
  Printer, Save, ChevronLeft, Loader2,
  CheckCircle2, XCircle, AlertTriangle, ArrowRight,
  Phone, Mail, Calendar, Shield, MapPin, Tag
} from "lucide-react";

interface QuotePreviewProps {
  quoteData: QuoteData;
  onSave: () => void;
  onBack: () => void;
  isSaving: boolean;
  calculation: QuoteCalculation;
}

const Spec = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <div className="flex gap-3 text-sm py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 w-36 flex-shrink-0">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  ) : null;

export default function QuotePreview({ quoteData, onSave, onBack, isSaving, calculation: calc }: QuotePreviewProps) {
  const scopeStatement = buildScopeStatement(quoteData);
  const inclusions = buildInclusionsChecklist(quoteData);
  const exclusions = buildExclusionsList(quoteData);
  const assumptions = buildAssumptionsList(quoteData);
  const currentDate = new Date().toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
  const sections = ["Decking", "Verandah", "Screening", "Electrical", "Extras"];
  const subtotal = calc.totalAmount / 100;
  const incGST = calc.totalAmountInc / 100;
  const gst = incGST - subtotal;
  const hasPricingWarnings = calc.warnings.length > 0;

  const projectLabel = quoteData.projectType
    .replace(/-/g, " + ")
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="space-y-5 ds-reveal">

      {/* ── Brand + Price Hero ── */}
      <div className="ds-card overflow-hidden">
        {/* Forest green brand header */}
        <div className="bg-[#1f3d2b] px-6 py-6" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            {/* Left — branding + client */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-[#1f3d2b] text-[9px] font-bold tracking-tight leading-tight text-center">AH<br/>DP</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">AH Decks & Pergolas</p>
                  <p className="text-white/50 text-[11px]">Licensed Builder · Decks, Pergolas & Verandahs</p>
                </div>
              </div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Quote prepared for</p>
              <h1 className="text-white font-bold text-2xl leading-tight">
                {quoteData.clientName || "Valued Client"}
              </h1>
              <p className="text-white/60 text-sm mt-1">{projectLabel}</p>
            </div>

            {/* Right — price hero */}
            <div className="sm:text-right flex-shrink-0">
              <div className="bg-white/12 rounded-2xl px-5 py-4 border border-white/20 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1">Total Investment</p>
                <p className="text-white font-bold leading-none" style={{ fontSize: "2.5rem" }}>
                  {formatCurrency(incGST)}
                </p>
                <p className="text-white/50 text-xs mt-2">inc GST</p>
                <p className="text-white/40 text-xs mt-0.5">{formatCurrency(subtotal)} ex GST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meta bar — contact + validity */}
        <div className="border-b border-gray-100 px-6 py-3 flex flex-wrap gap-x-5 gap-y-1.5 bg-gray-50/50">
          {quoteData.clientEmail && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Mail className="h-3 w-3 text-[#1f3d2b]/60 flex-shrink-0" /> {quoteData.clientEmail}
            </span>
          )}
          {quoteData.clientPhone && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Phone className="h-3 w-3 text-[#1f3d2b]/60 flex-shrink-0" /> {quoteData.clientPhone}
            </span>
          )}
          {quoteData.siteAddress && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3 w-3 text-[#1f3d2b]/60 flex-shrink-0" /> {quoteData.siteAddress}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3 flex-shrink-0" /> Prepared {currentDate}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Shield className="h-3 w-3 flex-shrink-0" /> Valid until {expiryDate}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Tag className="h-3 w-3 flex-shrink-0" /> Ref generated on save
          </span>
        </div>

        {/* GST breakdown strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { label: "Subtotal (ex GST)", value: formatCurrency(subtotal) },
            { label: "GST (10%)", value: formatCurrency(gst) },
            { label: "Total (inc GST)", value: formatCurrency(incGST), highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`px-5 py-4 ${highlight ? "bg-[#1f3d2b]/5" : ""}`}>
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">{label}</p>
              <p className={`font-bold ${highlight ? "text-[#1f3d2b] text-xl" : "text-gray-700 text-base"}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {hasPricingWarnings && (
        <div className="ds-card border-amber-200 bg-amber-50 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-amber-900 text-sm">Pricing Warnings</h2>
              <p className="text-xs text-amber-700 mt-0.5 mb-2">Review these missing pricing mappings before saving this quote.</p>
              <ul className="space-y-1.5">
                {calc.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-amber-800 leading-relaxed">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Project Scope ── */}
      {scopeStatement && (
        <div className="ds-card px-6 py-5">
          <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Project Scope</p>
          <p className="text-gray-700 text-sm leading-relaxed">{scopeStatement}</p>
        </div>
      )}

      {/* ── What's Included ── */}
      {inclusions.length > 0 && (
        <div className="ds-card">
          <div className="ds-card-header">
            <div className="ds-icon-badge">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">What's Included</h2>
              <p className="text-xs text-gray-400 mt-0.5">All items below are covered by this quote — supply and labour</p>
            </div>
          </div>
          <div className="ds-card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {inclusions.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
                  <CheckCircle2 className="h-4 w-4 text-[#1f3d2b] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Exclusions ── */}
      {exclusions.length > 0 && (
        <div className="ds-card">
          <div className="ds-card-header">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-orange-50 text-orange-600">
              <XCircle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Exclusions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Items not covered by this quote — can be quoted separately if required</p>
            </div>
          </div>
          <div className="ds-card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {exclusions.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
                  <XCircle className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Assumptions ── */}
      {assumptions.length > 0 && (
        <div className="ds-card">
          <div className="ds-card-header">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 text-blue-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Pricing Assumptions</h2>
              <p className="text-xs text-gray-400 mt-0.5">This quote is based on the following site and project assumptions</p>
            </div>
          </div>
          <div className="ds-card-body">
            <div className="space-y-2">
              {assumptions.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
                  <AlertTriangle className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Detailed Cost Breakdown ── */}
      <div className="ds-card">
        <div className="ds-card-header">
          <h2 className="font-semibold text-gray-900 text-sm">Detailed Cost Breakdown</h2>
          <span className="ml-auto text-[10px] text-gray-400 font-semibold uppercase tracking-wider">All prices ex GST</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="text-left px-6 py-2.5">Description</th>
                <th className="text-right px-3 py-2.5 hidden sm:table-cell">Qty</th>
                <th className="text-right px-3 py-2.5 hidden sm:table-cell">Unit</th>
                <th className="text-right px-3 py-2.5 hidden sm:table-cell">Rate</th>
                <th className="text-right px-6 py-2.5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(section => {
                const sectionItems = calc.lineItems.filter(i => i.section === section);
                if (sectionItems.length === 0) return null;
                const sectionTotal = sectionItems.reduce((s, i) => s + i.total, 0);
                return (
                  <React.Fragment key={section}>
                    <tr>
                      <td colSpan={5} className="px-6 pt-5 pb-1.5 text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest">
                        — {section} —
                      </td>
                    </tr>
                    {sectionItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-2.5 text-gray-700">{item.description}</td>
                        <td className="px-3 py-2.5 text-right text-gray-500 hidden sm:table-cell">{item.qty}</td>
                        <td className="px-3 py-2.5 text-right text-gray-400 hidden sm:table-cell text-xs">{item.unit}</td>
                        <td className="px-3 py-2.5 text-right text-gray-500 hidden sm:table-cell">{formatCurrency(item.unitRate)}</td>
                        <td className="px-6 py-2.5 text-right font-semibold text-gray-800">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 bg-gray-50/70">
                      <td colSpan={4} className="px-6 py-2 text-right text-xs font-semibold text-gray-500">{section} Total</td>
                      <td className="px-6 py-2 text-right font-bold text-gray-700">{formatCurrency(sectionTotal)}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td colSpan={4} className="px-6 pt-4 pb-1 text-right text-sm text-gray-400 font-medium">Subtotal (ex GST)</td>
                <td className="px-6 pt-4 pb-1 text-right text-sm font-bold text-gray-700">{formatCurrency(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-6 pb-1 text-right text-sm text-gray-400">GST (10%)</td>
                <td className="px-6 pb-1 text-right text-sm text-gray-500">{formatCurrency(gst)}</td>
              </tr>
              <tr className="bg-[#1f3d2b]/6">
                <td colSpan={4} className="px-6 pt-4 pb-5 text-right font-bold text-[#1f3d2b] text-base">
                  Total (inc GST)
                </td>
                <td className="px-6 pt-4 pb-5 text-right font-bold text-[#1f3d2b] text-2xl">
                  {formatCurrency(incGST)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Project Specifications ── */}
      {(quoteData.deckingRequired || quoteData.verandahRequired || quoteData.screeningRequired) && (
        <div className="ds-card">
          <div className="ds-card-header">
            <h2 className="font-semibold text-gray-900 text-sm">Project Specifications</h2>
          </div>
          <div className="ds-card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {quoteData.deckingRequired && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Decking</p>
                  <Spec label="Dimensions" value={`${quoteData.length}m × ${quoteData.width}m (${+(quoteData.length * quoteData.width).toFixed(1)} m²)`} />
                  <Spec label="Height" value={`${quoteData.height}m${quoteData.height <= 0.3 ? " (ground level)" : ""}`} />
                  <Spec label="Board Type" value={quoteData.boardType || quoteData.deckingType} />
                  <Spec label="Board Size" value={quoteData.boardSize} />
                  <Spec label="Joist Size" value={quoteData.joistSize} />
                  <Spec label="Bearer Size" value={quoteData.bearerSize} />
                  <Spec label="Board Direction" value={quoteData.boardDirection} />
                  {quoteData.stepRampRequired && quoteData.numberOfSteps > 0 && (
                    <Spec label="Steps" value={`${quoteData.numberOfSteps} step${quoteData.numberOfSteps > 1 ? "s" : ""}`} />
                  )}
                  {quoteData.handrailRequired && <Spec label="Handrail" value={quoteData.handrailType || "Included"} />}
                  {quoteData.ballustradeType && <Spec label="Balustrade" value={quoteData.ballustradeType} />}
                </div>
              )}
              {quoteData.verandahRequired && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Verandah / Pergola</p>
                  <Spec label="Structure Type" value={quoteData.structureType} />
                  <Spec label="Material" value={quoteData.materialType} />
                  <Spec label="Style" value={quoteData.structureStyle} />
                  <Spec label="Roof Type" value={quoteData.roofType} />
                  <Spec label="Dimensions" value={`${quoteData.roofSpan}m × ${quoteData.roofLength}m (${+(quoteData.roofSpan * quoteData.roofLength).toFixed(1)} m²)`} />
                  {quoteData.roofPitch > 0 && <Spec label="Pitch" value={`${quoteData.roofPitch}°`} />}
                  <Spec label="Gutter Type" value={quoteData.gutterType} />
                  {quoteData.ceilingType && <Spec label="Ceiling" value={quoteData.ceilingType} />}
                </div>
              )}
              {quoteData.screeningRequired && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Walls & Screening</p>
                  <Spec label="Type" value={quoteData.wallType} />
                  <Spec label="Material" value={quoteData.screenMaterial} />
                  <Spec label="Height" value={quoteData.claddingHeight ? `${quoteData.claddingHeight}m` : null} />
                  <Spec label="Bays" value={quoteData.numberOfBays ? String(quoteData.numberOfBays) : null} />
                </div>
              )}
              <div className="mb-5">
                <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Site & Construction</p>
                <Spec label="Site Address" value={quoteData.siteAddress || null} />
                <Spec label="Access" value={quoteData.constructionAccess} />
                <Spec label="Ground" value={quoteData.groundConditions} />
                <Spec label="Council Approval" value={quoteData.councilApproval ? "Required — included in quote" : "Not required"} />
                {quoteData.concreteFootingsRequired && <Spec label="Footings" value="Concrete footings included" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Notes ── */}
      {quoteData.notes && (
        <div className="ds-card">
          <div className="ds-card-header">
            <h2 className="font-semibold text-gray-900 text-sm">Additional Notes</h2>
          </div>
          <div className="ds-card-body">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{quoteData.notes}</p>
          </div>
        </div>
      )}

      {/* ── Next Steps ── */}
      <div className="ds-card overflow-hidden">
        <div className="ds-card-header bg-[#1f3d2b]/4">
          <div className="ds-icon-badge">
            <ArrowRight className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Next Steps</h2>
            <p className="text-xs text-gray-400 mt-0.5">How to proceed with AH Decks & Pergolas</p>
          </div>
        </div>
        <div className="ds-card-body">
          <ol className="space-y-3">
            {[
              { step: "1", title: "Review & approve this quote", desc: "Check all specifications and pricing. Contact us with any questions or adjustments." },
              { step: "2", title: "Site inspection", desc: "We'll arrange a brief site visit to confirm dimensions, access, and any site-specific requirements." },
              { step: "3", title: "Confirm & deposit", desc: "Sign the quote acceptance and pay a 20% deposit to secure your booking in our schedule." },
              { step: "4", title: "Council approval (if required)", desc: quoteData.councilApproval ? "Council DA/CDC documentation is included — we handle lodgement on your behalf." : "No council approval needed for this project based on current specifications." },
              { step: "5", title: "Construction commences", desc: "Our licensed team will contact you to confirm start dates and notify neighbours as required." },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1f3d2b]/10 text-[#1f3d2b] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── Terms & Conditions ── */}
      <div className="ds-card px-6 py-5 bg-gray-50/80">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Terms & Conditions</p>
        <ul className="text-xs text-gray-400 space-y-1.5 leading-relaxed list-disc list-inside">
          <li>This quote is valid for 30 days from the date of issue (expires {expiryDate}).</li>
          <li>All prices are estimates based on the specifications provided. Final price confirmed following site inspection.</li>
          <li>All prices are exclusive of GST unless stated otherwise. GST of 10% applies to all services.</li>
          <li>A 20% deposit is required to secure your booking. Remaining balance is payable on practical completion.</li>
          <li>Material pricing is subject to supplier availability and may be revised if order is delayed beyond 30 days.</li>
          <li>AH Decks & Pergolas reserves the right to adjust pricing based on site conditions discovered during construction.</li>
          <li>All work is carried out by licensed tradespeople in accordance with Australian Standards.</li>
        </ul>
      </div>

      {/* ── Action bar (hidden on print) ── */}
      <div className="ds-card px-5 py-4 print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="ds-btn-ghost w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4" /> Edit Details
          </button>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              disabled={isSaving}
              className="ds-btn-ghost flex-1 sm:flex-none"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print / PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f3d2b] hover:bg-[#2d5a3d] active:bg-[#1a3224] text-white text-sm font-bold px-7 py-3 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
              ) : (
                <><Save className="h-4 w-4" /> Save Quote</>
              )}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-3">
          Saving creates a permanent record and generates your quote reference number (AHDP-{new Date().getFullYear()}-XXXX)
        </p>
      </div>
    </div>
  );
}
