"""
Tests for data pipeline integrity, schema compliance, and benchmark files:
- Canonical 9-column schema
- 44 records (11 sectors x 4 events)
- No duplicate sector-event pairs
- Benchmark index drawdown validation
"""
import os
import json
import pytest
import pandas as pd

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


class TestDataPipeline:
    def test_canonical_file_exists(self):
        canonical_path = os.path.join(PROJECT_ROOT, 'data', 'processed', 'NiftyStress44_final.csv')
        assert os.path.exists(canonical_path), "NiftyStress44_final.csv does not exist!"

    def test_official_schema_columns(self):
        canonical_path = os.path.join(PROJECT_ROOT, 'data', 'processed', 'NiftyStress44_final.csv')
        df = pd.read_csv(canonical_path)
        expected_columns = [
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
        assert list(df.columns) == expected_columns

    def test_record_count_and_uniqueness(self):
        canonical_path = os.path.join(PROJECT_ROOT, 'data', 'processed', 'NiftyStress44_final.csv')
        df = pd.read_csv(canonical_path)
        assert len(df) == 44, f"Expected 44 records, got {len(df)}"
        assert df['sector'].nunique() == 11, f"Expected 11 sectors, got {df['sector'].nunique()}"
        assert df['stress_event'].nunique() == 4, f"Expected 4 events, got {df['stress_event'].nunique()}"
        assert df.duplicated(subset=['sector', 'stress_event']).sum() == 0, "Duplicate sector-event records found!"

    def test_risk_label_consistency(self):
        canonical_path = os.path.join(PROJECT_ROOT, 'data', 'processed', 'NiftyStress44_final.csv')
        df = pd.read_csv(canonical_path)
        for _, row in df.iterrows():
            mdd = row['max_drawdown_pct']
            label = row['risk_label']
            if mdd < -15.0:
                assert label == 'High', f"Mismatch for {row['sector']} in {row['stress_event']}: MDD {mdd} labeled {label}"
            elif mdd < -5.0:
                assert label == 'Medium', f"Mismatch for {row['sector']} in {row['stress_event']}: MDD {mdd} labeled {label}"
            else:
                assert label == 'Low', f"Mismatch for {row['sector']} in {row['stress_event']}: MDD {mdd} labeled {label}"

    def test_nifty50_validation(self):
        from src.validation.validate_windows import validate_stress_windows
        b_path = os.path.join(PROJECT_ROOT, 'data', 'raw', 'benchmarks', 'NIFTY_50_index.csv')
        c_path = os.path.join(PROJECT_ROOT, 'configs', 'stress_windows_config.json')
        if os.path.exists(b_path):
            results = validate_stress_windows(b_path, c_path)
            for r in results:
                assert r['criterion_met'] is True, f"Event {r['event_name']} failed 5% drawdown criterion: {r['nifty50_mdd_pct']}%"
