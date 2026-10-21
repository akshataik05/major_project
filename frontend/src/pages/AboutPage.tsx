import React from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Terminal,
  FileCheck,
  Send,
  BookOpenCheck,
  Layers,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const team = [
    { name: "Akshata I Kallimath", usn: "ENG23CS0016", role: "Quantitative Data Analyst & Financial Modeling" },
    { name: "Basanagouda", usn: "ENG23CS0028", role: "Data Pipeline Engineer & Calibrations" },
    { name: "Guru Kumar", usn: "ENG23CS0070", role: "Machine Learning Engineer & Evaluation" },
    { name: "Indushree D N", usn: "ENG23CS0080", role: "Frontend UI/UX & Documentation Lead" }
  ];

  const literatureTable = [
    {
      study: "Dynamic Market Risk and Portfolio Choice – Indian Stock Market (2023)",
      focus: "Sectoral market risk",
      contribution: "Analysed 10 Indian sectoral indices under volatility regimes and market-stress conditions (IIM-Bangalore).",
      limitation: "Focuses on dynamic portfolio choice; does not provide a crisis-specific labeled benchmark dataset."
    },
    {
      study: "Sector-Wise Portfolio Risk Assessment – NIFTY 50 Stocks (2025)",
      focus: "Sector-level portfolio risk",
      contribution: "Evaluated sectors using VaR, CVaR and Maximum Drawdown, demonstrating significant cross-sector risk variance.",
      limitation: "Does not build a standardized sector × stress-event risk-label matrix."
    },
    {
      study: "Prediction-based Mean-VaR Portfolio Optimization (2023)",
      focus: "ML + portfolio risk",
      contribution: "Combined ML models (Random Forest, XGBoost) with Mean-VaR optimization using Indian market data (ScienceDirect).",
      limitation: "Focuses on portfolio selection rather than crisis-period drawdown risk labeling."
    },
    {
      study: "Financial Risk Identification using Random Forest (2025/26)",
      focus: "ML risk classification",
      contribution: "Demonstrated Random Forest for low/medium/high risk classification on nonlinear financial data (Springer).",
      limitation: "Targeted corporate balance sheet risk rather than sectoral market drawdowns."
    },
    {
      study: "Guru & Das (2021)",
      focus: "COVID-19 & sectoral volatility",
      contribution: "Studied volatility spillovers across 10 major BSE indices during COVID-19 pandemic shock.",
      limitation: "Focuses exclusively on volatility spillovers, not portfolio drawdown metrics or risk labels."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Capstone Project Academic Context</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          About the Research & Project Credits
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Major Project Phase-I (Review 0 / Zeroth Review) presented at the Department of Computer Science and Engineering, School of Engineering, Dayananda Sagar University.
        </p>
      </div>

      {/* Project Identity Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-4 bg-gradient-to-br from-[#0F1A30] to-[#080E1E]">
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold uppercase tracking-wider">
            Official Research Title
          </span>
          <span className="text-xs text-slate-400">Academic Year 2026–2027</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Official Objective 2 Focus:</strong> Constructing NiftyStress-44, the first publicly available benchmark dataset capturing sector-level portfolio drawdown behavior (MDD, VaR 95%, Sharpe drop, recovery days) across 11 NSE sectors during four systemic macro stress windows (COVID-19, Russia-Ukraine, RBI Rate Hikes, and US Fed Tightening).
        </p>
      </div>

      {/* People Grid: Students & Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supervisor Card */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-[#0F1A30] md:col-span-1 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Project Supervisor & Guide</span>
          </div>
          <div className="pt-2">
            <h4 className="text-lg font-bold text-white">Prof. Yashpal Gupta S</h4>
            <p className="text-xs text-cyan-300 font-medium mt-0.5">Academic Supervisor & Research Mentor</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Department of Computer Science and Engineering<br />
              School of Engineering<br />
              Dayananda Sagar University, Bangalore
            </p>
          </div>
        </div>

        {/* Student Team Cards */}
        <div className="glass-panel p-6 rounded-2xl border border-[#1E2D4A] md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Student Research Team (Team 27)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team.map((t) => (
              <div key={t.usn} className="p-3.5 rounded-xl bg-[#080E1E] border border-[#1E2D4A]">
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{t.usn}</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Literature Review Table from Zeroth Review PPT */}
      <div className="glass-panel rounded-2xl border border-[#1E2D4A] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-[#101C35] border-b border-[#1E2D4A]">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <BookOpenCheck className="w-4 h-4 text-cyan-400" />
            <span>Zeroth Review Comparative Literature Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating the explicit research gap addressed by the NiftyStress-44 benchmark dataset.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1527] text-slate-300 uppercase tracking-wider border-b border-[#1E2D4A]">
              <tr>
                <th className="py-3 px-4 w-48">Prior Study</th>
                <th className="py-3 px-4 w-36">Focus</th>
                <th className="py-3 px-6">Key Contribution</th>
                <th className="py-3 px-6">Identified Limitation & Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A] text-slate-300">
              {literatureTable.map((lit, idx) => (
                <tr key={idx} className="hover:bg-[#0F1A30] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white leading-snug">{lit.study}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-medium">{lit.focus}</td>
                  <td className="py-3.5 px-6 text-slate-300 leading-relaxed">{lit.contribution}</td>
                  <td className="py-3.5 px-6 text-slate-400 leading-relaxed">{lit.limitation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Conferences & Dissemination */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <span>Target Academic Conference Venues</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-cyan-800/40 space-y-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold text-[10px]">Primary Track</span>
            <div className="font-bold text-white mt-1">IEEE CIFEr 2025</div>
            <div className="text-[11px] text-slate-400">Computational Intelligence for Financial Engineering</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-cyan-800/40 space-y-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold text-[10px]">Primary Track</span>
            <div className="font-bold text-white mt-1">Springer FinanceML</div>
            <div className="text-[11px] text-slate-400">Emerging Markets Risk Benchmark Track</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-[#1E2D4A] space-y-1">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">Secondary Track</span>
            <div className="font-bold text-white mt-1">ACM ICAIF 2025</div>
            <div className="text-[11px] text-slate-400">AI in Finance Dataset & Benchmark Track</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080E1E] border border-[#1E2D4A] space-y-1">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">Secondary Track</span>
            <div className="font-bold text-white mt-1">ICACCS 2025</div>
            <div className="text-[11px] text-slate-400">Indian Market Portfolio Analytics Track</div>
          </div>
        </div>
      </div>

      {/* Reproducibility Quick-Start */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Complete System Reproducibility Guide</span>
        </h3>
        <p className="text-xs text-slate-300">
          To reproduce all financial calculations, benchmark datasets, model evaluations, and launch the full-stack system locally:
        </p>

        <div className="p-4 rounded-xl bg-[#080E1E] border border-[#1E2D4A] font-mono text-xs text-slate-300 space-y-2">
          <div className="text-slate-500"># 1. Run the end-to-end reproducible pipeline</div>
          <div className="text-cyan-400">python src/pipeline.py</div>
          <div className="text-slate-500 mt-2"># 2. Train and evaluate the leak-free Random Forest baseline</div>
          <div className="text-cyan-400">python src/models/baseline_rf.py</div>
          <div className="text-slate-500 mt-2"># 3. Run automated financial, data, and model test suite</div>
          <div className="text-cyan-400">pytest tests/ -v</div>
          <div className="text-slate-500 mt-2"># 4. Start the FastAPI backend server</div>
          <div className="text-cyan-400">uvicorn src.api.main:app --port 8000 --reload</div>
          <div className="text-slate-500 mt-2"># 5. Start the React dashboard</div>
          <div className="text-cyan-400">cd frontend &amp;&amp; npm run dev</div>
        </div>
      </div>
    </div>
  );
};
