"""
Builds data_dictionary.xlsx: column definitions, label threshold rules,
sector/event reference, and methodological caveats -- cited in the paper's
methodology section per the objective document's file-usage table.

Output: ../outputs/data_dictionary.xlsx
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

FONT = "Arial"
OUTPUT_FILE = "../outputs/data_dictionary.xlsx"

wb = Workbook()

# --- Sheet 1: Column definitions ---
ws1 = wb.active
ws1.title = "Column Definitions"
ws1.append(["column", "type", "description", "example"])
ws1.append(["Sector", "TEXT", "One of the 11 NSE sector portfolios (equal-weighted across constituent tickers)", "Banking"])
ws1.append(["Event_ID", "TEXT", "Machine-readable stress event identifier", "covid_2020"])
ws1.append(["Event_Name", "TEXT", "Human-readable name of the macro stress event window", "COVID-19 Crash"])
ws1.append(["Start_Date / window_start", "DATE", "Start date of the defined stress window", "2020-02-17"])
ws1.append(["End_Date / window_end", "DATE", "End date of the defined stress window", "2020-04-01"])
ws1.append(["Maximum_Drawdown(%)", "FLOAT", "Peak-to-trough drawdown %% within the window: (Trough-Peak)/Peak x 100", "-38.4"])
ws1.append(["VaR_95(%)", "FLOAT", "5th percentile of daily returns within the window (historical simulation)", "-4.2"])
ws1.append(["Recovery_Days", "FLOAT (nullable)", "Trading days from trough date until price returns to pre-stress peak. Blank if not recovered in available data.", "87"])
ws1.append(["Sharpe_Ratio", "FLOAT", "Annualised Sharpe ratio during the stress window", "-1.35"])
ws1.append(["Risk_Label", "TEXT", "High / Medium / Low, assigned from Maximum_Drawdown(%) thresholds (see Label Rules sheet)", "High"])

# --- Sheet 2: Label rules ---
ws2 = wb.create_sheet("Label Rules")
ws2.append(["risk_label", "mdd_threshold", "interpretation"])
ws2.append(["High", "MDD <= -15%", "Severe capital drawdown; recovery likely > 60 days"])
ws2.append(["Medium", "-15% < MDD <= -5%", "Moderate loss; partial hedging would have helped"])
ws2.append(["Low", "MDD > -5%", "Resilient sector; minimal portfolio impact"])

# --- Sheet 3: Sectors & stress events ---
ws3 = wb.create_sheet("Sectors and Events")
ws3.append(["sector_name", "representative_index"])
for s in ["Banking", "IT", "FMCG", "Auto", "Pharma", "Metal", "Energy", "Realty", "Media", "PSU_Bank", "Financial_Services"]:
    ws3.append([s, f"Nifty {s.replace('_', ' ')}"])
ws3.append([])
ws3.append(["stress_event", "window", "trigger"])
ws3.append(["COVID-19 Crash", "2020-02-17 to 2020-04-01", "WHO pandemic declaration"])
ws3.append(["Russia-Ukraine Shock", "2022-02-16 to 2022-04-29", "Invasion announced Feb 24, 2022"])
ws3.append(["RBI Rate Hike Cycle", "2022-05-04 to 2023-02-08", "RBI repo rate 4.0% -> 6.5%"])
ws3.append(["US Fed Tightening", "2022-03-16 to 2023-12-13", "Fed Funds rate 0.25% -> 5.5%"])

# --- Sheet 4: Notes / caveats ---
ws4 = wb.create_sheet("Notes")
notes = [
    "Sector portfolios are equal-weighted across a representative subset of constituent tickers "
    "(see sector_constituents.json), not full official NSE index weights.",
    "RBI Rate Hike Cycle and US Fed Tightening windows overlap (Mar 2022 - Feb 2023) by design, "
    "since both macro forces were concurrent. Not a data error.",
    "Recovery_Days searches the full available return series, not just window_end, since real "
    "recoveries often outlast the crisis window. Blank if never recovered in available data.",
    "Risk_Label is a function of Maximum_Drawdown(%) ONLY -- VaR, Sharpe ratio, and Recovery_Days "
    "are additional features/context but do NOT affect the label directly.",
    "With the corrected -15/-5 thresholds, 0 of 44 records fall in the 'Low' band -- every "
    "sector recorded at least a Medium-level drawdown in every validated stress window. This is "
    "a real finding (see risk_label_matrix.xlsx Notes sheet), not a labeling bug.",
    "Baseline classifier (Step 6) reports TWO runs: a sanity check that includes "
    "Maximum_Drawdown(%) as a feature (expect ~100%% accuracy, since it directly determines the "
    "label -- this is NOT the reportable benchmark), and an honest baseline that excludes it "
    "(VaR, Sharpe, Recovery_Days only) -- THIS is the number to report as the paper's benchmark.",
]
ws4.append(["note"])
for n in notes:
    ws4.append([n])

# --- styling pass ---
header_fill = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
for ws in wb.worksheets:
    for row in ws.iter_rows():
        for cell in row:
            if cell.value is not None:
                cell.font = Font(name=FONT, bold=(cell.row == 1))
                cell.alignment = Alignment(wrap_text=True, vertical="top")
    for c in range(1, ws.max_column + 1):
        cell = ws.cell(row=1, column=c)
        if cell.value:
            cell.fill = header_fill
            cell.font = Font(name=FONT, bold=True, color="FFFFFF")
        ws.column_dimensions[get_column_letter(c)].width = 42
    ws.freeze_panes = "A2"

wb.save(OUTPUT_FILE)
print(f"Saved {OUTPUT_FILE}")
print(f"Sheets: {wb.sheetnames}")
