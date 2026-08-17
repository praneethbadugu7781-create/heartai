import os
import sys
import unittest
import numpy as np

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.assessment import HealthInput
from app.ml.inference import inference_engine
from app.services.prediction_service import prediction_service
from app.services.ensemble_service import ensemble_service
from app.services.assistant_service import assistant_service
from app.schemas.assistant import AssistantQueryRequest


class TestHeartGuardPipeline(unittest.TestCase):
    def setUp(self):
        inference_engine.load_artifacts()
        self.sample_health_data = HealthInput(
            age=58,
            sex=1,
            cp=0,
            trestbps=150,
            chol=260,
            fbs=1,
            restecg=1,
            thalach=125,
            exang=1,
            oldpeak=2.4,
            slope=1,
            ca=2,
            thal=3
        )

    def test_model_loading(self):
        self.assertTrue(inference_engine.is_loaded, "Inference engine should successfully load artifacts")
        self.assertIsNotNone(inference_engine.dnn_model)
        self.assertIsNotNone(inference_engine.mlp_model)
        self.assertIsNotNone(inference_engine.tabnet_model)

    def test_inference_and_ensemble(self):
        res = prediction_service.run_prediction_pipeline(
            self.sample_health_data,
            explain=True,
            include_recommendations=True
        )
        self.assertGreaterEqual(res.dnn_probability, 0.0)
        self.assertLessEqual(res.dnn_probability, 1.0)
        self.assertGreaterEqual(res.mlp_probability, 0.0)
        self.assertLessEqual(res.mlp_probability, 1.0)
        self.assertGreaterEqual(res.tabnet_probability, 0.0)
        self.assertLessEqual(res.tabnet_probability, 1.0)
        self.assertGreaterEqual(res.ensemble_probability, 0.0)
        self.assertLessEqual(res.ensemble_probability, 1.0)
        self.assertIn(res.risk_category, ["Lower Estimated Risk", "Moderate Estimated Risk", "Higher Estimated Risk"])
        self.assertGreater(len(res.top_factors), 0)
        self.assertGreater(len(res.recommendations), 0)
        self.assertIn("Medical Disclaimer", res.disclaimer)

    def test_ensemble_weights_and_tiers(self):
        res_low = ensemble_service.calculate_ensemble(0.1, 0.15, 0.12)
        self.assertEqual(res_low["risk_category"], "Lower Estimated Risk")
        self.assertEqual(res_low["risk_level_severity"], "low")

        res_high = ensemble_service.calculate_ensemble(0.85, 0.90, 0.88)
        self.assertEqual(res_high["risk_category"], "Higher Estimated Risk")
        self.assertEqual(res_high["risk_level_severity"], "high")

    def test_assistant_emergency_detection(self):
        emergency_req = AssistantQueryRequest(query="I am having severe crushing chest pain radiating to my left arm right now")
        resp = assistant_service.generate_response(emergency_req)
        self.assertTrue(resp.is_emergency)
        self.assertIn("EMERGENCY HEALTH ALERT", resp.answer)

    def test_assistant_cardiac_explanation(self):
        req = AssistantQueryRequest(
            query="Why did the models predict this risk score?",
            health_data=self.sample_health_data,
            prediction_summary={"risk_percentage": 78.4, "risk_category": "Higher Estimated Risk"}
        )
        resp = assistant_service.generate_response(req)
        self.assertFalse(resp.is_emergency)
        self.assertIn("Key Contributors", resp.answer)
        self.assertGreater(len(resp.suggested_followups), 0)


if __name__ == "__main__":
    unittest.main()
