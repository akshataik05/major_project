"""
Sharpe Ratio and Sharpe Ratio Drop (delta Sharpe) calculation module.
"""
from typing import Optional, Tuple
import numpy as np
import pandas as pd


def compute_annualized_sharpe(return_series: pd.Series, annualization_factor: int = 252, rf_daily: float = 0.0) -> Optional[float]:
    """
    Compute annualized Sharpe ratio of a daily return series.
    
    Formula:
        Sharpe = ((mean(returns) - rf) / std(returns)) * sqrt(252)
        
    Parameters:
        return_series: pd.Series of daily percentage returns
        annualization_factor: int, trading days per year (default 252)
        rf_daily: daily risk-free rate (default 0.0)
        
    Returns:
        Annualized Sharpe ratio rounded to 2 decimal places, or None if std == 0.
    """
    clean_returns = return_series.dropna()
    if len(clean_returns) < 2:
        return None
    
    excess_returns = clean_returns - rf_daily
    mean_excess = excess_returns.mean()
    volatility = excess_returns.std()
    
    if volatility <= 1e-9 or np.isnan(volatility):
        return 0.0
    
    sharpe = (mean_excess / volatility) * np.sqrt(annualization_factor)
    return round(float(sharpe), 2)


def compute_sharpe_drop(
    stress_returns: pd.Series,
    baseline_returns: pd.Series,
    annualization_factor: int = 252
) -> Tuple[Optional[float], Optional[float], Optional[float]]:
    """
    Compute Sharpe Drop per official specification:
    Sharpe Drop = Sharpe ratio (annualized) during stress window minus
                  Sharpe ratio during the 90-day pre-stress baseline period.
                  
    Returns:
        (sharpe_stress, sharpe_baseline, sharpe_drop)
    """
    sharpe_stress = compute_annualized_sharpe(stress_returns, annualization_factor)
    sharpe_base = compute_annualized_sharpe(baseline_returns, annualization_factor)
    
    if sharpe_stress is None or sharpe_base is None:
        return sharpe_stress, sharpe_base, None
    
    drop = round(sharpe_stress - sharpe_base, 2)
    return sharpe_stress, sharpe_base, drop
