"""
mdd_compute.py - Maximum Drawdown (MDD) Computation Module
Calculates the running peak, drawdown trajectory, and Maximum Drawdown (MDD)
for each of the 11 NIFTY sectors across the 4 macroeconomic stress events.

Usage:
    python mdd_compute.py
"""
import os
import sys
import json
import pandas as pd

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from src.risk_metrics.mdd import calculate_mdd, get_drawdown_series

def main():
    print("=" * 70)
    print("NIFTY Sector Maximum Drawdown (MDD) Computation")
    print("=" * 70)

    config_path = os.path.join(CURRENT_DIR, "configs", "stress_windows_config.json")
    returns_dir = os.path.join(CURRENT_DIR, "data", "raw", "sector_returns")

    with open(config_path, "r") as f:
        config = json.load(f)

    stress_windows = config["stress_windows"]
    sector_files = [f for f in os.listdir(returns_dir) if f.endswith("_returns.csv")]

    results = []
    for sf in sorted(sector_files):
        sector_name = sf.replace("_returns.csv", "")
        file_path = os.path.join(returns_dir, sf)
        df = pd.read_csv(file_path, parse_dates=["Date"])
        df = df.sort_values("Date").reset_index(drop=True)

        for event_key, window in stress_windows.items():
            start_date = pd.to_datetime(window["start"])
            end_date = pd.to_datetime(window["end"])

            window_df = df[(df["Date"] >= start_date) & (df["Date"] <= end_date)]
            if len(window_df) == 0:
                continue

            mdd_info = calculate_mdd(window_df["Return"].values)
            results.append({
                "Sector": f"NIFTY {sector_name}",
                "Event": window["name"],
                "Window_Start": window["start"],
                "Window_End": window["end"],
                "Trading_Days": len(window_df),
                "MDD_Pct": round(mdd_info["mdd"], 2)
            })

    res_df = pd.DataFrame(results)
    print(res_df.to_string(index=False))
    print(f"\n[SUCCESS] Computed MDD for {len(res_df)} sector-event combinations.")

if __name__ == "__main__":
    main()
