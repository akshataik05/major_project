"""
Maximum Drawdown (MDD) calculation module.
"""
from typing import Dict, Any, Optional
import numpy as np
import pandas as pd


def compute_mdd(return_series: pd.Series) -> Optional[float]:
    """
    Compute Maximum Drawdown (MDD) percentage from a series of daily simple returns.
    
    Parameters:
        return_series: pd.Series of daily percentage returns (e.g. 0.01 for 1%)
        
    Returns:
        MDD as a negative percentage float rounded to 2 decimal places (e.g. -38.40)
        Returns None if series is empty or invalid.
    """
    clean_returns = return_series.dropna()
    if clean_returns.empty:
        return None
    
    # Portfolio wealth trajectory assuming initial wealth = 1.0
    wealth = (1.0 + clean_returns).cumprod()
    running_max = wealth.cummax()
    drawdown = (wealth - running_max) / running_max
    
    mdd_pct = float(drawdown.min() * 100.0)
    return round(mdd_pct, 2)


def compute_mdd_details(dates: pd.Series, return_series: pd.Series) -> Dict[str, Any]:
    """
    Compute MDD along with peak date, trough date, and peak-to-trough days.
    
    Parameters:
        dates: pd.Series of dates corresponding to the returns
        return_series: pd.Series of daily returns
        
    Returns:
        Dictionary with mdd_pct, peak_date, trough_date, peak_to_trough_days, trough_wealth, peak_wealth
    """
    df = pd.DataFrame({'date': pd.to_datetime(dates), 'ret': return_series}).dropna()
    if df.empty:
        return {
            'mdd_pct': None,
            'peak_date': None,
            'trough_date': None,
            'peak_to_trough_days': None,
            'peak_wealth': None,
            'trough_wealth': None
        }
    
    wealth = (1.0 + df['ret']).cumprod()
    running_max = wealth.cummax()
    drawdown = (wealth - running_max) / running_max * 100.0
    
    trough_idx = drawdown.idxmin()
    peak_idx = wealth.loc[:trough_idx].idxmax()
    
    trough_date = df.loc[trough_idx, 'date'].strftime('%Y-%m-%d')
    peak_date = df.loc[peak_idx, 'date'].strftime('%Y-%m-%d')
    trading_days = int(trough_idx - peak_idx)
    
    return {
        'mdd_pct': round(float(drawdown.min()), 2),
        'peak_date': peak_date,
        'trough_date': trough_date,
        'peak_to_trough_days': trading_days,
        'peak_wealth': round(float(wealth.loc[peak_idx]), 4),
        'trough_wealth': round(float(wealth.loc[trough_idx]), 4)
    }
