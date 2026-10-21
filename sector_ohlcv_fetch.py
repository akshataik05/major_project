"""
sector_ohlcv_fetch.py - Quantitative Data Ingestion Module
Fetches daily OHLCV and Adjusted Close data for all 11 NIFTY sectors from Yahoo Finance
or utilizes the verified local cache in data/raw/sector_returns/.

Usage:
    python sector_ohlcv_fetch.py [--online]
"""
import os
import sys
import argparse

# Ensure workspace root is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from src.data_ingestion.fetch_ohlcv import fetch_and_cache_sector_data, verify_cached_returns

def main():
    parser = argparse.ArgumentParser(description="Fetch or verify NIFTY sector daily returns.")
    parser.add_argument("--online", action="store_true", help="Download latest data from Yahoo Finance via yfinance")
    args = parser.parse_args()

    print("=" * 70)
    print("NIFTY Sector OHLCV Data Ingestion & Return Computation")
    print("=" * 70)

    if args.online:
        print("[INFO] Running in ONLINE mode: Fetching from Yahoo Finance...")
        fetch_and_cache_sector_data()
    else:
        print("[INFO] Running in OFFLINE/CACHE mode: Verifying local data cache...")
        status = verify_cached_returns()
        if not status:
            print("[WARN] Local cache incomplete. Running online fetch to populate...")
            fetch_and_cache_sector_data()

    print("[SUCCESS] Sector daily returns verified and available in data/raw/sector_returns/")

if __name__ == "__main__":
    main()
