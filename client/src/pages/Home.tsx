import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, PlusCircle, ClipboardList, Layers, Ruler, CheckCircle2, ChevronRight } from "lucide-react";
import type { Quote } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const { data, isLoading } = useQuery<Quote[]>({ queryKey: ["/api/quotes"] });
  const recentQuotes = Array.isArray(data) ? data : [];

  const features = [
    { icon: Ruler, title: "Accurate Pricing", desc: "Real pricing pulled directly from AHDP's official price sheets with tiered rates." },
    { icon: Layers, title: "Full Project Scope", desc: "Covers decking, pergolas, verandahs, screening, electrical and extras all in one quote." },
    { icon: CheckCircle2, title: "Professional Output", desc: "Generate detailed, itemised quote summaries with GST breakdowns ready for clients." },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f0" }}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1f3d2b]">
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.18,
            backgroundImage: "radial-gradient(circle at 20% 80%, #8b5a2b 0%, transparent 60%), radial-gradient(circle at 80% 20%, #2d5a3d 0%, transparent 60%), radial-gradient(circle at 90% 50%, #a0673a 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#8b5a2b]/30 border border-[#8b5a2b]/50 rounded-full px-4 py-1.5 text-white/85 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Professional Quoting Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-5">
              Deck & Pergola<br />
              <span className="text-[#e8c99a]">Quote Builder</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Generate accurate, professional quotes for decks, pergolas, verandahs and more — on site, in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/create-quote">
                <div className="inline-flex items-center justify-center gap-2 bg-white text-[#1f3d2b] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-all shadow-lg cursor-pointer">
                  <PlusCircle className="h-5 w-5" />
                  Create New Quote
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/quotes">
                <div className="inline-flex items-center justify-center gap-2 bg-[#8b5a2b]/20 hover:bg-[#8b5a2b]/30 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all border border-[#8b5a2b]/40 cursor-pointer">
                  <ClipboardList className="h-4 w-4" />
                  View All Quotes
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 border-l-4 border-l-[#8b5a2b]/30"
              style={{
                border: "1px solid rgba(139,90,43,0.12)",
                borderLeft: "4px solid rgba(139,90,43,0.30)",
                boxShadow: "0 2px 10px rgba(139,90,43,0.07)",
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#8b5a2b]/10 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-[#8b5a2b]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Quotes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-[#8b5a2b] uppercase tracking-widest mb-1">Activity</p>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Recent Quotes</h2>
            <Link href="/quotes">
              <div className="flex items-center gap-1 text-sm text-[#1f3d2b] font-medium hover:underline cursor-pointer">
                View all <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#fafaf8] rounded-xl p-5 border border-gray-200/80 shadow-sm">
                  <Skeleton className="h-5 w-36 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : recentQuotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentQuotes.slice(0, 6).map((quote: Quote) => {
                const totalExGST = quote.totalAmount ? quote.totalAmount / 100 : null;
                const projectLabel = quote.projectType
                  .replace(/-/g, " + ")
                  .replace(/\b\w/g, (c: string) => c.toUpperCase());
                return (
                  <Link key={quote.id} href={`/quotes/${quote.id}`}>
                    <div className="bg-[#fafaf8] rounded-xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#8b5a2b]/30 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#1f3d2b] transition-colors">
                            {quote.clientName || "Unnamed Quote"}
                          </h3>
                          <span className="inline-block text-[10px] font-medium bg-[#8b5a2b]/8 text-[#8b5a2b] px-1.5 py-0.5 rounded mt-1">
                            {projectLabel}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#8b5a2b] transition-colors mt-0.5" />
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-xs text-gray-500">
                          {quote.length && quote.width ? `${quote.length}m × ${quote.width}m` : "—"}
                        </div>
                        {totalExGST !== null && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#8b5a2b]">{formatCurrency(totalExGST * 1.1)}</p>
                            <p className="text-[10px] text-gray-400">inc GST</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#fafaf8] rounded-xl border border-gray-200/80">
              <div className="w-14 h-14 rounded-2xl bg-[#8b5a2b]/8 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-7 w-7 text-[#8b5a2b]/60" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No quotes yet</h3>
              <p className="text-sm text-gray-400 mb-6">Create your first quote to get started</p>
              <Link href="/create-quote">
                <div className="inline-flex items-center gap-2 bg-[#1f3d2b] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2d5a3d] transition-colors cursor-pointer">
                  <PlusCircle className="h-4 w-4" />
                  Create New Quote
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
