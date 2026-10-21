import React, { useState } from 'react';
import { Grid3X3, Info, Eye, Layers, TrendingDown, ArrowDownRight, Clock } from 'lucide-react';
import { RiskMatrixResponse, MatrixCell } from '../types';
import { CellDetailModal } from '../components/CellDetailModal';

interface HeatmapPageProps {
  matrixData: RiskMatrixResponse | null;
}

export const HeatmapPage: React.FC<HeatmapPageProps> = ({ matrixData }) => {
  const [selectedCell, setSelectedCell] = useState<{
    sector: string;
    stress_event: string;
    risk_label: string;
    max_drawdown_pct: number;
    var_95: number;
    sharpe_drop: number;
    recovery_days: number | null;
    recovery_days_extended?: number | null;
  } | null>(null);

  const [metricView, setMetricView] = useState<'label' | 'mdd' | 'var' | 'sharpe'>('label');

  if (!matrixData) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading 11×4 Risk Matrix...
      </div>
    );
  }

  const { sectors, events, matrix, label_distribution } = matrixData;

  const handleCellClick = (sector: string, eventName: string, cell: MatrixCell | null) => {
    if (!cell) return;
    setSelectedCell({
      sector,
      stress_event: eventName,
      risk_label: cell.risk_label,
      max_drawdown_pct: cell.max_drawdown_pct,
      var_95: cell.var_95,
      sharpe_drop: cell.sharpe_drop,
      recovery_days: cell.recovery_days,
      recovery_days_extended: cell.recovery_days_extended
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Grid3X3 className="w-4 h-4" />
            <span>Official Deliverable · 11×4 Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Sector Risk Heatmap Matrix
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Interactive grid evaluating 11 NIFTY sectors across all 4 macroeconomic stress events. Click any cell to inspect peak, trough, VaR, recovery, and Sharpe metrics.
          </p>
        </div>

        {/* Metric Display Toggle */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#0F1A30] border border-[#1E2D4A] self-start md:self-auto">
          <button
            onClick={() => setMetricView('label')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              metricView === 'label'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Risk Labels
          </button>
          <button
            onClick={() => setMetricView('mdd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              metricView === 'mdd'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Max Drawdown (%)
          </button>
          <button
            onClick={() => setMetricView('var')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              metricView === 'var'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VaR 95%
          </button>
          <button
            onClick={() => setMetricView('sharpe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              metricView === 'sharpe'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sharpe Drop
          </button>
        </div>
      </div>

      {/* Legend & Summary Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1E2D4A] text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 font-medium">Risk Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-200">High Risk (MDD &lt; -15%)</span>
            <span className="text-slate-500">[{label_distribution.High}]</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-slate-200">Medium Risk (-15% ≤ MDD &lt; -5%)</span>
            <span className="text-slate-500">[{label_distribution.Medium}]</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-200">Low Risk (MDD ≥ -5%)</span>
            <span className="text-slate-500">[{label_distribution.Low}]</span>
          </div>
        </div>
        <div className="text-slate-400 italic">
          💡 Click any cell for deep financial inspection
        </div>
      </div>

      {/* Interactive 11x4 Heatmap Table */}
      <div className="glass-panel rounded-2xl border border-[#1E2D4A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#101C35] border-b border-[#1E2D4A]">
                <th className="py-4 px-6 text-left text-xs font-bold text-slate-300 uppercase tracking-wider w-48 sticky left-0 bg-[#101C35] z-10 border-r border-[#1E2D4A]">
                  Sector Portfolio
                </th>
                {events.map((e) => (
                  <th key={e} className="py-4 px-6 text-center text-xs font-bold text-slate-200 uppercase tracking-wider border-r border-[#1E2D4A] last:border-r-0 min-w-[180px]">
                    <div>{e}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A]">
              {matrix.map((row) => (
                <tr key={row.sector} className="hover:bg-[#0F1A30]/50 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-white text-xs sticky left-0 bg-[#0F1A30] z-10 border-r border-[#1E2D4A] whitespace-nowrap">
                    {row.sector}
                  </td>
                  {events.map((e) => {
                    const cell = row[e] as MatrixCell | null;
                    if (!cell) {
                      return (
                        <td key={e} className="py-3.5 px-4 text-center text-xs text-slate-500 border-r border-[#1E2D4A] last:border-r-0">
                          —
                        </td>
                      );
                    }

                    const isHigh = cell.risk_label === 'High';
                    const isMed = cell.risk_label === 'Medium';

                    return (
                      <td
                        key={e}
                        onClick={() => handleCellClick(row.sector, e, cell)}
                        className="py-2.5 px-4 text-center border-r border-[#1E2D4A] last:border-r-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className={`p-2.5 rounded-xl border transition-all ${
                          isHigh
                            ? 'bg-rose-950/40 border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/60'
                            : isMed
                            ? 'bg-amber-950/30 border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/50'
                            : 'bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/50'
                        }`}>
                          {metricView === 'label' && (
                            <div>
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                isHigh
                                  ? 'bg-rose-900/60 text-rose-300 border-rose-700'
                                  : 'bg-amber-900/60 text-amber-300 border-amber-700'
                              }`}>
                                {cell.risk_label}
                              </span>
                              <div className="text-[11px] text-slate-400 mt-1 font-mono font-medium">
                                MDD: {cell.max_drawdown_pct.toFixed(2)}%
                              </div>
                            </div>
                          )}

                          {metricView === 'mdd' && (
                            <div>
                              <div className="text-sm font-bold font-mono text-rose-400">
                                {cell.max_drawdown_pct.toFixed(2)}%
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Label: {cell.risk_label}
                              </div>
                            </div>
                          )}

                          {metricView === 'var' && (
                            <div>
                              <div className="text-sm font-bold font-mono text-amber-400">
                                {cell.var_95.toFixed(2)}%
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Daily VaR 95%
                              </div>
                            </div>
                          )}

                          {metricView === 'sharpe' && (
                            <div>
                              <div className={`text-sm font-bold font-mono ${cell.sharpe_drop < 0 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                                {cell.sharpe_drop > 0 ? `+${cell.sharpe_drop.toFixed(2)}` : cell.sharpe_drop.toFixed(2)}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Sharpe Drop
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cell Detail Inspection Modal */}
      <CellDetailModal
        isOpen={selectedCell !== null}
        onClose={() => setSelectedCell(null)}
        data={selectedCell}
      />
    </div>
  );
};
