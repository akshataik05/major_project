import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingDown,
  ShieldAlert,
  Clock,
  ArrowDownRight,
  Activity,
  Layers
} from 'lucide-react';
import { RiskRecord, TrajectoryPoint, StressEventItem } from '../types';
import { api } from '../services/api';

interface AnalyticsPageProps {
  records: RiskRecord[];
  stressEvents: StressEventItem[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ records, stressEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('COVID-19 Crash');
  const [selectedMetric, setSelectedMetric] = useState<'mdd' | 'var' | 'sharpe' | 'recovery'>('mdd');
  const [trajectorySector, setTrajectorySector] = useState<string>('Banking');
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[]>([]);
  const [loadingTrajectory, setLoadingTrajectory] = useState<boolean>(false);

  // Filter records for comparative bar chart
  const filteredRecords = records.filter(r => r.stress_event === selectedEvent);

  // Fetch sector trajectory on sector change
  useEffect(() => {
    setLoadingTrajectory(true);
    api.getSectorTrajectory(trajectorySector)
      .then(res => {
        // Downsample for fast chart rendering if > 500 points (take every 2nd or 3rd point)
        const sampled = res.trajectory.filter((_, idx) => idx % 2 === 0);
        setTrajectoryData(sampled);
        setLoadingTrajectory(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingTrajectory(false);
      });
  }, [trajectorySector]);

  const sectorsList = Array.from(new Set(records.map(r => r.sector))).sort();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Cross-Sector Downside Analytics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Portfolio Downside Risk Analytics
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Comparative analysis of Maximum Drawdown, Value at Risk, Sharpe ratio drop, and historical equity wealth trajectories for Indian NIFTY sectors.
        </p>
      </div>

      {/* Part 1: Event-wise Metric Comparison Bar Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Cross-Sector Risk Comparison</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing 11 sectors across the selected crisis window.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Event Selector */}
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="bg-[#080E1E] text-slate-200 text-xs rounded-xl px-3 py-2 border border-[#1E2D4A] focus:outline-none focus:border-cyan-500"
            >
              {stressEvents.map(e => (
                <option key={e.event_id} value={e.event_name}>{e.event_name}</option>
              ))}
            </select>

            {/* Metric Selector */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
              <button
                onClick={() => setSelectedMetric('mdd')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedMetric === 'mdd' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                MDD (%)
              </button>
              <button
                onClick={() => setSelectedMetric('var')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedMetric === 'var' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                VaR 95%
              </button>
              <button
                onClick={() => setSelectedMetric('sharpe')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedMetric === 'sharpe' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sharpe Drop
              </button>
              <button
                onClick={() => setSelectedMetric('recovery')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedMetric === 'recovery' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Recovery Days
              </button>
            </div>
          </div>
        </div>

        {/* Bar Chart Display */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredRecords} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" vertical={false} />
              <XAxis
                dataKey="sector"
                stroke="#64748B"
                fontSize={11}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(val) => {
                  if (selectedMetric === 'mdd' || selectedMetric === 'var') return `${val}%`;
                  if (selectedMetric === 'recovery') return `${val}d`;
                  return val.toFixed(1);
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1A30',
                  borderColor: '#1E2D4A',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }}
                formatter={(val: any) => {
                  if (val === null || val === undefined) return ['Censored (NaN)', 'Metric Value'];
                  if (selectedMetric === 'mdd' || selectedMetric === 'var') return [`${val}%`, selectedMetric.toUpperCase()];
                  if (selectedMetric === 'recovery') return [`${val} trading days`, 'Recovery'];
                  return [val, 'Sharpe Drop'];
                }}
              />
              <Bar
                dataKey={
                  selectedMetric === 'mdd' ? 'max_drawdown_pct' :
                  selectedMetric === 'var' ? 'var_95' :
                  selectedMetric === 'sharpe' ? 'sharpe_drop' :
                  'recovery_days_extended'
                }
                fill={
                  selectedMetric === 'mdd' ? '#EF476F' :
                  selectedMetric === 'var' ? '#FFD166' :
                  selectedMetric === 'sharpe' ? '#00F0FF' :
                  '#A78BFA'
                }
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Part 2: Sector Historical Trajectory & Drawdown Underwater Curve */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                1,480 Daily Observations (2019–2024)
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-400" />
              <span>Historical Cumulative Return & Drawdown Trajectory</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live time-series trajectory demonstrating actual historical daily returns and peak-to-trough underwater drawdowns.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Select Sector:</span>
            <select
              value={trajectorySector}
              onChange={(e) => setTrajectorySector(e.target.value)}
              className="bg-[#080E1E] text-slate-200 text-xs rounded-xl px-3 py-2 border border-[#1E2D4A] focus:outline-none focus:border-cyan-500 font-semibold"
            >
              {sectorsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cumulative Returns Curve */}
        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Cumulative Wealth Growth (% Change since Jan 2019)</span>
            <span className="text-teal-400 font-mono">NIFTY {trajectorySector} Portfolio</span>
          </div>
          <div className="h-64 w-full">
            {loadingTrajectory ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Loading daily series...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="cumRetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06D6A0" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06D6A0" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} minTickGap={60} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F1A30', borderColor: '#1E2D4A', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(v: any) => [`${v}%`, 'Cumulative Return']}
                  />
                  <Area type="monotone" dataKey="cum_return_pct" stroke="#06D6A0" strokeWidth={2} fillOpacity={1} fill="url(#cumRetGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Underwater Drawdown Curve */}
        <div className="pt-4 border-t border-[#1E2D4A]">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Underwater Drawdown Profile (Peak-to-Trough Loss % over Time)</span>
            <span className="text-rose-400 font-mono">Downside Severity Profile</span>
          </div>
          <div className="h-48 w-full">
            {loadingTrajectory ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Loading drawdown series...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF476F" stopOpacity={0.0}/>
                      <stop offset="95%" stopColor="#EF476F" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} minTickGap={60} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} domain={['auto', 0]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F1A30', borderColor: '#1E2D4A', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(v: any) => [`${v}%`, 'Drawdown from Peak']}
                  />
                  <Area type="monotone" dataKey="drawdown_pct" stroke="#EF476F" strokeWidth={2} fillOpacity={1} fill="url(#drawdownGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
