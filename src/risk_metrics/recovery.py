"""
Recovery Days calculation module.
"""
from typing import Optional, Tuple
import numpy as np
import pandas as pd


def compute_recovery_days(
    full_dates: pd.Series,
    full_returns: pd.Series,
    window_start: str,
    window_end: str
) -> Tuple[Optional[int], Optional[int]]:
    """
    Compute recovery days for a sector during a stress window.
    
    Definitions:
        1. Window-censored recovery_days (PDF specification):
           Number of trading days from trough date until portfolio price returns to pre-stress peak.
           If not recovered by window_end date, returns None (NaN).
        2. Extended empirical recovery_days:
           Searches the full subsequent time-series up to the end of available history.
           
    Returns:
        (recovery_days_window, recovery_days_extended)
    """
    df = pd.DataFrame({
        'date': pd.to_datetime(full_dates),
        'ret': full_returns
    }).dropna().sort_values('date').reset_index(drop=True)
    
    s_date = pd.to_datetime(window_start)
    e_date = pd.to_datetime(window_end)
    
    # Filter for stress window
    in_win_mask = (df['date'] >= s_date) & (df['date'] <= e_date)
    win_indices = df[in_win_mask].index
    
    if win_indices.empty:
        return None, None
    
    win_start_idx = win_indices[0]
    win_end_idx = win_indices[-1]
    
    # Calculate wealth inside window
    win_ret = df.loc[win_start_idx:win_end_idx, 'ret']
    win_wealth = (1.0 + win_ret).cumprod()
    win_running_max = win_wealth.cummax()
    win_drawdown = (win_wealth - win_running_max) / win_running_max
    
    trough_loc = win_drawdown.idxmin() # index in df
    peak_loc = win_wealth.loc[:trough_loc].idxmax() # index in df
    peak_wealth = win_wealth.loc[peak_loc]
    
    # 1. Recovery strictly within window:
    future_in_win = win_wealth.loc[trough_loc:]
    rec_in_win = future_in_win[future_in_win >= peak_wealth]
    
    # Exclude the trough day itself if trough was also peak (i.e. zero drawdown)
    if len(rec_in_win) > 1 and rec_in_win.index[0] == trough_loc:
        rec_in_win = rec_in_win.iloc[1:]
    elif not rec_in_win.empty and rec_in_win.index[0] == trough_loc:
        rec_in_win = rec_in_win.iloc[1:]
        
    if not rec_in_win.empty:
        rec_days_win = int(rec_in_win.index[0] - trough_loc)
    else:
        rec_days_win = None # Censored at window end per official specification
        
    # 2. Recovery across the full available history:
    # Track wealth continuing from global trough until peak_wealth is reached
    # Relative wealth at trough compared to peak is (1 + MDD)
    mdd = (win_wealth.loc[trough_loc] - peak_wealth) / peak_wealth
    future_ret_all = df.loc[trough_loc:, 'ret']
    cum_from_trough = (1.0 + future_ret_all).cumprod()
    
    # Needs to recover (1 + mdd) * cum >= 1.0
    recovered_all = cum_from_trough[(1.0 + mdd) * cum_from_trough >= 1.0]
    
    # Exclude trough index itself
    recovered_all = recovered_all[recovered_all.index > trough_loc]
    
    if not recovered_all.empty:
        rec_days_ext = int(recovered_all.index[0] - trough_loc)
    else:
        rec_days_ext = None
        
    return rec_days_win, rec_days_ext
