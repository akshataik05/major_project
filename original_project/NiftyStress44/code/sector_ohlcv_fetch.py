import json
import os

import pandas as pd
import yfinance as yf

# --------------------------------------------------
# Load sector definitions
# --------------------------------------------------

with open("../sector_constituents.json", "r") as f:
    config = json.load(f)

sectors = config["sectors"]

# Create output folder if it doesn't exist
OUTPUT_FOLDER = "../sector_returns"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

START_DATE = "2019-01-01"
END_DATE = "2024-12-31"

print("=" * 70)
print("Downloading sector stock data...")
print("=" * 70)


def download_close_prices(tickers):
    """
    Download adjusted close prices for a list of tickers.
    Returns a DataFrame with one column per ticker.
    """

    try:
        data = yf.download(
            tickers,
            start=START_DATE,
            end=END_DATE,
            auto_adjust=True,
            progress=False,
            group_by="ticker"
        )

        if data is None or data.empty:
            return None

        close_prices = pd.DataFrame()

        # Multiple tickers
        if len(tickers) > 1:
            for ticker in tickers:
                try:
                    close_prices[ticker] = data[ticker]["Close"]
                except Exception:
                    print(f"Skipping {ticker}")
        else:
            # Single ticker
            close_prices[tickers[0]] = data["Close"]

        return close_prices.dropna(how="all")

    except Exception as e:
        print("Download failed:", e)
        return None
# --------------------------------------------------
# Process each sector
# --------------------------------------------------

successful = 0
failed = 0

for sector_name, tickers in sectors.items():

    print(f"\nProcessing: {sector_name}")

    prices = download_close_prices(tickers)

    if prices is None or prices.empty:
        print(f"No data downloaded for {sector_name}")
        failed += 1
        continue

    # Remove columns with all missing values
    prices = prices.dropna(axis=1, how="all")

    if prices.empty:
        print(f"No valid price data for {sector_name}")
        failed += 1
        continue

    # Forward-fill small gaps
    prices = prices.ffill()

    # Daily percentage returns
    returns = prices.pct_change()

    # Average return across available stocks
    sector_returns = returns.mean(axis=1, skipna=True)

    output = pd.DataFrame({
        "Date": sector_returns.index,
        "Sector_Return": sector_returns.values
    })

    output.to_csv(
        os.path.join(
            OUTPUT_FOLDER,
            f"{sector_name}_returns.csv"
        ),
        index=False
    )

    print(
        f"Saved {sector_name}_returns.csv "
        f"({len(output)} rows)"
    )

    successful += 1

print("\n" + "=" * 70)
print("Download Complete")
print("=" * 70)
print(f"Successful sectors : {successful}")
print(f"Failed sectors     : {failed}")
print(f"Output folder      : {OUTPUT_FOLDER}")