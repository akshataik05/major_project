import React from 'react';
import {
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowRight,
  Database,
  BarChart2,
  Calendar,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { DatasetSummary, StressEventItem } from '../types';

interface OverviewPageProps {
  summary: DatasetSummary | null;
  stressEvents: StressEventItem[];
  setActiveTab: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ summary, stressEvents, setActiveTab }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Research Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#1E2D4A] relative overflow-hidden bg-gradient-to-br from-[#0F1A30] via-[#0A1224] to-[#080E1E]">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 w-64 h-64 rounded-full bg-teal-500/5 blur-2xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Capstone Major Project · Phase I</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            A fully reproducible quantitative benchmark framework constructing <strong className="text-cyan-400">NiftyStress-44</strong>: 
            the first standardized crisis-period portfolio risk dataset across 11 National Stock Exchange (NSE) sectors during four major macroeconomic shocks in Indian markets (2020–2023).
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('heatmap')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Explore 11×4 Risk Heatmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2D4A]/60 hover:bg-[#1E2D4A] border border-[#2A3F66] text-slate-200 font-medium text-xs sm:text-sm transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Model Benchmark Laboratory</span>
            </button>
            <button
              onClick={() => setActiveTab('dataset')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2D4A]/60 hover:bg-[#1E2D4A] border border-[#2A3F66] text-slate-200 font-medium text-xs sm:text-sm transition-colors"
            >
              <Database className="w-4 h-4 text-teal-400" />
              <span>Download Final Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Validated Records */}
        <div className="glass-panel p-5 rounded-xl border border-[#1E2D4A] glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider">Benchmark Records</span>
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">44 / 44</div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-400">
            <CheckCircle2Icon className="w-3.5 h-3.5" />
            <span>11 Sectors × 4 Stress Windows</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% verified schema compliance</p>
        </div>

        {/* Card 2: Risk Label Balance */}
        <div className="glass-panel p-5 rounded-xl border border-[#1E2D4A] glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider">Risk Distribution</span>
            <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            <span className="text-rose-400">26 High</span> <span className="text-slate-500">·</span> <span className="text-amber-400">18 Med</span>
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>0 Low Risk (Empirical Market Beta)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">MDD &lt; -15% (High) vs. -15% to -5% (Medium)</p>
        </div>

        {/* Card 3: Downside Severity */}
        <div className="glass-panel p-5 rounded-xl border border-[#1E2D4A] glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider">Severe Drawdown Peak</span>
            <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">-50.49%</div>
          <div className="mt-2 text-xs text-slate-300 font-medium">
            NIFTY Metal · COVID-19 Crash
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Average sector MDD across dataset: -21.07%</p>
        </div>

        {/* Card 4: Most Resilient Sector */}
        <div className="glass-panel p-5 rounded-xl border border-[#1E2D4A] glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider">Maximum Resilience</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">-6.68%</div>
          <div className="mt-2 text-xs text-slate-300 font-medium">
            NIFTY FMCG · RBI Rate Hike Cycle
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Inelastic staple demand mitigated capital drop</p>
        </div>
      </div>

      {/* Two Column Layout: Class Distribution & 4 Stress Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Risk Label Matrix Distribution Analysis */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E2D4A] lg:col-span-1 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Risk Category Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Authoritative rule-based risk labels derived strictly from Maximum Drawdown thresholds.
            </p>
          </div>

          <div className="space-y-4">
            {/* High Risk Bar */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-rose-400 font-semibold">High Risk (MDD &lt; -15%)</span>
                <span className="text-slate-200 font-mono">26 records (59.1%)</span>
              </div>
              <div className="w-full bg-[#080E1E] rounded-full h-3 overflow-hidden border border-[#1E2D4A]">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 h-full rounded-full" style={{ width: '59.1%' }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Severe capital loss; all 11 sectors during COVID-19 were High Risk.</p>
            </div>

            {/* Medium Risk Bar */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-amber-400 font-semibold">Medium Risk (-15% ≤ MDD &lt; -5%)</span>
                <span className="text-slate-200 font-mono">18 records (40.9%)</span>
              </div>
              <div className="w-full bg-[#080E1E] rounded-full h-3 overflow-hidden border border-[#1E2D4A]">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full" style={{ width: '40.9%' }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Moderate capital drawdown; prevalent in Russia-Ukraine & Rate Hike shocks.</p>
            </div>

            {/* Low Risk Bar */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-emerald-400 font-semibold">Low Risk (MDD ≥ -5%)</span>
                <span className="text-slate-400 font-mono">0 records (0.0%)</span>
              </div>
              <div className="w-full bg-[#080E1E] rounded-full h-3 overflow-hidden border border-[#1E2D4A]">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '0%' }} />
              </div>
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200/90 mt-2 space-y-1">
                <div className="flex items-center space-x-1 font-semibold text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Key Academic Empirical Finding</span>
                </div>
                <p>
                  Zero records qualify as "Low Risk" because all 4 crisis windows were validated against a NIFTY 50 decline ≥ 5%. Broad market beta dragged every sector down by at least -6.68%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Macro Stress Windows Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E2D4A] lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Validated Macroeconomic Stress Windows</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Confirmed boundaries where the benchmark index (NIFTY 50) suffered peak-to-trough drawdowns exceeding 5%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stressEvents.map((evt) => (
              <div
                key={evt.event_id}
                className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-mono text-cyan-400">{evt.window_start} → {evt.window_end}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                      MDD: {evt.nifty50_mdd_pct.toFixed(2)}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{evt.event_name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    <strong className="text-slate-300">Trigger:</strong> {evt.trigger}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1E2D4A] text-[11px] text-slate-400">
                  <strong className="text-slate-300">Expected Impact:</strong> {evt.expected_impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Audit & Academic Integrity Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0F1A30] to-cyan-950/30 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Dataset Audit & Provenance Status: PASS WITH LIMITATIONS</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Underlying price series derived from genuine Yahoo Finance historical market data (49 constituent stocks, 1,480 trading days). No synthetic records.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('quality')}
          className="whitespace-nowrap px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
        >
          View Full Audit Report
        </button>
      </div>
    </div>
  );
};

function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
