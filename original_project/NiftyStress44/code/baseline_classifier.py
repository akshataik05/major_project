import os

import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# --------------------------------------------------
# Configuration
# --------------------------------------------------

INPUT_FILE = "../outputs/labeled_risk_dataset.csv"

if not os.path.exists(INPUT_FILE):
    raise FileNotFoundError(f"File not found: {INPUT_FILE}")

# --------------------------------------------------
# Load Dataset
# --------------------------------------------------

df = pd.read_csv(INPUT_FILE)

print("=" * 70)
print("Loaded Dataset")
print("=" * 70)

print(df.head())

y_raw = df["Risk_Label"]
print("\nClass distribution:")
print(y_raw.value_counts())

if y_raw.nunique() < 2:
    raise ValueError(
        "Only one class present in Risk_Label -- cannot train a classifier. "
        "Check your threshold rule and input data."
    )


def run_model(feature_cols, label, X_full, y_full):
    """Train/evaluate a RandomForest on the given feature set and print a report."""
    print("\n" + "=" * 70)
    print(label)
    print("=" * 70)
    print(f"Features used: {feature_cols}")

    X = X_full[feature_cols]
    imputer = SimpleImputer(strategy="median")
    X = imputer.fit_transform(X)

    encoder = LabelEncoder()
    y = encoder.fit_transform(y_full)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.30, random_state=42, stratify=y,
    )

    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)
    print(f"\nAccuracy : {accuracy:.2%}")

    print("\nClassification Report:\n")
    print(classification_report(
        y_test, predictions, target_names=encoder.classes_, zero_division=0,
    ))

    print("Confusion Matrix:\n")
    print(confusion_matrix(y_test, predictions))

    importance = pd.DataFrame({
        "Feature": feature_cols,
        "Importance": model.feature_importances_,
    }).sort_values(by="Importance", ascending=False)
    print("\nFeature Importance:\n")
    print(importance)

    return {
        "run": label,
        "features": ", ".join(feature_cols),
        "accuracy": round(accuracy, 4),
        "n_test": len(y_test),
    }


results = []

# --------------------------------------------------
# Run 1: SANITY CHECK -- includes Maximum_Drawdown(%), which is the exact
# feature the label was derived from via a hard threshold. This will score
# very high (often ~100%) because the model can trivially relearn the
# threshold rule. This confirms the labeling pipeline is internally
# consistent, but it is NOT a meaningful predictive benchmark and should
# NOT be reported as "model accuracy" in the paper.
# --------------------------------------------------
results.append(run_model(
    ["Maximum_Drawdown(%)", "VaR_95(%)", "Sharpe_Ratio", "Recovery_Days"],
    "RUN 1 (SANITY CHECK -- includes Maximum_Drawdown(%), expect near-100%, "
    "DO NOT report as the paper's benchmark accuracy)",
    df, y_raw,
))

# --------------------------------------------------
# Run 2: HONEST BASELINE -- excludes Maximum_Drawdown(%) since it directly
# determines the label. This tests whether VaR, Sharpe drop, and recovery
# days -- signals that are NOT used to construct the label -- can predict
# risk on their own. THIS is the number that belongs in the paper as the
# baseline classifier benchmark.
# --------------------------------------------------
results.append(run_model(
    ["VaR_95(%)", "Sharpe_Ratio", "Recovery_Days"],
    "RUN 2 (HONEST BASELINE -- excludes Maximum_Drawdown(%), "
    "THIS is the number to report in the paper)",
    df, y_raw,
))

# --------------------------------------------------
# Save summary
# --------------------------------------------------
summary_df = pd.DataFrame(results)
summary_path = "../outputs/baseline_classifier_results.csv"
summary_df.to_csv(summary_path, index=False)
print(f"\nSaved run summary -> {summary_path}")
print(summary_df.to_string(index=False))

print("\nDone.")