export interface RiskRecord {
  sector: string;
  stress_event: string;
  window_start: string;
  window_end: string;
  max_drawdown_pct: number;
  var_95: number;
  recovery_days: number | null;
  recovery_days_extended?: number | null;
  sharpe_drop: number;
  risk_label: 'High' | 'Medium' | 'Low';
  peak_date?: string | null;
  trough_date?: string | null;
  peak_to_trough_days?: number | null;
}

export interface DatasetSummary {
  project_title: string;
  total_records: number;
  sector_count: number;
  event_count: number;
  class_distribution: {
    High: number;
    Medium: number;
    Low: number;
  };
  mdd_range: {
    min: number;
    max: number;
    mean: number;
  };
  var_range: {
    min: number;
    max: number;
    mean: number;
  };
  sharpe_drop_range: {
    min: number;
    max: number;
    mean: number;
  };
  audit_verdict: string;
  validation_status: string;
}

export interface StressEventItem {
  event_id: string;
  event_name: string;
  window_start: string;
  window_end: string;
  trigger: string;
  expected_impact: string;
  nifty50_mdd_pct: number;
  criterion_met: boolean;
}

export interface SectorItem {
  sector_name: string;
  constituents: string[];
  constituent_count: number;
  high_risk_events_count: number;
  medium_risk_events_count: number;
  avg_mdd_pct: number;
  worst_mdd_pct: number;
  worst_event: string;
}

export interface MatrixCell {
  risk_label: 'High' | 'Medium' | 'Low';
  max_drawdown_pct: number;
  var_95: number;
  sharpe_drop: number;
  recovery_days: number | null;
  recovery_days_extended?: number | null;
}

export interface RiskMatrixRow {
  sector: string;
  [eventName: string]: MatrixCell | string | null;
}

export interface RiskMatrixResponse {
  sectors: string[];
  events: string[];
  matrix: RiskMatrixRow[];
  label_distribution: {
    High: number;
    Medium: number;
    Low: number;
  };
}

export interface ModelExperiment {
  experiment_name: string;
  features: string;
  target_leakage: string;
  stratified_3fold_acc: number;
  stratified_3fold_balanced_acc: number;
  stratified_3fold_f1_macro: number;
  leave_one_crisis_out_acc: number;
  leave_one_crisis_out_f1_macro: number;
  test_split_70_30_acc: number;
  test_split_70_30_f1_macro: number;
  feature_importances: string;
  confusion_matrix_3fold: string;
  classes: string;
}

export interface ModelEvaluationResponse {
  dataset_name: string;
  sample_size: number;
  classes: string[];
  class_distribution: {
    High: number;
    Medium: number;
  };
  experiments: ModelExperiment[];
}

export interface TrajectoryPoint {
  date: string;
  cum_return_pct: number;
  drawdown_pct: number;
  daily_return_pct: number;
}
