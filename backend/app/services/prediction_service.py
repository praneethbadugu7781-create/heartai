from typing import Dict, Any, List
from ..schemas.assessment import HealthInput, TopFactorItem, RecommendationItem
from ..schemas.prediction import PredictionResponse, ModelPredictionDetail
from ..ml.inference import inference_engine
from .ensemble_service import ensemble_service
from .explanation_service import explanation_service
from .recommendation_service import recommendation_service

DISCLAIMER_TEXT = (
    "Medical Disclaimer: HeartGuard AI is an educational machine learning assessment tool. "
    "Predictions represent algorithmic risk estimations based on clinical trial datasets and do NOT constitute "
    "a medical diagnosis, clinical confirmation, or treatment plan. Always consult a qualified healthcare provider."
)


class PredictionService:
    """
    Orchestration service combining model inference, ensemble calculations,
    explainability generation, and lifestyle recommendations.
    """
    def run_prediction_pipeline(
        self,
        health_data: HealthInput,
        explain: bool = True,
        include_recommendations: bool = True
    ) -> PredictionResponse:
        data_dict = health_data.model_dump()

        # 1. Run synchronized multi-model inference
        inf_result = inference_engine.predict(data_dict)
        dnn_p = float(inf_result["dnn_probability"])
        mlp_p = float(inf_result["mlp_probability"])
        tabnet_p = float(inf_result["tabnet_probability"])
        raw_importance = inf_result["raw_feature_importance"]

        # 2. Compute transparent calibrated ensemble
        ensemble_res = ensemble_service.calculate_ensemble(dnn_p, mlp_p, tabnet_p)
        ensemble_p = ensemble_res["ensemble_probability"]
        risk_pct = ensemble_res["risk_percentage"]
        risk_cat = ensemble_res["risk_category"]
        risk_sev = ensemble_res["risk_level_severity"]
        model_agree = ensemble_res["model_agreement"]

        # 3. Model breakdown cards
        models_breakdown = [
            ModelPredictionDetail(
                model_name="Deep Neural Network (DNN)",
                probability=dnn_p,
                percentage=round(dnn_p * 100, 1),
                risk_tier="Higher Risk" if dnn_p >= 0.65 else ("Moderate Risk" if dnn_p >= 0.35 else "Lower Risk"),
                architecture="4 Dense Layers + BatchNorm + Dropout",
                key_characteristics="Non-linear tabular representations with batch normalization"
            ),
            ModelPredictionDetail(
                model_name="Multi-Layer Perceptron (MLP)",
                probability=mlp_p,
                percentage=round(mlp_p * 100, 1),
                risk_tier="Higher Risk" if mlp_p >= 0.65 else ("Moderate Risk" if mlp_p >= 0.35 else "Lower Risk"),
                architecture="2 Dense Layers + LeakyReLU + L2 Decay",
                key_characteristics="High-efficiency parametric linear-threshold baseline"
            ),
            ModelPredictionDetail(
                model_name="TabNet Classifier",
                probability=tabnet_p,
                percentage=round(tabnet_p * 100, 1),
                risk_tier="Higher Risk" if tabnet_p >= 0.65 else ("Moderate Risk" if tabnet_p >= 0.35 else "Lower Risk"),
                architecture="Attentive Transformer + Decision Steps",
                key_characteristics="Canonical sequential sparse attention for interpretable tabular features"
            )
        ]

        # 4. Generate Explainable AI top contributing factors
        top_factors: List[TopFactorItem] = []
        if explain:
            top_factors = explanation_service.explain_prediction(data_dict, raw_importance, ensemble_p)

        # 5. Generate personalized 6-pillar lifestyle recommendations
        recommendations: List[RecommendationItem] = []
        if include_recommendations:
            recommendations = recommendation_service.generate_recommendations(health_data, risk_cat, risk_sev)

        return PredictionResponse(
            dnn_probability=dnn_p,
            mlp_probability=mlp_p,
            tabnet_probability=tabnet_p,
            ensemble_probability=ensemble_p,
            risk_percentage=risk_pct,
            risk_category=risk_cat,
            risk_level_severity=risk_sev,
            model_agreement=model_agree,
            models_breakdown=models_breakdown,
            top_factors=top_factors,
            recommendations=recommendations,
            disclaimer=DISCLAIMER_TEXT
        )


prediction_service = PredictionService()
