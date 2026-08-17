from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class MetricDetail(BaseModel):
    model_key: str
    model_name: str
    architecture: str
    accuracy: float
    precision: float
    recall_sensitivity: float
    specificity: float
    f1_score: float
    roc_auc: float
    log_loss: float
    training_time_seconds: float
    epoch_count: int


class ROCCurvePoint(BaseModel):
    fpr: float
    tpr: float
    threshold: float


class ROCCurveData(BaseModel):
    model_key: str
    model_name: str
    auc: float
    points: List[ROCCurvePoint]


class ConfusionMatrixData(BaseModel):
    model_key: str
    model_name: str
    true_negative: int
    false_positive: int
    false_negative: int
    true_positive: int
    total_test_samples: int


class GlobalFeatureImportance(BaseModel):
    feature: str
    feature_name: str
    dnn_score: float
    mlp_score: float
    tabnet_score: float
    ensemble_score: float
    description: str


class DatasetStatistics(BaseModel):
    dataset_name: str
    total_samples: int
    unique_patients: int
    feature_count: int
    positive_class_count: int
    negative_class_count: int
    train_samples: int
    val_samples: int
    test_samples: int
    split_strategy: str


class ModelPerformanceReport(BaseModel):
    generated_at: str
    dataset_stats: DatasetStatistics
    metrics_summary: List[MetricDetail]
    roc_curves: List[ROCCurveData]
    confusion_matrices: List[ConfusionMatrixData]
    feature_importances: List[GlobalFeatureImportance]
    ensemble_strategy: str
    notes: str
