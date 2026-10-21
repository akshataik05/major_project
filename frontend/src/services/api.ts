import {
  DatasetSummary,
  StressEventItem,
  SectorItem,
  RiskMatrixResponse,
  RiskRecord,
  ModelEvaluationResponse,
  TrajectoryPoint
} from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },

  async getSummary(): Promise<DatasetSummary> {
    const res = await fetch(`${API_BASE}/summary`);
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json();
  },

  async getStressEvents(): Promise<StressEventItem[]> {
    const res = await fetch(`${API_BASE}/stress-events`);
    if (!res.ok) throw new Error('Failed to fetch stress events');
    return res.json();
  },

  async getSectors(): Promise<SectorItem[]> {
    const res = await fetch(`${API_BASE}/sectors`);
    if (!res.ok) throw new Error('Failed to fetch sectors');
    return res.json();
  },

  async getRiskMatrix(): Promise<RiskMatrixResponse> {
    const res = await fetch(`${API_BASE}/risk-matrix`);
    if (!res.ok) throw new Error('Failed to fetch risk matrix');
    return res.json();
  },

  async getRecords(params?: {
    sector?: string;
    stress_event?: string;
    risk_label?: string;
    sort_by?: string;
    order?: string;
  }): Promise<RiskRecord[]> {
    const query = new URLSearchParams();
    if (params?.sector) query.append('sector', params.sector);
    if (params?.stress_event) query.append('stress_event', params.stress_event);
    if (params?.risk_label) query.append('risk_label', params.risk_label);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.order) query.append('order', params.order);

    const res = await fetch(`${API_BASE}/records?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch records');
    return res.json();
  },

  async getModelResults(): Promise<ModelEvaluationResponse> {
    const res = await fetch(`${API_BASE}/model-results`);
    if (!res.ok) throw new Error('Failed to fetch model results');
    return res.json();
  },

  async getSectorTrajectory(sector: string): Promise<{ sector: string; total_days: number; trajectory: TrajectoryPoint[] }> {
    const res = await fetch(`${API_BASE}/sector-trajectory/${encodeURIComponent(sector)}`);
    if (!res.ok) throw new Error('Failed to fetch sector trajectory');
    return res.json();
  },

  async predictRisk(var_95: number, sharpe_drop: number) {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ var_95, sharpe_drop })
    });
    if (!res.ok) throw new Error('Prediction request failed');
    return res.json();
  },

  async getProvenance() {
    const res = await fetch(`${API_BASE}/provenance`);
    if (!res.ok) throw new Error('Failed to fetch provenance');
    return res.json();
  }
};
