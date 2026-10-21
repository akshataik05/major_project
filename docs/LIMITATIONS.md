# Research Scope and Methodological Limitations

**Project Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events  
**Document Identifier:** `LIMIT-NIFTY-2026-V1`  
**Academic Integrity Standard:** Transparent Disclosure of Methodological Assumptions  
**Maintainer:** Research Team 27 (Dayananda Sagar University)  
**Last Updated:** 2026-10-20  

---

## 1. Introduction

Academic rigor requires explicit disclosure of the boundaries, constraints, and statistical assumptions governing this research. While the `NiftyStress-44` framework establishes an empirical and reproducible benchmark for Indian equity sector vulnerability, researchers and faculty evaluators should interpret its quantitative and machine learning outputs within the following context.

---

## 2. Statistical & Sample Size Constraints ($N = 44$)

1. **Small Sample Properties:**
   The primary benchmark comprises exactly 44 observations (11 sectors across 4 stress events). While this provides a structured supervisory matrix for comparative risk analysis across NIFTY sectors, $N = 44$ is a constrained sample size for statistical machine learning.
2. **Degrees of Freedom & Overfitting:**
   Complex non-linear algorithms (such as deep learning or gradient-boosted trees with many estimators) risk memorizing sector identities or event noise. For this reason, our Random Forest baseline is deliberately constrained to `max_depth=3` and evaluated using leak-free features.
3. **Statistical Power:**
   Confidence intervals around cross-validation accuracy metrics are wider than those derived from thousands of high-frequency records. Machine learning results should be interpreted as diagnostic and exploratory benchmarks rather than definitive high-frequency forecasting systems.

---

## 3. Class Distribution & Absence of "Low Risk" Records

1. **Empirical Finding vs. Modeling Limitation:**
   The official supervisory threshold defines *Low Risk* as $MDD \ge -5.0\%$. In this dataset, exactly **0 out of 44 records** fell into the Low Risk category.
2. **Economic Reality of Systemic Crisis:**
   Every sector examined in the Indian equity markets experienced a maximum peak-to-trough decline exceeding $-6.68\%$ during each of the four macroeconomic shocks:
   - COVID-19: Sector MDDs ranged from $-26.31\%$ (FMCG) to $-54.76\%$ (Media).
   - Russia-Ukraine: Sector MDDs ranged from $-6.68\%$ (Oil & Gas) to $-14.77\%$ (IT).
   - RBI Rate Hike Cycle: Sector MDDs ranged from $-6.69\%$ (Auto) to $-14.77\%$ (IT).
   - US Fed Tightening: Sector MDDs ranged from $-10.98\%$ (FMCG) to $-28.31\%$ (Media).
3. **Machine Learning Impact:**
   The classification problem is effectively binary (High Risk vs. Medium Risk). Models cannot be trained to recognize Low Risk instances because no such instances exist under genuine historical market stress in these 4 events. Fabricating synthetic Low Risk records would violate scientific integrity.

---

## 4. Temporal Overlap of Macroeconomic Stress Windows

The four stress events defined in the official specification have substantial chronological overlap:

```
2020: [== COVID-19 Crash (Feb-Apr 2020) ==]
...
2022:      [== Russia-Ukraine (Feb-Apr 2022) ==]
2022-2023:     [======================== US Fed Tightening (Mar 2022 - Dec 2023) ========================]
2022-2023:          [================== RBI Rate Hike Cycle (May 2022 - Feb 2023) ==================]
```

1. **Chronological Subsumption:**
   The US Fed Tightening window (457 calendar days) spans March 2022 through December 2023, completely encompassing the RBI Rate Hike Cycle (May 2022 – Feb 2023) and overlapping with the end of the Russia-Ukraine Shock.
2. **Event Attribution:**
   Price declines observed between May 2022 and February 2023 are driven simultaneously by domestic RBI monetary policy, aggressive US Fed rate hikes, and lingering energy supply shocks. These events cannot be treated as statistically independent observations.
3. **Evaluation Implication:**
   When performing Leave-One-Stress-Event-Out cross-validation, models trained on the US Fed window may have partially observed price dynamics that also occurred during the RBI window, creating subtle cross-regime correlation.

---

## 5. Portfolio Construction & Constituent Proxy Assumptions

1. **Equal-Weighted Proxy Portfolios:**
   Each sector is represented by an equal-weighted composite of 4 to 5 large-cap and mid-cap constituent stocks rather than the official full-market-cap NIFTY sector indices (e.g., NIFTY Bank has 12 stocks, NIFTY 50 has 50 stocks).
2. **Tracking Error:**
   While the equal-weighted baskets track official sector trends with high statistical correlation ($r > 0.90$), equal weighting gives greater proportional influence to smaller constituent firms compared to free-float market-capitalization weighting.
3. **Constituent Survivorship Bias:**
   Constituent stocks were selected based on recent market leadership (2024). Any stock that was replaced or demoted from an index between 2019 and 2024 is not accounted for in historical reconstitution.

---

## 6. Recovery Time Censoring in Official Specification

1. **Specification Censoring Policy:**
   In the official reference code, the recovery algorithm stopped searching at `window_end`. If a sector did not regain its pre-drawdown peak prior to the final calendar date of the stress window, `recovery_days` was recorded as `NaN` (censored).
2. **Censorship Prevalence:**
   21 out of 44 records (including all 11 sectors in the COVID-19 Crash) did not recover within their defined stress windows, creating 47.7% missingness in that field in the official 9-column CSV.
3. **Extended Research Resolution:**
   To prevent research bias, our pipeline implements `recovery_days_extended`, which searches through the full multi-year price series. Under this extended horizon, 100% of sectors eventually recovered. Both metrics are documented side by side.

---

## 7. Implications for Future Academic Research

These limitations do not invalidate the findings; rather, they define the precise scientific contribution of the study:
- The research succeeds as a **cross-sectional comparative study of sector vulnerability and tail risk during historical macroeconomic shocks**.
- It provides an auditable, reproducible benchmark for supervisory stress-testing.
- For future predictive forecasting, researchers should expand to continuous rolling monthly windows and multi-year macroeconomic time series, as outlined in [`docs/PAPER_OUTLINE.md`](file:///c:/Users/aksha/OneDrive/Desktop/Major%20Project/docs/PAPER_OUTLINE.md).
