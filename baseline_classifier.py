"""
baseline_classifier.py - Random Forest Baseline Classification Module
Trains and evaluates the baseline Random Forest classifier on the NiftyStress-44
dataset without target leakage, reporting both Stratified 3-Fold and Leave-One-Crisis-Out.

Usage:
    python baseline_classifier.py
"""
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from src.models.baseline_rf import run_all_baseline_experiments

def main():
    print("=" * 70)
    print("NIFTY Risk Classification: Random Forest Baseline (Leak-Free)")
    print("=" * 70)

    results = run_all_baseline_experiments()
    print("\n[SUCCESS] Baseline evaluation complete. Artifacts saved:")
    print("- data/processed/baseline_classifier_results.csv")
    print("- reports/model_evaluation_metrics.json")
    print("- artifacts/baseline_rf_leak_free.joblib")

if __name__ == "__main__":
    main()
