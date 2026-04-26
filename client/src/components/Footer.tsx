import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1f3d2b]/95 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-white rounded flex items-center justify-center">
            <span className="text-[#1f3d2b] text-[8px] font-bold">AHDP</span>
          </div>
          <span className="text-white/60 text-sm font-medium">AH Decks & Pergolas</span>
        </div>
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} · Professional Quote Builder · All prices are estimates only
        </p>
      </div>
    </footer>
  );
}
