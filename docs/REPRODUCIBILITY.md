# Reproducibility Guide: NiftyStress-44 System

**Project Title:** Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events  
**Document Identifier:** `REPRO-NIFTY-2026-V1`  
**Target Audience:** Project Reviewers, Faculty Evaluators, Academic Peer Reviewers  
**Maintainer:** Research Team 27 (Dayananda Sagar University)  
**Last Updated:** 2026-10-20  

---

## 1. System Requirements & Environment

### Hardware Requirements
- **Processor:** Modern multi-core CPU (Intel i5/i7/i9, AMD Ryzen 5/7/9, Apple M-series).
- **RAM:** Minimum 4 GB (8 GB recommended).
- **Disk Space:** ~500 MB free space (including Node modules and cached market data).

### Software Requirements
- **Operating System:** Windows 10/11, Ubuntu 20.04+, or macOS 12+.
- **Python:** Version 3.10 through 3.13 (verified on Python 3.13.9).
- **Node.js:** Version 18.0+ (verified on Node v22.15.1 and npm 10.9.2).
- **Git:** Version 2.30+.

---

## 2. Installation and Setup

### 2.1 Clone Repository and Enter Workspace
```bash
cd "c:\Users\aksha\OneDrive\Desktop\Major Project"
```

### 2.2 Python Environment Setup
```bash
# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install all required Python dependencies
pip install -r requirements.txt
```

### 2.3 Frontend Dependency Installation & Compilation
The application uses a unified architecture where the React + Vite frontend is pre-compiled into static assets served directly by the FastAPI backend on port 8000.

```bash
cd frontend
npm install
npm run build
cd ..
```
*Note: `frontend/dist` is already built and included in this repository, so the server can run immediately.*

---

## 3. End-to-End Pipeline Execution

The system supports both **online mode** (fetching live NSE data from Yahoo Finance) and **offline mode** (using the verified, cached daily returns in `data/raw/sector_returns/`).

### 3.1 Execute Full Master Pipeline
To execute the complete data pipeline from raw daily returns to final certified artifacts:
```bash
python -m src.pipeline
```
*This command executes the window validation, computes all 4 risk metrics across the 44 sector-event pairs, assigns supervisory risk labels, and generates `NiftyStress44_final.csv`, `NiftyStress44_extended.csv`, `risk_label_matrix.xlsx`, `data_dictionary.xlsx`, and `domain_validation_notes.xlsx` in `data/processed/`.*

### 3.2 Individual Modular Execution
You can also execute each stage individually using either the modular package or the root standalone scripts:

```bash
# Step 1: Compute Maximum Drawdown for all sectors and stress windows
python mdd_compute.py

# Step 2: Compute VaR 95%, Sharpe Drop, and Recovery Days
python risk_metrics.py

# Step 3: Assign supervisory risk labels and build the Excel matrix
python label_assign.py

# Step 4: Run the leak-free Random Forest benchmark experiments
python baseline_classifier.py
```

---

## 4. Automated Testing Suite

The repository includes a comprehensive automated test suite spanning 29 unit and integration tests covering:
- Mathematical edge cases for MDD (monotonic increase, monotonic decrease, constant price, recovery).
- Historical VaR 95% quantile calculations and sign conventions.
- Sharpe ratio delta calculations and baseline handling.
- Boundary condition testing for supervisory risk labels (-15%, -5%).
- Target leakage verification in the machine learning baseline.
- FastAPI REST endpoint contracts and schema compliance.

### Run All Pytest Tests
```bash
pytest tests/ -v
```

**Expected Result:**
```
============================== 29 passed in 9.13s ==============================
```

---

## 5. Running the Unified Full-Stack Application

The backend serves both the REST API endpoints and the responsive React quantitative research dashboard from a single port (8000).

### Start the Application Server
```bash
uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```

### Accessing the System
- **Interactive Research Dashboard:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Interactive Swagger API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Backend Health Check:** [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

---

## 6. Output Artifact Checklist

After running the pipeline, verify that the following deliverables are present and populated:

| Artifact Path | Expected Content | Validation Check |
|---|---|---|
| `data/processed/NiftyStress44_final.csv` | 44 rows × 9 columns | Exactly 44 rows, 0 nulls in core metrics, MDD non-positive. |
| `data/processed/NiftyStress44_extended.csv` | 44 rows × 16 columns | Uncensored recovery days and baseline Sharpe components. |
| `data/processed/risk_label_matrix.xlsx` | 11×4 sector-by-event grid | Color-coded styling, 21 High Risk, 23 Medium Risk, 0 Low Risk. |
| `data/processed/data_dictionary.xlsx` | 4-sheet documentation workbook | Definitions, Sector Mapping, Stress Windows, Risk Thresholds. |
| `data/processed/domain_validation_notes.xlsx` | Domain spot-check worksheet | 11 sector qualitative notes with 100% domain agreement. |
| `data/processed/baseline_classifier_results.csv` | Fold-wise evaluation metrics | Stratified 3-Fold and GroupKFold experiment results. |
| `reports/model_evaluation_metrics.json` | JSON structured ML metrics | Precision, Recall, Macro F1, Confusion Matrix. |
| `artifacts/baseline_rf_leak_free.joblib` | Serialized scikit-learn model | Random Forest model trained on leak-free features. |
