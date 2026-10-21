"""
Pydantic Schemas for FastAPI API.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class SystemHealth(BaseModel):
    status: str
    app_title: str
    version: str
    python_version: str
    dataset_version: str
    total_records: int


class DatasetSummary(BaseModel):
    project_title: str
    total_records: int
    sector_count: int
    event_count: int
    class_distribution: Dict[str, int]
    mdd_range: Dict[str, float]
    var_range: Dict[str, float]
    sharpe_drop_range: Dict[str, float]
    audit_verdict: str
    validation_status: str


class StressEventItem(BaseModel):
    event_id: str
    event_name: str
    window_start: str
    window_end: str
    trigger: str
    expected_impact: str
    nifty50_mdd_pct: float
    criterion_met: bool


class SectorItem(BaseModel):
    sector_name: str
    constituents: List[str]
    constituent_count: int
    high_risk_events_count: int
    medium_risk_events_count: int
    avg_mdd_pct: float
    worst_mdd_pct: float
    worst_event: str


class RiskRecord(BaseModel):
    sector: str
    stress_event: str
    window_start: str
    window_end: str
    max_drawdown_pct: float
    var_95: float
    recovery_days: Optional[float] = None
    recovery_days_extended: Optional[float] = None
    sharpe_drop: float
    risk_label: str
    peak_date: Optional[str] = None
    trough_date: Optional[str] = None
    peak_to_trough_days: Optional[int] = None


class RiskMatrixResponse(BaseModel):
    sectors: List[str]
    events: List[str]
    matrix: List[Dict[str, Any]]
    label_distribution: Dict[str, int]


class PredictionRequest(BaseModel):
    var_95: float = Field(..., description="Historical Value at Risk at 95% confidence level (negative %)")
    sharpe_drop: float = Field(..., description="Annualized stress Sharpe ratio minus baseline Sharpe ratio")


class PredictionResponse(BaseModel):
    predicted_label: str
    confidence: float
    probabilities: Dict[str, float]
    disclaimer: str
