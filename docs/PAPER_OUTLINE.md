# Conference Research Paper Outline & Draft Specification

**Paper Title:** Empirical Downside Tail Risk and Machine Learning Classification Across NIFTY Sectors During Macroeconomic Stress Events  
**Alternative Target Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events: An Audited Emerging Market Benchmark  
**Target Conferences / Journals:**  
- *IEEE Symposium on Computational Intelligence for Financial Engineering and Economics (CIFEr)*  
- *ACM International Conference on AI in Finance (ICAIF)*  
- *Springer Journal of Financial Data Science / Financial Innovation*  
**Authors:** Akshata I Kallimath, Basanagouda, Guru Kumar, Indushree D N, Yashpal Gupta S  
**Affiliation:** Department of Computer Science and Engineering, School of Engineering, Dayananda Sagar University, Bangalore, India  

---

## Abstract

Macroeconomic crises induce abrupt structural breaks in asset price dynamics, asymmetric volatility spikes, and severe portfolio drawdowns that standard mean-variance models fail to capture. While emerging markets like India represent significant institutional capital, quantitative finance research frequently suffers from an absence of standardized, crisis-isolated sector benchmarks, leading to widespread methodological flaws including target leakage in machine learning evaluations. In this paper, we construct and audit **NiftyStress-44**, a transparent, reproducible benchmark evaluating downside portfolio tail risk across 11 National Stock Exchange of India (NSE) sectors during four systemic macroeconomic crisis events: the COVID-19 Crash (2020), the Russia-Ukraine Geopolitical Shock (2022), the Reserve Bank of India (RBI) Monetary Tightening Cycle (2022–2023), and the US Federal Reserve Tightening Cycle (2022–2023). 

We compute four unified downside metrics—Maximum Drawdown (MDD), historical Value at Risk at 95% confidence (VaR 95%), Sharpe ratio drop relative to a 90-day pre-stress baseline ($\Delta$Sharpe), and uncensored peak-recovery horizons—over 1,477 trading sessions (2019–2024). We demonstrate that the supervisory risk label (High, Medium, Low Risk) assigned via MDD thresholds creates severe target leakage if MDD is included in predictive feature sets (yielding an artificial 97.73% accuracy). When evaluated on strictly leak-free downside features using Stratified 3-Fold Cross-Validation, a constrained Random Forest baseline achieves 61.36% balanced accuracy (70.45% when including recovery dynamics). Furthermore, out-of-regime Leave-One-Stress-Event-Out validation reveals significant cross-crisis performance degradation (45.45%–50.00%), confirming that transmission mechanisms diverge fundamentally between sudden liquidity shocks and protracted inflationary rate cycles. We release the certified 44-record benchmark, reproducible calculation pipeline, and interactive research dashboard to facilitate future stress-testing research.

**Keywords:** Quantitative Finance, Portfolio Risk, Maximum Drawdown, Value at Risk, NIFTY 50 Sectors, Macroeconomic Stress Testing, Machine Learning, Target Leakage, Random Forest.

---

## 1. Introduction

- **1.1 Motivation:** Asymmetry of financial asset returns during black-swan macroeconomic distress. Failures of traditional risk models that assume normal distributions or continuous calm-market regimes.
- **1.2 The Emerging Market Context:** Significance of the Indian National Stock Exchange (NSE); rapid growth in domestic and foreign institutional retail capital; susceptibility to global supply shocks and foreign portfolio outflows.
- **1.3 Problem Statement & Research Gap:** Absence of crisis-isolated sector datasets in Indian equity research; fragmentation of downside risk metrics; pervasive circular target leakage in applied machine learning finance literature.
- **1.4 Key Contributions:**
  1. *Curated Benchmark (`NiftyStress-44`):* 11 sectors × 4 stress windows over 1,477 trading sessions.
  2. *Audited Multi-Dimensional Tail Risk Engine:* Simultaneous quantification of MDD, VaR 95%, $\Delta$Sharpe, and recovery days.
  3. *Empirical Disclosure of Target Leakage:* Mathematical and computational proof that MDD leakage inflates ML accuracy from 61.36% to 97.73%.
  4. *Cross-Regime Generalization Study:* Leave-One-Stress-Event-Out evaluation establishing structural differences across crisis archetypes.
  5. *Open-Science Reproducibility:* Open-source modular pipeline and interactive research system.

---

## 2. Related Work & Theoretical Framework

- **2.1 Portfolio Drawdown Theory:**
  - Baptista & Alexander (2006) on drawdown-constrained portfolio optimization.
  - Goldberg & Mahmoud (2014) on path-dependent drawdowns and underwater duration.
  - Chekhlov, Uryasev, & Zabarankin (2005) on Conditional Drawdown at Risk.
- **2.2 Tail Risk Estimation & Historical Simulation:**
  - Jorion (2010) on Value at Risk (VaR) empirical quantiles vs. parametric assumptions.
  - Sharpe (1994) on generalized reward-to-variability ratios and baseline lookbacks.
- **2.3 Sectoral Volatility in Emerging Markets:**
  - Guru & Das (2021) on COVID-19 volatility spillovers across BSE sectors.
  - IIM Bangalore (2023) on dynamic market risk across Indian sectoral indices.
- **2.4 Machine Learning in Financial Risk Classification:**
  - Breiman (2001) Random Forest properties on noisy tabular financial features.
  - Critical analysis of predictive claim inflation and target leakage in recent literature.

---

## 3. Dataset Construction & Quantitative Methodology

- **3.1 Sector Universe & Equities Mapping:**
  - 11 Sectors: Auto, Bank, Consumer Durables, Financial Services, FMCG, Healthcare, IT, Media, Metal, Oil & Gas, Realty.
  - 49 liquid large-cap and mid-cap NSE equities (`yfinance`, adjusted close).
  - Equal-weighted composite return calculation: $R_{sector,t} = \frac{1}{K} \sum_{i=1}^K R_{i,t}$.
- **3.2 Stress Event Identification & NIFTY 50 Hurdle Validation:**
  - Quantitative rule: Event window must demonstrate a peak-to-trough decline of at least 5.0% in benchmark NIFTY 50 (`^NSEI`).
  - Table: Validated dates, trading sessions, and empirical benchmark MDDs (-37.24%, -8.42%, -8.33%, -15.29%).
- **3.3 Mathematical Formulation of Risk Metrics:**
  - Maximum Drawdown ($MDD$): Running peak $M_t = \max_{s \le t} W_s$; $MDD = \min_t \frac{W_t - M_t}{M_t} \times 100\%$.
  - Historical Value at Risk ($VaR_{95}$): Empirical 5th percentile of daily returns $q_{0.05}(R_t)$.
  - Sharpe Ratio Drop ($\Delta Sharpe$): $Sharpe_{stress} - Sharpe_{baseline(90d)}$ with $R_f = 6.0\%$ and $\sqrt{252}$ annualization.
  - Recovery Duration ($T_{rec}$): Trading days from trough $t^*$ to recapture peak $W_{t^* + \tau} \ge M_{t^*}$. Formal separation between window-censored ($recovery\_days$) and uncensored horizon ($recovery\_days\_extended$).
- **3.4 Supervisory Risk Labeling:**
  - High Risk ($MDD < -15.0\%$), Medium Risk ($-15.0\% \le MDD < -5.0\%$), Low Risk ($MDD \ge -5.0\%$).
  - Empirical finding: 0 Low-Risk records (systemic market severity).

---

## 4. Machine Learning Framework & Target Leakage Analysis

- **4.1 The Target Leakage Problem:**
  - Theoretical demonstration: Target $Y$ is a deterministic piecewise step function of $MDD$.
  - Including $MDD$ yields $P(Y \mid X) \approx 1.0$ through trivial threshold memorization.
- **4.2 Experimental Setup:**
  - Model: Random Forest Classifier ($N_{trees}=100$, $depth=3$, balanced weights, fixed random seed 42).
  - Feature Sets: Leak-Free Standard ($VaR_{95}, \Delta Sharpe$) vs. Extended ($+ T_{rec}$) vs. Leaked ($+ MDD$).
- **4.3 Validation Protocols:**
  - Protocol 1: Stratified 3-Fold Cross-Validation.
  - Protocol 2: Leave-One-Stress-Event-Out (GroupKFold across the 4 macroeconomic events).

---

## 5. Empirical Results & Discussion

- **5.1 Cross-Sector Downside Risk Comparison:**
  - Deepest Drawdowns: NIFTY Media (-54.76%), NIFTY Realty (-49.49%), NIFTY Bank (-46.36%) during COVID-19.
  - Defensive Outperformers: NIFTY FMCG (-26.31% in COVID-19, -10.98% in US Fed Tightening).
  - Tail Risk Quantiles: Healthcare VaR 95% was lowest (-1.82% in Russia-Ukraine) due to defensive pharma demand.
- **5.2 Machine Learning Benchmark Performance:**
  - Leak-Free Standard (Stratified 3-Fold): 61.36% Accuracy, 0.613 Macro F1.
  - Leak-Free Extended with Recovery (Stratified 3-Fold): 70.45% Accuracy, 0.704 Macro F1.
  - Target-Leaked Sanity Check: 97.73% Accuracy (empirically proving the artificial boost).
- **5.3 Out-of-Regime Generalization Failure:**
  - GroupKFold accuracy drops to 45.45%–50.00%.
  - Qualitative analysis: Macro factors driving monetary policy cycles (interest rate sensitivity in IT and Realty) differ structurally from pandemic supply-chain freezes.

---

## 6. Limitations & Future Directions

- Sample size of 44 event-level records (appropriate for supervisory diagnosis, but small for high-dimensional deep learning).
- Equal-weighted constituent proxies vs. free-float capitalization indices.
- Extension to rolling monthly crisis prediction and integration of macro indicators (CPI inflation, repo rate yield curves, USD/INR FX volatility).

---

## 7. Conclusion

- Summary of findings: Importance of rigorous leak-free evaluation; sector-level defensive hierarchy in Indian equities; release of reproducible tools and dataset for academic and supervisory applications.

---

## References

*(Full 20-entry academic bibliography formatted in IEEE / APA style, including Sharpe 1994, Jorion 2010, Baptista & Alexander 2006, Goldberg & Mahmoud 2014, Guru & Das 2021, Breiman 2001, Reserve Bank of India 2023, NSE Indices 2024).*
