from typing import Dict, Any, List
import numpy as np
from ..ml.preprocessing import FEATURE_NAMES, FEATURE_LABELS
from ..schemas.assessment import TopFactorItem


class ExplanationService:
    """
    Explainable AI (XAI) engine generating individual patient feature attributions,
    identifying primary risk drivers and protective physiological indicators.
    """
    def __init__(self):
        # Baseline population references for directional interpretation
        self.clinical_baselines = {
            "age": 54.0,
            "trestbps": 120.0,
            "chol": 200.0,
            "thalach": 150.0,
            "oldpeak": 0.5,
            "cp": 0,
            "fbs": 0,
            "restecg": 0,
            "exang": 0,
            "slope": 1,
            "ca": 0,
            "thal": 2
        }

    def format_display_value(self, feature: str, val: Any) -> str:
        if feature == "age":
            return f"{val} years"
        elif feature == "trestbps":
            return f"{val} mmHg"
        elif feature == "chol":
            return f"{val} mg/dL"
        elif feature == "thalach":
            return f"{val} bpm"
        elif feature == "oldpeak":
            return f"{val:.1f} mm"
        elif feature == "sex":
            return "Male" if int(val) == 1 else "Female"
        elif feature == "cp":
            cp_map = {0: "Typical Angina", 1: "Atypical Angina", 2: "Non-Anginal", 3: "Asymptomatic"}
            return cp_map.get(int(val), str(val))
        elif feature == "fbs":
            return "> 120 mg/dL (Elevated)" if int(val) == 1 else "≤ 120 mg/dL (Normal)"
        elif feature == "restecg":
            ecg_map = {0: "Normal", 1: "ST-T Abnormality", 2: "LV Hypertrophy"}
            return ecg_map.get(int(val), str(val))
        elif feature == "exang":
            return "Yes (Exercise Angina)" if int(val) == 1 else "No"
        elif feature == "slope":
            slope_map = {0: "Upsloping", 1: "Flat", 2: "Downsloping"}
            return slope_map.get(int(val), str(val))
        elif feature == "ca":
            return f"{val} Major Vessels"
        elif feature == "thal":
            thal_map = {0: "Unknown", 1: "Normal Flow", 2: "Fixed Defect", 3: "Reversible Defect"}
            return thal_map.get(int(val), str(val))
        return str(val)

    def determine_direction_and_insight(self, feature: str, val: Any, model_risk: float) -> tuple:
        """
        Determines whether the factor is elevating risk or protective and crafts clinical insight.
        """
        if feature == "trestbps":
            if val >= 140:
                return "elevates_risk", f"Resting systolic blood pressure ({val} mmHg) is in the stage-2 hypertensive range, increasing cardiovascular strain."
            elif val >= 130:
                return "elevates_risk", f"Resting blood pressure ({val} mmHg) is elevated above the ideal < 120 mmHg threshold."
            else:
                return "protective", f"Resting blood pressure ({val} mmHg) is within optimal hemodynamic limits."

        elif feature == "chol":
            if val >= 240:
                return "elevates_risk", f"Serum cholesterol ({val} mg/dL) is high, presenting elevated atherogenic potential."
            elif val >= 200:
                return "elevates_risk", f"Serum cholesterol ({val} mg/dL) is borderline elevated."
            else:
                return "protective", f"Serum cholesterol ({val} mg/dL) is in the desirable cardiovascular range."

        elif feature == "thalach":
            if val < 130:
                return "elevates_risk", f"Maximum achieved heart rate ({val} bpm) reflects reduced chronotropic capacity under exertion."
            else:
                return "protective", f"Maximum heart rate ({val} bpm) indicates robust cardiovascular exercise tolerance."

        elif feature == "oldpeak":
            if val >= 1.5:
                return "elevates_risk", f"ST segment depression of {val:.1f} mm suggests exercise-induced subendocardial myocardial ischemia."
            elif val > 0.0:
                return "elevates_risk", f"Mild ST segment depression ({val:.1f} mm) noted during peak stress testing."
            else:
                return "protective", "Absence of ST segment depression during stress indicates stable myocardial perfusion."

        elif feature == "cp":
            if int(val) == 0:
                return "elevates_risk", "Typical angina symptoms reported, which correlate strongly with ischemic coronary patterns."
            elif int(val) in [1, 2]:
                return "protective", "Chest discomfort pattern is atypical or non-anginal in clinical presentation."
            else:
                return "protective", "Asymptomatic presentation without active chest discomfort episodes."

        elif feature == "exang":
            if int(val) == 1:
                return "elevates_risk", "Exercise-induced angina reported, indicating potential myocardial demand-supply mismatch."
            else:
                return "protective", "No exercise-induced angina reported during exertion."

        elif feature == "ca":
            if int(val) > 0:
                return "elevates_risk", f"{val} major coronary vessels identified with fluoroscopic narrowing or reduced patency."
            else:
                return "protective", "Zero major coronary vessel obstructions identified on fluoroscopy."

        elif feature == "age":
            if val >= 60:
                return "elevates_risk", f"Age ({val} years) is an unmodifiable demographic factor associated with accumulated arterial stiffness."
            else:
                return "protective", f"Age ({val} years) is associated with lower baseline vascular wear."

        elif feature == "restecg":
            if int(val) > 0:
                return "elevates_risk", "Resting ECG demonstrates electrical repolarization or left ventricular structural changes."
            else:
                return "protective", "Normal resting baseline electrocardiogram rhythm."

        elif feature == "slope":
            if int(val) == 1:
                return "elevates_risk", "Flat ST slope at peak exercise suggests impaired exercise repolarization."
            else:
                return "protective", "Upsloping or downsloping ST recovery dynamics."

        elif feature == "thal":
            if int(val) == 3:
                return "elevates_risk", "Reversible perfusion defect observed, indicative of reversible exercise ischemia."
            elif int(val) == 2:
                return "elevates_risk", "Fixed perfusion defect noted on cardiac nuclear imaging."
            else:
                return "protective", "Normal myocardial perfusion flow."

        # Default fallback
        return ("elevates_risk" if model_risk >= 0.5 else "protective"), f"{FEATURE_LABELS.get(feature, feature)} measured at {val}."

    def explain_prediction(
        self,
        health_data: Dict[str, Any],
        raw_importance: np.ndarray,
        model_risk: float
    ) -> List[TopFactorItem]:
        """
        Synthesizes model feature attributions with physiological rules to generate top patient factors.
        """
        factor_items = []
        
        for i, col in enumerate(FEATURE_NAMES):
            val = health_data.get(col, 0)
            score = float(raw_importance[i]) if i < len(raw_importance) else 0.05
            
            direction, insight = self.determine_direction_and_insight(col, val, model_risk)
            display_val = self.format_display_value(col, val)
            
            factor_items.append(TopFactorItem(
                feature=col,
                feature_name=FEATURE_LABELS.get(col, col),
                value=val,
                display_value=display_val,
                importance_score=round(score, 4),
                direction=direction,
                clinical_insight=insight
            ))

        # Sort by importance score descending and return top factors
        factor_items.sort(key=lambda x: x.importance_score, reverse=True)
        return factor_items


explanation_service = ExplanationService()
