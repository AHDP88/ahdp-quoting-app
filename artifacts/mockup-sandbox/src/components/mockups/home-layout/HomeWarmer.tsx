import React from "react";
import { ArrowRight, PlusCircle, ClipboardList, Layers, Ruler, CheckCircle2, ChevronRight } from "lucide-react";
import './_group.css';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value);
};

const mockQuotes = [
  { id: 1, clientName: "James Wilkinson", projectType: "deck", length: 6, width: 4, totalAmount: 1890000, status: "approved" },
  { id: 2, clientName: "Sarah Chen", projectType: "verandah", length: 8, width: 5, totalAmount: 2750000, status: "sent" },
  { id: 3, clientName: "Tom & Lisa Nguyen", projectType: "pergola", length: 5, width: 4, totalAmount: 1540000, status: "draft" },
  { id: 4, clientName: "Mark Sutherland", projectType: "deck-verandah", length: 10, width: 6, totalAmount: 4850000, status: "approved" },
  { id: 5, clientName: "Emma Kowalski", projectType: "screening", length: 7, width: 0, totalAmount: 880000, status: "draft" },
  { id: 6, clientName: "David & Rebecca Park", projectType: "pergola", length: 4, width: 4, totalAmount: 1210000, status: "sent" },
];

export function HomeWarmer() {
  const features = [
    { icon: Ruler, title: "Accurate Pricing", desc: "Real pricing pulled directly from AHDP's official price sheets with tiered rates." },
    { icon: Layers, title: "Full Project Scope", desc: "Covers decking, pergolas, verandahs, screening, electrical and extras all in one quote." },
    { icon: CheckCircle2, title: "Professional Output", desc: "Generate detailed, itemised quote summaries with GST breakdowns ready for clients." },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f0" }}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1f3d2b]">
        <div className="absolute inset-0 opacity-18"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #8b5a2b 0%, transparent 60%), radial-gradient(circle at 80% 20%, #2d5a3d 0%, transparent 60%), radial-gradient(circle at 90% 50%, #a0673a 0%, transparent 60%)" }}
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
              <a href="#" onClick={e => e.preventDefault()} className="inline-flex items-center justify-center gap-2 bg-white text-[#1f3d2b] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-all shadow-lg cursor-pointer">
                <PlusCircle className="h-5 w-5" />
                Create New Quote
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#" onClick={e => e.preventDefault()} className="inline-flex items-center justify-center gap-2 bg-[#8b5a2b]/20 hover:bg-[#8b5a2b]/30 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all border border-[#8b5a2b]/40 cursor-pointer">
                <ClipboardList className="h-4 w-4" />
                View All Quotes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-[#8b5a2b]/12 shadow-[0_2px_10px_rgba(139,90,43,0.07)] border-l-4 border-l-[#8b5a2b]/30">
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
            <a href="#" onClick={e => e.preventDefault()} className="flex items-center gap-1 text-sm text-[#1f3d2b] font-medium hover:underline cursor-pointer">
              View all <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockQuotes.slice(0, 6).map((quote) => {
              const totalIncGST = quote.totalAmount ? (quote.totalAmount / 100) * 1.1 : null;
              const projectLabel = quote.projectType.replace(/-/g, " + ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <a key={quote.id} href="#" onClick={e => e.preventDefault()} className="block bg-[#fafaf8] rounded-xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#8b5a2b]/30 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1f3d2b] transition-colors">{quote.clientName}</h3>
                      <span className="bg-[#8b5a2b]/8 text-[#8b5a2b] text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 inline-block">{projectLabel}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#8b5a2b] transition-colors mt-0.5" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-xs text-gray-500">
                      {quote.length && quote.width ? `${quote.length}m × ${quote.width}m` : "—"}
                    </div>
                    {totalIncGST !== null && (
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#8b5a2b]">{formatCurrency(totalIncGST)}</p>
                        <p className="text-[10px] text-gray-400">inc GST</p>
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeWarmer;
