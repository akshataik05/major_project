"""
Stress Window Validation Module.
Verifies that each defined stress window captures a peak-to-trough decline of at least 5% in NIFTY 50.
"""
from typing import Dict, Any, List
import os
import json
import pandas as pd


def validate_stress_windows(
    benchmark_csv_path: str,
    config_path: str
) -> List[Dict[str, Any]]:
    """
    Validate all stress windows against the 5% peak-to-trough decline criterion in NIFTY 50.
    """
    with open(config_path, 'r') as f:
        config = json.load(f)
        
    df_idx = pd.read_csv(benchmark_csv_path)
    # Check date column
    date_col = 'Date' if 'Date' in df_idx.columns else df_idx.columns[0]
    close_col = 'Close' if 'Close' in df_idx.columns else df_idx.columns[1]
    
    df_idx['date'] = pd.to_datetime(df_idx[date_col])
    df_idx = df_idx.sort_values('date').reset_index(drop=True)
    
    results = []
    min_drop_req = config.get("validation_min_index_mdd_pct", -5.0)
    
    for window in config["stress_windows"]:
        s_date = pd.to_datetime(window["window_start"])
        e_date = pd.to_datetime(window["window_end"])
        
        sub = df_idx[(df_idx['date'] >= s_date) & (df_idx['date'] <= e_date)].copy().reset_index(drop=True)
        if sub.empty:
            results.append({
                "event_id": window["event_id"],
                "event_name": window["event_name"],
                "status": "FAILED_NO_DATA",
                "mdd_pct": None,
                "criterion_met": False
            })
            continue
            
        prices = sub[close_col].dropna()
        running_max = prices.cummax()
        dd = (prices - running_max) / running_max * 100.0
        
        mdd = round(float(dd.min()), 2)
        trough_idx = dd.idxmin()
        peak_idx = prices.loc[:trough_idx].idxmax()
        
        peak_date = sub.loc[peak_idx, 'date'].strftime('%Y-%m-%d')
        trough_date = sub.loc[trough_idx, 'date'].strftime('%Y-%m-%d')
        
        criterion_met = bool(mdd <= min_drop_req)
        
        results.append({
            "event_id": window["event_id"],
            "event_name": window["event_name"],
            "window_start": window["window_start"],
            "window_end": window["window_end"],
            "peak_date": peak_date,
            "trough_date": trough_date,
            "nifty50_mdd_pct": mdd,
            "min_required_pct": min_drop_req,
            "criterion_met": criterion_met,
            "status": "PASS" if criterion_met else "FAIL"
        })
        
    return results
