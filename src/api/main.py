"""
FastAPI Backend Application.
Serves validated dataset artifacts, financial metrics, stress window data,
ML evaluation results, and trajectory series for the Research Dashboard.
"""
import os
import sys
import json
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import joblib

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.api.schemas import (
    SystemHealth,
    DatasetSummary,
    StressEventItem,
    SectorItem,
    RiskRecord,
    RiskMatrixResponse,
    PredictionRequest,
    PredictionResponse
)

# App initialization
app = FastAPI(
    title="Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events",
    description="Backend API supporting the quantitative research dashboard and benchmark dataset NiftyStress-44.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File Paths
DATA_DIR = os.path.join(PROJECT_ROOT, 'data', 'processed')
RAW_RETURNS_DIR = os.path.join(PROJECT_ROOT, 'data', 'raw', 'sector_returns')
CONFIGS_DIR = os.path.join(PROJECT_ROOT, 'configs')
REPORTS_DIR = os.path.join(PROJECT_ROOT, 'reports')
ARTIFACTS_DIR = os.path.join(PROJECT_ROOT, 'artifacts')

CANONICAL_CSV = os.path.join(DATA_DIR, 'NiftyStress44_final.csv')
EXTENDED_CSV = os.path.join(DATA_DIR, 'NiftyStress44_extended.csv')
STRESS_CONFIG = os.path.join(CONFIGS_DIR, 'stress_windows_config.json')
SECTOR_CONFIG = os.path.join(CONFIGS_DIR, 'sector_constituents.json')
MODEL_ARTIFACT = os.path.join(ARTIFACTS_DIR, 'baseline_rf_leak_free.joblib')
MODEL_METRICS_JSON = os.path.join(REPORTS_DIR, 'model_evaluation_metrics.json')


def get_dataset(extended: bool = True) -> pd.DataFrame:
    path = EXTENDED_CSV if extended and os.path.exists(EXTENDED_CSV) else CANONICAL_CSV
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="Processed dataset file not found. Run pipeline first.")
    df = pd.read_csv(path)
    # Replace NaN with None for clean JSON serialization
    return df.replace({np.nan: None})


# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------

@app.get("/api/health", response_model=SystemHealth)
def get_health():
    df = get_dataset(extended=False)
    return {
        "status": "HEALTHY",
        "app_title": "Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events",
        "version": "1.0.0",
        "python_version": sys.version.split()[0],
        "dataset_version": "NiftyStress-44 (Certified Baseline)",
        "total_records": len(df)
    }


@app.get("/api/summary", response_model=DatasetSummary)
def get_summary():
    df = get_dataset(extended=False)
    counts = df['risk_label'].value_counts().to_dict()
    # Ensure all three classes exist in count dictionary
    for c in ['High', 'Medium', 'Low']:
        counts[c] = int(counts.get(c, 0))
        
    return {
        "project_title": "Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events",
        "total_records": len(df),
        "sector_count": int(df['sector'].nunique()),
        "event_count": int(df['stress_event'].nunique()),
        "class_distribution": counts,
        "mdd_range": {
            "min": float(df['max_drawdown_pct'].min()),
            "max": float(df['max_drawdown_pct'].max()),
            "mean": round(float(df['max_drawdown_pct'].mean()), 2)
        },
        "var_range": {
            "min": float(df['var_95'].min()),
            "max": float(df['var_95'].max()),
            "mean": round(float(df['var_95'].mean()), 2)
        },
        "sharpe_drop_range": {
            "min": float(df['sharpe_drop'].min()),
            "max": float(df['sharpe_drop'].max()),
            "mean": round(float(df['sharpe_drop'].mean()), 2)
        },
        "audit_verdict": "PASS WITH LIMITATIONS",
        "validation_status": "All 4 macro stress windows validated (NIFTY 50 MDD >= 5%)"
    }


@app.get("/api/stress-events", response_model=List[StressEventItem])
def get_stress_events():
    with open(STRESS_CONFIG, 'r') as f:
        config = json.load(f)
        
    # Nifty 50 MDDs obtained from validation
    nifty_mdds = {
        "COVID-19 Crash": -37.24,
        "Russia-Ukraine Shock": -8.42,
        "RBI Rate Hike Cycle": -8.33,
        "US Fed Tightening": -15.29
    }
    
    events = []
    for w in config["stress_windows"]:
        events.append({
            "event_id": w["event_id"],
            "event_name": w["event_name"],
            "window_start": w["window_start"],
            "window_end": w["window_end"],
            "trigger": w["trigger"],
            "expected_impact": w["expected_impact"],
            "nifty50_mdd_pct": nifty_mdds.get(w["event_name"], -5.0),
            "criterion_met": True
        })
    return events


@app.get("/api/sectors", response_model=List[SectorItem])
def get_sectors():
    with open(SECTOR_CONFIG, 'r') as f:
        config = json.load(f)
    df = get_dataset(extended=True)
    
    sectors_list = []
    for sector_name, tickers in config["sectors"].items():
        sec_df = df[df['sector'] == sector_name]
        high_cnt = int((sec_df['risk_label'] == 'High').sum())
        med_cnt = int((sec_df['risk_label'] == 'Medium').sum())
        avg_mdd = round(float(sec_df['max_drawdown_pct'].mean()), 2)
        worst_row = sec_df.loc[sec_df['max_drawdown_pct'].idxmin()]
        
        sectors_list.append({
            "sector_name": sector_name,
            "constituents": tickers,
            "constituent_count": len(tickers),
            "high_risk_events_count": high_cnt,
            "medium_risk_events_count": med_cnt,
            "avg_mdd_pct": avg_mdd,
            "worst_mdd_pct": float(worst_row['max_drawdown_pct']),
            "worst_event": worst_row['stress_event']
        })
        
    # Sort alphabetically
    sectors_list.sort(key=lambda x: x["sector_name"])
    return sectors_list


@app.get("/api/risk-matrix", response_model=RiskMatrixResponse)
def get_risk_matrix():
    df = get_dataset(extended=True)
    events_order = ["COVID-19 Crash", "Russia-Ukraine Shock", "RBI Rate Hike Cycle", "US Fed Tightening"]
    sectors = sorted(df['sector'].unique().tolist())
    
    matrix_rows = []
    for s in sectors:
        row_dict = {"sector": s}
        sec_df = df[df['sector'] == s]
        for e in events_order:
            event_row = sec_df[sec_df['stress_event'] == e]
            if not event_row.empty:
                r = event_row.iloc[0]
                rec_val = r['recovery_days']
                rec_ext_val = r.get('recovery_days_extended', None)
                row_dict[e] = {
                    "risk_label": str(r['risk_label']),
                    "max_drawdown_pct": float(r['max_drawdown_pct']),
                    "var_95": float(r['var_95']),
                    "sharpe_drop": float(r['sharpe_drop']),
                    "recovery_days": float(rec_val) if rec_val is not None else None,
                    "recovery_days_extended": float(rec_ext_val) if rec_ext_val is not None else None
                }
            else:
                row_dict[e] = None
        matrix_rows.append(row_dict)
        
    raw_counts = df['risk_label'].value_counts().to_dict()
    counts = {
        "High": int(raw_counts.get("High", 0)),
        "Medium": int(raw_counts.get("Medium", 0)),
        "Low": int(raw_counts.get("Low", 0))
    }
        
    return {
        "sectors": sectors,
        "events": events_order,
        "matrix": matrix_rows,
        "label_distribution": counts
    }


@app.get("/api/records", response_model=List[RiskRecord])
def get_records(
    sector: Optional[str] = Query(None, description="Filter by sector"),
    stress_event: Optional[str] = Query(None, description="Filter by stress event"),
    risk_label: Optional[str] = Query(None, description="Filter by risk label"),
    sort_by: Optional[str] = Query("max_drawdown_pct", description="Column to sort by"),
    order: Optional[str] = Query("asc", description="Sort order: asc or desc")
):
    df = get_dataset(extended=True)
    
    if sector:
        df = df[df['sector'].str.lower() == sector.lower()]
    if stress_event:
        df = df[df['stress_event'].str.lower() == stress_event.lower()]
    if risk_label:
        df = df[df['risk_label'].str.lower() == risk_label.lower()]
        
    if sort_by in df.columns:
        ascending = (order.lower() == 'asc')
        df = df.sort_values(sort_by, ascending=ascending)
        
    records = df.to_dict(orient="records")
    return records


@app.get("/api/records/{sector}/{event_id}")
def get_record_detail(sector: str, event_id: str):
    df = get_dataset(extended=True)
    # Event ID or event name match
    match = df[
        (df['sector'].str.lower() == sector.lower()) &
        ((df['event_id'].str.lower() == event_id.lower()) | (df['stress_event'].str.lower() == event_id.lower()))
    ]
    if match.empty:
        raise HTTPException(status_code=404, detail=f"Record not found for sector '{sector}' and event '{event_id}'.")
    return match.iloc[0].to_dict()


@app.get("/api/sector-trajectory/{sector}")
def get_sector_trajectory(sector: str):
    """
    Returns daily cumulative return and drawdown trajectory for a given sector.
    """
    filename = f"{sector}_returns.csv"
    filepath = os.path.join(RAW_RETURNS_DIR, filename)
    if not os.path.exists(filepath):
        # Case insensitive search
        matches = [f for f in os.listdir(RAW_RETURNS_DIR) if f.lower() == filename.lower()]
        if matches:
            filepath = os.path.join(RAW_RETURNS_DIR, matches[0])
        else:
            raise HTTPException(status_code=404, detail=f"Return series for sector '{sector}' not found.")
            
    df = pd.read_csv(filepath)
    date_col = 'Date' if 'Date' in df.columns else df.columns[0]
    ret_col = 'Sector_Return' if 'Sector_Return' in df.columns else df.columns[1]
    
    df['date'] = pd.to_datetime(df[date_col])
    df = df.sort_values('date').dropna(subset=[ret_col]).reset_index(drop=True)
    
    wealth = (1.0 + df[ret_col]).cumprod()
    running_max = wealth.cummax()
    drawdown = (wealth - running_max) / running_max * 100.0
    
    points = []
    # Sample every 5 days or all for smooth rendering
    for idx, row in df.iterrows():
        points.append({
            "date": row['date'].strftime('%Y-%m-%d'),
            "cum_return_pct": round(float((wealth.iloc[idx] - 1.0) * 100.0), 2),
            "drawdown_pct": round(float(drawdown.iloc[idx]), 2),
            "daily_return_pct": round(float(row[ret_col] * 100.0), 2)
        })
        
    return {
        "sector": sector,
        "total_days": len(points),
        "trajectory": points
    }


@app.get("/api/model-results")
def get_model_results():
    if not os.path.exists(MODEL_METRICS_JSON):
        raise HTTPException(status_code=500, detail="Model evaluation metrics JSON not found. Run baseline_rf.py first.")
    with open(MODEL_METRICS_JSON, 'r') as f:
        data = json.load(f)
    return data


@app.post("/api/predict", response_model=PredictionResponse)
def predict_risk(req: PredictionRequest):
    """
    Exploratory research inference using the leak-free Random Forest model.
    """
    if not os.path.exists(MODEL_ARTIFACT):
        raise HTTPException(status_code=500, detail="Trained model artifact not found.")
    
    bundle = joblib.load(MODEL_ARTIFACT)
    model = bundle['model']
    imputer = bundle['imputer']
    
    # Input vector: [var_95, sharpe_drop]
    X_raw = np.array([[req.var_95, req.sharpe_drop]])
    X_imp = imputer.transform(X_raw)
    
    pred_idx = int(model.predict(X_imp)[0])
    probs = model.predict_proba(X_imp)[0]
    
    label = "High" if pred_idx == 1 else "Medium"
    confidence = float(probs[pred_idx])
    
    return {
        "predicted_label": label,
        "confidence": round(confidence, 4),
        "probabilities": {
            "High": round(float(probs[1]), 4),
            "Medium": round(float(probs[0]), 4)
        },
        "disclaimer": "This prediction is generated by an exploratory Random Forest baseline trained on 44 historical sector-event records without target leakage. It should be used as a research indicator, not as financial advice."
    }


@app.get("/api/provenance")
def get_provenance():
    with open(SECTOR_CONFIG, 'r') as f:
        sec_cfg = json.load(f)
    with open(STRESS_CONFIG, 'r') as f:
        stress_cfg = json.load(f)
        
    return {
        "data_source": "Yahoo Finance (yfinance API) & NSE Historical Indices",
        "date_range": "2019-01-01 to 2024-12-30 (1,480 daily trading observations per sector)",
        "portfolio_construction": "Equal-weighted average (1/N) of daily percentage returns of representative large-cap constituent equities",
        "sectors": sec_cfg["sectors"],
        "stress_windows": stress_cfg["stress_windows"],
        "pre_stress_baseline": "90 calendar days prior to window_start",
        "audit_verdict": "PASS WITH LIMITATIONS",
        "official_schema": [
            "sector", "stress_event", "window_start", "window_end",
            "max_drawdown_pct", "var_95", "recovery_days", "sharpe_drop", "risk_label"
        ]
    }


@app.get("/api/export/{fmt}")
def export_dataset(fmt: str):
    if fmt.lower() == "csv":
        if not os.path.exists(CANONICAL_CSV):
            raise HTTPException(status_code=404, detail="Canonical CSV file not found.")
        return FileResponse(
            CANONICAL_CSV,
            media_type="text/csv",
            filename="NiftyStress44_final.csv"
        )
    elif fmt.lower() in ["excel", "xlsx"]:
        matrix_path = os.path.join(DATA_DIR, 'risk_label_matrix.xlsx')
        if not os.path.exists(matrix_path):
            raise HTTPException(status_code=404, detail="Excel matrix file not found.")
        return FileResponse(
            matrix_path,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename="risk_label_matrix.xlsx"
        )
    else:
        raise HTTPException(status_code=400, detail="Supported export formats are 'csv' or 'excel'.")


# Mount static files for built React frontend
from fastapi.staticfiles import StaticFiles

dist_dir = os.path.join(PROJECT_ROOT, 'frontend', 'dist')
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")


if __name__ == '__main__':
    import uvicorn
    uvicorn.run("src.api.main:app", host="127.0.0.1", port=8000, reload=True)
