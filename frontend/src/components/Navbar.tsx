import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Grid3X3,
  BarChart3,
  Database,
  BrainCircuit,
  ShieldCheck,
  BookOpen,
  Info,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Stress Events', icon: Calendar },
    { id: 'heatmap', label: 'Sector Heatmap', icon: Grid3X3 },
    { id: 'analytics', label: 'Portfolio Analytics', icon: BarChart3 },
    { id: 'dataset', label: 'Dataset Explorer', icon: Database },
    { id: 'models', label: 'Model Laboratory', icon: BrainCircuit },
    { id: 'quality', label: 'Quality & Provenance', icon: ShieldCheck },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'about', label: 'About Research', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[#1E2D4A] bg-[#080E1E]/90 backdrop-blur-md">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 text-cyan-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                Major Capstone Project · Phase I
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Benchmark: NiftyStress-44
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4 self-end md:self-center">
          <div className="flex items-center space-x-2 bg-[#0F1A30] px-3 py-1.5 rounded-lg border border-[#1E2D4A] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">{systemStatus}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">44 Records Certified</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 border-t border-[#1E2D4A]/50 py-1.5" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F1A30]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
