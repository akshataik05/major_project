import React from 'react';
import {
  BookOpen,
  TrendingDown,
  ShieldAlert,
  ArrowDownRight,
  Clock,
  Layers,
  FileText,
  ExternalLink
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const references = [
    {
      authors: "Sharpe, W. F.",
      year: "1994",
      title: "The Sharpe Ratio",
      journal: "The Journal of Portfolio Management, Vol. 21, No. 1, pp. 49–58",
      purpose: "Theoretical foundation for annualizing risk-adjusted returns and calculating the 90-day pre-stress baseline Sharpe drop."
    },
    {
      authors: "Jorion, P.",
      year: "2010",
      title: "Market Risk",
      journal: "Encyclopedia of Quantitative Finance, John Wiley & Sons",
      purpose: "Mathematical framework for historical simulation Value at Risk (VaR 95%) as the 5th empirical percentile of daily returns."
    },
    {
      authors: "Baptista, A. M., & Alexander, G. J.",
      year: "2006",
      title: "Portfolio Selection with a Drawdown Constraint",
      journal: "Journal of Banking & Finance, Vol. 30, No. 11, pp. 3171–3189",
      purpose: "Justification for utilizing Maximum Drawdown as the primary criterion for crisis-period portfolio risk labeling."
    },
    {
      authors: "Goldberg, L. R., & Mahmoud, O.",
      year: "2014",
      title: "Drawdown: From Practice to Theory and Back Again",
      journal: "Mathematics and Financial Economics, Vol. 8, No. 3, pp. 275–297",
      purpose: "Theoretical properties of drawdown distributions and recovery dynamics following severe equity market troughs."
    },
    {
      authors: "National Stock Exchange of India (NSE Indices)",
      year: "2024",
      title: "NIFTY 50 Index – Index Methodology and Historical Data",
      journal: "NSE India Publications",
      purpose: "Primary benchmark index reference used to validate the 5% peak-to-trough decline criterion across stress windows."
    },
    {
      authors: "Reserve Bank of India (RBI)",
      year: "2023",
      title: "Chronology of Major Policy Announcements: April 2022 to March 2023",
      journal: "RBI Annual Report 2022–23",
      purpose: "Official chronology supporting the RBI Rate Hike Cycle stress window (repo rate hike from 4.0% to 6.5%)."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Quantitative Research Methodology & Formulations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Research Methodology & Metric Definitions
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Formal mathematical formulations, threshold definitions, portfolio construction protocols, and academic citations guiding the NiftyStress-44 benchmark.
        </p>
      </div>

      {/* Mathematical Formulations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric 1: Maximum Drawdown */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E2D4A] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">1. Maximum Drawdown (MDD)</h3>
              <p className="text-xs text-slate-400">Peak-to-trough equity decline percentage</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] font-mono text-xs text-cyan-300 space-y-2">
            <div>{"W_t = ∏(1 + r_τ)   [Cumulative Portfolio Wealth]"}</div>
            <div>{"M_t = max_{τ ≤ t} (W_τ)   [Running Peak]"}</div>
            <div className="text-rose-400 font-bold">{"MDD = min_t [(W_t - M_t) / M_t] × 100%"}</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            MDD measures the maximum percentage loss experienced from the preceding high-water mark within the designated crisis window. It is expressed as a signed negative percentage.
          </p>
        </div>

        {/* Metric 2: Value at Risk */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E2D4A] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">2. Value at Risk (VaR 95%)</h3>
              <p className="text-xs text-slate-400">5th percentile daily return quantile</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] font-mono text-xs text-cyan-300 space-y-2">
            <div>{"F_R(x) = P(R_t ≤ x)   [Empirical Return Distribution]"}</div>
            <div className="text-amber-400 font-bold">{"VaR_0.95 = F_R^{-1}(0.05) × 100%"}</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Computed via non-parametric historical simulation from daily simple returns during the stress window. Reported as a signed return quantile (e.g. -4.20% represents a daily loss exceeding 4.2% on 5% of trading days).
          </p>
        </div>

        {/* Metric 3: Sharpe Ratio Drop */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E2D4A] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">3. Sharpe Ratio Drop (ΔSharpe)</h3>
              <p className="text-xs text-slate-400">Stress performance relative to 90-day baseline</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] font-mono text-xs text-cyan-300 space-y-2">
            <div>{"Sharpe = (μ / σ) × √252"}</div>
            <div className="text-cyan-400 font-bold">{"ΔSharpe = Sharpe_stress − Sharpe_baseline"}</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Measures the structural deterioration in risk-adjusted performance during crisis periods compared to peacetime conditions. A negative value indicates that risk-adjusted returns degraded relative to pre-stress levels.
          </p>
        </div>

        {/* Metric 4: Recovery Days */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E2D4A] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">4. Recovery Days</h3>
              <p className="text-xs text-slate-400">Trading days elapsed from trough to pre-stress peak</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] font-mono text-xs text-cyan-300 space-y-2">
            <div>{"t_peak = argmax(W_t),   t_trough = argmin(Drawdown_t)"}</div>
            <div className="text-purple-400 font-bold">{"t_rec = min { t > t_trough : W_t ≥ W_{t_peak} }"}</div>
            <div>{"Recovery Days = t_rec − t_trough   [NaN if t_rec > window_end]"}</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Per the official specification: if price does not rebound to its pre-stress high prior to the window end date, recovery days is recorded as NaN.
          </p>
        </div>
      </div>

      {/* Official Risk Threshold Definition Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Official Risk Labeling Rules (Objective 2 Specification)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">High Risk Class</div>
            <div className="text-base font-extrabold font-mono text-white">MDD &lt; -15.0%</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Severe capital impairment; recovery likely &gt; 60 days. Requires aggressive hedging or tactical de-risking.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Medium Risk Class</div>
            <div className="text-base font-extrabold font-mono text-white">-15.0% ≤ MDD &lt; -5.0%</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Moderate portfolio drawdown; partial hedging and defensive allocation effective at mitigating losses.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Low Risk Class</div>
            <div className="text-base font-extrabold font-mono text-white">MDD ≥ -5.0%</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Resilient sector; minimal capital drawdown. (Zero empirical occurrences during market-wide crises).
            </p>
          </div>
        </div>
      </div>

      {/* Peer-Reviewed References Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Peer-Reviewed Academic & Institutional References</span>
        </h3>

        <div className="divide-y divide-[#1E2D4A]">
          {references.map((ref, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1">
              <div className="text-xs font-semibold text-cyan-400">
                {ref.authors} ({ref.year}). "{ref.title}."
              </div>
              <div className="text-xs text-slate-300 italic">
                {ref.journal}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                <strong className="text-slate-400">Methodological Application:</strong> {ref.purpose}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
