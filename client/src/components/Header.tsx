import React from "react";
import { Link, useLocation } from "wouter";
import { Home, FileText, PlusCircle, Settings } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  const navLink = (href: string, label: string, Icon: React.ElementType) => (
    <Link href={href}>
      <div className={`flex items-center gap-1.5 text-sm font-medium cursor-pointer transition-colors px-3 py-1.5 rounded-md ${
        location === href
          ? "text-white bg-white/15"
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <header className="bg-[#1f3d2b] border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-[#1f3d2b] text-xs font-bold tracking-tight">AHDP</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-sm leading-tight">AH Decks & Pergolas</p>
              <p className="text-white/50 text-xs">Quote Builder</p>
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {navLink("/", "Home", Home)}
          {navLink("/quotes", "Quotes", FileText)}
          {navLink("/settings", "Settings", Settings)}
          <Link href="/create-quote">
            <div className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer ml-2 bg-white text-[#1f3d2b] px-4 py-1.5 rounded-lg hover:bg-white/90 transition-colors shadow-sm">
              <PlusCircle className="h-4 w-4" />
              <span>New Quote</span>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
