import os
import json
import torch
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, Optional

from ..models.dnn_model import HeartDNN
from ..models.mlp_model import HeartMLP
from ..models.tabnet_model import HeartTabNet
from .preprocessing import HeartDataPreprocessor, FEATURE_NAMES, FEATURE_LABELS

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")


class HeartInferenceEngine:
    """
    Unified production inference engine loading trained DNN, MLP, and TabNet models
    and running synchronized probability calculations and feature attribution.
    """
    def __init__(self, artifacts_dir: str = ARTIFACTS_DIR):
        self.artifacts_dir = artifacts_dir
        self.preprocessor = HeartDataPreprocessor()
        self.dnn_model: Optional[HeartDNN] = None
        self.mlp_model: Optional[HeartMLP] = None
        self.tabnet_model: Optional[HeartTabNet] = None
        self.is_loaded = False
        self.input_dim = len(FEATURE_NAMES)
        
        self.load_artifacts()

    def load_artifacts(self) -> bool:
        prep_path = os.path.join(self.artifacts_dir, "preprocessor", "preprocessor.joblib")
        meta_path = os.path.join(self.artifacts_dir, "preprocessor", "features_meta.json")
        dnn_path = os.path.join(self.artifacts_dir, "models", "dnn.pt")
        mlp_path = os.path.join(self.artifacts_dir, "models", "mlp.pt")
        tabnet_path = os.path.join(self.artifacts_dir, "models", "tabnet.pt")

        try:
            if os.path.exists(prep_path) and os.path.exists(meta_path):
                self.preprocessor.load(prep_path, meta_path)
            else:
                return False

            # Load DNN
            self.dnn_model = HeartDNN(input_dim=self.input_dim)
            if os.path.exists(dnn_path):
                self.dnn_model.load_state_dict(torch.load(dnn_path, map_location=torch.device("cpu")))
            self.dnn_model.eval()

            # Load MLP
            self.mlp_model = HeartMLP(input_dim=self.input_dim)
            if os.path.exists(mlp_path):
                self.mlp_model.load_state_dict(torch.load(mlp_path, map_location=torch.device("cpu")))
            self.mlp_model.eval()

            # Load TabNet
            self.tabnet_model = HeartTabNet(input_dim=self.input_dim)
            if os.path.exists(tabnet_path):
                self.tabnet_model.load_state_dict(torch.load(tabnet_path, map_location=torch.device("cpu")))
            self.tabnet_model.eval()

            self.is_loaded = True
            return True
        except Exception as e:
            print(f"Error loading model artifacts: {e}")
            self.is_loaded = False
            return False

    def predict(self, health_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs synchronized inference across DNN, MLP, and TabNet.
        Returns probabilities and raw feature attribution vectors.
        """
        if not self.is_loaded:
            loaded = self.load_artifacts()
            if not loaded:
                # If models haven't been trained yet, train them or raise
                raise RuntimeError("Models and preprocessor are not loaded. Please run model training first.")

        # Transform inputs
        X_scaled = self.preprocessor.transform_single(health_dict)
        x_tensor = torch.tensor(X_scaled, dtype=torch.float32)

        with torch.no_grad():
            dnn_prob = float(self.dnn_model(x_tensor).numpy().flatten()[0])
            mlp_prob = float(self.mlp_model(x_tensor).numpy().flatten()[0])
            tabnet_pred, tabnet_masks = self.tabnet_model.forward_with_masks(x_tensor)
            tabnet_prob = float(tabnet_pred.numpy().flatten()[0])

        # Extract TabNet attention importance for this specific input
        tabnet_attn = torch.stack(tabnet_masks, dim=0).sum(dim=0).mean(dim=0).numpy().flatten()
        if tabnet_attn.sum() > 0:
            tabnet_attn = tabnet_attn / tabnet_attn.sum()

        # Extract DNN saliency attribution
        dnn_attr = self.dnn_model.get_feature_importance(x_tensor).numpy().flatten()

        # Combine feature importance weights
        combined_importance = 0.5 * tabnet_attn + 0.5 * dnn_attr
        if combined_importance.sum() > 0:
            combined_importance = combined_importance / combined_importance.sum()

        return {
            "dnn_probability": np.clip(dnn_prob, 0.01, 0.99),
            "mlp_probability": np.clip(mlp_prob, 0.01, 0.99),
            "tabnet_probability": np.clip(tabnet_prob, 0.01, 0.99),
            "raw_feature_importance": combined_importance,
            "tabnet_attention": tabnet_attn,
            "dnn_saliency": dnn_attr
        }


# Global inference engine singleton
inference_engine = HeartInferenceEngine()
