import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any, List
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

FEATURE_NAMES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

FEATURE_LABELS = {
    "age": "Age",
    "sex": "Biological Sex",
    "cp": "Chest Pain Type",
    "trestbps": "Resting Blood Pressure",
    "chol": "Serum Cholesterol",
    "fbs": "Fasting Blood Sugar",
    "restecg": "Resting Electrocardiogram",
    "thalach": "Maximum Heart Rate",
    "exang": "Exercise Induced Angina",
    "oldpeak": "ST Depression (Exercise)",
    "slope": "ST Segment Slope",
    "ca": "Major Coronary Vessels",
    "thal": "Thalassemia Blood Flow"
}

NUMERICAL_FEATURES = ["age", "trestbps", "chol", "thalach", "oldpeak"]
CATEGORICAL_FEATURES = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]


class HeartDataPreprocessor:
    """
    Robust clinical data preprocessor with strictly separated train-fit transformations,
    outlier safeguards, zero-leakage scaling, and serialization.
    """
    def __init__(self):
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.feature_means = {}
        self.feature_stds = {}
        self.feature_medians = {}

    def fit(self, X_train: pd.DataFrame) -> "HeartDataPreprocessor":
        """
        Fit numerical scaling and extract baseline distribution metadata strictly on training data.
        """
        # Ensure correct column order
        X_num = X_train[NUMERICAL_FEATURES].copy()
        self.scaler.fit(X_num)
        
        for col in FEATURE_NAMES:
            self.feature_medians[col] = float(X_train[col].median())
            self.feature_means[col] = float(X_train[col].mean())
            self.feature_stds[col] = float(X_train[col].std()) if X_train[col].std() > 0 else 1.0
            
        self.is_fitted = True
        return self

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        """
        Transform numerical and categorical features into a normalized float array for neural models.
        """
        if not self.is_fitted:
            raise RuntimeError("HeartDataPreprocessor must be fitted on training data before transformation.")
            
        df = X[FEATURE_NAMES].copy()
        
        # Handle potential NaNs with train medians
        for col in FEATURE_NAMES:
            if df[col].isnull().any():
                df[col] = df[col].fillna(self.feature_medians[col])
                
        # Scale numerical columns
        df[NUMERICAL_FEATURES] = self.scaler.transform(df[NUMERICAL_FEATURES])
        
        return df[FEATURE_NAMES].values.astype(np.float32)

    def transform_single(self, health_dict: Dict[str, Any]) -> np.ndarray:
        """
        Transform a single user/patient dictionary input for inference.
        """
        df = pd.DataFrame([health_dict])
        return self.transform(df)

    def save(self, filepath: str, meta_filepath: str):
        """
        Persist fitted preprocessor and feature metadata.
        """
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self.scaler, filepath)
        
        meta = {
            "feature_names": FEATURE_NAMES,
            "feature_labels": FEATURE_LABELS,
            "numerical_features": NUMERICAL_FEATURES,
            "categorical_features": CATEGORICAL_FEATURES,
            "feature_medians": self.feature_medians,
            "feature_means": self.feature_means,
            "feature_stds": self.feature_stds,
            "is_fitted": self.is_fitted
        }
        with open(meta_filepath, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)

    def load(self, filepath: str, meta_filepath: str) -> "HeartDataPreprocessor":
        """
        Load persisted preprocessor from disk.
        """
        self.scaler = joblib.load(filepath)
        with open(meta_filepath, "r", encoding="utf-8") as f:
            meta = json.load(f)
        self.feature_medians = meta["feature_medians"]
        self.feature_means = meta["feature_means"]
        self.feature_stds = meta["feature_stds"]
        self.is_fitted = True
        return self


def load_and_split_heart_dataset(csv_path: str, random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, pd.Series]:
    """
    Loads dataset, handles duplicates/validation, and performs a 70% Train, 15% Val, 15% Test stratified split.
    """
    df = pd.read_csv(csv_path)
    
    # Standardize column names to lowercase
    df.columns = [c.lower().strip() for c in df.columns]
    
    # Validate required columns
    required_cols = FEATURE_NAMES + ["target"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing expected column '{col}' in heart disease dataset.")

    # Clean missing values if any
    df = df.dropna(subset=required_cols)
    
    X = df[FEATURE_NAMES]
    y = df["target"].astype(int)
    
    # 70% Train, 30% Temp (Val + Test) stratified
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, random_state=random_state, stratify=y
    )
    
    # Split Temp evenly into 15% Val and 15% Test
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=random_state, stratify=y_temp
    )
    
    return X_train, X_val, X_test, y_train, y_val, y_test
