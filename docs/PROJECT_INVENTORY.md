# Project Inventory

**Project Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events  
**Institution:** Dayananda Sagar University, School of Engineering, Department of Computer Science & Engineering  
**Academic Year:** 2026–2027 | Major Project Phase-I (Review 0 / Zeroth Review)  
**Supervisor / Guide:** Prof. Yashpal Gupta S  
**Student Team:**
- Akshata I Kallimath (ENG23CS0016)
- Basanagouda (ENG23CS0028)
- Guru Kumar (ENG23CS0070)
- Indushree D N (ENG23CS0080)

---

## 1. Executive Summary of Inventory

This inventory documents all files, datasets, configurations, scripts, and presentations located in the capstone project workspace. All original materials have been inspected, cataloged, and preserved.

| File / Component | Category | Size / Format | Status | Purpose / Description |
| :--- | :--- | :--- | :--- | :--- |
| `Objective2_PortfolioDrawdown_Dataset (1).pdf` | Specification | 15.6 KB (5 pages PDF) | Verified Primary Spec | Official guideline and technical requirements from the project supervisor defining the NiftyStress-44 benchmark dataset, metrics, risk thresholds, schema, and baseline Random Forest model. |
| `Zeroth_Review.pptx` | Presentation | 1.94 MB (17 slides PPTX) | Verified Academic Context | Zeroth Review presentation outlining team members, problem statement, research gap, literature review, proposed methodology, feasibility, and references. |
| `Nifty_50` | Raw Archive | 241.3 MB (ZIP archive) | Preserved & Extracted | Compressed archive containing Claude-generated project code, virtual environment (`.venv`), outputs, and daily sector return series. |
| `original_project/NiftyStress44/` | Extracted Project | Directory (~1.2 MB clean) | Audited Baseline | Clean extraction of `Nifty_50` excluding virtual environment and IDE metadata. Contains existing code, outputs, and return series. |

---

## 2. Detailed Inspection of Discovered Project Artifacts

### 2.1 Reference Documents

1. **`Objective2_PortfolioDrawdown_Dataset (1).pdf`**
   - **Research Title:** Portfolio Drawdown Risk Labeling of Nifty 50 Sector Portfolios During Macro Stress Events (Target Dataset: NiftyStress-44).
   - **Scope:** 11 NSE sectors, 4 defined macroeconomic stress events, 44 labeled records.
   - **Four Defined Stress Windows:**
     1. COVID-19 Crash: 2020-02-17 to 2020-04-01 (Trigger: WHO pandemic declaration).
     2. Russia-Ukraine Shock: 2022-02-16 to 2022-04-29 (Trigger: Invasion announced Feb 24, 2022).
     3. RBI Rate Hike Cycle: 2022-05-04 to 2023-02-08 (Trigger: RBI repo rate 4.0% → 6.5%).
     4. US Fed Tightening: 2022-03-16 to 2023-12-13 (Trigger: Fed Funds rate 0.25% → 5.5%).
   - **Required Risk Metrics:** Maximum Drawdown (MDD %), Value at Risk (VaR 95% via historical simulation), Recovery Days, and Sharpe Drop (annualized stress Sharpe minus 90-day pre-stress baseline Sharpe).
   - **Labeling Rule:** High Risk (MDD < -15%), Medium Risk (-15% ≤ MDD < -5%), Low Risk (MDD ≥ -5%).
   - **Official 9-Column Output Schema:**
     `sector`, `stress_event`, `window_start`, `window_end`, `max_drawdown_pct`, `var_95`, `recovery_days`, `sharpe_drop`, `risk_label`.
   - **Baseline Classifier:** Random Forest 3-class classifier evaluated with 3-fold cross-validation. Target accuracy: ≥ 80%.
   - **Target Conferences:** IEEE CIFEr 2025, Springer FinanceML, ICACCS 2025, ACM ICAIF 2025.

2. **`Zeroth_Review.pptx`**
   - 17 slides detailing the project relevance, research gap, comparative literature review table (IIM-B 2023, ResearchGate 2025, ScienceDirect 2023, Springer 2025/26, Guru & Das 2021), 4-phase implementation timeline, and peer-reviewed citations.

---

### 2.2 Existing Claude-Generated Codebase (`original_project/NiftyStress44/code/`)

| Script Name | Purpose | Status | Audit Findings & Gaps |
| :--- | :--- | :--- | :--- |
| `sector_ohlcv_fetch.py` | Ingestion & returns computation | Functional | Fetches 4–5 large-cap tickers per sector via `yfinance` from 2019-01-01 to 2024-12-31, forward-fills gaps, computes daily returns, and equal-weights them. **Gap:** Uses equal-weighted proxy portfolios of 4–5 stocks rather than full official index constituent series. |
| `validate_windows.py` | Stress window boundary verification | Functional | Verifies that `^NSEI` (NIFTY 50) suffered ≥ 5% MDD during each window. All 4 windows pass validation (-37.24%, -8.42%, -8.33%, -15.29%). |
| `mdd_compute.py` | Maximum Drawdown computation | Functional | Correct peak-to-trough calculation using running wealth maximum. Outputs `mdd_results.csv`. |
| `risk_metrics.py` | Computes MDD, VaR 95%, Sharpe, Recovery | **Methodological Issues** | **Critical Issues Found:**<br>1. Computed `Sharpe_Ratio` during the stress period only, failing to compute the 90-day pre-stress baseline Sharpe or `sharpe_drop`.<br>2. Sliced returns only within the stress window for recovery calculation; consequently, 21 of 44 records (including all 11 COVID records) returned `NaN`. |
| `label_assign.py` | Rule-based label assignment | Functional | Applies MDD threshold: High (≤ -15%), Medium (-15% to -5%), Low (> -5%). Produces 26 High, 18 Medium, 0 Low. |
| `baseline_classifier.py` | Random Forest baseline model | **Methodological Issues** | **Critical Issues Found:**<br>1. Run 1 suffered from direct target leakage by including MDD.<br>2. Run 2 excluded MDD but used a random 70/30 train/test split (only 14 test samples) instead of the 3-fold cross-validation mandated by the official specification.<br>3. Handled only 2 present classes without stratification validation or Leave-One-Group-Out testing. |
| `build_label_matrix.py` | Formatted Excel matrix | Functional | Generates `risk_label_matrix.xlsx` with sector-by-event grid and color coding. |
| `build_data_dictionary.py`| Data dictionary generation | Functional | Generates `data_dictionary.xlsx` with column descriptions and caveats. |
| `build_domain_validation.py`| Domain expectation checks | Functional | Cross-checks 10 sector-event outcomes against financial expectations; highlights 2 reviews due to zero "Low" occurrences. |

---

### 2.3 Existing Output Files (`original_project/NiftyStress44/outputs/`)

| Output File | Size | Records / Columns | Audit Verdict |
| :--- | :--- | :--- | :--- |
| `labeled_risk_dataset.csv` | 3.3 KB | 44 rows × 8 cols | **Non-compliant Schema**: Missing `window_start`, `window_end`; contains `Sharpe_Ratio` instead of `sharpe_drop`; filename differs from `NiftyStress44_final.csv`. |
| `mdd_results.csv` | 3.4 KB | 44 rows × 6 cols | Valid MDD metrics with dates. |
| `risk_metrics.csv` | 3.1 KB | 44 rows × 7 cols | Contains raw metrics; 21 `NaN` recovery days; raw Sharpe. |
| `risk_label_matrix.xlsx` | 6.2 KB | 11 × 4 grid | Accurately color-coded matrix (26 High, 18 Medium, 0 Low). |
| `data_dictionary.xlsx` | 9.0 KB | 4 sheets | Informative but documents non-compliant column schema. |
| `domain_validation_notes.xlsx` | 7.0 KB | 10 spot checks | High-quality domain analysis. |
| `baseline_classifier_results.csv` | 375 B | 2 rows × 4 cols | Summarizes Run 1 (leakage sanity check) and Run 2 (honest 70/30 baseline). |

---

### 2.4 Raw Return Series (`original_project/NiftyStress44/sector_returns/`)

- 11 sector CSV files (`Auto`, `Banking`, `Energy`, `Financial_Services`, `FMCG`, `IT`, `Media`, `Metal`, `Pharma`, `PSU_Bank`, `Realty`).
- Each contains 1,480 daily trading observations from `2019-01-01` to `2024-12-30`.
- Data provenance verified against Yahoo Finance daily adjusted close prices for the 49 representative sector constituents listed in `sector_constituents.json`.

---

## 3. Missing Components Required for Capstone Completion

1. **Compliant Final Dataset (`NiftyStress44_final.csv`)**: Exact 9-column schema conforming to the official specification with mathematically verified `sharpe_drop` and documented recovery days.
2. **Modular Reproducible Data Pipeline**: Clean Python package structure (`src/`) with reproducible command-line interfaces and configuration-driven execution.
3. **Target-Leak-Free, Small-Sample Validated Model Evaluation**: Random Forest classifier evaluated via 3-fold cross-validation and Leave-One-Group-Out validation with full classification reports (accuracy, balanced accuracy, precision, recall, F1, confusion matrix).
4. **Interactive Research Dashboard (Full Stack)**:
   - Backend: Production FastAPI server with RESTful endpoints for metrics, stress windows, sector profiles, matrix, ML evaluation, and export.
   - Frontend: Modern, responsive React + TypeScript + Vite + Tailwind CSS dashboard covering all 9 required research pages.
5. **Automated Test Suite (`tests/`)**: Comprehensive tests for financial formulas (MDD, VaR 95%, Sharpe drop, recovery time), pipeline integrity, API responses, and model validity.
6. **Academic Documentation & Conference Paper Package (`docs/`, `reports/`)**:
   - `docs/RESEARCH_METHODOLOGY.md`
   - `docs/DATA_DICTIONARY.md`
   - `docs/DATA_PROVENANCE.md`
   - `docs/EXPERIMENT_PROTOCOL.md`
   - `docs/LIMITATIONS.md`
   - `docs/REPRODUCIBILITY.md`
   - `docs/RELATED_WORK.md`
   - `docs/PAPER_OUTLINE.md`
   - All audit reports and data quality summaries in `reports/`.

---

## 4. Preservation & Safety Policy

- The original archive `Nifty_50` and extracted baseline `original_project/` remain strictly preserved and read-only.
- All new modular code, corrected pipelines, web interfaces, and documentation will be structured within standard workspace directories (`data/`, `src/`, `frontend/`, `tests/`, `docs/`, `reports/`, `configs/`).
