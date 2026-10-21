"""
Baseline Random Forest Classifier & Evaluation Module.
Implements leak-free baseline evaluation on the NiftyStress-44 benchmark dataset.

Methodological safeguards:
1. Strict exclusion of max_drawdown_pct to prevent target leakage.
2. Stratified 3-Fold Cross-Validation per official specification.
3. GroupKFold (Leave-One-Stress-Event-Out) for temporal cross-crisis evaluation.
4. Comprehensive reporting: Accuracy, Balanced Accuracy, Macro/Per-class Precision, Recall, F1, and Confusion Matrices.
"""
from typing import Dict, Any, List, Tuple
import os
import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold, LeaveOneGroupOut, train_test_split
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, '..', '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)


def evaluate_cv(
    X: np.ndarray,
    y: np.ndarray,
    cv_splits: List[Tuple[np.ndarray, np.ndarray]],
    n_estimators: int = 100,
    random_state: int = 42
) -> Dict[str, Any]:
    """
    Run Cross-Validation across pre-defined train/test index splits.
    """
    fold_accuracies = []
    fold_balanced_accs = []
    fold_f1_macros = []
    all_y_true = []
    all_y_pred = []
    
    for fold_idx, (train_idx, test_idx) in enumerate(cv_splits):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]
        
        clf = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=4,
            random_state=random_state + fold_idx
        )
        clf.fit(X_train, y_train)
        preds = clf.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        # Handle cases where fold test set has only 1 class
        unique_test_classes = np.unique(y_test)
        if len(unique_test_classes) > 1:
            bacc = balanced_accuracy_score(y_test, preds)
        else:
            bacc = acc
        p, r, f1, _ = precision_recall_fscore_support(y_test, preds, average='macro', zero_division=0)
        
        fold_accuracies.append(acc)
        fold_balanced_accs.append(bacc)
        fold_f1_macros.append(f1)
        
        all_y_true.extend(y_test)
        all_y_pred.extend(preds)
        
    all_y_true = np.array(all_y_true)
    all_y_pred = np.array(all_y_pred)
    
    overall_acc = accuracy_score(all_y_true, all_y_pred)
    overall_bacc = balanced_accuracy_score(all_y_true, all_y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(all_y_true, all_y_pred, average='macro', zero_division=0)
    p_per, r_per, f1_per, support_per = precision_recall_fscore_support(all_y_true, all_y_pred, average=None, zero_division=0)
    conf_mat = confusion_matrix(all_y_true, all_y_pred, labels=[0, 1])
    
    return {
        "overall_accuracy": round(float(overall_acc), 4),
        "overall_balanced_accuracy": round(float(overall_bacc), 4),
        "macro_precision": round(float(precision), 4),
        "macro_recall": round(float(recall), 4),
        "macro_f1": round(float(f1), 4),
        "per_class": {
            "precision": [round(float(x), 4) for x in p_per],
            "recall": [round(float(x), 4) for x in r_per],
            "f1": [round(float(x), 4) for x in f1_per],
            "support": [int(x) for x in support_per]
        },
        "fold_accuracies": [round(float(x), 4) for x in fold_accuracies],
        "mean_fold_accuracy": round(float(np.mean(fold_accuracies)), 4),
        "std_fold_accuracy": round(float(np.std(fold_accuracies)), 4),
        "confusion_matrix": conf_mat.tolist()
    }


def run_baseline_experiments() -> pd.DataFrame:
    """
    Run all model evaluation experiments on NiftyStress44 dataset.
    """
    data_path = os.path.join(PROJECT_ROOT, 'data', 'processed', 'NiftyStress44_extended.csv')
    df = pd.read_csv(data_path)
    
    # Encode target label
    le = LabelEncoder()
    y = le.fit_transform(df['risk_label']) # 0: High, 1: Medium (or vice versa)
    classes = list(le.classes_)
    
    print("=" * 75)
    print("BASELINE CLASSIFIER EVALUATION (RANDOM FOREST)")
    print("=" * 75)
    print(f"Dataset Size: {len(df)} records")
    print(f"Target Classes: {classes}")
    for idx, c in enumerate(classes):
        cnt = int((y == idx).sum())
        print(f"  Class {idx} ({c}): {cnt} samples ({cnt/len(y)*100:.1f}%)")
        
    # Feature Sets to test
    feature_sets = [
        {
            "name": "Leak-Free Standard (VaR 95% + Sharpe Drop)",
            "features": ["var_95", "sharpe_drop"],
            "leakage": False,
            "description": "Recommended primary benchmark. Uses only return-based tail risk and risk-adjusted drop without MDD."
        },
        {
            "name": "Leak-Free Extended (VaR 95% + Sharpe Drop + Extended Recovery)",
            "features": ["var_95", "sharpe_drop", "recovery_days_extended"],
            "leakage": False,
            "description": "Integrates full empirical recovery time alongside tail loss and Sharpe decline."
        },
        {
            "name": "Leak-Free Censored (VaR 95% + Sharpe Drop + Censored Recovery)",
            "features": ["var_95", "sharpe_drop", "recovery_days"],
            "leakage": False,
            "description": "Uses strict window-censored recovery days with median imputation for unrecovered events."
        },
        {
            "name": "Target Leakage Sanity Check (Includes MDD)",
            "features": ["max_drawdown_pct", "var_95", "sharpe_drop"],
            "leakage": True,
            "description": "SANITY CHECK ONLY. Demonstrates target leakage since Risk_Label is derived directly from MDD."
        }
    ]
    
    results_records = []
    
    # 1. Stratified 3-Fold Cross-Validation (Official Requirement)
    skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    skf_splits = list(skf.split(df, y))
    
    # 2. Leave-One-Stress-Event-Out (GroupKFold on 4 crisis windows)
    groups = df['stress_event'].values
    logo = LeaveOneGroupOut()
    logo_splits = list(logo.split(df, y, groups))
    
    for fs in feature_sets:
        f_cols = fs["features"]
        X_df = df[f_cols].copy()
        
        # Impute if any NaN
        imputer = SimpleImputer(strategy="median")
        X = imputer.fit_transform(X_df)
        
        # Run Stratified 3-Fold CV
        eval_skf = evaluate_cv(X, y, skf_splits)
        
        # Run Leave-One-Event-Out
        eval_logo = evaluate_cv(X, y, logo_splits)
        
        # Run Train/Test Split (70/30) for historical comparison
        X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.30, random_state=42, stratify=y)
        clf_split = RandomForestClassifier(n_estimators=100, max_depth=4, random_state=42)
        clf_split.fit(X_tr, y_tr)
        preds_split = clf_split.predict(X_te)
        acc_split = accuracy_score(y_te, preds_split)
        bacc_split = balanced_accuracy_score(y_te, preds_split)
        p_sp, r_sp, f1_sp, _ = precision_recall_fscore_support(y_te, preds_split, average='macro', zero_division=0)
        
        # Feature importance from model on full data
        full_rf = RandomForestClassifier(n_estimators=100, max_depth=4, random_state=42)
        full_rf.fit(X, y)
        importances = dict(zip(f_cols, [round(float(imp), 4) for imp in full_rf.feature_importances_]))
        
        print(f"\nExperiment: {fs['name']}")
        print(f"  Features: {', '.join(f_cols)}")
        print(f"  Target Leakage: {'YES (UNSOUND)' if fs['leakage'] else 'NO (VALID)'}")
        print(f"  Stratified 3-Fold CV Accuracy: {eval_skf['overall_accuracy']:.2%} (Folds: {eval_skf['fold_accuracies']}, F1: {eval_skf['macro_f1']:.2f})")
        print(f"  Leave-One-Crisis-Out Accuracy: {eval_logo['overall_accuracy']:.2%} (Folds: {eval_logo['fold_accuracies']}, F1: {eval_logo['macro_f1']:.2f})")
        print(f"  70/30 Split Accuracy:          {acc_split:.2%} (N_test = {len(y_te)})")
        print(f"  Feature Importances:          {importances}")
        
        results_records.append({
            "experiment_name": fs["name"],
            "features": ", ".join(f_cols),
            "target_leakage": "YES" if fs["leakage"] else "NO",
            "stratified_3fold_acc": eval_skf["overall_accuracy"],
            "stratified_3fold_balanced_acc": eval_skf["overall_balanced_accuracy"],
            "stratified_3fold_f1_macro": eval_skf["macro_f1"],
            "leave_one_crisis_out_acc": eval_logo["overall_accuracy"],
            "leave_one_crisis_out_f1_macro": eval_logo["macro_f1"],
            "test_split_70_30_acc": round(float(acc_split), 4),
            "test_split_70_30_f1_macro": round(float(f1_sp), 4),
            "feature_importances": json.dumps(importances),
            "confusion_matrix_3fold": json.dumps(eval_skf["confusion_matrix"]),
            "classes": json.dumps(classes)
        })
        
    df_results = pd.DataFrame(results_records)
    
    # Save CSV
    out_csv = os.path.join(PROJECT_ROOT, 'data', 'processed', 'baseline_classifier_results.csv')
    df_results.to_csv(out_csv, index=False)
    print(f"\nSaved baseline evaluation results -> {out_csv}")
    
    # Also save structured JSON for frontend consumption
    json_path = os.path.join(PROJECT_ROOT, 'reports', 'model_evaluation_metrics.json')
    eval_json = {
        "dataset_name": "NiftyStress-44",
        "sample_size": len(df),
        "classes": classes,
        "class_distribution": {"High": int((df['risk_label'] == 'High').sum()), "Medium": int((df['risk_label'] == 'Medium').sum())},
        "experiments": results_records
    }
    with open(json_path, 'w') as jf:
        json.dump(eval_json, jf, indent=2)
    print(f"Saved JSON metrics -> {json_path}")
    
    return df_results


if __name__ == '__main__':
    run_baseline_experiments()
