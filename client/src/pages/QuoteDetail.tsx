import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Printer, Share2, Calendar, Phone, Mail, Ruler,
  MapPin, Tag, Clock, CheckCircle2, Send, CheckCircle, XCircle,
  RotateCcw, Briefcase, Trash2, Copy, ChevronDown, ChevronUp,
  DollarSign, CalendarDays, User, AlertTriangle, Loader2
} from "lucide-react";

interface QuoteResponse {
  id: number;
  projectType: string;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  siteAddress: string | null;
  notes: string | null;
  createdAt: string;
  totalAmount: number | null;
  totalAmountInc: number | null;
  quoteReference: string | null;
  status: string | null;
  scopeSummaryText: string | null;
  sentAt: string | null;
  approvedAt: string | null;
  declinedAt: string | null;
  depositPaid: boolean | null;
  depositAmount: number | null;
  siteInspectionDate: string | null;
  estimatedStartDate: string | null;
  assignedTo: string | null;
  followUpDate: string | null;
  jobReference: string | null;
  deckingRequired: boolean | null;
  length: string;
  width: string;
  height: string | null;
  boardType: string | null;
  boardSize: string | null;
  joistSize: string | null;
  bearerSize: string | null;
  verandahRequired: boolean | null;
  structureType: string | null;
  materialType: string | null;
  structureStyle: string | null;
  roofType: string | null;
  roofSpan: string | null;
  roofLength: string | null;
  roofPitch: string | null;
  screeningRequired: boolean | null;
  wallType: string | null;
  screenMaterial: string | null;
  claddingHeight: string | null;
  numberOfBays: number | null;
  councilApproval: boolean | null;
  constructionAccess: string | null;
  groundConditions: string | null;
  electricalWorkRequired: boolean | null;
  numCeilingFans: string | null;
  numHeaters: string | null;
  numLights: string | null;
  numPowerPoints: string | null;
}

const STATUS_META: Record<string, { bg: string; text: string; label: string; dot: string; borderColor: string }> = {
  draft:    { bg: "bg-gray-100",  text: "text-gray-600",  dot: "bg-gray-400",  label: "Draft",    borderColor: "border-gray-200" },
  sent:     { bg: "bg-blue-50",   text: "text-blue-700",  dot: "bg-blue-500",  label: "Sent",     borderColor: "border-blue-200" },
  approved: { bg: "bg-green-50",  text: "text-green-700", dot: "bg-green-500", label: "Approved", borderColor: "border-green-200" },
  declined: { bg: "bg-red-50",    text: "text-red-700",   dot: "bg-red-400",   label: "Declined", borderColor: "border-red-200" },
};

const SpecRow = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <div className="flex gap-2 text-sm py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 w-32 flex-shrink-0">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  ) : null;

function StatusBadge({ status }: { status: string | null }) {
  const s = STATUS_META[status ?? "draft"] ?? STATUS_META.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function QuoteDetail() {
  const [match, params] = useRoute<{ id: string }>("/quotes/:id");
  const [, navigate] = useLocation();
  const quoteId = match && params?.id ? parseInt(params.id, 10) : undefined;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCrm, setShowCrm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobFields, setJobFields] = useState<Record<string, string>>({});

  const { data: quote, isLoading, error } = useQuery<QuoteResponse>({
    queryKey: [`/api/quotes/${quoteId}`],
    enabled: !!quoteId,
  });

  const { data: crmPayload } = useQuery({
    queryKey: [`/api/quotes/${quoteId}/crm-export`],
    enabled: !!quoteId && showCrm,
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      apiRequest("PATCH", `/api/quotes/${quoteId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/quotes/${quoteId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
    },
  });

  const jobMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiRequest("PATCH", `/api/quotes/${quoteId}/job`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/quotes/${quoteId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({ title: "Saved", description: "Job details updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/quotes/${quoteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({ title: "Quote deleted" });
      navigate("/quotes");
    },
  });

  const handleStatus = (status: string, label: string) => {
    statusMutation.mutate({ status }, {
      onSuccess: () => toast({ title: `Marked as ${label}` }),
    });
  };

  const handleJobSave = () => {
    const data: Record<string, unknown> = {};
    if (jobFields.siteInspectionDate !== undefined) data.siteInspectionDate = jobFields.siteInspectionDate;
    if (jobFields.estimatedStartDate !== undefined) data.estimatedStartDate = jobFields.estimatedStartDate;
    if (jobFields.assignedTo !== undefined) data.assignedTo = jobFields.assignedTo;
    if (jobFields.followUpDate !== undefined) data.followUpDate = jobFields.followUpDate;
    if (jobFields.jobReference !== undefined) data.jobReference = jobFields.jobReference;
    if (Object.keys(data).length > 0) jobMutation.mutate(data);
  };

  const handleDepositToggle = () => {
    jobMutation.mutate({ depositPaid: !quote?.depositPaid }, {
      onSuccess: () => toast({ title: quote?.depositPaid ? "Deposit marked unpaid" : "Deposit marked paid" }),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: "#f5f5f0" }}>
        <div className="bg-white border-b border-gray-200/80 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-5">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen" style={{ background: "#f5f5f0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/quotes">
            <div className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1f3d2b] mb-6 cursor-pointer">
              <ArrowLeft className="h-4 w-4" /> Back to quotes
            </div>
          </Link>
          <div className="ds-card p-10 text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Quote Not Found</h2>
            <p className="text-sm text-gray-400 mb-6">This quote doesn't exist or has been removed.</p>
            <Link href="/quotes">
              <div className="inline-flex items-center gap-2 bg-[#1f3d2b] text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer hover:bg-[#2d5a3d] transition-colors">
                View All Quotes
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalExGST = quote.totalAmount ? quote.totalAmount / 100 : null;
  const totalIncGST = quote.totalAmountInc
    ? quote.totalAmountInc / 100
    : totalExGST !== null ? totalExGST * 1.1 : null;
  const formattedDate = quote.createdAt ? format(new Date(quote.createdAt), "d MMMM yyyy") : "—";
  const projectLabel = quote.projectType.replace(/-/g, " + ").replace(/\b\w/g, c => c.toUpperCase());
  const status = quote.status ?? "draft";
  const statusStyle = STATUS_META[status] ?? STATUS_META.draft;
  const depositAmt = quote.depositAmount ? quote.depositAmount / 100 : totalIncGST ? totalIncGST * 0.2 : null;

  const hasElectrical = quote.electricalWorkRequired && [
    quote.numCeilingFans, quote.numHeaters, quote.numLights, quote.numPowerPoints
  ].some(v => v && parseInt(v) > 0);

  const jobField = (key: string, fallback: string | null) =>
    jobFields[key] !== undefined ? jobFields[key] : (fallback ?? "");

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f0" }}>

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link href="/quotes">
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1f3d2b] mb-3 cursor-pointer transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> All Quotes
            </div>
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {quote.clientName || "Unnamed Quote"}
                </h1>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#1f3d2b]/10 text-[#1f3d2b]">
                  {projectLabel}
                </span>
                <StatusBadge status={status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                {quote.quoteReference && (
                  <span className="flex items-center gap-1 font-mono font-semibold text-[#1f3d2b]/70">
                    <Tag className="h-3 w-3" />{quote.quoteReference}
                  </span>
                )}
                {quote.jobReference && (
                  <span className="flex items-center gap-1 font-mono font-semibold text-amber-700/70">
                    <Briefcase className="h-3 w-3" />{quote.jobReference}
                  </span>
                )}
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formattedDate}</span>
                {quote.clientEmail && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{quote.clientEmail}</span>}
                {quote.clientPhone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{quote.clientPhone}</span>}
                {quote.siteAddress && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{quote.siteAddress}</span>}
                {quote.assignedTo && <span className="flex items-center gap-1"><User className="h-3 w-3" />{quote.assignedTo}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="ds-btn-ghost text-xs px-3 py-2">
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button
                onClick={() => { if (navigator.share) navigator.share({ title: `Quote — ${quote.clientName}`, url: window.location.href }); else navigator.clipboard.writeText(window.location.href).then(() => toast({ title: "Link copied!" })); }}
                className="ds-btn-ghost text-xs px-3 py-2"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="ds-btn-ghost text-xs px-3 py-2 text-red-500 hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATUS ACTION BAR ── */}
      {status !== "approved" && (
        <div className={`border-b ${statusStyle.borderColor}`} style={{ background: status === "sent" ? "#eff6ff" : status === "declined" ? "#fff5f5" : "#f9fafb" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-gray-500">
              {status === "draft" && "Ready to send this quote to the client?"}
              {status === "sent" && `Sent${quote.sentAt ? ` on ${format(new Date(quote.sentAt), "d MMM yyyy")}` : ""} — waiting for client response.`}
              {status === "declined" && `Declined${quote.declinedAt ? ` on ${format(new Date(quote.declinedAt), "d MMM yyyy")}` : ""}. You can reactivate or archive this quote.`}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {status === "draft" && (
                <button
                  onClick={() => handleStatus("sent", "Sent")}
                  disabled={statusMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-60"
                >
                  {statusMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Mark as Sent
                </button>
              )}
              {status === "sent" && (
                <>
                  <button
                    onClick={() => handleStatus("approved", "Approved")}
                    disabled={statusMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors disabled:opacity-60"
                  >
                    {statusMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Mark as Approved
                  </button>
                  <button
                    onClick={() => handleStatus("declined", "Declined")}
                    disabled={statusMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-60"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Decline
                  </button>
                  <button
                    onClick={() => handleStatus("draft", "Draft")}
                    disabled={statusMutation.isPending}
                    className="ds-btn-ghost text-xs px-3 py-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Back to Draft
                  </button>
                </>
              )}
              {status === "declined" && (
                <button
                  onClick={() => handleStatus("draft", "Draft")}
                  disabled={statusMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white text-xs font-bold transition-colors disabled:opacity-60"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reactivate as Draft
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVAL BANNER ── */}
      {status === "approved" && (
        <div className="bg-green-600 border-b border-green-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Approved{quote.approvedAt ? ` on ${format(new Date(quote.approvedAt), "d MMM yyyy")}` : ""} — complete the job handover details below.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatus("sent", "Sent")}
                disabled={statusMutation.isPending}
                className="text-green-100 hover:text-white text-xs underline"
              >
                Revert to Sent
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-5">

          {/* ── LEFT COLUMN ── */}
          <div className="md:col-span-1 space-y-5">

            {/* Total card */}
            <div className="ds-card overflow-hidden">
              <div className="bg-[#1f3d2b] px-5 py-5">
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1">Total Investment</p>
                {totalIncGST !== null ? (
                  <p className="font-bold text-white leading-none" style={{ fontSize: "2rem" }}>
                    {formatCurrency(totalIncGST)}
                  </p>
                ) : (
                  <p className="text-white/60 text-sm">Not calculated</p>
                )}
                <p className="text-white/40 text-xs mt-1.5">inc GST</p>
              </div>
              {totalExGST !== null && (
                <div className="px-5 py-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal (ex GST)</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(totalExGST)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>GST (10%)</span>
                    <span>{formatCurrency(totalExGST * 0.1)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total (inc GST)</span>
                    <span className="text-[#1f3d2b]">{formatCurrency(totalExGST * 1.1)}</span>
                  </div>
                </div>
              )}
              <div className="px-5 pb-4 pt-0">
                <p className="text-[10px] text-gray-400">Estimate only · Valid 30 days · Subject to site inspection</p>
              </div>
            </div>

            {/* Quote record */}
            <div className="ds-card px-5 py-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Quote Record</p>
              <div className="space-y-2.5">
                {quote.quoteReference && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><Tag className="h-3 w-3" />Reference</span>
                    <span className="font-mono font-semibold text-[#1f3d2b]">{quote.quoteReference}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1.5"><Clock className="h-3 w-3" />Created</span>
                  <span className="font-medium text-gray-700">{formattedDate}</span>
                </div>
                {quote.sentAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><Send className="h-3 w-3" />Sent</span>
                    <span className="font-medium text-gray-700">{format(new Date(quote.sentAt), "d MMM yyyy")}</span>
                  </div>
                )}
                {quote.approvedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-green-500" />Approved</span>
                    <span className="font-medium text-green-700">{format(new Date(quote.approvedAt), "d MMM yyyy")}</span>
                  </div>
                )}
                {quote.declinedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><XCircle className="h-3 w-3 text-red-400" />Declined</span>
                    <span className="font-medium text-red-600">{format(new Date(quote.declinedAt), "d MMM yyyy")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>

            {/* Deposit card (always visible if there's a price) */}
            {depositAmt !== null && (
              <div className={`ds-card px-5 py-4 ${quote.depositPaid ? "bg-green-50/60 border-green-200" : ""}`}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {quote.depositPaid ? "✓ Deposit Received" : "Deposit Required"}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(depositAmt)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">20% of total inc GST</p>
                  </div>
                  <button
                    onClick={handleDepositToggle}
                    disabled={jobMutation.isPending}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      quote.depositPaid
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-800 text-white hover:bg-gray-900"
                    }`}
                  >
                    {quote.depositPaid ? "✓ Paid" : "Mark Paid"}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">Balance of {totalIncGST && depositAmt ? formatCurrency(totalIncGST - depositAmt) : "—"} payable on completion.</p>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="md:col-span-2 space-y-5">

            {/* Scope summary */}
            {quote.scopeSummaryText && (
              <div className="ds-card px-6 py-5">
                <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Project Scope</p>
                <p className="text-sm text-gray-700 leading-relaxed">{quote.scopeSummaryText}</p>
              </div>
            )}

            {/* ── JOB HANDOVER PANEL ── */}
            <div className="ds-card">
              <div className="ds-card-header">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${status === "approved" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">
                    Job Handover{quote.jobReference && <span className="ml-2 font-mono text-xs text-amber-700 font-normal">{quote.jobReference}</span>}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {status === "approved"
                      ? "Fill in the details below to prepare for construction handover"
                      : "These fields become active once the quote is approved"}
                  </p>
                </div>
              </div>
              <div className="ds-card-body">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "jobReference",       label: "Job Reference",        icon: Tag,          ph: "e.g. JOB-2026-0001",  fallback: quote.jobReference },
                    { key: "assignedTo",          label: "Assigned To",          icon: User,         ph: "Estimator / Rep name", fallback: quote.assignedTo },
                    { key: "siteInspectionDate",  label: "Site Inspection Date", icon: CalendarDays, ph: "e.g. 28 Mar 2026",     fallback: quote.siteInspectionDate },
                    { key: "estimatedStartDate",  label: "Est. Start Date",      icon: CalendarDays, ph: "e.g. 14 Apr 2026",     fallback: quote.estimatedStartDate },
                    { key: "followUpDate",        label: "Follow-up Date",       icon: Clock,        ph: "e.g. 20 Mar 2026",     fallback: quote.followUpDate },
                  ].map(({ key, label, icon: Icon, ph, fallback }) => (
                    <div key={key} className="ds-field">
                      <label className="ds-label flex items-center gap-1.5">
                        <Icon className="h-3 w-3 text-gray-400" />{label}
                      </label>
                      <input
                        type="text"
                        disabled={status !== "approved" && key !== "assignedTo" && key !== "followUpDate"}
                        value={jobField(key, fallback)}
                        onChange={e => setJobFields(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={ph}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3d2b]/20 focus:border-[#1f3d2b]/40 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2 mt-1 border-t border-gray-50">
                  <button
                    onClick={handleJobSave}
                    disabled={jobMutation.isPending || Object.keys(jobFields).length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f3d2b] hover:bg-[#2d5a3d] text-white text-sm font-bold transition-all disabled:opacity-50"
                  >
                    {jobMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    Save Job Details
                  </button>
                </div>
              </div>
            </div>

            {/* ── QUOTE DETAILS ── */}
            <div className="ds-card">
              <div className="ds-card-header">
                <h2 className="font-semibold text-gray-900 text-sm">Quote Details</h2>
              </div>
              <div className="ds-card-body">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Client</p>
                    <SpecRow label="Name" value={quote.clientName} />
                    <SpecRow label="Email" value={quote.clientEmail} />
                    <SpecRow label="Phone" value={quote.clientPhone} />
                    <SpecRow label="Site Address" value={quote.siteAddress} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Site</p>
                    <SpecRow label="Access" value={quote.constructionAccess} />
                    <SpecRow label="Ground" value={quote.groundConditions} />
                    <SpecRow label="Council" value={quote.councilApproval ? "Approval required" : "Not required"} />
                  </div>

                  {quote.deckingRequired && (
                    <div>
                      <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Decking</p>
                      {quote.length && quote.width && (
                        <div className="flex gap-2 text-sm py-1.5 border-b border-gray-50">
                          <span className="text-gray-400 w-32 flex-shrink-0">Dimensions</span>
                          <span className="font-medium text-gray-800 flex items-center gap-1">
                            <Ruler className="h-3 w-3" /> {quote.length}m × {quote.width}m {quote.height && `at ${quote.height}m`}
                          </span>
                        </div>
                      )}
                      <SpecRow label="Board Type" value={quote.boardType} />
                      <SpecRow label="Board Size" value={quote.boardSize} />
                      <SpecRow label="Joist Size" value={quote.joistSize} />
                      <SpecRow label="Bearer Size" value={quote.bearerSize} />
                    </div>
                  )}

                  {quote.verandahRequired && (
                    <div>
                      <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Verandah / Pergola</p>
                      <SpecRow label="Type" value={quote.structureType} />
                      <SpecRow label="Material" value={quote.materialType} />
                      <SpecRow label="Style" value={quote.structureStyle} />
                      <SpecRow label="Roof" value={quote.roofType} />
                      {quote.roofSpan && quote.roofLength && (
                        <div className="flex gap-2 text-sm py-1.5 border-b border-gray-50">
                          <span className="text-gray-400 w-32 flex-shrink-0">Dimensions</span>
                          <span className="font-medium text-gray-800">{quote.roofSpan}m × {quote.roofLength}m{quote.roofPitch && ` @ ${quote.roofPitch}°`}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {quote.screeningRequired && (
                    <div>
                      <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Walls & Screening</p>
                      <SpecRow label="Type" value={quote.wallType} />
                      <SpecRow label="Material" value={quote.screenMaterial} />
                      <SpecRow label="Height" value={quote.claddingHeight ? `${quote.claddingHeight}m` : null} />
                      <SpecRow label="Bays" value={quote.numberOfBays ? String(quote.numberOfBays) : null} />
                    </div>
                  )}

                  {hasElectrical && (
                    <div>
                      <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Electrical</p>
                      {quote.numCeilingFans && parseInt(quote.numCeilingFans) > 0 && <SpecRow label="Ceiling Fans" value={quote.numCeilingFans} />}
                      {quote.numHeaters && parseInt(quote.numHeaters) > 0 && <SpecRow label="Heaters" value={quote.numHeaters} />}
                      {quote.numLights && parseInt(quote.numLights) > 0 && <SpecRow label="Lights" value={quote.numLights} />}
                      {quote.numPowerPoints && parseInt(quote.numPowerPoints) > 0 && <SpecRow label="Power Points" value={quote.numPowerPoints} />}
                    </div>
                  )}

                  {quote.notes && (
                    <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-[#1f3d2b] uppercase tracking-widest mb-2">Notes</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{quote.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── CRM EXPORT ── */}
            <div className="ds-card">
              <button
                onClick={() => setShowCrm(!showCrm)}
                className="ds-card-header w-full text-left hover:bg-gray-50/70 rounded-t-2xl transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-violet-50 text-violet-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 text-sm">CRM / Airtable Export</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Structured JSON payload — ready for Airtable, Make, Zapier, or webhook</p>
                </div>
                {showCrm ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>

              {showCrm && (
                <div className="ds-card-body">
                  <div className="relative">
                    <pre className="text-[11px] leading-relaxed text-gray-600 bg-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto max-h-80 font-mono">
                      {crmPayload ? JSON.stringify(crmPayload, null, 2) : "Loading…"}
                    </pre>
                    <button
                      onClick={() => {
                        if (crmPayload) {
                          navigator.clipboard.writeText(JSON.stringify(crmPayload, null, 2));
                          toast({ title: "Copied!", description: "CRM payload copied to clipboard" });
                        }
                      }}
                      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-green-300 text-[11px] font-medium transition-colors"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3">
                    This payload contains all fields needed for Airtable CRM, job scheduling, and workflow automation. Add a webhook URL in your settings to push this automatically on status changes.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="mt-6">
          <Link href="/quotes">
            <div className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1f3d2b] cursor-pointer transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to all quotes
            </div>
          </Link>
        </div>
      </div>

      {/* ── DELETE CONFIRMATION DIALOG ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Delete this quote?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>{quote.quoteReference || `Quote #${quote.id}`}</strong> for <strong>{quote.clientName || "unnamed client"}</strong> will be permanently deleted. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); deleteMutation.mutate(); }}
                disabled={deleteMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete Quote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
