# NiftyStress-44

**Portfolio Drawdown Risk Labeling of Nifty 50 Sector Portfolios During Macro Stress Events (2020-2023)**

A labeled benchmark dataset (44 records = 11 NSE sectors x 4 macro stress events) for training
and benchmarking portfolio risk classifiers on crisis-period behavior, built entirely from
public OHLCV data via a reproducible Python pipeline.

## What's in this dataset

Four macro stress windows in Indian markets:

| Event | Window | Trigger |
|---|---|---|
| COVID-19 Crash | 2020-02-17 to 2020-04-01 | WHO pandemic declaration |
| Russia-Ukraine Shock | 2022-02-16 to 2022-04-29 | Invasion announced Feb 24, 2022 |
| RBI Rate Hike Cycle | 2022-05-04 to 2023-02-08 | RBI repo rate 4.0% -> 6.5% |
| US Fed Tightening | 2022-03-16 to 2023-12-13 | Fed Funds rate 0.25% -> 5.5% |

Crossed against 11 NSE sector portfolios (Banking, IT, FMCG, Auto, Pharma, Metal, Energy,
Realty, Media, PSU Bank, Financial Services), each equal-weighted across a representative
set of constituent tickers.

For each of the 44 sector x event combinations, the dataset reports Maximum Drawdown (MDD),
Value at Risk at 95%, Sharpe ratio, recovery days, and a risk label (High / Medium / Low)
derived from MDD thresholds.

**Note:** with the current thresholds (High: MDD<=-15%, Medium: -15%<MDD<=-5%, Low: MDD>-5%),
0 of 44 records fall into "Low" for these particular events -- see
`outputs/risk_label_matrix.xlsx` (Notes sheet) for why this is a real finding, not a bug.

## Repository structure

```
NiftyStress44/
├── stress_windows_config.json      Stress event definitions (Step 1)
├── sector_constituents.json        Sector -> ticker mapping (Step 2)
├── requirements.txt                Pinned library versions
├── sector_returns/                 Per-sector daily return CSVs (Step 2 output)
├── code/
│   ├── validate_windows.py         Step 1: validate windows against Nifty 50 index MDD
│   ├── sector_ohlcv_fetch.py       Step 2: fetch OHLCV, compute sector returns
│   ├── mdd_compute.py              Step 3: compute Maximum Drawdown
│   ├── risk_metrics.py             Step 4: compute VaR, Sharpe ratio, recovery days
│   ├── label_assign.py             Step 5: assign risk labels
│   ├── baseline_classifier.py      Step 6: Random Forest baseline (sanity check + honest run)
│   ├── build_label_matrix.py       Builds outputs/risk_label_matrix.xlsx
│   ├── build_domain_validation.py  Builds outputs/domain_validation_notes.xlsx
│   └── build_data_dictionary.py    Builds outputs/data_dictionary.xlsx
└── outputs/
    ├── mdd_results.csv                 Step 3 output
    ├── risk_metrics.csv                Step 4 output
    ├── labeled_risk_dataset.csv        Final labeled dataset (44 rows x 8 columns)
    ├── baseline_classifier_results.csv Benchmark accuracy (sanity check + honest baseline)
    ├── risk_label_matrix.xlsx          11x4 sector x event label grid
    ├── domain_validation_notes.xlsx    Spot-check vs. domain knowledge
    └── data_dictionary.xlsx            Column defs, label rules, caveats
```

## Reproducing the dataset

```bash
pip install -r requirements.txt

cd code
python validate_windows.py         # confirms all 4 windows are real Nifty50 drawdowns (needs internet)
python sector_ohlcv_fetch.py       # pulls constituent OHLCV, builds sector return series (needs internet)
python mdd_compute.py              # computes MDD per sector x window
python risk_metrics.py             # computes VaR, Sharpe ratio, recovery days
python label_assign.py             # assigns risk labels from MDD thresholds
python baseline_classifier.py      # trains + evaluates baseline Random Forest
python build_label_matrix.py       # builds risk_label_matrix.xlsx
python build_domain_validation.py  # builds domain_validation_notes.xlsx
python build_data_dictionary.py    # builds data_dictionary.xlsx
```

Each script can be re-run independently once its input file(s) already exist in `outputs/`.

## Baseline classifier results

`baseline_classifier.py` reports two runs, deliberately kept separate:

- **RUN 1 (sanity check)**: includes `Maximum_Drawdown(%)` as a feature. Scores ~100% because
  the label is a direct threshold function of this exact column -- this is NOT a meaningful
  predictive result and should not be cited as the paper's benchmark accuracy.
- **RUN 2 (honest baseline)**: excludes `Maximum_Drawdown(%)`, testing whether VaR, Sharpe
  ratio, and recovery days alone can predict risk. **This is the number to report** (currently
  71.43% on a 14-record test split; small dataset, so treat as indicative, not precise).

## Known limitations

- Sector portfolios are equal-weighted across a representative subset of constituents, not
  full official NSE index weights (a reproducibility trade-off for free yfinance data).
- The RBI Rate Hike and US Fed Tightening windows deliberately overlap (Mar 2022 - Feb 2023),
  since both macro forces were concurrent -- by design, not a data error.
- `Recovery_Days` searches the full available return series, not just the stress window itself,
  since real recoveries often outlast the crisis window. Blank if never recovered in the data.
- With 44 records, "Low" risk never occurs under the current thresholds -- report this as a
  finding in the results section rather than silently working around it.
- Constituent ticker lists should be verified against the current NSE index factsheets
  (niftyindices.com) before final data collection, as index composition changes periodically.

## Citation

If you use this dataset, please cite the accompanying paper and the Zenodo DOI (to be minted
on release).

## License

Specify a license (e.g. CC-BY-4.0 for the dataset, MIT for the code) before publishing to
Zenodo/GitHub -- not yet finalized.
