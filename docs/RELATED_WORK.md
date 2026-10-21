# Literature Review and Related Work

**Project Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events  
**Document Identifier:** `REL-NIFTY-2026-V1`  
**Academic Context:** Major Project Phase-I (Review 0 / Zeroth Review)  
**Academic Institution:** Dayananda Sagar University, School of Engineering, Dept. of CSE  
**Maintainer:** Research Team 27 (Akshata I Kallimath, Basanagouda, Guru Kumar, Indushree D N)  
**Faculty Guide:** Prof. Yashpal Gupta S  
**Last Updated:** 2026-10-20  

---

## 1. Introduction

The evaluation of equity portfolio risk during macroeconomic distress is a foundational problem at the intersection of quantitative finance and computational intelligence. While the quantitative finance literature contains extensive theoretical work on downside risk measures—such as Maximum Drawdown (MDD) and Value at Risk (VaR)—and the machine learning literature contains numerous predictive algorithms, there remains a critical gap in standardized, crisis-labeled empirical datasets for emerging markets like India.

This document synthesizes key scholarly contributions across four distinct domains, evaluates existing market datasets, and articulates the specific research gap addressed by the `NiftyStress-44` benchmark.

---

## 2. Theoretical Foundations of Downside Risk Measurement

### 2.1 The Sharpe Ratio and Risk-Adjusted Performance
The Sharpe ratio remains the primary benchmark for risk-adjusted performance evaluation:
$$\text{Sharpe} = \frac{\mathbb{E}[R_p - R_f]}{\sigma_p}$$
- **Sharpe, W. F. (1994).** *"The Sharpe Ratio,"* *The Journal of Portfolio Management*, 21(1), 49–58.
  - *Contribution:* Formalized the generalized Sharpe ratio and established conditions under which excess returns relative to a riskless benchmark ($R_f$) provide an appropriate reward-to-variability metric.
  - *Application in this Study:* Provides the foundation for calculating $\Delta Sharpe = Sharpe_{stress} - Sharpe_{baseline}$, comparing stress-period performance against a 90-day pre-crisis baseline under a 6.0% annualized risk-free rate (matching RBI repo benchmarks).

### 2.2 Value at Risk (VaR) and Tail Loss Estimation
- **Jorion, P. (2010).** *"Market Risk,"* *Encyclopedia of Quantitative Finance*, John Wiley & Sons.
  - *Contribution:* Detailed parametric and non-parametric historical simulation methodologies for estimating Value at Risk ($VaR_\alpha$), emphasizing the empirical quantile approach for capturing fat tails during liquidity stress.
  - *Application in this Study:* Informs our calculation of 1-day historical VaR at the 95% confidence level ($q_{0.05}$) across all 11 NIFTY sectors.

### 2.3 Portfolio Optimization under Drawdown Constraints
Standard Markowitz mean-variance optimization often fails during crisis periods because volatility does not differentiate between upside gains and catastrophic peak-to-trough drawdowns:
- **Baptista, A. M., & Alexander, G. J. (2006).** *"Portfolio Selection with a Drawdown Constraint,"* *Journal of Banking & Finance*, 30(11), 3171–3189.
  - *Contribution:* Proved that incorporating a hard Maximum Drawdown constraint alters the efficient frontier and significantly prevents catastrophic portfolio ruin in volatile regimes.
- **Goldberg, L. R., & Mahmoud, O. (2014).** *"Drawdown: From Practice to Theory and Back Again,"* *Journal of Investment Strategies*, 6(3), 1–24.
  - *Contribution:* Developed the statistical properties of conditional drawdown and the duration of underwater recovery periods.
- **Chekhlov, A., Uryasev, S., & Zabarankin, M. (2005).** *"Drawdown Measure in Portfolio Optimization,"* *International Journal of Theoretical and Applied Finance*, 8(1), 13–58.
  - *Contribution:* Formulated the Conditional Drawdown at Risk (CDaR) optimization framework for path-dependent loss minimization.

---

## 3. Indian Market Sector Dynamics & Crisis Spillovers

### 3.1 Sectoral Volatility and COVID-19 Spillovers
- **Guru, B. K., & Das, A. (2021).** *"COVID-19 and Volatility Spillovers Across Sectoral Indices: Evidence from BSE,"* *Studies in Economics and Finance*, 38(4), 809–828.
  - *Contribution:* Investigated volatility transmission across 10 major Bombay Stock Exchange (BSE) sectoral indices, showing that the COVID-19 shock caused massive structural breaks in correlation structures, with energy, banking, and auto sectors acting as net transmitters of systemic risk.
  - *Limitation:* Focused strictly on econometric volatility spillovers (GARCH-BEKK); did not formulate portfolio drawdown metrics, recovery horizons, or machine learning labels.

### 3.2 Dynamic Market Risk in Indian Sectors
- **Indian Institute of Management Bangalore (IIM-B) Working Group (2023).** *"Dynamic Market Risk and Portfolio Choice – Indian Stock Market."*
  - *Contribution:* Examined 10 Indian sectoral indices under distinct volatility regimes, demonstrating that dynamic conditional correlation models improve minimum-variance portfolios during market stress.
  - *Limitation:* Addressed continuous portfolio optimization rather than curating a discrete, labeled benchmark of historical macroeconomic stress events.

### 3.3 Sector-Wise Portfolio Risk Assessment on NIFTY 50
- **ResearchGate Working Paper (2025).** *"Sector-Wise Portfolio Risk Assessment – NIFTY 50 Stocks."*
  - *Contribution:* Evaluated NIFTY 50 sector baskets using VaR, Conditional VaR (CVaR), and MDD, confirming statistically significant risk heterogeneity across sectors.
  - *Limitation:* Did not establish an empirical sector $\times$ stress-event matrix with standardized supervisory labels or reproducible code.

---

## 4. Machine Learning in Financial Risk Classification

### 4.1 Nonlinear Risk Identification via Tree Ensembles
- **Breiman, L. (2001).** *"Random Forests,"* *Machine Learning*, 45(1), 5–32.
  - *Contribution:* Established the theoretical convergence and out-of-bag error properties of bagging with random feature selection, showing high resilience to multicollinearity and noise in financial tabular datasets.
- **Springer Financial Computing Group (2025/2026).** *"Financial Risk Identification using Random Forest,"* *Journal of Financial Data Science*.
  - *Contribution:* Demonstrated the efficacy of Random Forest classifiers in partitioning corporate risk into High/Medium/Low tiers using nonlinear balance-sheet and market indicators.
  - *Limitation:* Applied exclusively to corporate bankruptcy/credit default rather than sectoral market drawdowns during macroeconomic crises.

### 4.2 Prediction-Based Mean-VaR Optimization
- **ScienceDirect Quantitative Finance Series (2023).** *"Prediction-Based Mean-VaR Portfolio Optimization Using Tree Ensembles."*
  - *Contribution:* Combined Random Forest, XGBoost, and AdaBoost to forecast one-step-ahead returns for Mean-VaR portfolio allocation across international equity markets including the NSE.
  - *Limitation:* Aimed at directional price prediction rather than diagnostic crisis classification.

---

## 5. Comparative Literature Matrix & The Research Gap

| Study | Institution / Venue | Focus Domain | Metrics Used | Crisis Isolation? | Standardized Risk Labels? | ML Evaluation Without Leakage? |
|---|---|---|---|:---:|:---:|:---:|
| **Guru & Das (2021)** | Studies in Econ & Fin | BSE Sector Volatility | GARCH, Spillover Index | Partial (COVID only) | ❌ No | ❌ N/A |
| **IIM-B Study (2023)** | IIM Bangalore | Indian Sector Market Risk | Beta, DCC-GARCH, VaR | ❌ No (Continuous) | ❌ No | ❌ N/A |
| **ResearchGate (2025)** | Pre-print | NIFTY 50 Sector Risk | VaR, CVaR, MDD | ❌ No | ❌ No | ❌ N/A |
| **ScienceDirect (2023)** | ScienceDirect | ML Mean-VaR Optimization | Mean-VaR, RMSE, Sharpe | ❌ No | ❌ No | Partial (Return forecasting) |
| **Springer Study (2025)** | Springer FinData | Corporate Risk Classification | Debt ratios, Volatility | ❌ No (Credit) | Yes (Corporate Risk) | ❌ N/A |
| **NiftyStress-44 (This Work)** | **DSU Capstone (2026)** | **NSE Sector Macro Drawdown** | **MDD, VaR 95%, $\Delta$Sharpe, Recovery** | **✅ Yes (4 Stress Events)** | **✅ Yes (High/Med/Low)** | **✅ Yes (Leak-Free RF Benchmark)** |

### 5.1 The Four Identified Research Gaps

1. **Absence of Crisis-Specific Benchmarks in Indian Markets:**
   Existing repositories (Kaggle, Mendeley Data, Yahoo Finance) provide continuous historical daily prices. Quantitative researchers studying crises must independently identify stress dates, calculate drawdown trajectories, and align sector portfolios from scratch.
2. **Fragmentation of Downside Risk Metrics:**
   Extant studies typically report a single metric (e.g., VaR alone, or volatility alone). Downside tail risk is multi-dimensional: a sector may suffer high instantaneous volatility (VaR) but recover rapidly, or suffer deep prolonged structural degradation (MDD and long recovery days).
3. **Pervasive Target Leakage in ML Finance Literature:**
   Numerous existing student and commercial projects assign risk labels using MDD thresholds and subsequently include MDD or peak drawdown metrics as input features to train machine learning classifiers, reporting artificial 95–99% accuracy. This study rigorously exposes and eliminates this target leakage.
4. **Lack of Cross-Crisis Generalization Analysis:**
   Prior models rarely evaluate whether risk classification rules learned during an epidemiological liquidity shock (COVID-19) transfer to prolonged monetary tightening regimes (US Fed / RBI Rate Hikes).

---

## 6. Official Regulatory and Policy References

1. **National Stock Exchange of India (NSE Indices).** *"NIFTY 50 Index: Index Methodology and Historical Data,"* NSE India, 2024. [https://www.nseindia.com](https://www.nseindia.com)
2. **Reserve Bank of India (RBI).** *"Chronology of Major Policy Announcements: April 2022 to March 2023,"* *RBI Annual Report 2022–23*, Reserve Bank of India, Mumbai.
3. **Board of Governors of the Federal Reserve System (US Fed).** *"Monetary Policy Implementation and Balance Sheet Normalization (2022–2023),"* Federal Reserve Economic Data (FRED).
