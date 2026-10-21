# Dataset Audit Report: NiftyStress-44

**Project Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events  
**Audit Conducted By:** Senior Quantitative Finance Researcher & Lead Data Engineer  
**Dataset Under Review:** `labeled_risk_dataset.csv` (Target: `NiftyStress44_final.csv`)  
**Audit Date:** 2026-10-20  
**Overall Verdict:** **PASS WITH LIMITATIONS**  

---

## 1. Executive Summary

This audit independently assesses the dataset generated for Objective 2 of the Capstone Project against the official specification `Objective2_PortfolioDrawdown_Dataset.pdf` and the Zeroth Review presentation `Zeroth_Review.pptx`.

The existing dataset contains 44 records (11 sectors × 4 macroeconomic stress events). The underlying return series are derived from genuine Yahoo Finance market data across 49 representative sector constituent stocks. However, critical schema omissions, metric definition deviations (`Sharpe_Ratio` instead of `sharpe_drop`), window-censored recovery periods, and model evaluation leakage require technical repairs and documented methodological caveats before the dataset can be certified for academic publication.

### Summary of Verdicts by Intended Use:
| Intended Use Case | Audit Verdict | Rationale |
| :--- | :--- | :--- |
| **Descriptive Risk Analysis** | **PASS** | MDD and VaR (95%) calculations are mathematically correct and accurately capture downside severity across all sectors. |
| **Risk-Label Generation** | **PASS** | Threshold rules (High: < -15%, Medium: -15% to -5%, Low: ≥ -5%) are faithfully applied. Zero occurrences of "Low" is an empirical property of market-wide crises, not a labeling bug. |
| **Machine Learning Benchmarking** | **PASS WITH LIMITATIONS** | Extremely small sample size ($N = 44$) and 2 populated classes. Random 70/30 train/test split has excessive variance. Models must strictly exclude MDD to prevent target leakage and use Stratified 3-Fold Cross-Validation. |

---

## 2. Structural & Completeness Audit

### 2.1 Matrix Integrity
- **Expected Combinations:** 11 NSE Sectors × 4 Macro Stress Events = 44 unique pairs.
- **Observed Records:** 44 unique pairs.
- **Duplicate Pairs:** 0 duplicates detected.
- **Sectors Verified (11/11):** Auto, Banking, Energy, Financial Services, FMCG, IT, Media, Metal, Pharma, PSU Bank, Realty.
- **Events Verified (4/4):**
  1. COVID-19 Crash (2020-02-17 to 2020-04-01)
  2. Russia-Ukraine Shock (2022-02-16 to 2022-04-29)
  3. RBI Rate Hike Cycle (2022-05-04 to 2023-02-08)
  4. US Fed Tightening (2022-03-16 to 2023-12-13)

### 2.2 Schema Compliance Audit

The official specification requires an exact 9-column schema:
```
sector, stress_event, window_start, window_end, max_drawdown_pct, var_95, recovery_days, sharpe_drop, risk_label
```

| Expected Column | In Existing File? | Actual Column Name | Finding / Discrepancy |
| :--- | :--- | :--- | :--- |
| `sector` | Partial | `Sector` | Capitalized name; needs lowercasing. |
| `stress_event` | Partial | `Event_Name` | Mismatched column header; `Event_ID` is also redundantly present. |
| `window_start` | **MISSING** | — | Dates omitted from final output table (present only in intermediate files). |
| `window_end` | **MISSING** | — | Dates omitted from final output table. |
| `max_drawdown_pct` | Partial | `Maximum_Drawdown(%)` | Mismatched column header with punctuation. Values match. |
| `var_95` | Partial | `VaR_95(%)` | Mismatched column header with punctuation. Values match. |
| `recovery_days` | Partial | `Recovery_Days` | Present, but contains 21 `NaN` values due to window-end truncation. |
| `sharpe_drop` | **MISSING** | `Sharpe_Ratio` | **Critical Error**: Original code computed raw stress Sharpe, NOT `sharpe_drop` ($Sharpe_{stress} - Sharpe_{baseline}$). |
| `risk_label` | Partial | `Risk_Label` | Capitalized; values (High/Medium) are correct. |

---

## 3. Financial Metric Verification

### 3.1 Maximum Drawdown (MDD)
- **Mathematical Definition:** $MDD = \min_t \left( \frac{W_t - \max_{\tau \le t} W_\tau}{\max_{\tau \le t} W_\tau} \right) \times 100\%$ where $W_t = \prod (1 + r_t)$.
- **Audit Result:** VERIFIED. Independent re-computation from daily return series matches all 44 original values exactly to 2 decimal places.
- **Range:** -50.49% (Metal, COVID-19) to -6.68% (FMCG, RBI Rate Hike).

### 3.2 Value at Risk (VaR 95%)
- **Mathematical Definition:** 5th percentile of daily portfolio return distribution within the stress window via historical simulation.
- **Audit Result:** VERIFIED. Signed negative percentage convention matches specification.
- **Range:** -10.60% (Metal, COVID-19) to -1.30% (FMCG, US Fed Tightening).

### 3.3 Sharpe Ratio Drop (`sharpe_drop`)
- **Mathematical Definition:** Annualized Sharpe ratio during the stress window minus annualized Sharpe ratio during the 90-day pre-stress baseline.
- **Audit Result:** FAILED IN ORIGINAL DATASET.
  - The original script computed raw annualized Sharpe ratio within the window without subtracting pre-stress baseline performance.
  - **Resolution:** Re-computed using 90-day lookback window:
    $$\Delta Sharpe = \left( \frac{\mu_{stress}}{\sigma_{stress}} \sqrt{252} \right) - \left( \frac{\mu_{base}}{\sigma_{base}} \sqrt{252} \right)$$
  - Audited `sharpe_drop` ranges from **-9.16** (Media, COVID-19) to **+3.15** (PSU Bank, US Fed Tightening). Mean drop is **-0.63**.

### 3.4 Recovery Days (`recovery_days`)
- **Mathematical Definition:** Trading days from drawdown trough until cumulative wealth returns to pre-stress peak.
- **Audit Finding:**
  - In `risk_metrics.py`, the search for recovery was restricted strictly to `window_returns` (ending at `window_end`).
  - For crises with severe drawdowns or short windows (such as COVID-19, ending April 1, 2020), no sector recovered by `window_end`.
  - Consequently, **21 of 44 records (47.7%) have `NaN` recovery days**.
  - **Compliance Check:** The PDF specification states: *"If a sector has not recovered by the window end date, flag recovery_days as NaN and note in data dictionary."*
  - Thus, the `NaN` representation strictly adheres to the prompt specification, but for financial completeness, our pipeline will report both the strict window-censored recovery and the unconstrained empirical recovery days.

---

## 4. Class Distribution & Risk-Label Integrity

### 4.1 Approved Threshold Rules
- **High Risk:** $MDD < -15.0\%$
- **Medium Risk:** $-15.0\% \le MDD < -5.0\%$
- **Low Risk:** $MDD \ge -5.0\%$

### 4.2 Observed Distribution
- **High Risk:** 26 records (59.1%)
- **Medium Risk:** 18 records (40.9%)
- **Low Risk:** 0 records (0.0%)

### 4.3 Why are there Zero Low-Risk Records?
Step 1 of the official objective required each stress window to be validated against a peak-to-trough decline of at least 5% in the NIFTY 50 index. Because all 4 selected periods represent severe macroeconomic shocks, broad market beta dragged every sector down by more than 5%. The least severe drawdown in the entire 44-record dataset was **FMCG during the RBI Rate Hike Cycle at -6.68%**.

Therefore, the absence of the "Low Risk" class is an **authentic empirical market finding**, demonstrating that during major systemic macro shocks in Indian markets, no sector qualifies as low risk under a -5% MDD threshold.

---

## 5. Machine Learning & Target Leakage Audit

In `original_project/NiftyStress44/code/baseline_classifier.py`:
1. **Run 1 (Sanity Check):** Included `Maximum_Drawdown(%)` as a predictive feature. Because `Risk_Label` is deterministically derived from `Maximum_Drawdown(%)`, this produced an artificial accuracy of 100% due to **direct target leakage**.
2. **Run 2 (Honest Baseline):** Excluded `Maximum_Drawdown(%)` and evaluated on `VaR_95(%)`, `Sharpe_Ratio`, and `Recovery_Days`. However:
   - It evaluated on a single 70/30 train/test split (only 14 test records).
   - Because 21 records have missing `Recovery_Days`, median imputation was applied, which distorts the feature distribution on such a tiny test set.
   - It did not execute the **3-fold cross-validation** explicitly mandated by the official specification.

### Recommended Evaluation Protocol:
- Train a Random Forest classifier strictly excluding `max_drawdown_pct`.
- Evaluate using **Stratified 3-Fold Cross-Validation** ($k=3$) to satisfy the project guide's requirement.
- Evaluate using **Leave-One-Stress-Event-Out (GroupKFold)** to test true temporal cross-crisis generalization.
- Report Accuracy, Balanced Accuracy, Precision, Recall, F1-score, and Confusion Matrix.

---

## 6. Audit Verdict & Sign-off

**FINAL VERDICT: PASS WITH LIMITATIONS**

The dataset is certified for use in the capstone project and subsequent conference paper subject to the automated repair of:
1. Exporting the canonical 9-column schema as `NiftyStress44_final.csv`.
2. Calculating true `sharpe_drop` using the 90-day pre-stress baseline.
3. Transparently documenting censored `recovery_days` alongside unconstrained empirical recovery days.
4. Implementing leak-free Stratified 3-Fold Cross-Validation for the baseline Random Forest classifier.
