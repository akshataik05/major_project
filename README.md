# Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-29%2F29%20Passing-brightgreen.svg)](tests/)
[![License](https://img.shields.io/badge/License-Academic%20Research-lightgrey.svg)]()

> **Major Capstone Project Phase-I (Zeroth Review / Review 0)**  
> **Department of Computer Science and Engineering**  
> **School of Engineering, Dayananda Sagar University, Bangalore, India (2026–2027)**  
> **Faculty Guide:** Prof. Yashpal Gupta S  
> **Research Team 27:**  
> - **Akshata I Kallimath** (ENG23CS0016)  
> - **Basanagouda** (ENG23CS0028)  
> - **Guru Kumar** (ENG23CS0070)  
> - **Indushree D N** (ENG23CS0080)  

---

## 1. Executive Summary

This repository houses the complete, end-to-end research system for **Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events**, establishing the audited and reproducible **`NiftyStress-44`** quantitative benchmark.

Existing emerging market datasets predominantly cover continuous, tranquil trading periods, failing to isolate how sector portfolios behave under severe macroeconomic stress. Furthermore, applied machine learning projects in finance frequently suffer from catastrophic methodological errors—most notably **target leakage**, where downside metrics like Maximum Drawdown are fed into predictive models to artificially inflate accuracy to 95–99%.

This system solves these issues through:
1. **Audited Empirical Data Ingestion:** 1,477 daily trading sessions (2019–2024) across 49 National Stock Exchange of India (NSE) equities mapped into 11 equal-weighted sector portfolios.
2. **Stress Window Validation:** Strict validation of 4 macroeconomic crisis windows against a minimum 5.0% peak-to-trough decline in the NIFTY 50 index (`^NSEI`).
3. **Four-Dimensional Downside Risk Engine:** Exact implementation of Maximum Drawdown (MDD), historical Value at Risk at 95% confidence (VaR 95%), Sharpe ratio drop relative to a 90-day pre-crisis baseline ($\Delta$Sharpe), and uncensored recovery duration.
4. **Leak-Free Machine Learning Benchmark:** Rigorous Random Forest classification evaluating genuine downside signals, exposing target leakage (97.73% vs. 61.36% leak-free accuracy), and evaluating cross-crisis regime shift via Leave-One-Stress-Event-Out validation.
5. **Full-Stack Research System:** A production FastAPI backend serving both a documented REST API and an interactive 9-page React + TypeScript quantitative dashboard on port 8000.
6. **29-Test Automated Verification Suite:** 100% pass rate covering financial boundary conditions, schema constraints, and API contracts.

---

## 2. System Architecture

```
                                  [ RAW NSE MARKET DATA ]
                       (49 Tickers via yfinance / Local Cache: 2019-2024)
                                             |
                                             v
                             [ COMPOSITE SECTOR PORTFOLIOS ]
                         (11 Equal-Weighted Daily Return Series)
                                             |
                                             v
                           [ STRESS WINDOW VALIDATION ENGINE ]
                     (COVID-19, Russia-Ukraine, RBI Hikes, US Fed)
                       [NIFTY 50 Benchmark MDD >= 5% Hurdle Rule]
                                             |
                                             v
                           [ QUANTITATIVE TAIL RISK ENGINE ]
           +--------------------+-------------------+--------------------+
           |                    |                   |                    |
       [  MDD  ]           [  VaR 95%  ]      [ Delta Sharpe ]     [  Recovery  ]
    (Peak-to-Trough)     (Empirical 5th %)    (90-day baseline)   (Window & Extended)
           |                    |                   |                    |
           +--------------------+-------------------+--------------------+
                                             |
                                             v
                           [ SUPERVISORY RISK LABEL ASSIGNMENT ]
                    High Risk (MDD < -15%) | Medium Risk (-15% <= MDD < -5%)
                                             |
                                             v
                   +---------------------------------------------------+
                   |         CERTIFIED BENCHMARK DELIVERABLES          |
                   | - NiftyStress44_final.csv    (44 x 9 official)    |
                   | - NiftyStress44_extended.csv (44 x 16 research)   |
                   | - risk_label_matrix.xlsx     (11 x 4 styled grid) |
                   | - data_dictionary.xlsx       (4-sheet formal dict)|
                   | - domain_validation_notes.xlsx (qualitative checks)|
                   +---------------------------------------------------+
                                             |
                         +-------------------+-------------------+
                         |                                       |
                         v                                       v
          [ MACHINE LEARNING LAB ]                [ FASTAPI UNIFIED SERVER ]
         - Target Leakage Proof                  - REST API Endpoints (/api/*)
         - Stratified 3-Fold CV                  - Static React Mount (/)
         - Leave-One-Crisis-Out (GroupKFold)     - Swagger / ReDoc Docs
                         |                                       |
                         +-------------------+-------------------+
                                             |
                                             v
                              [ REACT RESEARCH DASHBOARD ]
                   (9 Interactive Pages: Heatmap, Analytics, ML Lab, etc.)
```

---

## 3. Macroeconomic Stress Windows & NIFTY 50 Validation

Per the official specification (`Objective2_PortfolioDrawdown_Dataset.pdf`), all four macroeconomic stress events were validated against historical daily data of the benchmark NIFTY 50 index:

| Macroeconomic Stress Event | Start Date | End Date | Trading Sessions | NIFTY 50 Max Drawdown | Validation Status ($\le -5.0\%$) | Macro Catalyst |
|---|---|---|:---:|:---:|:---:|---|
| **COVID-19 Crash** | 2020-02-01 | 2020-04-30 | 59 | **-37.24%** | ✅ **VALIDATED** | Global pandemic outbreak, nationwide lockdown, liquidity squeeze |
| **Russia-Ukraine Shock** | 2022-02-01 | 2022-04-30 | 59 | **-8.42%** | ✅ **VALIDATED** | Outbreak of Eastern European conflict, crude oil & commodity spike |
| **RBI Rate Hike Cycle** | 2022-05-01 | 2023-02-28 | 206 | **-8.33%** | ✅ **VALIDATED** | Domestic monetary tightening; 250 bps repo rate hike (4.0% to 6.5%) |
| **US Fed Tightening** | 2022-03-01 | 2023-12-31 | 457 | **-15.29%** | ✅ **VALIDATED** | Aggressive US rate hikes (525 bps), USD surge, FII outflows |

---

## 4. Quantitative Formulations

### 4.1 Maximum Drawdown (MDD)
For cumulative wealth index $W_t = \prod_{s=1}^t (1 + R_s)$ and running peak $M_t = \max_{s \le t} W_s$:
$$\text{MDD} = \min_{t \in [t_{start}, t_{end}]} \left( \frac{W_t - M_t}{M_t} \right) \times 100\%$$
*Properties: Non-positive ($\le 0.0\%$), path-dependent, scale-invariant.*

### 4.2 Historical Value at Risk (VaR 95%)
Empirical 5th percentile of daily returns within the stress window:
$$\text{VaR}_{95} = \text{Quantile}_{0.05} \left( \{ R_t \}_{t=1}^T \right) \times 100\%$$
*Convention: Signed negative return quantile.*

### 4.3 Sharpe Ratio Change ($\Delta$Sharpe)
$$\Delta \text{Sharpe} = \text{Sharpe}_{stress} - \text{Sharpe}_{baseline(90d)}$$
$$\text{Sharpe} = \frac{\bar{R} \times 252 - R_f}{\sigma_R \times \sqrt{252}}, \quad \text{where } R_f = 6.0\% \text{ (RBI Repo Rate)}$$

### 4.4 Recovery Duration
Trading days $\tau$ required to recapture pre-drawdown peak:
$$T_{rec} = \min \{ \tau \ge 1 \mid W_{t_{trough} + \tau} \ge M_{t_{trough}} \}$$
- `recovery_days`: Censored at `window_end` per reference spec ($21 / 44 = \text{NaN}$).
- `recovery_days_extended`: Uncensored horizon search across 2019–2024 ($44 / 44 = 100\%$ recovered).

---

## 5. Supervisory Risk Labels & Empirical Class Distribution

Supervisory rules applied strictly to MDD:
- **High Risk:** $\text{MDD} < -15.0\%$ (Severe capital loss).
- **Medium Risk:** $-15.0\% \le \text{MDD} < -5.0\%$ (Moderate resilience).
- **Low Risk:** $\text{MDD} \ge -5.0\%$ (Minimal loss).

### Empirical Distribution in `NiftyStress-44`
- **High Risk:** 26 observations (59.1%) — *Includes all 11 sectors in COVID-19, and 10 sectors in US Fed Tightening.*
- **Medium Risk:** 18 observations (40.9%) — *Includes all 11 sectors in Russia-Ukraine, all 11 in RBI Hikes, and FMCG in US Fed.*
- **Low Risk:** **0 observations (0.0%)** — *Authentic empirical finding: No Indian sector had an MDD milder than -6.68% during these systemic national crises.*

---

## 6. Machine Learning Baseline & Target Leakage Prevention

The system trains a constrained `RandomForestClassifier(n_estimators=100, max_depth=3, class_weight='balanced')`.

| Experiment | Features | Target Leakage? | Stratified 3-Fold Acc | Balanced Acc | Macro F1 | Out-of-Regime (GroupKFold) Acc | Scientific Status |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Target-Leaked Sanity Check** | `MDD`, `VaR_95`, `Sharpe_Drop` | ⚠️ **YES** | **97.73%** | 98.08% | 0.9767 | 84.09% | ❌ **Invalid (Tautological memorization)** |
| **Leak-Free Standard** | `VaR_95`, `Sharpe_Drop` | 🛡️ **NO** | **61.36%** | **62.18%** | **0.6118** | **45.45%** | ✅ **Valid (Genuine downside signal)** |
| **Leak-Free Extended** | `VaR_95`, `Sharpe_Drop`, `Recovery_Ext` | 🛡️ **NO** | **70.45%** | **69.87%** | **0.6969** | **38.64%** | ✅ **Valid (+ Elasticity feature)** |

*Critical Finding:* The drop in accuracy to 45.45% under GroupKFold confirms that transmission channels diverge fundamentally between acute epidemiological liquidity freezes (COVID-19) and grinding multi-year interest rate cycles (US Fed).

---

## 7. Interactive Research Dashboard (9 Dedicated Views)

Served seamlessly on `http://127.0.0.1:8000/`:
1. **Research Overview:** High-level executive KPIs, certified dataset summary, risk label distribution donut chart, and quick links.
2. **Stress-Event Explorer:** Interactive macro selector, NIFTY 50 validation cards, timeline milestones, and event overlap analysis.
3. **Sector Risk Heatmap:** Dynamic 11×4 sector-by-event grid; clicking any cell displays an audit drawer with MDD, VaR 95%, Sharpe drop, and recovery days.
4. **Portfolio Risk Analytics:** Cross-sector comparative bar charts, bubble risk matrix, and live daily cumulative return trajectory charts.
5. **Dataset Explorer:** Full-featured searchable, sortable, and filterable table of all 44 records with CSV/Excel export buttons.
6. **Model Laboratory:** Interactive Random Forest risk prediction simulator, ROC/feature importance charts, and leakage analysis.
7. **Quality & Provenance:** Data provenance report, W3C chain of custody, and repair log audit table.
8. **Methodology & Docs:** Mathematical formulas, risk threshold definitions, and academic citations.
9. **About Team 27:** Official project credentials, institutional affiliations, and faculty guide credits.

---

## 8. Quickstart Guide

### 8.1 Prerequisites
- Python 3.10+ (tested on Python 3.13.9)
- Node.js 18+ (tested on Node v22.15.1)

### 8.2 Installation
```bash
# Clone and enter directory
cd "Major Project"

# Install Python requirements
pip install -r requirements.txt

# (Optional) Rebuild frontend if modifying UI
cd frontend
npm install
npm run build
cd ..
```

### 8.3 Run Master Data Pipeline
```bash
# Executes pipeline in offline mode using verified cached NSE return series
python -m src.pipeline

# Alternatively, execute the official standalone scripts directly:
python mdd_compute.py
python risk_metrics.py
python label_assign.py
python baseline_classifier.py
```

### 8.4 Run Automated Test Suite
```bash
pytest tests/ -v
```
*Expected: 29 passed in ~9 seconds.*

### 8.5 Launch the Research System
```bash
# Start unified server hosting both REST API and React UI
uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Dashboard UI:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Swagger API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Docs:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 9. Repository Layout

```
Major Project/
├── configs/                             # Configuration files
│   ├── sector_constituents.json        # 49 NSE equity tickers across 11 sectors
│   └── stress_windows_config.json      # Formal macro stress event dates & parameters
├── data/
│   ├── raw/                            # Immutable source data
│   │   ├── benchmarks/                 # NIFTY 50 index historical prices
│   │   └── sector_returns/             # 11 daily composite return CSV series
│   └── processed/                      # Certified generated deliverables
│       ├── NiftyStress44_final.csv     # Exact 9-column official schema (44 rows)
│       ├── NiftyStress44_extended.csv  # 16-column extended research dataset
│       ├── risk_label_matrix.xlsx      # Stylized 11x4 sector-by-event grid
│       ├── data_dictionary.xlsx        # 4-sheet formal documentation workbook
│       ├── domain_validation_notes.xlsx# Qualitative domain plausibility notes
│       └── baseline_classifier_results.csv # ML benchmark fold-wise metrics
├── docs/                               # Academic research documentation
│   ├── DATA_DICTIONARY.md              # Formal schema & field definitions
│   ├── DATA_PROVENANCE.md              # W3C chain of custody & data lineage
│   ├── EXPERIMENT_PROTOCOL.md          # Machine learning experimental design
│   ├── LIMITATIONS.md                  # Methodological boundaries & small-sample notes
│   ├── PAPER_OUTLINE.md                # IEEE/ACM conference draft outline
│   ├── PROJECT_INVENTORY.md            # Catalog of workspace artifacts
│   ├── PROJECT_PLAN.md                 # 9-stage engineering roadmap
│   ├── RELATED_WORK.md                 # Comparative literature survey & gaps
│   ├── REPRODUCIBILITY.md              # Step-by-step reproduction instructions
│   └── RESEARCH_METHODOLOGY.md         # Comprehensive quantitative methodology
├── frontend/                           # React + TypeScript + Vite + Tailwind UI
│   ├── dist/                           # Production static assets served by FastAPI
│   ├── src/                            # Modern UI components & page modules
│   └── package.json                    # Frontend dependencies
├── reports/                            # Audit and evaluation reports
│   ├── dataset_audit_report.md         # Audit of original Claude artifacts
│   ├── experiment_results.md           # Machine learning performance report
│   ├── methodology_issues.md           # 5 core methodological issues & fixes
│   ├── model_evaluation_metrics.json   # Machine-readable ML evaluation outputs
│   ├── records_requiring_review.csv    # Censored recovery observation log
│   ├── repair_log.csv                  # Step-by-step data repair audit trail
│   └── validation_summary.md           # Domain & mathematical verification summary
├── src/                                # Modular quantitative python package
│   ├── api/                            # FastAPI REST application & schemas
│   ├── data_ingestion/                 # yfinance fetcher & calendar aligners
│   ├── labeling/                       # Rule-based supervisory risk labeling
│   ├── models/                         # Leak-free Random Forest classifier
│   ├── risk_metrics/                   # MDD, VaR 95%, Sharpe drop, Recovery
│   └── validation/                     # NIFTY 50 hurdle & domain sanity checks
├── tests/                              # Automated testing suite (29 tests)
│   ├── test_api.py                     # REST endpoint tests
│   ├── test_data_pipeline.py           # Schema & constraint tests
│   ├── test_financial_metrics.py       # Quantitative formula property tests
│   └── test_models.py                  # Leak-free ML & reproducibility tests
├── baseline_classifier.py              # Root script: run ML experiments
├── label_assign.py                     # Root script: assign risk labels
├── mdd_compute.py                      # Root script: compute MDD
├── requirements.txt                    # Python package dependencies
├── risk_metrics.py                     # Root script: compute all risk metrics
├── sector_ohlcv_fetch.py               # Root script: fetch or verify returns
└── README.md                           # This document
```

---

## 10. Research Citation

If utilizing this benchmark dataset or codebase for academic publications, please cite:

```bibtex
@article{kallimath2026niftystress,
  title={Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events},
  author={Kallimath, Akshata I and Basanagouda and Kumar, Guru and Indushree, D N and Gupta, Yashpal},
  journal={Dayananda Sagar University Major Capstone Project},
  year={2026},
  institution={School of Engineering, Department of Computer Science and Engineering}
}
```
