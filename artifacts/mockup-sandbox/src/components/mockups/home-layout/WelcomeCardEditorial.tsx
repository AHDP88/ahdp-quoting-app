import React from 'react';
import './_group.css';
import { 
  Plus, FileText, Calculator, Layers, FileCheck, ChevronRight
} from 'lucide-react';

const mockQuotes = [
  { id: 1, clientName: "James Wilkinson", projectType: "deck", length: 6, width: 4, totalAmount: 1890000, status: "approved" },
  { id: 2, clientName: "Sarah Chen", projectType: "verandah", length: 8, width: 5, totalAmount: 2750000, status: "sent" },
  { id: 3, clientName: "Tom & Lisa Nguyen", projectType: "pergola", length: 5, width: 4, totalAmount: 1540000, status: "draft" },
  { id: 4, clientName: "Mark Sutherland", projectType: "deck-verandah", length: 10, width: 6, totalAmount: 4850000, status: "approved" },
  { id: 5, clientName: "Emma Kowalski", projectType: "screening", length: 7, width: 0, totalAmount: 880000, status: "draft" },
  { id: 6, clientName: "David & Rebecca Park", projectType: "pergola", length: 4, width: 4, totalAmount: 1210000, status: "sent" },
];

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-AU', { 
    style: 'currency', 
    currency: 'AUD',
    maximumFractionDigits: 0 
  }).format(cents / 100);
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-emerald-100 text-emerald-800';
    case 'sent': return 'bg-blue-100 text-blue-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getProjectTypeBorder = (type: string) => {
  if (type.includes('deck')) return 'border-l-amber-500';
  if (type.includes('verandah')) return 'border-l-sky-500';
  if (type.includes('pergola')) return 'border-l-emerald-500';
  return 'border-l-gray-400';
};

export function WelcomeCardEditorial() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] p-6 font-sans flex flex-col items-center">
      
      {/* Welcome Card */}
      <div className="w-full max-w-[920px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12 relative mt-8">
        {/* Top Accent Bar */}
        <div className="h-2 bg-[#1f3d2b] w-full absolute top-0 left-0" />
        
        <div className="p-10 flex flex-col items-center text-center">
          
          {/* Brand Badge */}
          <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-[#1f3d2b] to-[#8b5a2b] flex items-center justify-center shadow-[0_8px_24px_rgba(31,61,43,0.25)] mb-8">
            <span className="text-white font-bold tracking-widest text-sm">AHDP</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
            AHDP Pricing
          </h1>
          <p className="text-base font-medium text-[#1f3d2b] mb-8">
            Quote Builder
          </p>

          <div className="w-16 h-px bg-gray-200 mb-8" />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mb-12">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1f3d2b] hover:bg-[#1f3d2b]/90 text-white py-3.5 px-8 rounded-xl font-medium transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
              Create New Quote
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-[#1f3d2b]/30 text-[#1f3d2b] hover:bg-gray-50 py-3.5 px-8 rounded-xl font-medium transition-colors">
              <FileText className="w-5 h-5" />
              View All Quotes
            </button>
          </div>

          {/* Feature Trio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full border-t border-gray-100 pt-8 mt-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#1f3d2b]/8 text-[#1f3d2b] flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Tiered Pricing</h3>
              <p className="text-xs text-gray-400">Tiered AHDP rates</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#1f3d2b]/8 text-[#1f3d2b] flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Multiple Structures</h3>
              <p className="text-xs text-gray-400">Deck, pergola & more</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#1f3d2b]/8 text-[#1f3d2b] flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Detailed Summaries</h3>
              <p className="text-xs text-gray-400">GST-ready summaries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="w-full max-w-[920px]">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <span className="text-sm font-medium text-gray-500 bg-gray-200/50 px-2.5 py-1 rounded-full">
              {mockQuotes.length} quotes
            </span>
          </div>
          <button className="text-sm font-medium text-[#1f3d2b] hover:underline flex items-center">
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Scroll Strip */}
        <div className="flex overflow-x-auto pb-6 -mx-6 px-6 sm:mx-0 sm:px-0 gap-4 hide-scrollbar snap-x">
          {mockQuotes.map(quote => (
            <div 
              key={quote.id} 
              className={`min-w-[280px] max-w-[280px] bg-white rounded-xl border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow cursor-pointer snap-start border-l-4 ${getProjectTypeBorder(quote.projectType)}`}
            >
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(quote.totalAmount)}
                </div>
                <div className="text-base font-semibold text-gray-700 truncate">
                  {quote.clientName}
                </div>
                <div className="text-xs text-gray-400 mt-1 capitalize">
                  {quote.projectType.replace('-', ' & ')} • {quote.length}x{quote.width}m
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${getStatusColor(quote.status)}`}>
                  {quote.status}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Ref #{String(quote.id).padStart(4, '0')}
                </span>
              </div>
            </div>
          ))}
          
          {/* View All Card */}
          <div className="min-w-[140px] bg-gray-50/50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-[#1f3d2b] hover:bg-gray-50 hover:border-[#1f3d2b]/30 transition-colors cursor-pointer snap-start">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
              <ChevronRight className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">View All</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
