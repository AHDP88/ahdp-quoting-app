import React from 'react';
import { 
  Plus, 
  Calculator, 
  Layers, 
  FileText, 
  ChevronRight,
  Calendar,
  Hammer
} from 'lucide-react';
import './_group.css';

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
    minimumFractionDigits: 0,
  }).format(cents / 100);
};

const formatDimensions = (length: number, width: number) => {
  if (width === 0) return `${length}m`;
  return `${length}m × ${width}m`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'draft': return 'bg-slate-200 text-slate-800 border-slate-300';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getProjectTypeDisplay = (type: string) => {
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ');
};

export function CommandCenter() {
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-900 font-sans">
      
      {/* Sidebar - The Command Center */}
      <div className="w-[260px] flex-shrink-0 flex flex-col justify-between" style={{ backgroundColor: '#1f3d2b' }}>
        <div className="p-6 flex flex-col gap-8">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded shadow-sm flex items-center justify-center text-white font-bold text-xl tracking-wider" style={{ backgroundColor: '#8b5a2b' }}>
              AH
            </div>
            <div>
              <h1 className="text-white font-semibold leading-tight text-lg">AH Decks &<br/>Pergolas</h1>
            </div>
          </div>
          
          {/* Primary Action */}
          <div className="flex flex-col gap-2">
            <button className="w-full py-3 px-4 rounded-md font-medium text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm" style={{ backgroundColor: '#8b5a2b' }}>
              <Plus size={18} strokeWidth={2.5} />
              <span>Create New Quote</span>
            </button>
            <p className="text-white/60 text-xs text-center mt-1 leading-relaxed">
              Generate accurate, professional quotes on site, in minutes.
            </p>
          </div>
          
          <div className="h-px w-full bg-white/10" />
          
          {/* Feature Highlights (Subordinated) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/80">
              <Calculator size={18} className="text-[#8b5a2b]" />
              <span className="text-sm font-medium">Accurate Pricing</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Layers size={18} className="text-[#8b5a2b]" />
              <span className="text-sm font-medium">Full Project Scope</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <FileText size={18} className="text-[#8b5a2b]" />
              <span className="text-sm font-medium">Professional Output</span>
            </div>
          </div>
          
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-6 mt-auto border-t border-white/10 flex flex-col gap-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-white/90 hover:text-white text-sm font-medium flex items-center justify-between group transition-colors">
            View All Quotes
            <ChevronRight size={16} className="text-white/50 group-hover:text-white transition-colors" />
          </a>
          <div className="text-white/40 text-xs font-mono">
            System v2.0
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#f5f5f0' }}>
        
        {/* Compact Top Bar */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-black/5 bg-white/40 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-800">Recent Quotes</h2>
            <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
              {mockQuotes.length} active
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Calendar size={15} />
            {today}
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="flex-grow overflow-y-auto p-8">
          {mockQuotes.length > 0 ? (
            <div className="flex flex-col bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
              {mockQuotes.map((quote, idx) => (
                <div 
                  key={quote.id} 
                  className={`flex items-center px-6 py-4 transition-colors hover:bg-slate-50 cursor-pointer ${idx !== mockQuotes.length - 1 ? 'border-b border-slate-100' : ''}`}
                  onClick={() => {}}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-4 flex-shrink-0">
                    <Hammer size={18} />
                  </div>
                  
                  <div className="flex-grow flex items-center gap-4 min-w-0">
                    <div className="font-semibold text-slate-800 truncate w-[200px]">
                      {quote.clientName}
                    </div>
                    
                    <div className="w-[140px] flex-shrink-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {getProjectTypeDisplay(quote.projectType)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-slate-500 w-[100px] flex-shrink-0 font-mono">
                      {formatDimensions(quote.length, quote.width)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                    <div className="font-medium text-slate-900 w-[100px] text-right">
                      {formatCurrency(quote.totalAmount)}
                    </div>
                    
                    <div className="w-[90px] flex justify-end">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)} capitalize text-center w-full`}>
                        {quote.status}
                      </div>
                    </div>
                    
                    <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-sm">No recent quotes found.</p>
            </div>
          )}
        </div>
        
      </div>
      
    </div>
  );
}

export default CommandCenter;
