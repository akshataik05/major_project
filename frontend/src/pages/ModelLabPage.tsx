import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart2,
  TrendingUp,
  Cpu,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ModelEvaluationResponse, ModelExperiment } from '../types';
import { api } from '../services/api';

export const ModelLabPage: React.FC = () => {
  const [modelData, setModelData] = useState<ModelEvaluationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Prediction Simulator State
  const [simVar, setSimVar] = useState<number>(-4.5);
  const [simSharpe, setSimSharpe] = useState<number>(-1.5);
  const [prediction, setPrediction] = useState<{
    predicted_label: string;
    confidence: number;
    probabilities: { High: number; Medium: number };
    disclaimer: string;
  } | null>(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    api.getModelResults()
      .then(res => {
        setModelData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const res = await api.predictRisk(simVar, simSharpe);
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Machine Learning Benchmark & Evaluation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Baseline Random Forest Model Laboratory
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Evaluation of the Random Forest baseline classifier mandated by Objective 2. Implements leak-free features, Stratified 3-Fold Cross-Validation, and Leave-One-Crisis-Out temporal generalization.
        </p>
      </div>

      {/* Critical Target Leakage Safeguard Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-[#0F1A30] to-[#080E1E] space-y-3">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Methodological Safeguard: Target Leakage Prevention</span>
              <span className="px-2 py-0.5 rounded bg-rose-900 text-rose-300 text-[10px] font-mono uppercase tracking-wider">
                Audited & Enforced
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Because the ground-truth target (<code className="text-rose-400">risk_label</code>) is deterministically derived from Maximum Drawdown (<code className="text-rose-400">max_drawdown_pct</code>), feeding MDD into the classifier trivially leaks the answer, artificially yielding ~100% accuracy. The official benchmark model strictly <strong>excludes MDD</strong> and evaluates whether Value at Risk and Sharpe ratio drop alone can classify sector crisis severity.
            </p>
          </div>
        </div>
      </div>

      {/* Experiments Comparison Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Empirical Evaluation Benchmarks</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading model evaluation metrics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {modelData?.experiments.map((exp, idx) => {
              const isLeakage = exp.target_leakage === 'YES';
              const importances = JSON.parse(exp.feature_importances);
              const confMatrix = JSON.parse(exp.confusion_matrix_3fold);

              return (
                <div
                  key={exp.experiment_name}
                  className={`p-6 rounded-2xl border transition-all ${
                    isLeakage
                      ? 'glass-panel border-rose-500/30 bg-rose-950/10'
                      : 'glass-panel border-cyan-500/30 bg-[#0F1A30]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono text-slate-400">Benchmark #{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isLeakage
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}>
                      {isLeakage ? 'SANITY CHECK (LEAKAGE)' : 'LEAK-FREE (VALID)'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {exp.experiment_name}
                  </h4>
                  <div className="text-xs text-slate-400 mt-1">
                    <strong className="text-slate-300">Features:</strong> {exp.features}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#1E2D4A]">
                    <div className="p-2.5 rounded-lg bg-[#080E1E] text-center">
                      <div className="text-[10px] text-slate-400">Stratified 3-Fold</div>
                      <div className={`text-base font-bold font-mono mt-0.5 ${isLeakage ? 'text-rose-400' : 'text-cyan-400'}`}>
                        {(exp.stratified_3fold_acc * 100).toFixed(1)}%
                      </div>
                      <div className="text-[9px] text-slate-500">Macro F1: {exp.stratified_3fold_f1_macro.toFixed(2)}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#080E1E] text-center">
                      <div className="text-[10px] text-slate-400">Leave-One-Crisis</div>
                      <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                        {(exp.leave_one_crisis_out_acc * 100).toFixed(1)}%
                      </div>
                      <div className="text-[9px] text-slate-500">Cross-crisis gen.</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#080E1E] text-center">
                      <div className="text-[10px] text-slate-400">70/30 Split</div>
                      <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                        {(exp.test_split_70_30_acc * 100).toFixed(1)}%
                      </div>
                      <div className="text-[9px] text-slate-500">N_test = 14</div>
                    </div>
                  </div>

                  {/* Feature Importance Breakdown */}
                  <div className="mt-4 pt-3 border-t border-[#1E2D4A]">
                    <div className="text-[11px] font-semibold text-slate-300 mb-2">Feature Importance Weights:</div>
                    <div className="space-y-1.5">
                      {Object.entries(importances).map(([fName, fVal]: [string, any]) => (
                        <div key={fName}>
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span className="font-mono">{fName}</span>
                            <span className="font-mono text-white">{(fVal * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-[#080E1E] rounded-full h-1.5 overflow-hidden mt-0.5">
                            <div
                              className={`h-full rounded-full ${isLeakage ? 'bg-rose-500' : 'bg-cyan-500'}`}
                              style={{ width: `${fVal * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Risk Prediction Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#1E2D4A] space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Risk Inference Simulator</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Test the Trained Leak-Free Random Forest Model
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate sector risk classification during a hypothetical macro event using return-based tail risk (VaR 95%) and Sharpe drop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Controls */}
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Value at Risk (VaR 95%) — Negative Daily Percentage
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="-12.0"
                  max="-1.0"
                  step="0.1"
                  value={simVar}
                  onChange={(e) => setSimVar(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="w-16 font-mono text-sm text-cyan-400 font-bold">{simVar.toFixed(1)}%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Sample range: -10.60% (severe) to -1.30% (mild)</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sharpe Ratio Drop (Stress Sharpe − 90-Day Baseline Sharpe)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="-10.0"
                  max="3.0"
                  step="0.1"
                  value={simSharpe}
                  onChange={(e) => setSimSharpe(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="w-16 font-mono text-sm text-cyan-400 font-bold">{simSharpe.toFixed(1)}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Sample range: -9.16 (drastic loss) to +3.15 (gain)</p>
            </div>

            <button
              type="submit"
              disabled={predicting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20"
            >
              {predicting ? 'Classifying...' : 'Run Random Forest Classification'}
            </button>
          </form>

          {/* Result Card */}
          <div className="p-5 rounded-xl bg-[#080E1E] border border-[#1E2D4A] space-y-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Classifier Output (Joblib Model In-Memory)
            </div>

            {prediction ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Predicted Risk Class:</div>
                    <div className={`text-2xl font-extrabold mt-0.5 ${
                      prediction.predicted_label === 'High' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {prediction.predicted_label} Risk
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Model Confidence:</div>
                    <div className="text-xl font-bold font-mono text-white">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Probability Bars */}
                <div className="space-y-2 pt-2 border-t border-[#1E2D4A]">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-rose-400 font-medium">P(High Risk)</span>
                      <span className="font-mono text-slate-300">{(prediction.probabilities.High * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#0F1A30] rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${prediction.probabilities.High * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-400 font-medium">P(Medium Risk)</span>
                      <span className="font-mono text-slate-300">{(prediction.probabilities.Medium * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#0F1A30] rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${prediction.probabilities.Medium * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0F1A30] border border-[#1E2D4A] text-[10px] text-slate-400 leading-relaxed">
                  {prediction.disclaimer}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                Adjust the sliders and click "Run Random Forest Classification" to test model response.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
