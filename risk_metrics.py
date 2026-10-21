"""
risk_metrics.py - Quantitative Portfolio Risk Metrics Engine
Computes MDD, historical VaR (95%), recovery days, and Sharpe ratio change
for each sector-event pair per the official project specification.

Usage:
    python risk_metrics.py
"""
import os
import sys
import json
import pandas as pd

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from src.risk_metrics.calculator import calculate_sector_event_metrics

def main():
    print("=" * 70)
    print("NIFTY Sector Quantitative Risk Metrics Calculation")
    print("=" * 70)

    config_path = os.path.join(CURRENT_DIR, "configs", "stress_windows_config.json")
    returns_dir = os.path.join(CURRENT_DIR, "data", "raw", "sector_returns")

    with open(config_path, "r") as f:
        config = json.load(f)

    stress_windows = config["stress_windows"]
    lookback = config.get("baseline_lookback_days", 90)

    sector_files = [f for f in os.listdir(returns_dir) if f.endswith("_returns.csv")]
    all_metrics = []

    for sf in sorted(sector_files):
        sector_name = sf.replace("_returns.csv", "")
        file_path = os.path.join(returns_dir, sf)
        df = pd.read_csv(file_path, parse_dates=["Date"])
        df = df.sort_values("Date").reset_index(drop=True)

        for event_key, window in stress_windows.items():
            metrics = calculate_sector_event_metrics(
                sector_df=df,
                sector_name=f"NIFTY {sector_name}",
                event_name=window["name"],
                start_date=window["start"],
                end_date=window["end"],
                baseline_lookback_days=lookback
            )
            all_metrics.append(metrics)

    res_df = pd.DataFrame(all_metrics)
    summary_cols = ["sector", "event", "mdd", "var_95", "recovery_days", "recovery_days_extended", "sharpe_drop"]
    print(res_df[summary_cols].head(15).to_string(index=False))
    print(f"\n... Total {len(res_df)} records calculated successfully.")

if __name__ == "__main__":
    main()
