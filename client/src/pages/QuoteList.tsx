import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import type { Quote } from "@shared/schema";
import { format } from "date-fns";
import {
  PlusCircle, ClipboardList, ChevronRight, Calendar, Phone,
  Ruler, Tag, MapPin, Send, CheckCircle, XCircle, RotateCcw,
  Briefcase
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type StatusFilter = "all" | "draft" | "sent" | "approved" | "declined";

const STATUS_META: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  draft:    { bg: "bg-gray-100",   text: "text-gray-600",  dot: "bg-gray-400",  label: "Draft" },
  sent:     { bg: "bg-blue-50",    text: "text-blue-700",  dot: "bg-blue-500",  label: "Sent" },
  approved: { bg: "bg-green-50",   text: "text-green-700", dot: "bg-green-500", label: "Approved" },
  declined: { bg: "bg-red-50",     text: "text-red-700",   dot: "bg-red-400",   label: "Declined" },
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "draft",    label: "Draft" },
  { key: "sent",     label: "Sent" },
  { key: "approved", label: "Approved" },
  { key: "declined", label: "Declined" },
];

function StatusBadge({ status }: { status: string | null }) {
  const s = STATUS_META[status ?? "draft"] ?? STATUS_META.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function QuoteList() {
  const { data, isLoading } = useQuery<Quote[]>({ queryKey: ["/api/quotes"] });
  const [filter, setFilter] = useState<StatusFilter>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/quotes/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
    },
  });

  const allQuotes = Array.isArray(data) ? data : [];
  const quotes = filter === "all" ? allQuotes : allQuotes.filter(q => (q.status ?? "draft") === filter);

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "all" ? allQuotes.length : allQuotes.filter(q => (q.status ?? "draft") === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  const handleQuickStatus = (e: React.MouseEvent, id: number, status: string, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    statusMutation.mutate({ id, status }, {
      onSuccess: () => toast({ title: `Quote marked as ${label}` }),
    });
  };

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f0" }}>
      <div className="bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote Pipeline</h1>
            <p className="text-sm text-gray-500 mt-0.5">{allQuotes.length} quote{allQuotes.length !== 1 ? "s" : ""} — AH Decks & Pergolas</p>
          </div>
          <Link href="/create-quote">
            <div className="inline-flex items-center gap-2 bg-[#1f3d2b] hover:bg-[#2d5a3d] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">New Quote</span>
              <span className="sm:hidden">New</span>
            </div>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  filter === key
                    ? "border-[#1f3d2b] text-[#1f3d2b]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {label}
                {counts[key] > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filter === key ? "bg-[#1f3d2b] text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {counts[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="ds-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-28" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : quotes.length > 0 ? (
          <div className="space-y-3">
            {quotes.map((quote: Quote) => {
              const totalIncGST = quote.totalAmountInc
                ? quote.totalAmountInc / 100
                : quote.totalAmount ? (quote.totalAmount / 100) * 1.1 : null;
              const totalExGST = quote.totalAmount ? quote.totalAmount / 100 : null;
              const projectLabel = quote.projectType
                .replace(/-/g, " + ")
                .replace(/\b\w/g, (c: string) => c.toUpperCase());
              const formattedDate = quote.createdAt
                ? format(new Date(quote.createdAt), "d MMM yyyy")
                : "—";
              const status = quote.status ?? "draft";
              const isApproved = status === "approved";

              return (
                <Link key={quote.id} href={`/quotes/${quote.id}`}>
                  <div className="ds-card cursor-pointer hover:shadow-md hover:border-[#1f3d2b]/25 transition-all group border border-gray-200/80">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Name row */}
                          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                            <h2 className="font-semibold text-gray-900 group-hover:text-[#1f3d2b] transition-colors text-base truncate">
                              {quote.clientName || "Unnamed Quote"}
                            </h2>
                            <StatusBadge status={status} />
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1f3d2b]/10 text-[#1f3d2b]">
                                <Briefcase className="h-2.5 w-2.5" />
                                {quote.jobReference || "Pending job"}
                              </span>
                            )}
                          </div>
                          {/* Meta chips */}
                          <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400">
                            {quote.quoteReference && (
                              <span className="flex items-center gap-1 font-mono text-[#1f3d2b]/60 font-medium">
                                <Tag className="h-3 w-3" />{quote.quoteReference}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />{formattedDate}
                            </span>
                            {quote.clientPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />{quote.clientPhone}
                              </span>
                            )}
                            {quote.siteAddress && (
                              <span className="flex items-center gap-1 truncate max-w-[200px]">
                                <MapPin className="h-3 w-3 flex-shrink-0" />{quote.siteAddress}
                              </span>
                            )}
                            {quote.length && quote.width && (
                              <span className="flex items-center gap-1">
                                <Ruler className="h-3 w-3" />{quote.length}m × {quote.width}m
                              </span>
                            )}
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1f3d2b]/8 text-[#1f3d2b]/70">
                              {projectLabel}
                            </span>
                          </div>
                        </div>

                        {/* Right side — price + actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            {totalIncGST !== null ? (
                              <>
                                <p className="text-[10px] text-gray-400 mb-0.5">Inc GST</p>
                                <p className="text-lg font-bold text-[#1f3d2b]">{formatCurrency(totalIncGST)}</p>
                                {totalExGST && <p className="text-[10px] text-gray-400">{formatCurrency(totalExGST)} ex</p>}
                              </>
                            ) : (
                              <p className="text-sm text-gray-400">—</p>
                            )}
                          </div>

                          {/* Quick action buttons */}
                          <div className="flex flex-col gap-1" onClick={e => e.preventDefault()}>
                            {status === "draft" && (
                              <button
                                onClick={e => handleQuickStatus(e, quote.id, "sent", "Sent")}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors"
                                title="Mark as Sent"
                              >
                                <Send className="h-3 w-3" /> Send
                              </button>
                            )}
                            {status === "sent" && (
                              <>
                                <button
                                  onClick={e => handleQuickStatus(e, quote.id, "approved", "Approved")}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-[11px] font-semibold transition-colors"
                                  title="Mark as Approved"
                                >
                                  <CheckCircle className="h-3 w-3" /> Approve
                                </button>
                                <button
                                  onClick={e => handleQuickStatus(e, quote.id, "declined", "Declined")}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold transition-colors"
                                  title="Mark as Declined"
                                >
                                  <XCircle className="h-3 w-3" /> Decline
                                </button>
                              </>
                            )}
                            {status === "declined" && (
                              <button
                                onClick={e => handleQuickStatus(e, quote.id, "draft", "Draft")}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-semibold transition-colors"
                                title="Reactivate as Draft"
                              >
                                <RotateCcw className="h-3 w-3" /> Reactivate
                              </button>
                            )}
                          </div>

                          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#1f3d2b] transition-colors" />
                        </div>
                      </div>

                      {/* Scope summary strip */}
                      {quote.scopeSummaryText && (
                        <p className="mt-3 text-[11px] text-gray-400 leading-relaxed border-t border-gray-50 pt-2.5 line-clamp-2">
                          {quote.scopeSummaryText}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 ds-card">
            <div className="w-14 h-14 rounded-2xl bg-[#1f3d2b]/8 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="h-7 w-7 text-[#1f3d2b]/50" />
            </div>
            {filter !== "all" ? (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No {filter} quotes</h3>
                <p className="text-sm text-gray-400 mb-5">No quotes with this status yet.</p>
                <button onClick={() => setFilter("all")} className="text-sm text-[#1f3d2b] font-medium hover:underline">
                  View all quotes
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No quotes yet</h3>
                <p className="text-sm text-gray-400 mb-7">Create your first quote to get started</p>
                <Link href="/create-quote">
                  <div className="inline-flex items-center gap-2 bg-[#1f3d2b] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2d5a3d] transition-colors cursor-pointer shadow-sm">
                    <PlusCircle className="h-4 w-4" />
                    Create New Quote
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
