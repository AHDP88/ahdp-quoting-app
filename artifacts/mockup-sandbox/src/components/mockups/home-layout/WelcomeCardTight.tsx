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

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800 border-green-200';
    case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getProjectTypeColor = (type: string) => {
  switch (type) {
    case 'deck': return 'bg-[#8b5a2b]';
    case 'pergola': return 'bg-[#1f3d2b]';
    case 'verandah': return 'bg-blue-600';
    case 'deck-verandah': return 'bg-purple-600';
    case 'screening': return 'bg-amber-600';
    default: return 'bg-gray-400';
  }
};

const getProjectTypeName = (type: string) => {
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ');
};

export function WelcomeCardTight() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Welcome Card */}
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-12 text-center mb-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#1f3d2b]"></div>
        
        {/* Brand Badge */}
        <div className="mx-auto w-20 h-20 rounded-xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2d5a3d] to-[#1f3d2b] flex items-center justify-center mb-6 shadow-sm border-2 border-white/15 ring-4 ring-white/10 ring-inset">
          <span className="text-white font-bold text-2xl tracking-widest">AH</span>
        </div>
        
        {/* Headings */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          AH Decks & Pergolas
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Quote Builder
        </p>
        
        <div className="w-16 h-px bg-gray-200 mx-auto mb-10"></div>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button className="flex items-center justify-center gap-2 bg-[#1f3d2b] hover:bg-[#152a1e] text-white px-7 py-3 rounded-xl font-medium transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            <span>Create New Quote</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#1f3d2b]/8 hover:bg-[#1f3d2b]/15 text-[#1f3d2b] px-7 py-3 rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" />
            <span>View All Quotes</span>
          </button>
        </div>
        
        {/* Features Trio */}
        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 mt-4">
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <div className="w-10 h-10 rounded-full bg-[#1f3d2b]/8 flex items-center justify-center text-[#1f3d2b] mb-1">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Accurate Pricing</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <div className="w-10 h-10 rounded-full bg-[#1f3d2b]/8 flex items-center justify-center text-[#1f3d2b] mb-1">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Full Scope</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <div className="w-10 h-10 rounded-full bg-[#1f3d2b]/8 flex items-center justify-center text-[#1f3d2b] mb-1">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Pro Output</span>
          </div>
        </div>
      </div>
      
      {/* Recent Quotes Section */}
      <div className="w-full max-w-[900px]">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <button className="text-sm font-medium text-[#1f3d2b] hover:text-[#152a1e] flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Horizontal Scroll Strip */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-4 snap-x hide-scrollbar">
          {mockQuotes.map((quote) => (
            <div 
              key={quote.id} 
              className="snap-start flex-none w-72 sm:w-80 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${getProjectTypeColor(quote.projectType)}`}></div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {getProjectTypeName(quote.projectType)}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1f3d2b] transition-colors line-clamp-1">
                {quote.clientName}
              </h3>
              
              <div className="text-sm text-gray-500 mb-4 flex flex-col gap-1">
                {quote.length > 0 && quote.width > 0 ? (
                  <span>{quote.length}m × {quote.width}m</span>
                ) : (
                  <span>Custom sizing</span>
                )}
                <span className="font-bold text-xl text-[#1f3d2b]">{formatCurrency(quote.totalAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${getStatusColor(quote.status)}`}>
                  {quote.status}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Quote #{1000 + quote.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Hide Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
