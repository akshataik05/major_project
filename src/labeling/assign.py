"""
Rule-based Risk Label Assignment module.
Authoritative source for High / Medium / Low risk classification per MDD thresholds.
"""
from typing import Optional, Union
import pandas as pd
import numpy as np


def assign_risk_label(mdd: Optional[Union[float, int]]) -> str:
    """
    Assign risk labels based on Maximum Drawdown (MDD) percentage.
    
    Official Approved Threshold Rules (from Objective PDF Page 2):
        - High Risk   : MDD < -15.0%
        - Medium Risk : -15.0% <= MDD < -5.0%
        - Low Risk    : MDD >= -5.0%
        
    Edge Cases:
        - If mdd is exactly -15.0%, it is classified as Medium Risk (-15% <= MDD < -5%).
        - If mdd is exactly -5.0%, it is classified as Low Risk (MDD >= -5%).
        - If mdd is NaN, None, or invalid, returns 'Unknown'.
    """
    if mdd is None or pd.isna(mdd):
        return "Unknown"
    
    try:
        val = float(mdd)
    except (ValueError, TypeError):
        return "Unknown"
        
    if val < -15.0:
        return "High"
    elif -15.0 <= val < -5.0:
        return "Medium"
    else:
        return "Low"


def add_risk_labels_to_dataframe(df: pd.DataFrame, mdd_column: str = "max_drawdown_pct") -> pd.DataFrame:
    """
    Add or update 'risk_label' column in a DataFrame using the authoritative threshold function.
    """
    out_df = df.copy()
    out_df['risk_label'] = out_df[mdd_column].apply(assign_risk_label)
    return out_df
