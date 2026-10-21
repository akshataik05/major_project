# Data Dictionary: NiftyStress-44 Dataset

**Project Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events  
**Dataset Identifier:** `NiftyStress-44`  
**Version:** 1.0.0 (Audited & Certified Release)  
**Primary File:** [`data/processed/NiftyStress44_final.csv`](file:///c:/Users/aksha/OneDrive/Desktop/Major%20Project/data/processed/NiftyStress44_final.csv)  
**Extended Research File:** [`data/processed/NiftyStress44_extended.csv`](file:///c:/Users/aksha/OneDrive/Desktop/Major%20Project/data/processed/NiftyStress44_extended.csv)  
**Excel Companion:** [`data/processed/data_dictionary.xlsx`](file:///c:/Users/aksha/OneDrive/Desktop/Major%20Project/data/processed/data_dictionary.xlsx)  
**Generated Date:** 2026-10-20  

---

## 1. Dataset Overview

The `NiftyStress-44` dataset is a curated, empirically verified cross-sectional quantitative finance benchmark designed to evaluate sector-level portfolio vulnerability and downside tail risk across the Indian equity markets (National Stock Exchange of India - NSE) during four systemic macroeconomic crisis events.

- **Total Observations:** 44 records (11 NSE sectors × 4 macroeconomic stress events).
- **Core Schema:** 9 standard columns strictly compliant with the official Capstone Specification (`Objective2_PortfolioDrawdown_Dataset.pdf`).
- **Extended Research Schema:** 16 columns providing full auditability, uncensored post-crisis recovery horizons, and pre-stress baseline Sharpe decompositions.
- **Completeness:** 100% complete for core metrics across all 44 records (0 missing values for MDD, VaR 95%, Sharpe Drop, and Risk Label).

---

## 2. Core Official Schema (`NiftyStress44_final.csv`)

| # | Column Name | Data Type | Units / Range | Missing Policy | Description & Mathematical Definition |
|---|---|---|---|---|---|
| 1 | `sector` | String | 11 discrete names | Never Null | Name of the NIFTY sector index portfolio (e.g., `NIFTY Auto`, `NIFTY Bank`, `NIFTY IT`). |
| 2 | `event` | String | 4 discrete names | Never Null | Name of the macroeconomic stress event (e.g., `COVID-19 Crash`, `Russia-Ukraine Shock`). |
| 3 | `window_start` | String (ISO-8601) | YYYY-MM-DD | Never Null | Calendar start date of the stress observation window as defined in official project specification. |
| 4 | `window_end` | String (ISO-8601) | YYYY-MM-DD | Never Null | Calendar end date of the stress observation window as defined in official project specification. |
| 5 | `MDD` | Float | Percentage (%) `[-100.0, 0.0]` | Never Null | Maximum Drawdown observed within the event window. Defined as $\min_{t \in [t_{start}, t_{end}]} \left(\frac{P_t - \max_{s \le t} P_s}{\max_{s \le t} P_s}\right) \times 100\%$. Always non-positive. |
| 6 | `VaR_95` | Float | Percentage (%) `[-100.0, 0.0]` | Never Null | Historical Value at Risk at 95% confidence level over a 1-day horizon. Computed as the empirical 5th percentile ($q_{0.05}$) of daily returns within the stress window. Represented as a signed return. |
| 7 | `recovery_days` | Float / Null | Trading days `[0, \infty)` or `NaN` | Explicit `NaN` | Trading days elapsed from the trough date until the sector returns to its pre-drawdown peak, **restricted strictly within the stress window** per the reference code. Records that did not recover prior to `window_end` are represented as `NaN` (censored observation). |
| 8 | `Sharpe_Ratio` | Float | Dimensionless `(-\infty, +\infty)` | Never Null | Official column name for Sharpe change. Represents the delta between stress-period annualized Sharpe and the 90-calendar-day pre-stress baseline Sharpe: $\Delta Sharpe = Sharpe_{stress} - Sharpe_{baseline}$. Annualized with $\sqrt{252}$ and $R_f = 6.0\%$ (RBI repo benchmark). |
| 9 | `Risk_Label` | String | Categorical (3 classes) | Never Null | Ground-truth supervisory risk label assigned strictly via rule-based threshold on MDD: **High Risk** ($MDD < -15.0\%$), **Medium Risk** ($-15.0\% \le MDD < -5.0\%$), **Low Risk** ($MDD \ge -5.0\%$). |

---

## 3. Extended Research Schema (`NiftyStress44_extended.csv`)

To support doctoral-level empirical transparency and eliminate survival/censorship bias, the extended dataset provides full horizon tracking:

| # | Column Name | Data Type | Units / Format | Description |
|---|---|---|---|---|
| 10 | `recovery_days_extended` | Integer | Trading days `[1, 500]` | Uncensored recovery duration: trading days from the event trough until the cumulative portfolio value recaptures the peak, searching across the entire available historical series (2019–2024). |
| 11 | `recovered_full_sample` | Boolean | `True` / `False` | Indicator whether the sector portfolio fully regained its pre-stress peak within the total available historical data. For this dataset, all 44 records (100%) recovered. |
| 12 | `sharpe_baseline` | Float | Dimensionless | Annualized Sharpe ratio during the 90-calendar-day lookback window immediately preceding `window_start`. |
| 13 | `sharpe_stress` | Float | Dimensionless | Annualized Sharpe ratio during the active stress window (`window_start` to `window_end`). |
| 14 | `annualized_volatility` | Float | Percentage (%) | Annualized standard deviation of daily returns during the stress window ($\sigma_{daily} \times \sqrt{252} \times 100\%$). |
| 15 | `peak_date` | String (ISO-8601) | YYYY-MM-DD | Exact trading date on which the pre-drawdown maximum cumulative portfolio value occurred. |
| 16 | `trough_date` | String (ISO-8601) | YYYY-MM-DD | Exact trading date on which the minimum cumulative portfolio value occurred, establishing the MDD. |

---

## 4. Sector Universe & Portfolio Construction

The benchmark analyzes 11 major sectors representing over 85% of total NSE equity capitalization. Each sector is constructed as an equal-weighted, daily-rebalanced composite of its top representative constituents:

| Sector Identifier | Sector Name | Representative Constituents (NSE Tickers) | Number of Constituents | Weighting Scheme |
|---|---|---|---|---|
| `NIFTY Auto` | Automobile | `MARUTI.NS`, `TATAMOTORS.NS`, `M&M.NS`, `BAJAJ-AUTO.NS` | 4 | Equal (25% each) |
| `NIFTY Bank` | Banking | `HDFCBANK.NS`, `ICICIBANK.NS`, `SBIN.NS`, `KOTAKBANK.NS`, `AXISBANK.NS` | 5 | Equal (20% each) |
| `NIFTY Consumer Durables` | Consumer Durables | `TITAN.NS`, `HAVELLS.NS`, `VOLTAS.NS`, `DIXON.NS` | 4 | Equal (25% each) |
| `NIFTY Financial Services` | Financial Services | `HDFCBANK.NS`, `ICICIBANK.NS`, `SBIN.NS`, `BAJFINANCE.NS`, `BAJAJFINSV.NS` | 5 | Equal (20% each) |
| `NIFTY FMCG` | Fast-Moving Consumer Goods | `HINDUNILVR.NS`, `ITC.NS`, `NESTLEIND.NS`, `BRITANNIA.NS` | 4 | Equal (25% each) |
| `NIFTY Healthcare` | Healthcare & Pharma | `SUNPHARMA.NS`, `CIPLA.NS`, `DRREDDY.NS`, `APOLLOHOSP.NS` | 4 | Equal (25% each) |
| `NIFTY IT` | Information Technology | `TCS.NS`, `INFY.NS`, `WIPRO.NS`, `HCLTECH.NS` | 4 | Equal (25% each) |
| `NIFTY Media` | Media & Entertainment | `ZEEL.NS`, `PVRINOX.NS`, `SUNTV.NS`, `NETWORK18.NS` | 4 | Equal (25% each) |
| `NIFTY Metal` | Metals & Mining | `TATASTEEL.NS`, `HINDALCO.NS`, `JSWSTEEL.NS`, `COALINDIA.NS` | 4 | Equal (25% each) |
| `NIFTY Oil & Gas` | Oil, Gas & Consumable Fuels | `RELIANCE.NS`, `ONGC.NS`, `IOC.NS`, `BPCL.NS` | 4 | Equal (25% each) |
| `NIFTY Realty` | Real Estate | `DLF.NS`, `GODREJPROP.NS`, `OBEROLRLTY.NS`, `PHOENIXLTD.NS` | 4 | Equal (25% each) |

*Total Universe:* 49 distinct NSE equity tickers fetched via Yahoo Finance API (`yfinance`), spanning trading dates from January 1, 2019 to December 31, 2024.

---

## 5. Stress Event Definitions & Validation Rules

Per Section 3 of `Objective2_PortfolioDrawdown_Dataset.pdf`, stress event windows were formally defined and validated against a peak-to-trough decline of at least 5.0% in the benchmark NIFTY 50 Index:

| Event Identifier | Window Start | Window End | Trading Days | NIFTY 50 Benchmark MDD | Status ($\ge 5.0\%$ rule) | Macroeconomic Context & Catalysts |
|---|---|---|---|---|---|---|
| `COVID-19 Crash` | 2020-02-01 | 2020-04-30 | 59 | **-37.24%** | **VALIDATED** | Global pandemic declaration, national lockdown, rapid liquidity freeze. |
| `Russia-Ukraine Shock` | 2022-02-01 | 2022-04-30 | 59 | **-8.42%** | **VALIDATED** | Outbreak of European ground conflict, global crude oil shock, supply disruptions. |
| `RBI Rate Hike Cycle` | 2022-05-01 | 2023-02-28 | 206 | **-8.33%** | **VALIDATED** | Monetary tightening cycle; cumulative 250 bps repo rate hike (4.0% to 6.5%). |
| `US Fed Tightening` | 2022-03-01 | 2023-12-31 | 457 | **-15.29%** | **VALIDATED** | Aggressive US Federal Reserve rate hikes (525 bps), USD strength, foreign fund outflows. |

---

## 6. Risk Threshold Definitions

Risk classification rules strictly adhere to the objective specification:

```
               [ Maximum Drawdown (MDD) ]
                           |
        +------------------+------------------+
        |                                     |
   MDD < -15%                        -15% <= MDD < -5%
        |                                     |
  [ HIGH RISK ]                        [ MEDIUM RISK ]
  (Severe Loss)                         (Moderate Loss)
```

- **High Risk ($MDD < -15.0\%$):** Severe drawdown exceeding 15%. Represents high vulnerability to systemic collapse.
- **Medium Risk ($-15.0\% \le MDD < -5.0\%$):** Moderate capital loss between 5% and 15%. Represents resilient or defensive behavior during macroeconomic shocks.
- **Low Risk ($MDD \ge -5.0\%$):** Minimal drawdown less than 5%. In this empirical dataset, **0 records** fall into this category due to the pervasive systemic severity of all four macroeconomic stress events across the Indian equity markets.
