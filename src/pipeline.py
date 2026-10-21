"""
Master Reproducible Data Pipeline.
Executes the end-to-end data pipeline from raw daily return series to final validated benchmark datasets:
- NiftyStress44_final.csv (exact 9-column official schema)
- NiftyStress44_extended.csv (includes extended metrics for research transparency)
- risk_label_matrix.xlsx
- data_dictionary.xlsx
- domain_validation_notes.xlsx
"""
import os
import sys
import json
from typing import Dict, Any, List
import pandas as pd
import numpy as np

# Ensure workspace root is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.risk_metrics.calculator import calculate_sector_event_metrics
from src.labeling.assign import assign_risk_label
from src.labeling.matrix_builder import export_risk_label_matrix_excel
from src.labeling.dictionary_builder import export_data_dictionary_excel
from src.validation.domain_checks import run_domain_validation, export_domain_validation_excel
from src.validation.validate_windows import validate_stress_windows


def run_pipeline() -> Dict[str, Any]:
    """
    Execute full data pipeline and generate all certified artifacts.
    """
    print("=" * 75)
    print("STARTING NIFTYSTRESS-44 REPRODUCIBLE DATA PIPELINE")
    print("=" * 75)
    
    # 1. Load Configurations
    config_path = os.path.join(PROJECT_ROOT, 'configs', 'stress_windows_config.json')
    constituents_path = os.path.join(PROJECT_ROOT, 'configs', 'sector_constituents.json')
    raw_returns_dir = os.path.join(PROJECT_ROOT, 'data', 'raw', 'sector_returns')
    processed_dir = os.path.join(PROJECT_ROOT, 'data', 'processed')
    benchmark_path = os.path.join(PROJECT_ROOT, 'data', 'raw', 'benchmarks', 'NIFTY_50_index.csv')
    
    os.makedirs(processed_dir, exist_ok=True)
    
    with open(config_path, 'r') as f:
        stress_config = json.load(f)
    with open(constituents_path, 'r') as f:
        constituents_config = json.load(f)
        
    stress_windows = stress_config["stress_windows"]
    lookback = stress_config.get("baseline_lookback_days", 90)
    
    # 2. Validate NIFTY 50 Windows
    print("\n--- Validating Macro Stress Windows (NIFTY 50 >= 5% Drawdown) ---")
    if os.path.exists(benchmark_path):
        val_results = validate_stress_windows(benchmark_path, config_path)
        for vr in val_results:
            print(f"  {vr['event_name']:25s} | MDD: {vr['nifty50_mdd_pct']:6.2f}% | Status: {vr['status']}")
    else:
        print("  Warning: Benchmark file not found, skipping index validation.")
        
    # 3. Compute Metrics for 11 Sectors x 4 Events
    print("\n--- Processing Sector Returns & Computing Risk Metrics ---")
    sector_files = sorted([f for f in os.listdir(raw_returns_dir) if f.endswith('_returns.csv')])
    
    extended_records = []
    for sf in sector_files:
        sector_name = sf.replace('_returns.csv', '')
        filepath = os.path.join(raw_returns_dir, sf)
        df_sec = pd.read_csv(filepath)
        
        # Check date and return column
        date_col = 'Date' if 'Date' in df_sec.columns else df_sec.columns[0]
        ret_col = 'Sector_Return' if 'Sector_Return' in df_sec.columns else df_sec.columns[1]
        
        for w in stress_windows:
            metrics = calculate_sector_event_metrics(
                sector_name=sector_name,
                dates=df_sec[date_col],
                returns=df_sec[ret_col],
                event_config=w,
                baseline_lookback_days=lookback
            )
            # Assign risk label
            metrics['risk_label'] = assign_risk_label(metrics['max_drawdown_pct'])
            extended_records.append(metrics)
            print(f"  {sector_name:18s} | {w['event_name']:22s} | MDD: {metrics['max_drawdown_pct']:6.2f}% | Label: {metrics['risk_label']}")
            
    df_extended = pd.DataFrame(extended_records)
    print(f"\nGenerated {len(df_extended)} sector-event records.")
    
    # 4. Create the Canonical 9-Column Output Dataset
    # Schema: sector, stress_event, window_start, window_end, max_drawdown_pct, var_95, recovery_days, sharpe_drop, risk_label
    official_columns = [
        "sector",
        "stress_event",
        "window_start",
        "window_end",
        "max_drawdown_pct",
        "var_95",
        "recovery_days",
        "sharpe_drop",
        "risk_label"
    ]
    df_final = df_extended[official_columns].copy()
    
    # Save canonical CSV
    final_csv_path = os.path.join(processed_dir, 'NiftyStress44_final.csv')
    df_final.to_csv(final_csv_path, index=False)
    print(f"Saved canonical dataset -> {final_csv_path} (Shape: {df_final.shape})")
    
    # Save extended CSV for full research transparency
    ext_csv_path = os.path.join(processed_dir, 'NiftyStress44_extended.csv')
    df_extended.to_csv(ext_csv_path, index=False)
    print(f"Saved extended dataset  -> {ext_csv_path} (Shape: {df_extended.shape})")
    
    # 5. Build and Export Risk Label Matrix
    matrix_excel_path = os.path.join(processed_dir, 'risk_label_matrix.xlsx')
    export_risk_label_matrix_excel(df_final, matrix_excel_path)
    
    # 6. Build and Export Data Dictionary
    dict_excel_path = os.path.join(processed_dir, 'data_dictionary.xlsx')
    export_data_dictionary_excel(dict_excel_path)
    
    # 7. Run Domain Validation & Export Notes
    domain_df = run_domain_validation(df_final)
    domain_excel_path = os.path.join(processed_dir, 'domain_validation_notes.xlsx')
    export_domain_validation_excel(domain_df, domain_excel_path)
    
    # Summary of Class Distribution
    counts = df_final['risk_label'].value_counts().to_dict()
    print("\n--- Final Risk Label Distribution ---")
    for k, v in counts.items():
        print(f"  {k:12s}: {v:2d} records ({v/len(df_final)*100:.1f}%)")
        
    print("\n" + "=" * 75)
    print("PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 75)
    
    return {
        "status": "SUCCESS",
        "records_count": len(df_final),
        "class_distribution": counts,
        "final_csv": final_csv_path,
        "extended_csv": ext_csv_path,
        "matrix_excel": matrix_excel_path,
        "dictionary_excel": dict_excel_path,
        "domain_excel": domain_excel_path
    }


if __name__ == '__main__':
    run_pipeline()
