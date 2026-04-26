import React from 'react';
import { Plus, ArrowRight, FileText, CheckCircle, Calculator, FileCheck, Layers, Settings, ChevronRight } from 'lucide-react';
import './_group.css';

const mockQuotes = [
  { id: 1, clientName: "James Wilkinson", projectType: "deck", length: 6, width: 4, totalAmount: 1890000, status: "approved" },
  { id: 2, clientName: "Sarah Chen", projectType: "verandah", length: 8, width: 5, totalAmount: 2750000, status: "sent" },
  { id: 3, clientName: "Tom & Lisa Nguyen", projectType: "pergola", length: 5, width: 4, totalAmount: 1540000, status: "draft" },
  { id: 4, clientName: "Mark Sutherland", projectType: "deck-verandah", length: 10, width: 6, totalAmount: 4850000, status: "approved" },
  { id: 5, clientName: "Emma Kowalski", projectType: "screening", length: 7, width: 0, totalAmount: 880000, status: "draft" },
  { id: 6, clientName: "David & Rebecca Park", projectType: "pergola", length: 4, width: 4, totalAmount: 1210000, status: "sent" },
];

const features = [
  {
    icon: <Calculator className="w-5 h-5 text-[#8b5a2b]" />,
    title: "Accurate Pricing",
    description: "Real pricing from AHDP official price sheets with tiered rates"
  },
  {
    icon: <Layers className="w-5 h-5 text-[#8b5a2b]" />,
    title: "Full Project Scope",
    description: "Covers decking, pergolas, verandahs, screening, electrical and extras"
  },
  {
    icon: <FileCheck className="w-5 h-5 text-[#8b5a2b]" />,
    title: "Professional Output",
    description: "Itemised quote summaries with GST breakdowns ready for clients"
  }
];

export function SplitDashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'deck': return 'bg-orange-100 text-orange-800';
      case 'pergola': return 'bg-purple-100 text-purple-800';
      case 'verandah': return 'bg-teal-100 text-teal-800';
      case 'deck-verandah': return 'bg-indigo-100 text-indigo-800';
      case 'screening': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans text-slate-900">
      {/* Compact Header Strip */}
      <header className="h-[100px] bg-[#1f3d2b] text-white px-6 md:px-12 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-baseline space-x-3">
          <h1 className="text-2xl font-bold tracking-tight">AH Decks & Pergolas</h1>
          <span className="text-[#8b5a2b] font-medium hidden sm:inline-block">—</span>
          <span className="text-gray-300 font-medium text-lg hidden sm:inline-block">Quote Builder</span>
        </div>
        <button className="bg-white text-[#1f3d2b] hover:bg-gray-100 px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Create New Quote
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Quotes (65% width approximately -> 8 cols of 12) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Quotes</h2>
                <span className="bg-white px-2.5 py-0.5 rounded-full text-sm font-semibold text-gray-600 shadow-sm border border-gray-200">
                  {mockQuotes.length} total
                </span>
              </div>
              <button className="text-[#1f3d2b] hover:text-[#162d20] font-medium text-sm flex items-center transition-colors group">
                View all quotes 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {mockQuotes.map((quote) => (
                <div 
                  key={quote.id} 
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-[#8b5a2b] hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider ${getProjectTypeColor(quote.projectType)}`}>
                      {quote.projectType.replace('-', ' & ')}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(quote.status)}`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#1f3d2b] transition-colors">
                    {quote.clientName}
                  </h3>
                  
                  <div className="text-sm text-gray-500 mb-4 flex-grow">
                    {quote.length > 0 && quote.width > 0 ? (
                      <>{quote.length}m × {quote.width}m dimensions</>
                    ) : (
                      <>Custom dimensions</>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Total inc. GST</div>
                      <div className="text-xl font-bold text-gray-900">{formatCurrency(quote.totalAmount)}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1f3d2b] group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Platform Overview & Stats (35% width approximately -> 4 cols of 12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stats Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[#f5f5f0] rounded-lg">
                  <div className="text-2xl font-black text-[#1f3d2b]">{mockQuotes.length}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1 uppercase">Total</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-black text-emerald-700">2</div>
                  <div className="text-xs font-medium text-emerald-600 mt-1 uppercase">Approved</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-black text-blue-700">2</div>
                  <div className="text-xs font-medium text-blue-600 mt-1 uppercase">Pending</div>
                </div>
              </div>
            </div>

            {/* Platform Overview Features */}
            <div className="bg-[#1f3d2b] text-white rounded-xl shadow-md p-1 border border-[#162d20]">
              <div className="bg-[#162d20] rounded-t-lg p-4">
                <h2 className="font-semibold flex items-center text-gray-100">
                  <Settings className="w-4 h-4 mr-2 text-[#8b5a2b]" />
                  Platform Capabilities
                </h2>
              </div>
              <div className="p-3 space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 flex items-start space-x-4 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-[#8b5a2b]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                      <p className="text-gray-300 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default SplitDashboard;
