import React from 'react';
import { ShieldCheck, GraduationCap, GitBranch, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#1E2D4A] bg-[#050A15] py-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Academic Capstone</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Major Project Phase-I · Review 0<br />
              Dept. of Computer Science & Engineering<br />
              School of Engineering, Dayananda Sagar University
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold">Student Research Team (Team 27)</h4>
            <ul className="space-y-1 text-slate-400">
              <li>Akshata I Kallimath <span className="text-slate-500 font-mono text-[11px]">(ENG23CS0016)</span></li>
              <li>Basanagouda <span className="text-slate-500 font-mono text-[11px]">(ENG23CS0028)</span></li>
              <li>Guru Kumar <span className="text-slate-500 font-mono text-[11px]">(ENG23CS0070)</span></li>
              <li>Indushree D N <span className="text-slate-500 font-mono text-[11px]">(ENG23CS0080)</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold">Project Supervision</h4>
            <p className="text-slate-400">
              <strong className="text-slate-200">Prof. Yashpal Gupta S</strong><br />
              Project Guide & Academic Mentor<br />
              Department of CSE, SOE-DSU
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold">Reproducibility & Standards</h4>
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Target Benchmark: NiftyStress-44</span>
            </div>
            <p className="text-slate-500">
              Aligned with IEEE CIFEr / ACM ICAIF benchmark guidelines. Zero synthetic observations.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E2D4A]/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <div>
            © 2026–2027 Dayananda Sagar University · Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events
          </div>
          <div className="flex items-center space-x-4">
            <span>FastAPI 0.151.0 Backend</span>
            <span>·</span>
            <span>React 18 + Vite Frontend</span>
            <span>·</span>
            <span>Python 3.13 Quantitative Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
