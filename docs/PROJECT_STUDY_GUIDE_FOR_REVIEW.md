# THE COMPLETE BEGINNER-TO-PRO PROJECT STUDY GUIDE

## **Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events**
> **Academic Project Guide for Review 1 & Viva Voce**  
> **Team 27:** Akshata I Kallimath, Basanagouda, Guru Kumar, Indushree D N  
> **Supervisor:** Prof. Yashpal Gupta S  
> **Department of Computer Science and Engineering, Dayananda Sagar University (2026–2027)**  

---

# TABLE OF CONTENTS
1. [The 2-Minute Elevator Pitch (Explain Like I'm 10)](#1-the-2-minute-elevator-pitch)
2. [The Core Problem & Research Gap (Why does this project exist?)](#2-the-core-problem--research-gap)
3. [The Dataset & The Magic Number 44](#3-the-dataset--the-magic-number-44)
4. [The 4 Macroeconomic Stress Events Explained](#4-the-4-macroeconomic-stress-events)
5. [The 11 NIFTY Sectors & Their Stocks](#5-the-11-nifty-sectors)
6. [The 4 Financial Risk Metrics (In Everyday English)](#6-the-4-financial-risk-metrics)
7. [The Risk Labels & The Big Empirical Finding (Zero Low Risk)](#7-the-risk-labels--the-big-finding)
8. [Machine Learning & The "Target Leakage" Trap (MOST IMPORTANT FOR VIVA!)](#8-machine-learning--target-leakage)
9. [Full Tech Stack & System Architecture](#9-full-tech-stack--system-architecture)
10. [Top 15 Tough Questions Evaluators Will Ask (With Word-for-Word Answers)](#10-top-15-tough-questions-with-answers)
11. [Slide-by-Slide Script for Your Review 1 Presentation](#11-slide-by-slide-script)

---

# 1. THE 2-MINUTE ELEVATOR PITCH

### Imagine This Analogy:
Think of the Indian stock market as a **human body**, and the 11 sectors (Banking, IT, Pharma, Auto, etc.) as the **major organs** (heart, lungs, brain, muscles).
- On normal sunny days, all organs work fine. You can measure a person’s routine jog and say, *"Everything looks healthy."*
- **BUT**, what happens when the person gets hit by a sudden, severe shock—like a viral pandemic, a global war, or aggressive interest rate shocks?
- Does the heart fail first? Do the lungs stay strong? Does the body recover in 2 weeks or 2 years?

### What Our Project Does:
Most existing research only studies the stock market during **normal calm days**. When a real crisis hits, normal models completely fail!
Our project is the **first standardized crash test** of the Indian stock market. We took **11 major NSE sectors**, put them through **4 real-world historical crises** (2020–2023), measured their damage using **4 deep mathematical risk metrics**, categorized their risk (High vs. Medium), and trained an honest, **leak-free Machine Learning model** to see if we can detect high-risk sectors without cheating. 

We also built a **complete, working research web dashboard** with interactive charts and an automated **29-test verification suite**.

---

# 2. THE CORE PROBLEM & RESEARCH GAP

### Why was this project needed? (The Problem)
1. **Normal Data is Deceptive:** Datasets on Kaggle or Yahoo Finance give you 10 years of stock prices. But 90% of those days are normal trading. Models trained on calm days are useless when black swan disasters hit.
2. **Scattered Metrics:** One researcher looks only at volatility. Another looks only at returns. Nobody had combined **depth of loss (Drawdown)**, **worst-day loss (VaR)**, **speed of healing (Recovery Days)**, and **risk-reward change (Sharpe Drop)** into a single dataset.
3. **No Sector $\times$ Event Benchmark for India:** If an analyst wanted to know *"Did IT suffer more during COVID or during the US Fed rate hike?"*, they had to calculate it from scratch every single time.
4. **Widespread "Cheating" in ML Literature (Target Leakage):** Many student projects and published papers use Maximum Drawdown to create labels (e.g., if drop $> 15\%$, label = High Risk). Then, they mistakenly feed Maximum Drawdown back into their Machine Learning model as an input feature! The model gets 99% accuracy, but it’s completely fake—it’s like giving a student the answer key inside the exam question!

### The 4 Research Gaps (Remember these 4 bullets for review):
1. **No Crisis-Isolated Indian Dataset:** Existing repositories have general data, none isolates crisis windows.
2. **Fragmented Downside Metrics:** Studies measure volatility, but ignore recovery time and drawdown depth together.
3. **Absence of a Standardized $11 \times 4$ Matrix:** No open-source supervisory benchmark exists for NSE sectors.
4. **Pervasive Target Leakage:** Lack of leak-free Machine Learning benchmarks that evaluate genuine predictive signals.

---

# 3. THE DATASET & THE MAGIC NUMBER 44

### Why is our benchmark called `NiftyStress-44`?
Because:
$$\text{Total Records} = 11 \text{ Sectors} \times 4 \text{ Macroeconomic Stress Events} = 44 \text{ Records}$$

Every single record represents **one sector experiencing one specific crisis**.
For example:
- Record 1: `NIFTY Banking` during `COVID-19 Crash`
- Record 2: `NIFTY IT` during `Russia-Ukraine Shock`
- Record 3: `NIFTY FMCG` during `RBI Rate Hike Cycle`
- ... up to 44 records.

### The 5% Validation Hurdle Rule (Very Important!)
How did we prove an event was an actual "crisis" and not just normal market noise?
- **The Rule:** In the official project guide (`Objective2_PortfolioDrawdown_Dataset.pdf`), the national benchmark **NIFTY 50 Index (`^NSEI`)** had to drop by **at least 5.0%** from peak to trough during that window.
- **Our Verification:**
  - COVID-19 Crash: NIFTY 50 fell **-37.24%** (Passed! Huge crash)
  - Russia-Ukraine Shock: NIFTY 50 fell **-8.42%** (Passed! $\ge 5\%$)
  - RBI Rate Hike Cycle: NIFTY 50 fell **-8.33%** (Passed! $\ge 5\%$)
  - US Fed Tightening: NIFTY 50 fell **-15.29%** (Passed! $\ge 5\%$)

All 4 events passed the scientific hurdle rule!

---

# 4. THE 4 MACROECONOMIC STRESS EVENTS

| Event Name | Date Window | Trading Days | What happened in the real world? |
|---|:---:|:---:|---|
| **1. COVID-19 Crash** | 17 Feb 2020 – 01 Apr 2020 | 31 days | The World Health Organization declared a global pandemic. India announced an immediate nationwide lockdown. Factories shut down, airlines stopped, and panic selling hit all stock markets worldwide. |
| **2. Russia-Ukraine Shock** | 16 Feb 2022 – 29 Apr 2022 | 49 days | Russia invaded Ukraine. Global crude oil skyrocketed above \$120/barrel. Supply chains broke, fertilizer and commodity prices spiked, creating massive global inflation fear. |
| **3. RBI Rate Hike Cycle** | 04 May 2022 – 08 Feb 2023 | 194 days | To fight domestic inflation, the Reserve Bank of India (RBI) aggressively hiked interest rates from 4.0% to 6.5% (a 250 bps increase). Borrowing money became expensive for Indian companies. |
| **4. US Fed Tightening** | 16 Mar 2022 – 13 Dec 2023 | 432 days | The US Federal Reserve raised interest rates from 0.25% to 5.50% (the fastest hike in 40 years). The US Dollar surged, causing Foreign Institutional Investors (FIIs) to pull billions of dollars out of emerging markets like India. |

> **Note for Evaluators:** Notice that Events 2, 3, and 4 overlap in 2022–2023. We document this transparently: our metrics measure how sectors behaved *during those defined time windows*, without claiming a single isolated cause.

---

# 5. THE 11 NIFTY SECTORS

We analyzed 11 major sectors representing over **85% of total NSE equity capitalization**. For each sector, we built an **equal-weighted composite portfolio** using 4 to 5 top liquid stocks:

1. **Banking (5 stocks):** HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Mahindra Bank.
2. **PSU Bank (5 stocks):** State Bank of India, Bank of Baroda, PNB, Canara Bank, Union Bank.
3. **Financial Services (5 stocks):** Bajaj Finance, Bajaj Finserv, HDFC Life, SBI Life, ICICI Bank.
4. **IT (Information Technology) (5 stocks):** TCS, Infosys, HCL Tech, Wipro, Tech Mahindra.
5. **Auto (5 stocks):** Maruti Suzuki, Tata Motors, M&M, Bajaj Auto, Hero MotoCorp.
6. **Metal (5 stocks):** Tata Steel, JSW Steel, Hindalco, Vedanta, SAIL.
7. **Energy / Oil & Gas (5 stocks):** Reliance Industries, ONGC, NTPC, Power Grid, IOC.
8. **Pharma / Healthcare (5 stocks):** Sun Pharma, Dr. Reddy's, Cipla, Divi's Lab, Lupin.
9. **FMCG (Fast-Moving Consumer Goods) (5 stocks):** Hindustan Unilever, ITC, Nestle India, Britannia, Dabur.
10. **Realty (Real Estate) (5 stocks):** DLF, Godrej Properties, Oberoi Realty, Prestige Estates, Phoenix Mills.
11. **Media (4 stocks):** Zee Entertainment, Sun TV, PVR INOX, Network18.

*Total: 49 unique NSE stocks, tracked across 1,477 daily trading sessions from 2019 to 2024.*

---

# 6. THE 4 FINANCIAL RISK METRICS

For every sector in every crisis, we calculate **4 distinct numbers**. Here is what they mean in simple terms:

```
               [ 4 DIMENSIONS OF CRISIS RISK ]
      +-----------------------+-----------------------+
      |                                               |
  1. Maximum Drawdown (MDD)                2. Value at Risk (VaR 95%)
  "How deep is the hole?"                  "How bad is your worst single day?"
      |                                               |
  3. Recovery Days                         4. Sharpe Ratio Drop
  "How long to climb out?"                 "How much risk-adjusted return died?"
```

### 1. Maximum Drawdown (MDD)
- **Plain English:** The biggest percentage loss from the highest peak to the lowest trough during the crisis.
- **Formula:** $MDD = \min \left( \frac{\text{Value}_t - \text{Peak}}{\text{Peak}} \right) \times 100\%$
- **Example:** If your portfolio was at ₹100, falls to ₹60, and later bounces to ₹80, the Maximum Drawdown is **-40%**.
- **Always Negative or Zero:** A lower number (e.g. -50%) means worse, catastrophic loss.

### 2. Value at Risk at 95% Confidence (VaR 95%)
- **Plain English:** If you invest on any random day during the crisis, what is the loss on your worst 5% of days?
- **Calculation:** The **5th percentile** ($q_{0.05}$) of the daily return distribution.
- **Example:** A VaR of **-8.8%** means: on 95% of days, your daily loss won't exceed 8.8%; but on the worst 5% of disaster days, you lose *more* than 8.8% in a single day.

### 3. Sharpe Ratio Drop ($\Delta$Sharpe)
- **Plain English:** The Sharpe Ratio measures *"How much return do you get for each unit of risk?"*
- During peace time, a sector might have a Sharpe of $+1.5$. During crisis, it collapses to $-3.5$.
- **Formula:** $\Delta \text{Sharpe} = \text{Sharpe}_{\text{stress}} - \text{Sharpe}_{\text{baseline}}$
- We used a **90-calendar-day pre-stress baseline** immediately before the crisis started, with a **6.0% risk-free rate** (matching RBI repo benchmarks).
- A negative $\Delta$Sharpe means your risk-reward ratio degraded severely.

### 4. Recovery Days
- **Plain English:** How many trading days did it take from the lowest bottom (trough) to climb all the way back to the pre-crisis peak?
- **The Censorship Nuance (Very Smart Defense Point!):**
  - **Window-Censored Recovery (`recovery_days`):** In the official PDF guide, the search stopped at the end date of the crisis window. For COVID-19, all 11 sectors took more than 31 days to recover, so the official column recorded **`NaN`** (missing/censored).
  - **Extended Recovery (`recovery_days_extended`):** We created an extended research metric searching through 2024. **Every single sector eventually recovered 100%!** Recovery took between 4 days (Pharma/Energy in 2022) to 424 days (Metal/Realty).

---

# 7. THE RISK LABELS & THE BIG FINDING

### The Supervisory Threshold Rules (Mandated by Guide):
- **High Risk:** $\text{MDD} < -15.0\%$ (Deep, severe capital destruction)
- **Medium Risk:** $-15.0\% \le \text{MDD} < -5.0\%$ (Moderate decline, resilient)
- **Low Risk:** $\text{MDD} \ge -5.0\%$ (Minimal loss, safe haven)

### The Actual Result Across All 44 Records:
- **High Risk:** **26 records (59.1%)**
  - All 11 sectors during COVID-19 Crash.
  - 10 sectors during US Fed Tightening (all except FMCG).
  - Several cyclical sectors (Metal, IT, Realty, PSU Bank, Financial Services) during RBI rate hikes.
- **Medium Risk:** **18 records (40.9%)**
  - All 11 sectors during Russia-Ukraine Shock.
  - FMCG, Auto, Banking, Pharma during RBI Rate Hikes.
  - FMCG during US Fed Tightening.
- **Low Risk:** **0 records (0.0%)**

### WHY ARE THERE ZERO "LOW RISK" SECTORS? (Must-Know Viva Answer!)
> **The Professor will ask:** *"Why is your Low Risk count zero? Did your code fail?"*  
> **Your Answer:** *"No, sir! That is an authentic empirical finding of systemic market contagion! For an event to be selected, the NIFTY 50 index had to drop by at least 5%. In the Indian market, when the national index drops $\ge 5\%$, beta correlation causes every single sector to fall by at least -6.68% (which was the mildest drop, achieved by FMCG). No sector in India is completely immune to a systemic national crisis. Inventing fake low-risk data would violate scientific research ethics."*

---

# 8. MACHINE LEARNING & TARGET LEAKAGE

## What is Target Leakage in Plain English?
Imagine a school teacher defines a student as **"Tall"** if their height is over 175 cm, and **"Short"** if under 175 cm.
Now, the teacher builds an AI to "predict" whether a student is Tall or Short.
- If the teacher gives the AI the student's **Height** as an input feature, what happens?
- The AI will get **100% accuracy** every single time! It just checks: `if height > 175: Tall else Short`.
- **Has the AI learned anything smart about biology or genetics? NO! It just memorized the label definition!** That is **Target Leakage**.

### How Target Leakage Happened in Prior Student Projects:
The supervisory label is defined as:
$$\text{If } MDD < -15\% \implies \text{High Risk}, \quad \text{Else } \text{Medium Risk}$$
If you put **Maximum Drawdown (MDD)** into the Random Forest feature set:
- The Random Forest splits on `MDD <= -15.0` and gets **97.73% accuracy**!
- It looks amazing on paper, but it is **scientifically fraudulent and mathematically useless** for real-world future prediction.

### Our Solution (The Leak-Free Benchmark):
We **strictly excluded MDD** and only used genuine early downside signals:
- **Feature Set 1 (Leak-Free Standard):** `VaR_95` + `Sharpe_Drop`
  - **Stratified 3-Fold CV Accuracy: 61.36%** (Macro F1: 0.612)
  - Feature Importance: VaR 95% = **51.5%**, Sharpe Drop = **48.5%**
- **Feature Set 2 (Leak-Free Extended):** `VaR_95` + `Sharpe_Drop` + `Recovery_Days_Extended`
  - **Stratified 3-Fold CV Accuracy: 70.45%** (Macro F1: 0.697)
  - Adding recovery duration boosted accuracy by 9%!
- **Target-Leaked Sanity Check (With MDD):**
  - **Accuracy: 97.73%** (Empirically proves that MDD artificially inflates the score by 36%!).

### What is Leave-One-Stress-Event-Out (GroupKFold)?
Instead of random cross-validation, we tested:
- Train on 3 crises $\rightarrow$ Test on the unseen 4th crisis.
- **Accuracy dropped to 45.45%!**
- **Why? (Brilliant Viva Point):** Because a **health pandemic crash (COVID-19)** has completely different economic transmission channels than a **multi-year interest rate cycle (US Fed)**! In COVID-19, everything crashed at once. In US Fed tightening, defensive sectors like FMCG adapted, while IT and Media suffered prolonged bleeding.

---

# 9. FULL TECH STACK & SYSTEM ARCHITECTURE

```
[ FRONTEND ]                  [ BACKEND API ]               [ DATA & ML ENGINE ]
React 18 + TypeScript        FastAPI (Python 3.13)         Pandas, NumPy, SciPy
Vite + Tailwind CSS          Uvicorn ASGI Server           Scikit-Learn (Random Forest)
Lucide Icons + Recharts      REST Endpoints (/api/*)       yfinance (NSE Market Data)
        |                             |                             |
        +-----------------------------+-----------------------------+
                                      |
                      RUNNING TOGETHER ON PORT 8000
                       http://127.0.0.1:8000/
```

### 1. Data Ingestion & Math Layer:
- **`yfinance`:** Ingests daily adjusted close prices for 49 NSE stocks (2019–2024).
- **`pandas` & `numpy`:** Date alignment with NSE trading calendar, equal-weighted composite portfolio returns, running peak-to-trough algorithms.
- **`scipy.stats`:** Empirical percentile calculation for Value at Risk (VaR 95%).

### 2. Machine Learning Layer:
- **`scikit-learn`:** `RandomForestClassifier(n_estimators=100, max_depth=3, class_weight='balanced', random_state=42)`.
- `StratifiedKFold(n_splits=3)` and `LeaveOneGroupOut` (GroupKFold).

### 3. Backend REST API Layer:
- **FastAPI:** High-performance async Python web framework.
- 10 REST endpoints: `/api/health`, `/api/summary`, `/api/stress-events`, `/api/sectors`, `/api/risk-matrix`, `/api/records`, `/api/model-results`, `/api/predict`, and export endpoints.

### 4. Frontend Interactive Dashboard:
- Built with **React 18, TypeScript, Tailwind CSS, Vite**.
- Pre-compiled into `frontend/dist` and served statically by FastAPI from the root URL (`http://127.0.0.1:8000/`).
- **9 interactive pages:** Overview, Stress-Event Explorer, Sector Heatmap, Portfolio Analytics, Dataset Explorer, Model Lab, Quality & Provenance, Methodology, About Team 27.

### 5. Automated Testing Suite:
- **`pytest`:** 29 automated tests covering MDD edge cases, VaR negative signs, Sharpe calculations, risk boundaries, API schema compliance, and target leakage prevention.
- **Result:** **29 passed in 8.5 seconds (100% pass rate).**

---

# 10. TOP 15 TOUGH QUESTIONS EVALUATORS WILL ASK

### Q1: What is the exact title of your project?
> **Answer:** *"Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events."*

### Q2: What is the main research objective of this project?
> **Answer:** *"To build an audited, reproducible benchmark dataset named NiftyStress-44 that measures sector-level portfolio drawdown risk across 11 NSE sectors during 4 macroeconomic crises using 4 unified downside risk metrics (MDD, VaR 95%, Sharpe Drop, and Recovery Days), and to evaluate a leak-free Random Forest baseline classifier."*

### Q3: Why did you choose equal-weighted portfolios instead of market-cap weighting?
> **Answer:** *"Market-cap weighting allows 1 or 2 mega-cap stocks (like Reliance in Energy or HDFC in Banking) to dominate 60% of the sector's performance. Equal weighting gives a true, balanced reflection of systemic distress across representative sector constituent firms without dynamic reconstitution survivorship bias."*

### Q4: Why are there 0 records in the "Low Risk" class?
> **Answer:** *"Because all 4 stress events satisfied the criterion of a $\ge 5\%$ decline in the benchmark NIFTY 50 index. Due to systemic market beta, every single sector experienced a maximum drawdown of at least $-6.68\%$ (achieved by FMCG). No sector in the Indian equity markets was completely immune to systemic national crisis. Documenting this zero count is an authentic empirical finding of crisis contagion."*

### Q5: What is Maximum Drawdown, and can it be positive?
> **Answer:** *"Maximum Drawdown measures the maximum peak-to-trough decline in cumulative portfolio wealth during an event. It can NEVER be positive; it is always $\le 0\%$. If a portfolio only goes up, MDD is exactly $0\%$. In our dataset, it ranges from $-6.68\%$ to $-54.76\%$."*

### Q6: What sign convention did you use for Value at Risk (VaR 95%)?
> **Answer:** *"We used the signed return quantile convention, where VaR is stored as a negative percentage (the empirical 5th percentile of daily returns). A more negative VaR indicates worse single-day tail loss risk."*

### Q7: Why are there missing values (NaN) in the official recovery_days column?
> **Answer:** *"Per the official project specification, the recovery search was censored at the end date of the crisis window. For prolonged shocks like COVID-19, no sector recovered before the window ended on April 1, 2020. Treating unrecovered sectors as 0 days would be mathematically false. Therefore, they are recorded as NaN (censored). To eliminate bias, we also computed an extended recovery metric searching across the full 2019–2024 series, proving all 44 sectors eventually recovered."*

### Q8: How did you compute Sharpe Ratio Drop?
> **Answer:** *"We calculated the difference between the annualized stress-period Sharpe ratio and a 90-calendar-day pre-stress baseline Sharpe ratio: $\Delta \text{Sharpe} = \text{Sharpe}_{\text{stress}} - \text{Sharpe}_{\text{baseline}}$, annualized with $\sqrt{252}$ and an RBI repo rate benchmark of 6.0%."*

### Q9: What is Target Leakage in your machine learning model?
> **Answer:** *"Target leakage occurs when an input feature contains the answer to the target variable. Since our supervisory risk label (High vs. Medium) was assigned using an MDD threshold of $-15\%$, including MDD as an input predictor allows the Random Forest to trivially memorize the boundary, producing a false 97.73% accuracy. We strictly excluded MDD to evaluate genuine downside signals (VaR and Sharpe Drop), achieving an honest 61.36% to 70.45% accuracy."*

### Q10: Why did your GroupKFold (Leave-One-Crisis-Out) accuracy drop to 45.45%?
> **Answer:** *"Because crisis archetypes have fundamentally different macroeconomic drivers! A rapid epidemiological lockdown crash (COVID-19) causes uniform across-the-board collapse, whereas a 20-month monetary tightening cycle (US Fed) causes slow, selective valuation compression where defensive sectors adapt. A model trained on interest rate cycles cannot easily predict a pandemic freeze."*

### Q11: Why is your sample size only 44 records? Is that enough for ML?
> **Answer:** *"44 records is the exact complete census of 11 sectors $\times$ 4 validated crises defined in the capstone specification. It is intended as a supervisory benchmarking matrix, not a deep learning dataset. We constrained our Random Forest to a max depth of 3 and used Stratified 3-Fold CV to prevent overfitting on this small sample."*

### Q12: Which sector was the most defensive during crises?
> **Answer:** *"NIFTY FMCG was the most resilient sector overall, suffering the shallowest drawdown in the entire dataset ($-6.68\%$ during RBI rate hikes) and remaining the only sector in Medium Risk ($-8.7\%$) during the aggressive US Fed tightening cycle. NIFTY Pharma was also highly defensive ($-7.16\%$ in Russia-Ukraine)."*

### Q13: Which sector was the most vulnerable?
> **Answer:** *"NIFTY Media ($-54.76\%$ in COVID-19, $-28.2\%$ in US Fed), NIFTY Metal ($-50.49\%$ in COVID-19, $-38.56\%$ in US Fed), and NIFTY Banking ($-44.8\%$ in COVID-19) suffered the deepest capital destruction."*

### Q14: What software architecture did you build?
> **Answer:** *"A unified full-stack architecture. The backend is built with Python FastAPI providing 10 documented REST endpoints. The frontend is a modern React 18 + TypeScript + Tailwind CSS quantitative research dashboard. Both run simultaneously from a single server on port 8000."*

### Q15: How can another researcher reproduce your work?
> **Answer:** *"Everything is 100% reproducible. The code is pushed to our GitHub repo (`https://github.com/akshataik05/major_project`). Running `python -m src.pipeline` regenerates all certified CSVs and Excel workbooks from raw cached daily returns. Running `pytest tests/ -v` verifies all 29 automated tests in 8.5 seconds."*

---

# 11. SLIDE-BY-SLIDE SCRIPT FOR YOUR PRESENTATION

Use this exact guide during your presentation. Divide the slides among team members:

### Slide 1: Title Slide (Speaker: Akshata / Team Lead)
> *"Good morning respected guide Prof. Yashpal Gupta sir and faculty evaluators. We are Team 27, presenting our Major Project Phase-I Review 1 on **Analysis of Portfolio Risk Across NIFTY Sectors During Macroeconomic Stress Events**."*

### Slide 2: Overview (Speaker: Akshata)
> *"Today we will walk you through our project: the problem and research gap, our certified NiftyStress-44 dataset, mathematical risk formulations, our leak-free machine learning benchmark, the full-stack architecture, and our completed deliverables."*

### Slide 3: Abstract (Speaker: Basanagouda)
> *"Financial markets react unevenly to shocks. Standard datasets cover normal trading; none isolates sector drawdown during crises. We built NiftyStress-44: an audited benchmark spanning 11 NSE sectors and 4 major crisis windows from 2020 to 2023. We quantified 4 risk metrics, assigned supervisory risk labels, proved and solved the target leakage problem in ML, and built a live research dashboard with 29 passing automated tests."*

### Slide 4: Project Objectives & Scope (Speaker: Basanagouda)
> *"Our 4 core objectives are: O1—Analyse downside risk across 11 sectors; O2—Compute MDD, VaR 95%, recovery days, and Sharpe drop; O3—Generate the certified 44-record benchmark and Excel matrix; and O4—Develop a leak-free Random Forest classifier. All deliverables are complete and versioned."*

### Slide 5: Requirements & Validation (Speaker: Guru Kumar)
> *"Every crisis window was validated against a 5% drawdown hurdle in the NIFTY 50 index. Notice row 5 of our table: rather than claiming an unrealistic 80% accuracy, our leak-free model achieves 61.4% to 70.5% genuine accuracy, exposing that 97.7% accuracy only happens when target leakage is present. Our 29 automated tests pass with a 100% success rate."*

### Slide 6: Innovation & Impact (Speaker: Guru Kumar)
> *"Our key innovations include: the first crisis-focused sector benchmark for India, combined multi-dimensional tail risk metrics, empirical proof of target leakage exclusion, and a production-ready research platform deployed on port 8000."*

### Slide 7 & 8: Literature Survey & Research Gap (Speaker: Indushree)
> *"Our literature review covers IIM Bangalore, ResearchGate, ScienceDirect, and Guru & Das. We identified 4 critical gaps: existing datasets cover only normal periods; portfolio risk models fail during crises; no standardized sector-event matrix exists for NSE; and ML studies frequently suffer from target leakage. NiftyStress-44 directly solves all four."*

### Slide 9 & 10: System Architecture & Design (Speaker: Indushree)
> *"Our system operates across 6 reproducible stages: Stress Window Validation $\rightarrow$ Data Ingestion of 49 tickers $\rightarrow$ Drawdown Engine $\rightarrow$ Tail Risk & Recovery $\rightarrow$ Supervisory Labeling $\rightarrow$ Leak-Free ML & Web Dashboard. Both the FastAPI backend and React frontend are integrated seamlessly on port 8000."*

### Slide 11: Implementation Snapshot - Risk Matrix (Speaker: Akshata)
> *"This is our completed 11 $\times$ 4 risk matrix. Out of 44 records, 26 are High Risk, 18 are Medium Risk, and exactly ZERO are Low Risk. This is an authentic empirical finding: when the national index drops $\ge 5\%$, every sector fell by at least -6.68%, proving systemic contagion. Media and Metal were the hardest hit, while FMCG and Pharma were defensive anchors."*

### Slide 12: List of Deliverables & Timeline (Speaker: Akshata)
> *"All Phase-I deliverables are 100% complete: final datasets, Excel matrices, Python modules, FastAPI server, React dashboard, 29 passing tests, and clean GitHub push. Our Phase-II roadmap focuses on conference paper submission to IEEE CIFEr or ACM ICAIF."*

### Slide 13: References & Conclusion (Speaker: All)
> *"We cite 11 authoritative papers in quantitative finance and financial ML, including Sharpe (1994), Jorion (2010), and Alexander & Baptista (2006). Thank you, and we are now ready for your questions!"*

---

# CONGRATULATIONS!
You now possess a complete, professional, airtight understanding of your capstone project. Read through this document once or twice with your team, and you will ace your Review 1 evaluation!
