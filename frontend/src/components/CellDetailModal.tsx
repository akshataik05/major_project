import React from 'react';
import { X, TrendingDown, ShieldAlert, Clock, ArrowDownRight, Info, CheckCircle2 } from 'lucide-react';

interface CellDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    sector: string;
    stress_event: string;
    risk_label: string;
    max_drawdown_pct: number;
    var_95: number;
    sharpe_drop: number;
    recovery_days: number | null;
    recovery_days_extended?: number | null;
    window_start?: string;
    window_end?: string;
  } | null;
}

export const CellDetailModal: React.FC<CellDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const isHigh = data.risk_label === 'High';
  const isMed = data.risk_label === 'Medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="glass-panel w-full max-w-lg rounded-2xl border border-[#1E2D4A] p-6 shadow-2xl relative bg-[#0F1A30]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2D4A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-6">
          <div className={`p-3 rounded-xl border ${
            isHigh ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' :
            isMed ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
            'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isHigh ? 'bg-rose-950 text-rose-400 border-rose-800' :
                isMed ? 'bg-amber-950 text-amber-400 border-amber-800' :
                'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {data.risk_label} Risk
              </span>
              <span className="text-xs text-slate-400">Benchmark Cell Inspection</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {data.sector} Sector
            </h3>
            <p className="text-sm text-cyan-400 font-medium">
              {data.stress_event}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Max Drawdown (MDD)</span>
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-bold font-mono text-rose-400">
              {data.max_drawdown_pct.toFixed(2)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Threshold: {isHigh ? '< -15%' : '-15% to -5%'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Value at Risk (95%)</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {data.var_95.toFixed(2)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Daily historical quantile
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Sharpe Ratio Drop</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className={`text-lg font-bold font-mono ${data.sharpe_drop < 0 ? 'text-cyan-400' : 'text-emerald-400'}`}>
              {data.sharpe_drop > 0 ? `+${data.sharpe_drop.toFixed(2)}` : data.sharpe_drop.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              vs 90-day baseline period
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Recovery Days</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {data.recovery_days !== null ? `${data.recovery_days} days` : 'Censored (NaN)'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {data.recovery_days_extended ? `Full series: ${data.recovery_days_extended} days` : 'Unrecovered in window'}
            </div>
          </div>
        </div>

        {/* Methodological Context */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 space-y-2">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
            <Info className="w-4 h-4" />
            <span>Quantitative Methodology Note</span>
          </div>
          <p className="leading-relaxed">
            The risk classification for this cell is strictly rule-based: assigned solely from Maximum Drawdown ({data.max_drawdown_pct.toFixed(2)}%).
            {data.recovery_days === null && (
              <span className="block mt-1 text-slate-400">
                • <strong>Recovery Days is NaN</strong> per the official PDF specification because the sector did not rebound to its pre-stress peak prior to the window end date. Extended analysis shows full recovery occurred in {data.recovery_days_extended ?? 'N/A'} trading days.
              </span>
            )}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1E2D4A] hover:bg-[#2A3F66] text-white text-xs font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
