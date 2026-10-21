"""
Value at Risk (VaR) calculation module using Historical Simulation.
"""
from typing import Optional
import numpy as np
import pandas as pd


def compute_var(return_series: pd.Series, confidence_level: float = 0.95) -> Optional[float]:
    """
    Compute Value at Risk (VaR) at the specified confidence level (default 95%)
    using the non-parametric historical simulation method.
    
    Convention:
        In this benchmark dataset, VaR is reported as the signed return quantile
        (negative percentage, e.g. -4.20 for a 4.2% daily loss at 95% confidence),
        matching the official specification schema.
        
    Parameters:
        return_series: pd.Series of daily percentage returns
        confidence_level: float between 0 and 1 (default 0.95)
        
    Returns:
        VaR percentage float rounded to 2 decimal places.
    """
    clean_returns = return_series.dropna()
    if clean_returns.empty:
        return None
    
    alpha_percentile = (1.0 - confidence_level) * 100.0
    var_quantile = float(np.percentile(clean_returns.to_numpy(), alpha_percentile))
    
    return round(var_quantile * 100.0, 2)
