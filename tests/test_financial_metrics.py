"""
Unit tests for quantitative financial calculations:
- Maximum Drawdown (MDD)
- Value at Risk (VaR 95%)
- Sharpe Ratio and Sharpe Drop
- Recovery Days
- Risk Label Threshold Rules
"""
import pytest
import numpy as np
import pandas as pd

from src.risk_metrics.mdd import compute_mdd, compute_mdd_details
from src.risk_metrics.var import compute_var
from src.risk_metrics.sharpe import compute_annualized_sharpe, compute_sharpe_drop
from src.risk_metrics.recovery import compute_recovery_days
from src.labeling.assign import assign_risk_label


class TestMDD:
    def test_known_drawdown(self):
        # Initial wealth 100 -> 120 (gain 20%) -> 60 (drop 50% from peak) -> 90
        # Daily returns: [0.20, -0.50, 0.50]
        # Wealth: [1.20, 0.60, 0.90]
        # Drawdowns: [0%, (0.6 - 1.2)/1.2 = -50%, (0.9 - 1.2)/1.2 = -25%]
        # MDD should be -50.00%
        returns = pd.Series([0.20, -0.50, 0.50])
        mdd = compute_mdd(returns)
        assert mdd == -50.00

    def test_strictly_increasing_returns(self):
        # No drawdown should occur if returns are strictly positive
        returns = pd.Series([0.01, 0.02, 0.01, 0.03])
        mdd = compute_mdd(returns)
        assert mdd == 0.00

    def test_flat_prices(self):
        returns = pd.Series([0.0, 0.0, 0.0])
        mdd = compute_mdd(returns)
        assert mdd == 0.00

    def test_empty_series(self):
        mdd = compute_mdd(pd.Series([], dtype=float))
        assert mdd is None

    def test_mdd_details_dates(self):
        dates = pd.date_range('2020-01-01', periods=4)
        returns = pd.Series([0.10, -0.30, 0.05, 0.10])
        details = compute_mdd_details(dates, returns)
        assert details['mdd_pct'] == -30.00
        assert details['peak_date'] == '2020-01-01'
        assert details['trough_date'] == '2020-01-02'


class TestVaR:
    def test_var_negative_convention(self):
        # 100 returns ranging from -0.10 to +0.10
        np.random.seed(42)
        returns = pd.Series(np.linspace(-0.10, 0.10, 101))
        # 5th percentile is approximately -0.09 (-9.00%)
        var95 = compute_var(returns, confidence_level=0.95)
        assert var95 < 0
        assert round(var95, 1) == -9.0

    def test_var_empty(self):
        assert compute_var(pd.Series([], dtype=float)) is None


class TestSharpe:
    def test_sharpe_zero_volatility(self):
        returns = pd.Series([0.01, 0.01, 0.01])
        sharpe = compute_annualized_sharpe(returns)
        assert sharpe == 0.0

    def test_sharpe_drop_calculation(self):
        # Stress returns mean -0.002, baseline mean +0.001
        stress_ret = pd.Series([-0.01, -0.02, 0.01, -0.005, -0.015] * 10)
        base_ret = pd.Series([0.005, 0.01, -0.002, 0.008, 0.003] * 10)
        
        s_stress, s_base, drop = compute_sharpe_drop(stress_ret, base_ret)
        assert s_stress < s_base
        assert drop < 0
        assert round(s_stress - s_base, 2) == drop


class TestRiskLabelAssignment:
    def test_high_risk(self):
        assert assign_risk_label(-15.01) == "High"
        assert assign_risk_label(-38.40) == "High"
        assert assign_risk_label(-50.49) == "High"

    def test_medium_risk(self):
        assert assign_risk_label(-15.0) == "Medium"  # Boundary: -15% <= MDD < -5%
        assert assign_risk_label(-14.99) == "Medium"
        assert assign_risk_label(-5.01) == "Medium"
        assert assign_risk_label(-6.68) == "Medium"

    def test_low_risk(self):
        assert assign_risk_label(-5.0) == "Low"      # Boundary: MDD >= -5%
        assert assign_risk_label(-4.99) == "Low"
        assert assign_risk_label(0.0) == "Low"

    def test_invalid_input(self):
        assert assign_risk_label(None) == "Unknown"
        assert assign_risk_label(np.nan) == "Unknown"
        assert assign_risk_label("invalid") == "Unknown"
