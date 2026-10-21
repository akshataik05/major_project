"""
Data Dictionary Builder.
Generates data_dictionary.xlsx strictly reflecting the official 9-column schema,
labeling rules, sector constituents, and methodological notes.
"""
import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

HEADER_FILL = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
THIN_BORDER = Border(
    left=Side(style='thin', color='D9D9D9'),
    right=Side(style='thin', color='D9D9D9'),
    top=Side(style='thin', color='D9D9D9'),
    bottom=Side(style='thin', color='D9D9D9')
)


def export_data_dictionary_excel(output_path: str):
    """
    Build and save data_dictionary.xlsx
    """
    wb = Workbook()
    
    # Sheet 1: Column Definitions
    ws1 = wb.active
    ws1.title = "Column Definitions"
    headers1 = ["column", "type", "required", "description", "example"]
    ws1.append(headers1)
    
    col_defs = [
        ["sector", "TEXT", "Yes", "Name of the NSE sector portfolio (equal-weighted basket of 4-5 representative large caps)", "Banking"],
        ["stress_event", "TEXT", "Yes", "Name of the macroeconomic crisis period", "COVID-19 Crash"],
        ["window_start", "DATE", "Yes", "Official start date of the stress event window (YYYY-MM-DD)", "2020-02-17"],
        ["window_end", "DATE", "Yes", "Official end date of the stress event window (YYYY-MM-DD)", "2020-04-01"],
        ["max_drawdown_pct", "FLOAT", "Yes", "Maximum peak-to-trough decline within the stress window: (Trough - Peak) / Peak x 100", "-38.40"],
        ["var_95", "FLOAT", "Yes", "Value at Risk at 95% confidence (5th percentile of daily returns via historical simulation)", "-4.20"],
        ["recovery_days", "INT / NULL", "Nullable", "Trading days from trough to pre-stress peak. NaN if recovery took longer than window_end per PDF rule.", "87"],
        ["sharpe_drop", "FLOAT", "Yes", "Annualized stress Sharpe ratio minus 90-day pre-stress baseline Sharpe ratio", "-1.35"],
        ["risk_label", "TEXT", "Yes", "Rule-based category: High (MDD < -15%), Medium (-15% <= MDD < -5%), Low (MDD >= -5%)", "High"]
    ]
    for row in col_defs:
        ws1.append(row)
        
    # Sheet 2: Label Rules
    ws2 = wb.create_sheet("Label Rules")
    headers2 = ["risk_label", "mdd_threshold", "severity_interpretation", "observed_count"]
    ws2.append(headers2)
    ws2.append(["High Risk", "MDD < -15.0%", "Severe capital impairment; prolonged recovery timeline", 26])
    ws2.append(["Medium Risk", "-15.0% <= MDD < -5.0%", "Moderate portfolio loss; hedging strategies effective", 18])
    ws2.append(["Low Risk", "MDD >= -5.0%", "Resilient sector; minimal capital drawdown", 0])
    
    # Sheet 3: Sectors and Stress Windows
    ws3 = wb.create_sheet("Sectors and Windows")
    ws3.append(["stress_event", "window_start", "window_end", "macro_trigger", "expected_impact"])
    ws3.append(["COVID-19 Crash", "2020-02-17", "2020-04-01", "WHO global pandemic declaration", "Systemic high drawdown across all sectors"])
    ws3.append(["Russia-Ukraine Shock", "2022-02-16", "2022-04-29", "Invasion announcement (Feb 24, 2022)", "Energy & Metals resilient; IT under stress"])
    ws3.append(["RBI Rate Hike Cycle", "2022-05-04", "2023-02-08", "RBI repo rate increased 4.0% -> 6.5%", "Banking volatility; FMCG defensive stability"])
    ws3.append(["US Fed Tightening", "2022-03-16", "2023-12-13", "Fed Funds rate increased 0.25% -> 5.5%", "FII equity outflows; severe IT sector drawdown"])
    
    # Sheet 4: Methodological Caveats
    ws4 = wb.create_sheet("Methodology Caveats")
    ws4.append(["caveat_id", "topic", "methodological_statement"])
    caveats = [
        ["CAV-01", "Equal Weighting", "Sector portfolios are constructed as 1/N equal-weighted daily returns of 4-5 large-cap constituents rather than full free-float market-cap index weights."],
        ["CAV-02", "Sharpe Drop Baseline", "Sharpe Drop is computed using a 90-calendar-day lookback window immediately preceding window_start, capturing delta performance."],
        ["CAV-03", "Censored Recovery", "Recovery Days strictly records NaN if recovery did not occur prior to window_end (per PDF specification). An extended metric is available in supplemental outputs."],
        ["CAV-04", "Empirical Zero Low", "Zero records fall in the 'Low' category because every validated stress window captured a broad NIFTY 50 drawdown >= 5%, dragging all equity sectors down by >= 6.68%."],
        ["CAV-05", "Target Leakage Exclusion", "MDD must never be used as a predictive feature in machine learning models because the target label is deterministically derived from it."]
    ]
    for c in caveats:
        ws4.append(c)
        
    # Formatting
    for ws in wb.worksheets:
        for c in range(1, ws.max_column + 1):
            cell = ws.cell(row=1, column=c)
            cell.fill = HEADER_FILL
            cell.font = Font(name="Arial", bold=True, color="FFFFFF")
            cell.alignment = Alignment(horizontal="center", vertical="center")
            ws.column_dimensions[get_column_letter(c)].width = 28
            
        for row in ws.iter_rows(min_row=2):
            for cell in row:
                cell.font = Font(name="Arial")
                cell.border = THIN_BORDER
                cell.alignment = Alignment(vertical="center")
                
        ws.row_dimensions[1].height = 25
        ws.freeze_panes = "A2"
        
    ws1.column_dimensions["D"].width = 55
    ws3.column_dimensions["D"].width = 45
    ws3.column_dimensions["E"].width = 45
    ws4.column_dimensions["C"].width = 85
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    wb.save(output_path)
    print(f"Saved data dictionary to {output_path}")
