import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    log_loss,
    confusion_matrix,
    roc_curve,
    precision_recall_curve
)


def calculate_comprehensive_metrics(y_true: np.ndarray, y_prob: np.ndarray, threshold: float = 0.5) -> Dict[str, Any]:
    """
    Computes all standard clinical and statistical classification metrics:
    Accuracy, Precision, Recall (Sensitivity), Specificity, F1-Score, ROC-AUC, Log Loss, and Confusion Matrix.
    """
    y_pred = (y_prob >= threshold).astype(int)
    
    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    
    try:
        auc = float(roc_auc_score(y_true, y_prob))
    except Exception:
        auc = 0.5
        
    try:
        loss = float(log_loss(y_true, np.clip(y_prob, 1e-7, 1 - 1e-7)))
    except Exception:
        loss = 0.693

    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    # Specificity = TN / (TN + FP)
    specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0

    return {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall_sensitivity": round(rec, 4),
        "specificity": round(specificity, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "log_loss": round(loss, 4),
        "true_negative": int(tn),
        "false_positive": int(fp),
        "false_negative": int(fn),
        "true_positive": int(tp),
        "total_samples": int(len(y_true))
    }


def compute_roc_curve_data(y_true: np.ndarray, y_prob: np.ndarray, max_points: int = 40) -> List[Dict[str, float]]:
    """
    Generate decimated ROC curve points suitable for web chart rendering.
    """
    fpr, tpr, thresholds = roc_curve(y_true, y_prob)
    
    # Decimate points if array is large
    if len(fpr) > max_points:
        indices = np.linspace(0, len(fpr) - 1, max_points, dtype=int)
        fpr = fpr[indices]
        tpr = tpr[indices]
        thresholds = thresholds[indices]
        
    points = []
    for f, t, th in zip(fpr, tpr, thresholds):
        points.append({
            "fpr": round(float(f), 4),
            "tpr": round(float(t), 4),
            "threshold": round(float(np.clip(th, 0.0, 1.0)), 4)
        })
    return points
