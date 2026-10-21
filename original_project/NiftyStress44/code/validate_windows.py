import json
import pandas as pd
import yfinance as yf


def compute_mdd(prices):
    """Compute Maximum Drawdown (%)"""

    prices = prices.dropna()

    running_max = prices.cummax()
    drawdown = (prices - running_max) / running_max * 100

    trough = drawdown.idxmin()
    peak = prices.loc[:trough].idxmax()

    return float(drawdown.min()), peak, trough


# -----------------------------
# Read configuration
# -----------------------------
with open("../stress_windows_config.json", "r") as f:
    config = json.load(f)

ticker = config["index_ticker"]

print(f"\nDownloading {ticker} data...\n")

# Find overall start and end dates
start = min(w["window_start"] for w in config["stress_windows"])
end = max(w["window_end"] for w in config["stress_windows"])

data = yf.download(
    ticker,
    start=start,
    end=end,
    auto_adjust=True,
    progress=False
)

if data is None or data.empty:
    print("No data downloaded.")
    exit()

close = data["Close"]

if isinstance(close, pd.DataFrame):
    close = close.squeeze()

print("=" * 70)

for window in config["stress_windows"]:

    name = window["event_name"]
    s = window["window_start"]
    e = window["window_end"]

    window_prices = close.loc[s:e]

    if window_prices.empty:
        print(f"\n{name}")
        print("-" * 40)
        print("No data found for this period.")
        continue

    mdd, peak, trough = compute_mdd(window_prices)

    print(f"\n{name}")
    print("-" * 40)
    print("Start :", s)
    print("End   :", e)
    print("Peak  :", peak.date())
    print("Trough:", trough.date())
    print(f"Maximum Drawdown : {mdd:.2f}%")

print("\nValidation Complete.")