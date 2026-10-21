import React, { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingDown,
  ShieldAlert,
  Info,
  Clock,
  ExternalLink,
  Layers,
  ArrowDownRight
} from 'lucide-react';
import { StressEventItem, RiskRecord } from '../types';
import { api } from '../services/api';

interface StressEventsPageProps {
  stressEvents: StressEventItem[];
}

export const StressEventsPage: React.FC<StressEventsPageProps> = ({ stressEvents }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    stressEvents[0]?.event_id || 'covid_2020'
  );
  const [eventRecords, setEventRecords] = useState<RiskRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const selectedEvent = stressEvents.find(e => e.event_id === selectedEventId) || stressEvents[0];

  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    api.getRecords({ stress_event: selectedEvent.event_name, sort_by: 'max_drawdown_pct', order: 'asc' })
      .then(data => {
        setEventRecords(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedEventId, selectedEvent]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Macroeconomic Stress Event Explorer</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Four Defined Macro Shocks in Indian Markets (2020–2023)
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Detailed analysis of the four systemic crisis periods identified in the official research specification, capturing distinct macroeconomic triggers and sectoral transmission mechanisms.
        </p>
      </div>

      {/* Event Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stressEvents.map((evt) => {
          const isSelected = evt.event_id === selectedEventId;
          return (
            <button
              key={evt.event_id}
              onClick={() => setSelectedEventId(evt.event_id)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/80 to-[#0F1A30] border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'glass-panel border-[#1E2D4A] hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono text-cyan-400">{evt.window_start.substring(0, 7)}</span>
                <span className="px-2 py-0.5 rounded bg-[#1E2D4A] text-slate-300 font-mono text-[10px]">
                  MDD: {evt.nifty50_mdd_pct.toFixed(1)}%
                </span>
              </div>
              <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {evt.event_name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {evt.trigger}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Event Deep-Dive Panel */}
      {selectedEvent && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-6 bg-gradient-to-b from-[#0F1A30] to-[#080E1E]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2D4A]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-medium">
                  Window: {selectedEvent.window_start} to {selectedEvent.window_end}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  NIFTY 50 Criterion: Passed (≥ 5% Drop)
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-2">
                {selectedEvent.event_name}
              </h3>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="text-right">
                <div className="text-xs text-slate-400">NIFTY 50 Index MDD</div>
                <div className="text-xl font-bold font-mono text-rose-400">
                  {selectedEvent.nifty50_mdd_pct.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Trigger and Expected Impact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Macroeconomic Trigger
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {selectedEvent.trigger}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Theoretical / Observed Sectoral Transmission
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {selectedEvent.expected_impact}
              </p>
            </div>
          </div>

          {/* Sector Ranking Table for this Event */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Sector Performance Ranking (Sorted by Downside Severity)</span>
              </h4>
              <span className="text-xs text-slate-400">11 Sectors Evaluated</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#1E2D4A] bg-[#080E1E]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#101C35] text-slate-300 font-semibold uppercase tracking-wider border-b border-[#1E2D4A]">
                  <tr>
                    <th className="py-3 px-4">Rank / Sector</th>
                    <th className="py-3 px-4 text-right">Max Drawdown (MDD)</th>
                    <th className="py-3 px-4 text-right">VaR 95% (Daily)</th>
                    <th className="py-3 px-4 text-right">Sharpe Drop</th>
                    <th className="py-3 px-4 text-center">Recovery Days</th>
                    <th className="py-3 px-4 text-center">Assigned Risk Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2D4A] text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">Loading sector metrics...</td>
                    </tr>
                  ) : (
                    eventRecords.map((r, idx) => {
                      const isHigh = r.risk_label === 'High';
                      return (
                        <tr key={r.sector} className="hover:bg-[#0F1A30]/80 transition-colors">
                          <td className="py-3 px-4 font-medium text-white flex items-center space-x-2">
                            <span className="w-5 text-slate-500 font-mono text-[11px]">{idx + 1}.</span>
                            <span>{r.sector}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-rose-400">
                            {r.max_drawdown_pct.toFixed(2)}%
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-amber-400">
                            {r.var_95.toFixed(2)}%
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${r.sharpe_drop < 0 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                            {r.sharpe_drop > 0 ? `+${r.sharpe_drop.toFixed(2)}` : r.sharpe_drop.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-300">
                            {r.recovery_days !== null ? `${r.recovery_days} d` : <span className="text-slate-500 italic">Censored (NaN)</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              isHigh
                                ? 'bg-rose-950 text-rose-400 border-rose-800'
                                : 'bg-amber-950 text-amber-400 border-amber-800'
                            }`}>
                              {r.risk_label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Econometric Overlap Note */}
      <div className="p-4 rounded-xl bg-[#0F1A30] border border-[#1E2D4A] text-xs text-slate-400 space-y-1">
        <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
          <Info className="w-4 h-4" />
          <span>Macroeconomic Window Concurrency Note</span>
        </div>
        <p className="leading-relaxed">
          The <strong>US Fed Tightening</strong> window (March 2022 to December 2023) overlaps temporally with both the <strong>Russia-Ukraine Shock</strong> (Feb–Apr 2022) and the <strong>RBI Rate Hike Cycle</strong> (May 2022 to Feb 2023). This overlap reflects genuine historical concurrency: global inflationary pressures triggered by energy supply shocks compelled synchronized central bank tightening worldwide. Both the RBI Rate Hike Cycle and US Fed Tightening shared a common market trough date on <strong>June 17, 2022</strong>.
        </p>
      </div>
    </div>
  );
};
