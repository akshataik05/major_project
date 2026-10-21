import os
import pandas as pd

# --------------------------------------------------
# Configuration
# --------------------------------------------------

INPUT_FILE = "../outputs/risk_metrics.csv"
OUTPUT_FOLDER = "../outputs"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# --------------------------------------------------
# Load Risk Metrics
# --------------------------------------------------

df = pd.read_csv(INPUT_FILE)

# --------------------------------------------------
# Risk Label Function
# --------------------------------------------------

def assign_risk_label(mdd):
    """
    Assign risk labels based on Maximum Drawdown.
    """

    if pd.isna(mdd):
        return "Unknown"

    if mdd <= -15:
        return "High"

    elif mdd <= -5:
        return "Medium"

    else:
        return "Low"


# --------------------------------------------------
# Apply Labels
# --------------------------------------------------

df["Risk_Label"] = df["Maximum_Drawdown(%)"].apply(assign_risk_label)

# --------------------------------------------------
# Save Output
# --------------------------------------------------

output_file = os.path.join(
    OUTPUT_FOLDER,
    "labeled_risk_dataset.csv"
)

df.to_csv(output_file, index=False)

# --------------------------------------------------
# Display Summary
# --------------------------------------------------

print("=" * 70)
print("Risk Label Assignment Completed")
print("=" * 70)

print("\nRisk Label Distribution:\n")
print(df["Risk_Label"].value_counts())

print("\nOutput File:")
print(output_file)

print("\nFirst 10 Records:\n")
print(df.head(10))

print("\nDone.")