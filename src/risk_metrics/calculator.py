"""
Master Risk Metric Calculation Engine.
Ties together MDD, VaR 95%, Sharpe Drop, and Recovery Days.
"""
from typing import Dict, Any, List
import os
import json
import pandas as pd
from src.risk_metrics.mdd import compute_mdd, compute_mdd_details
from src.risk_metrics.var import compute_var
from src.risk_metrics.sharpe import compute_sharpe_drop, compute_annualized_sharpe
from src.risk_metrics.recovery import compute_recovery_days


def calculate_sector_event_metrics(
    sector_name: str,
    dates: pd.Series,
    returns: pd.Series,
    event_config: Dict[str, Any],
    baseline_lookback_days: int = 90
) -> Dict[str, Any]:
    """
    Compute all portfolio risk metrics for a specific sector and stress event.
    """
    df = pd.DataFrame({'date': pd.to_datetime(dates), 'ret': returns}).dropna()
    df = df.sort_values('date').reset_index(drop=True)
    
    s_date = pd.to_datetime(event_config['window_start'])
    e_date = pd.to_datetime(event_config['window_end'])
    
    # Stress window slice
    stress_mask = (df['date'] >= s_date) & (df['date'] <= e_date)
    stress_returns = df.loc[stress_mask, 'ret']
    
    # 90-day pre-stress baseline slice
    base_s_date = s_date - pd.Timedelta(days=baseline_lookback_days)
    base_mask = (df['date'] >= base_s_date) & (df['date'] < s_date)
    base_returns = df.loc[base_mask, 'ret']
    
    # MDD details
    mdd_details = compute_mdd_details(df.loc[stress_mask, 'date'], stress_returns)
    mdd_pct = mdd_details['mdd_pct']
    
    # VaR 95%
    var_95 = compute_var(stress_returns, confidence_level=0.95)
    
    # Sharpe Drop
    sharpe_stress, sharpe_base, sharpe_drop = compute_sharpe_drop(stress_returns, base_returns)
    
    # Recovery Days (window-censored and extended)
    rec_win, rec_ext = compute_recovery_days(
        df['date'], df['ret'],
        event_config['window_start'],
        event_config['window_end']
    )
    
    return {
        'sector': sector_name,
        'stress_event': event_config['event_name'],
        'event_id': event_config['event_id'],
        'window_start': event_config['window_start'],
        'window_end': event_config['window_end'],
        'max_drawdown_pct': mdd_pct,
        'var_95': var_95,
        'recovery_days': rec_win,
        'recovery_days_extended': rec_ext,
        'sharpe_stress': sharpe_stress,
        'sharpe_baseline': sharpe_base,
        'sharpe_drop': sharpe_drop,
        'peak_date': mdd_details['peak_date'],
        'trough_date': mdd_details['trough_date'],
        'peak_to_trough_days': mdd_details['peak_to_trough_days']
    }
