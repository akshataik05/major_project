import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RiskRecord } from '../types';

interface DatasetExplorerPageProps {
  records: RiskRecord[];
}

export const DatasetExplorerPage: React.FC<DatasetExplorerPageProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [selectedLabel, setSelectedLabel] = useState('ALL');
  const [sortField, setSortField] = useState<keyof RiskRecord>('max_drawdown_pct');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(records.map(r => r.sector))).sort()], [records]);
  const events = useMemo(() => ['ALL', ...Array.from(new Set(records.map(r => r.stress_event))).sort()], [records]);
  const labels = ['ALL', 'High', 'Medium', 'Low'];

  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        const matchesSearch =
          r.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.stress_event.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = selectedSector === 'ALL' || r.sector === selectedSector;
        const matchesEvent = selectedEvent === 'ALL' || r.stress_event === selectedEvent;
        const matchesLabel = selectedLabel === 'ALL' || r.risk_label === selectedLabel;
        return matchesSearch && matchesSector && matchesEvent && matchesLabel;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [records, searchTerm, selectedSector, selectedEvent, selectedLabel, sortField, sortOrder]);

  const toggleSort = (field: keyof RiskRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>NiftyStress-44 Final Benchmark Dataset</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Certified Dataset Explorer
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Official 9-column schema certified for academic release. Filter, sort, inspect, and export all 44 sector-event combinations.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <a
            href="/api/export/csv"
            download="NiftyStress44_final.csv"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
          <a
            href="/api/export/excel"
            download="risk_label_matrix.xlsx"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Matrix (XLSX)</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-[#1E2D4A] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sector or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#080E1E] text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 border border-[#1E2D4A] focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />
        </div>

        {/* Sector Filter */}
        <div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full bg-[#080E1E] text-slate-200 text-xs rounded-xl px-3 py-2 border border-[#1E2D4A] focus:outline-none focus:border-cyan-500"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Sectors (11)' : s}</option>
            ))}
          </select>
        </div>

        {/* Event Filter */}
        <div>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full bg-[#080E1E] text-slate-200 text-xs rounded-xl px-3 py-2 border border-[#1E2D4A] focus:outline-none focus:border-cyan-500"
          >
            {events.map((e) => (
              <option key={e} value={e}>{e === 'ALL' ? 'All Stress Events (4)' : e}</option>
            ))}
          </select>
        </div>

        {/* Risk Label Filter */}
        <div>
          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            className="w-full bg-[#080E1E] text-slate-200 text-xs rounded-xl px-3 py-2 border border-[#1E2D4A] focus:outline-none focus:border-cyan-500"
          >
            {labels.map((l) => (
              <option key={l} value={l}>{l === 'ALL' ? 'All Risk Labels (3)' : `${l} Risk`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dataset Records Table */}
      <div className="glass-panel rounded-2xl border border-[#1E2D4A] overflow-hidden shadow-2xl">
        <div className="px-6 py-3.5 bg-[#101C35] border-b border-[#1E2D4A] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white font-mono">{filteredRecords.length}</strong> of{' '}
            <strong className="text-white font-mono">{records.length}</strong> verified records
          </div>
          <div className="text-[11px] text-slate-400">
            Click column headers to sort
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1527] text-slate-300 font-semibold uppercase tracking-wider border-b border-[#1E2D4A]">
              <tr>
                <th onClick={() => toggleSort('sector')} className="py-3 px-4 cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center space-x-1">
                    <span>sector</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => toggleSort('stress_event')} className="py-3 px-4 cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center space-x-1">
                    <span>stress_event</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">window_start</th>
                <th className="py-3 px-3 text-center">window_end</th>
                <th onClick={() => toggleSort('max_drawdown_pct')} className="py-3 px-4 text-right cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center justify-end space-x-1">
                    <span>max_drawdown_pct</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => toggleSort('var_95')} className="py-3 px-4 text-right cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center justify-end space-x-1">
                    <span>var_95</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => toggleSort('recovery_days')} className="py-3 px-4 text-center cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center justify-center space-x-1">
                    <span>recovery_days</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => toggleSort('sharpe_drop')} className="py-3 px-4 text-right cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center justify-end space-x-1">
                    <span>sharpe_drop</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th onClick={() => toggleSort('risk_label')} className="py-3 px-4 text-center cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center justify-center space-x-1">
                    <span>risk_label</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A] text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => {
                  const isHigh = r.risk_label === 'High';
                  return (
                    <tr key={`${r.sector}-${r.stress_event}`} className="hover:bg-[#0F1A30] transition-colors">
                      <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                        {r.sector}
                      </td>
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {r.stress_event}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {r.window_start}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {r.window_end}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-400 whitespace-nowrap">
                        {r.max_drawdown_pct.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-400 whitespace-nowrap">
                        {r.var_95.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono whitespace-nowrap">
                        {r.recovery_days !== null ? (
                          <span className="text-slate-200">{r.recovery_days} d</span>
                        ) : (
                          <span className="text-slate-500 italic" title="Did not recover before window end date per PDF specification">
                            NaN
                          </span>
                        )}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono whitespace-nowrap ${
                        r.sharpe_drop < 0 ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {r.sharpe_drop > 0 ? `+${r.sharpe_drop.toFixed(2)}` : r.sharpe_drop.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
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
  );
};
