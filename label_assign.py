"""
label_assign.py - Supervisory Risk Labeling and Matrix Generation
Assigns High Risk, Medium Risk, or Low Risk labels based on Maximum Drawdown
thresholds and exports both CSV datasets and the 11x4 Excel risk matrix.

Usage:
    python label_assign.py
"""
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from src.pipeline import run_pipeline

def main():
    print("=" * 70)
    print("NIFTY Supervisory Risk Label Assignment & Matrix Generation")
    print("=" * 70)

    # Runs certified pipeline to assign labels and build matrix
    summary = run_pipeline()
    print("\n[SUCCESS] Label assignment complete!")
    print(f"- Processed records: {summary['total_records']}")
    print(f"- Risk label distribution: {summary['risk_label_distribution']}")
    print(f"- Output CSV: data/processed/NiftyStress44_final.csv")
    print(f"- Output Matrix: data/processed/risk_label_matrix.xlsx")

if __name__ == "__main__":
    main()
