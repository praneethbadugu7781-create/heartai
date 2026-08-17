from typing import Dict, Any, Tuple
from ..core.config import settings


class EnsembleService:
    """
    Transparent ensemble engine combining individual DNN, MLP, and TabNet model probabilities
    using validation-calibrated weights and configurable risk tier categorization.
    """
    def __init__(
        self,
        w_dnn: float = settings.DNN_WEIGHT,
        w_mlp: float = settings.MLP_WEIGHT,
        w_tabnet: float = settings.TABNET_WEIGHT,
        threshold_low: float = settings.RISK_THRESHOLD_LOW,
        threshold_mod: float = settings.RISK_THRESHOLD_MODERATE
    ):
        # Normalize weights
        total_w = w_dnn + w_mlp + w_tabnet
        self.w_dnn = w_dnn / total_w
        self.w_mlp = w_mlp / total_w
        self.w_tabnet = w_tabnet / total_w
        
        self.threshold_low = threshold_low
        self.threshold_mod = threshold_mod

    def calculate_ensemble(
        self,
        dnn_prob: float,
        mlp_prob: float,
        tabnet_prob: float
    ) -> Dict[str, Any]:
        """
        Calculates ensemble probability, risk percentage, category, severity, and model agreement.
        """
        ensemble_prob = (
            self.w_dnn * dnn_prob +
            self.w_mlp * mlp_prob +
            self.w_tabnet * tabnet_prob
        )
        # Bound
        ensemble_prob = max(0.001, min(0.999, ensemble_prob))
        risk_pct = round(ensemble_prob * 100, 1)

        # Risk tier determination
        if ensemble_prob < self.threshold_low:
            risk_category = "Lower Estimated Risk"
            severity = "low"
        elif ensemble_prob < self.threshold_mod:
            risk_category = "Moderate Estimated Risk"
            severity = "moderate"
        else:
            risk_category = "Higher Estimated Risk"
            severity = "high"

        # Model consensus assessment
        probs = [dnn_prob, mlp_prob, tabnet_prob]
        spread = max(probs) - min(probs)
        if spread <= 0.12:
            model_agreement = "High Consensus"
        elif spread <= 0.25:
            model_agreement = "Moderate Consensus"
        else:
            model_agreement = "Divergent Estimates (Borderline Phenotype)"

        return {
            "dnn_probability": round(dnn_prob, 4),
            "mlp_probability": round(mlp_prob, 4),
            "tabnet_probability": round(tabnet_prob, 4),
            "ensemble_probability": round(ensemble_prob, 4),
            "risk_percentage": risk_pct,
            "risk_category": risk_category,
            "risk_level_severity": severity,
            "model_agreement": model_agreement,
            "weights_used": {
                "dnn": round(self.w_dnn, 3),
                "mlp": round(self.w_mlp, 3),
                "tabnet": round(self.w_tabnet, 3)
            }
        }


ensemble_service = EnsembleService()
