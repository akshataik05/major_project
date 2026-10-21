"""
Tests for Random Forest model benchmarks, artifact loading, and leak-free evaluation.
"""
import os
import joblib
import pytest
import numpy as np
import pandas as pd

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


class TestModelEvaluation:
    def test_model_artifact_exists(self):
        art_path = os.path.join(PROJECT_ROOT, 'artifacts', 'baseline_rf_leak_free.joblib')
        assert os.path.exists(art_path), "Trained model artifact baseline_rf_leak_free.joblib does not exist!"

    def test_model_prediction_sanity(self):
        art_path = os.path.join(PROJECT_ROOT, 'artifacts', 'baseline_rf_leak_free.joblib')
        bundle = joblib.load(art_path)
        model = bundle['model']
        imputer = bundle['imputer']
        
        # Test input vector: severe tail risk (VaR 95% = -8.5%, Sharpe drop = -5.0)
        X_severe = imputer.transform([[-8.5, -5.0]])
        pred_severe = model.predict(X_severe)[0]
        # 1 corresponds to High Risk
        assert pred_severe == 1

        # Test input vector: mild tail risk (VaR 95% = -1.5%, Sharpe drop = 1.0)
        X_mild = imputer.transform([[-1.5, 1.0]])
        pred_mild = model.predict(X_mild)[0]
        # 0 corresponds to Medium Risk
        assert pred_mild == 0

    def test_target_leakage_exclusion(self):
        art_path = os.path.join(PROJECT_ROOT, 'artifacts', 'baseline_rf_leak_free.joblib')
        bundle = joblib.load(art_path)
        features = bundle['features']
        assert 'max_drawdown_pct' not in features, "TARGET LEAKAGE: max_drawdown_pct found in features!"
        assert 'Maximum_Drawdown(%)' not in features, "TARGET LEAKAGE: Maximum_Drawdown(%) found in features!"
