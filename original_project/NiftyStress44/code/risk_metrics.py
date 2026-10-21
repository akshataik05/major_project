import json
import os

import numpy as np
import pandas as pd

# --------------------------------------------------
# Configuration
# --------------------------------------------------

RETURNS_FOLDER = "../sector_returns"
OUTPUT_FOLDER = "../outputs"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

with open("../stress_windows_config.json", "r") as f:
    config = json.load(f)

stress_windows = config["stress_windows"]


# --------------------------------------------------
# Metric Functions
# --------------------------------------------------

def compute_mdd(return_series):
    """Maximum Drawdown (%)"""

    return_series = return_series.dropna()

    if return_series.empty:
        return np.nan

    wealth = (1 + return_series).cumprod()

    running_max = wealth.cummax()

    drawdown = (wealth - running_max) / running_max

    return round(drawdown.min() * 100, 2)


def compute_var(return_series, confidence=0.95):
    """Historical Value at Risk (%)"""

    return_series = return_series.dropna()

    if return_series.empty:
        return np.nan

    var = np.percentile(return_series.to_numpy(), (1 - confidence) * 100)

    return round(float(var) * 100, 2)


def compute_sharpe(return_series):
    """Sharpe Ratio"""

    return_series = return_series.dropna()

    if len(return_series) < 2:
        return np.nan

    mean_return = return_series.mean()

    volatility = return_series.std()

    if volatility == 0:
        return np.nan

    return round(
        (mean_return / volatility) * np.sqrt(252),
        2
    )
# --------------------------------------------------
# Calculate Risk Metrics
# --------------------------------------------------

results = []

csv_files = sorted(
    f for f in os.listdir(RETURNS_FOLDER)
    if f.endswith("_returns.csv")
)

print("=" * 80)
print("Computing Risk Metrics")
print("=" * 80)

for csv_file in csv_files:

    sector_name = csv_file.replace("_returns.csv", "")

    df = pd.read_csv(os.path.join(RETURNS_FOLDER, csv_file))

    df["Date"] = pd.to_datetime(df["Date"])

    for window in stress_windows:

        start = pd.to_datetime(window["window_start"])
        end = pd.to_datetime(window["window_end"])

        window_returns = df[
            (df["Date"] >= start) &
            (df["Date"] <= end)
        ]["Sector_Return"]

        if window_returns.empty:
            continue

        mdd = compute_mdd(window_returns)
        var95 = compute_var(window_returns)
        sharpe = compute_sharpe(window_returns)

        # Recovery Days
        wealth = (1 + window_returns).cumprod()
        running_max = wealth.cummax()
        drawdown = (wealth - running_max) / running_max

        trough = drawdown.idxmin()

        recovery_days = np.nan

        if pd.notna(trough):

            peak_value = running_max.loc[trough]

            future = wealth.loc[trough:]

            recovered = future[future >= peak_value]

            if not recovered.empty:
                recovery_days = (
                    recovered.index[0] - trough
                )

        results.append({

            "Sector": sector_name,
            "Event_ID": window["event_id"],
            "Event_Name": window["event_name"],

            "Maximum_Drawdown(%)": mdd,
            "VaR_95(%)": var95,
            "Sharpe_Ratio": sharpe,
            "Recovery_Days": recovery_days

        })

        print(
            f"{sector_name:20s}"
            f"{window['event_id']:30s}"
            f"MDD={mdd:7}"
            f"  VaR={var95:7}"
            f"  Sharpe={sharpe:7}"
        )

# --------------------------------------------------
# Save Output
# --------------------------------------------------

risk_df = pd.DataFrame(results)

output_file = os.path.join(
    OUTPUT_FOLDER,
    "risk_metrics.csv"
)

risk_df.to_csv(output_file, index=False)

print("\n" + "=" * 80)
print("Risk Metric Computation Completed")
print("=" * 80)
print(f"Rows Generated : {len(risk_df)}")
print(f"Output File    : {output_file}")
print("=" * 80)