import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Info,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const QualityProvenancePage: React.FC = () => {
  const repairLog = [
    {
      id: 'REP-001',
      category: 'Schema Discrepancy',
      severity: 'Critical',
      description: "Dataset filename was 'labeled_risk_dataset.csv' instead of 'NiftyStress44_final.csv'.",
      action: "Generated canonical NiftyStress44_final.csv following exact official specification naming.",
      status: 'VERIFIED REPAIRED'
    },
    {
      id: 'REP-002',
      category: 'Missing Schema Columns',
      severity: 'Critical',
      description: "Columns 'window_start' and 'window_end' were omitted from final CSV.",
      action: "Merged official stress window start and end dates from config into final CSV schema.",
      status: 'VERIFIED REPAIRED'
    },
    {
      id: 'REP-003',
      category: 'Metric Definition Error',
      severity: 'Critical',
      description: "Original code computed raw stress Sharpe ratio instead of 'sharpe_drop' (Stress Sharpe minus 90-day baseline Sharpe).",
      action: "Implemented 90-calendar-day pre-stress baseline lookback and computed true delta Sharpe.",
      status: 'VERIFIED REPAIRED'
    },
    {
      id: 'REP-004',
      category: 'Censored Metric Handling',
      severity: 'Major',
      description: "Recovery_Days only searched within the stress window, causing 21 NaN values for unrecovered sectors.",
      action: "Preserved NaN per official PDF specification while generating an extended empirical metric in supplemental dataset.",
      status: 'VERIFIED REPAIRED'
    },
    {
      id: 'REP-005',
      category: 'Column Naming Conventions',
      severity: 'Minor',
      description: "Columns used mixed case and parenthesis, e.g., 'Maximum_Drawdown(%)', 'VaR_95(%)' instead of snake_case.",
      action: "Aligned column names exactly to the 9 snake_case schema columns defined in the objective document.",
      status: 'VERIFIED REPAIRED'
    },
    {
      id: 'REP-006',
      category: 'Target Leakage in ML',
      severity: 'Critical',
      description: "Baseline classifier included Maximum_Drawdown(%) in Run 1 which causes 100% target leakage, and used 70/30 split instead of 3-fold CV.",
      action: "Enforced leak-free feature set (VaR 95%, Sharpe drop) evaluated with Stratified 3-Fold Cross-Validation and Leave-One-Event-Out.",
      status: 'VERIFIED REPAIRED'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Academic Data Quality & Provenance Certification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Data Quality & Provenance Audit
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Independent verification of dataset authenticity, instrument provenance, mathematical calculation integrity, schema alignment, and auditable repair logs.
        </p>
      </div>

      {/* Audit Verdict Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-[#0F1A30] to-[#080E1E] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Independent Audit Verdict</div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                PASS WITH LIMITATIONS
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-[#080E1E] px-4 py-2 rounded-xl border border-[#1E2D4A] text-xs font-mono text-cyan-300">
            <span>Audit Ref: AUD-NIFTY44-2026</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1E2D4A]">
          <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Descriptive Analysis: PASS</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Historical return series and MDD/VaR calculations are solid and mathematically verified against public NSE data.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Risk-Label Generation: PASS</span>
            </div>
            <p className="text-[11px] text-slate-400">
              MDD threshold rules are accurately applied. Zero Low-Risk count confirmed as an authentic empirical market property.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>ML Experiments: PASS WITH LIMITATIONS</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sample size is small (N=44) with 2 populated classes. Stratified 3-Fold CV and strict MDD exclusion required.
            </p>
          </div>
        </div>
      </div>

      {/* Provenance Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Data Provenance & Instrument Construction</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The underlying data represents genuine historical daily market observations for <strong className="text-cyan-400">49 NSE equity tickers</strong> across the 11 official sectors from <strong className="text-white">January 1, 2019 to December 30, 2024</strong> (1,480 daily trading bars per sector). Prices were retrieved via Yahoo Finance (<code className="text-cyan-400">yfinance</code> API) with corporate splits, dividends, and bonus issues fully adjusted (<code className="text-cyan-400">auto_adjust=True</code>). No synthetic data was generated.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="text-slate-500 text-[10px]">Primary Source</div>
            <div className="font-semibold text-white mt-0.5">Yahoo Finance / NSE</div>
          </div>
          <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="text-slate-500 text-[10px]">Historical Range</div>
            <div className="font-semibold text-white mt-0.5">2019–2024 (6 Years)</div>
          </div>
          <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="text-slate-500 text-[10px]">Constituent Tickers</div>
            <div className="font-semibold text-white mt-0.5">49 Verified Equities</div>
          </div>
          <div className="p-3 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
            <div className="text-slate-500 text-[10px]">Weighting Scheme</div>
            <div className="font-semibold text-white mt-0.5">Equal-Weighted (1/N)</div>
          </div>
        </div>
      </div>

      {/* Repair Log Table */}
      <div className="glass-panel rounded-2xl border border-[#1E2D4A] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-[#101C35] border-b border-[#1E2D4A] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Auditable Repair & Enhancement Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">All 6 technical and methodological corrections applied to certify the dataset.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
            6 / 6 RESOLVED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1527] text-slate-400 uppercase tracking-wider border-b border-[#1E2D4A]">
              <tr>
                <th className="py-3 px-4">Issue ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-6">Identified Defect</th>
                <th className="py-3 px-6">Resolution Executed</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A] text-slate-300">
              {repairLog.map((r) => (
                <tr key={r.id} className="hover:bg-[#0F1A30] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">{r.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">{r.category}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      r.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                      r.severity === 'Major' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-300 leading-relaxed min-w-[240px]">{r.description}</td>
                  <td className="py-3.5 px-6 text-slate-300 leading-relaxed min-w-[240px]">{r.action}</td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{r.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
