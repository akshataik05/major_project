import json
import os

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


def compute_mdd(return_series):
    """
    Compute Maximum Drawdown from daily returns.
    Returns:
        mdd_percent
    """

    return_series = return_series.dropna()

    if return_series.empty:
        return None

    # Portfolio value assuming initial investment = 1
    wealth = (1 + return_series).cumprod()

    running_max = wealth.cummax()

    drawdown = (wealth - running_max) / running_max

    return round(drawdown.min() * 100, 2)
# --------------------------------------------------
# Calculate MDD for every sector and every stress window
# --------------------------------------------------

results = []

csv_files = sorted(
    f for f in os.listdir(RETURNS_FOLDER)
    if f.endswith("_returns.csv")
)

print("=" * 70)
print("Computing Maximum Drawdown (MDD)")
print("=" * 70)

for csv_file in csv_files:

    sector_name = csv_file.replace("_returns.csv", "")

    file_path = os.path.join(RETURNS_FOLDER, csv_file)

    df = pd.read_csv(file_path)

    df["Date"] = pd.to_datetime(df["Date"])

    for window in stress_windows:

        start = pd.to_datetime(window["window_start"])
        end = pd.to_datetime(window["window_end"])

        event_returns = df[
            (df["Date"] >= start) &
            (df["Date"] <= end)
        ]["Sector_Return"]

        mdd = compute_mdd(event_returns)

        results.append({
            "Sector": sector_name,
            "Event_ID": window["event_id"],
            "Event_Name": window["event_name"],
            "Start_Date": start.date(),
            "End_Date": end.date(),
            "Maximum_Drawdown(%)": mdd
        })

        print(
            f"{sector_name:20s}"
            f"{window['event_id']:30s}"
            f"{mdd}"
        )

# --------------------------------------------------
# Save Results
# --------------------------------------------------

results_df = pd.DataFrame(results)

output_file = os.path.join(
    OUTPUT_FOLDER,
    "mdd_results.csv"
)

results_df.to_csv(output_file, index=False)

print("\n" + "=" * 70)
print("Finished!")
print(f"Rows Generated : {len(results_df)}")
print(f"Output File    : {output_file}")
print("=" * 70)