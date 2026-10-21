# Machine Learning Experiment Protocol

**Project Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events  
**Document Identifier:** `PROTO-ML-2026-V1`  
**Model Family:** Random Forest Classifier & Supervised Baselines  
**Evaluation Standard:** Leak-Free Stratified K-Fold and Out-of-Regime GroupKFold  
**Maintainer:** Research Team 27 (Dayananda Sagar University)  
**Last Updated:** 2026-10-20  

---

## 1. Experimental Overview & Research Questions

The machine learning component of this project addresses a specific question posed in the Capstone Specification:
> *Can an ensemble decision-tree model classify sector risk profiles using downside risk and volatility characteristics without target leakage, and can it generalize across macroeconomic regimes?*

### 1.1 Hypotheses
1. **$H_1$ (Target Leakage Hypothesis):** Including Maximum Drawdown ($MDD$) or direct mathematical derivatives in the feature space constitutes circular target leakage, trivially yielding near-100% classification accuracy while possessing zero predictive validity.
2. **$H_2$ (Downside Feature Sufficiency):** Daily tail-risk metrics (Value at Risk at 95% confidence) combined with risk-adjusted performance changes ($\Delta Sharpe$) carry sufficient discriminative signal to separate High Risk from Medium Risk regimes.
3. **$H_3$ (Macroeconomic Regime Shift):** Cross-event generalization (Leave-One-Stress-Event-Out) will exhibit significant performance degradation compared to in-sample cross-validation, reflecting the structural divergence between health-driven liquidity shocks (COVID-19) and inflationary monetary tightening regimes (US Fed / RBI).

---

## 2. Target Variable & Leakage Prevention Protocol

### 2.1 Target Variable Definition
The supervisory target variable $Y \in \{\text{High Risk}, \text{Medium Risk}, \text{Low Risk}\}$ is defined deterministically as:
$$Y_i = \begin{cases} \text{High Risk} & \text{if } MDD_i < -15.0\% \\ \text{Medium Risk} & \text{if } -15.0\% \le MDD_i < -5.0\% \\ \text{Low Risk} & \text{if } MDD_i \ge -5.0\% \end{cases}$$

### 2.2 Strict Target Leakage Rule
Under standard machine learning rigor, **any feature derived from the target or perfectly correlated with the target boundary must be strictly excluded**.
- **Excluded Features:** `MDD`, `trough_date`, `peak_date`.
- **Approved Feature Set A (Standard Leak-Free):** `VaR_95`, `Sharpe_Ratio` ($\Delta Sharpe$).
- **Approved Feature Set B (Extended Leak-Free):** `VaR_95`, `Sharpe_Ratio`, `recovery_days_extended`.
- **Sanity Check Feature Set (Target Leakage Demonstration):** `MDD`, `VaR_95`, `Sharpe_Ratio`.

---

## 3. Dataset Characteristics & Class Imbalance

The benchmark dataset consists of $N = 44$ sector-event records:
- **High Risk ($MDD < -15\%$):** 21 records (47.7%)
  - All 11 sectors in COVID-19 Crash (100%)
  - 10 sectors in US Fed Tightening (all except FMCG)
- **Medium Risk ($-15\% \le MDD < -5\%$):** 23 records (52.3%)
  - All 11 sectors in Russia-Ukraine Shock
  - All 11 sectors in RBI Rate Hike Cycle
  - 1 sector in US Fed Tightening (`NIFTY FMCG`: -10.98%)
- **Low Risk ($MDD \ge -5\%$):** 0 records (0.0%)
  - No sector experienced an MDD milder than -5.0% during these systemic national crises.

*Effective Target Space:* Binary classification between High Risk (Class 1) and Medium Risk (Class 0).

---

## 4. Model Specification & Hyperparameters

The primary model is a constrained Random Forest Classifier designed for small-sample stability and avoidance of overfitting:

```python
RandomForestClassifier(
    n_estimators=100,
    max_depth=3,           # Constrained to prevent memorization
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,       # Fixed seed for reproducibility
    class_weight="balanced"
)
```

### 4.1 Benchmark Baselines
1. **Majority Baseline (Zero-Rule):** Always predicts the modal class (Medium Risk, 52.27% accuracy).
2. **Stratified Dummy Classifier:** Predicts classes according to the empirical training prior.

---

## 5. Cross-Validation Schemes

### 5.1 Scheme A: Stratified 3-Fold Cross-Validation
- **Rationale:** Aligns with Section 4 of the official PDF specification.
- **Protocol:** The 44 records are split into 3 folds such that each fold contains proportional representation of High Risk and Medium Risk samples.
- **Repetitions:** Evaluated across fixed `random_state=42`.

### 5.2 Scheme B: Leave-One-Stress-Event-Out (GroupKFold)
- **Rationale:** Rigorous test of temporal regime transferability.
- **Protocol:** In each iteration, 3 macroeconomic events (33 records) are used for training, and the model is evaluated on the unseen 4th macroeconomic event (11 records).
- **Folds:**
  - Fold 1: Train on Russia-Ukraine, RBI Hikes, US Fed | Test on COVID-19 Crash.
  - Fold 2: Train on COVID-19, RBI Hikes, US Fed | Test on Russia-Ukraine Shock.
  - Fold 3: Train on COVID-19, Russia-Ukraine, US Fed | Test on RBI Rate Hike Cycle.
  - Fold 4: Train on COVID-19, Russia-Ukraine, RBI Hikes | Test on US Fed Tightening.

---

## 6. Evaluation Metrics

For each experimental fold and overall cross-validation, the following metrics are recorded:
- **Accuracy:** Overall proportion of correct predictions.
- **Balanced Accuracy:** Average of recall across classes (mitigating any residual class imbalance).
- **Macro Precision:** Arithmetic mean of per-class precision.
- **Macro Recall:** Arithmetic mean of per-class recall.
- **Macro F1-Score:** Harmonic mean of Macro Precision and Macro Recall.
- **Per-Class Metrics:** Precision, Recall, and F1 for High Risk and Medium Risk.
- **Confusion Matrix:** True Positives, False Positives, True Negatives, False Negatives.

---

## 7. Execution & Artifact Serialization

All experimental runs are executed via `src/models/baseline_rf.py` and saved to:
- Output CSV: [`data/processed/baseline_classifier_results.csv`](file:///c:/Users/aksha/OneDrive/Desktop/Major%20Project/data/processed/baseline_classifier_results.csv)
- Metrics JSON: [`reports/model_evaluation_metrics.json`](file:///c:/Users/aksha/OneDrive/Desktop/Major%20Project/reports/model_evaluation_metrics.json)
- Serialized Joblib Model: [`artifacts/baseline_rf_leak_free.joblib`](file:///c:/Users/aksha/OneDrive/Desktop/Major%20Project/artifacts/baseline_rf_leak_free.joblib)
