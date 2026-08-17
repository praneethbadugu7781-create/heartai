from typing import List, Dict, Any
from ..schemas.assessment import RecommendationItem, HealthInput


class RecommendationService:
    """
    Context-aware general lifestyle guidance generator across 6 pillars:
    Nutrition, Physical Activity, Sleep, Stress, Monitoring, and Professional Care.
    Adheres strictly to safe non-prescriptive educational health standards.
    """
    def generate_recommendations(
        self,
        health_data: HealthInput,
        risk_category: str,
        risk_severity: str
    ) -> List[RecommendationItem]:
        recommendations = []

        # -------------------------------------------------------------
        # 1. Nutrition Guidance
        # -------------------------------------------------------------
        nut_points = [
            "Emphasize a Mediterranean or DASH-style eating pattern rich in leafy vegetables, berries, and whole grains.",
            "Prioritize lean proteins such as legumes, wild-caught fish rich in Omega-3 fatty acids, and skinless poultry.",
            "Limit processed foods with high sodium (< 2,300 mg/day baseline, < 1,500 mg/day for elevated blood pressure)."
        ]
        if health_data.chol >= 200:
            nut_points.insert(1, f"With serum cholesterol at {health_data.chol} mg/dL, increase soluble fiber (oats, flaxseeds, psyllium) to assist natural LDL binding.")
        if health_data.fbs == 1:
            nut_points.append("Focus on low-glycemic carbohydrates and pair carbs with dietary fats and fiber to maintain steady glycemic curves.")

        recommendations.append(RecommendationItem(
            category="Nutrition",
            title="Cardioprotective Dietary Principles",
            summary="Evidence-based nutritional approaches emphasizing whole foods, plant sterols, and healthy unsaturated fats.",
            actionable_points=nut_points,
            priority="high" if (health_data.chol >= 240 or health_data.trestbps >= 140) else "standard",
            icon="Utensils"
        ))

        # -------------------------------------------------------------
        # 2. Physical Activity Guidance
        # -------------------------------------------------------------
        act_points = [
            "Target a minimum of 150 minutes of moderate-intensity aerobic exercise (such as brisk walking, cycling, or swimming) per week.",
            "Incorporate 2 non-consecutive days of light-to-moderate resistance or functional mobility training.",
            "Avoid abrupt heavy exertion without adequate 5-10 minute cardiovascular warm-up and cool-down phases."
        ]
        if health_data.exang == 1:
            act_points.insert(0, "Because you noted exercise discomfort, engage only in low-intensity activities and consult your doctor before structured conditioning.")
        elif health_data.thalach < 120:
            act_points.append("Gradually build aerobic endurance with zone-2 cardiovascular training to improve chronotropic capacity over time.")

        recommendations.append(RecommendationItem(
            category="Physical Activity",
            title="Heart-Healthy Movement & Aerobic Conditioning",
            summary="Gradual, sustainable physical activity designed to improve vascular elasticity and endurance safely.",
            actionable_points=act_points,
            priority="high" if health_data.exang == 1 else "standard",
            icon="Activity"
        ))

        # -------------------------------------------------------------
        # 3. Sleep Architecture
        # -------------------------------------------------------------
        sleep_points = [
            "Maintain 7 to 9 hours of restorative sleep per night with a regular sleep and wake schedule.",
            "Keep the sleep environment cool (65-68°F / 18-20°C), quiet, and free from blue-light screens 60 minutes before bed.",
            "If frequent snoring, morning fatigue, or nighttime awakenings occur, discuss an evaluation for sleep-disordered breathing with a clinician."
        ]
        recommendations.append(RecommendationItem(
            category="Sleep",
            title="Circadian Health & Nighttime Recovery",
            summary="Quality sleep allows nocturnal blood pressure dipping and essential parasympathetic cardiovascular recovery.",
            actionable_points=sleep_points,
            priority="medium",
            icon="Moon"
        ))

        # -------------------------------------------------------------
        # 4. Stress Management & Autonomic Balance
        # -------------------------------------------------------------
        stress_points = [
            "Practice diaphragmatic resonance breathing (e.g., 4 seconds inhale, 4 seconds hold, 4 seconds exhale) for 5 minutes twice daily.",
            "Take scheduled 10-minute micro-breaks during high-pressure work periods to reset sympathetic nervous system tone.",
            "Incorporate gentle mindful meditation, nature walks, or listening to calming music to support heart rate variability (HRV)."
        ]
        recommendations.append(RecommendationItem(
            category="Stress Management",
            title="Autonomic Regulation & Stress Reduction",
            summary="Chronic sympathetic activation elevates cortisol and blood pressure. Intentional down-regulation promotes arterial health.",
            actionable_points=stress_points,
            priority="medium",
            icon="Sparkles"
        ))

        # -------------------------------------------------------------
        # 5. Biomarker Monitoring
        # -------------------------------------------------------------
        mon_points = [
            "Record resting blood pressure at the same time daily (morning and evening) using a validated upper-arm cuff.",
            "Schedule annual or bi-annual comprehensive metabolic and lipid panels with your primary care provider.",
            "Keep an organized log of resting vitals, exertion tolerance, and any noticeable sensations to share during checkups."
        ]
        if health_data.trestbps >= 130:
            mon_points.insert(0, f"With resting BP at {health_data.trestbps} mmHg, maintain a 14-day blood pressure diary before your next doctor visit.")

        recommendations.append(RecommendationItem(
            category="Monitoring & Biometrics",
            title="Proactive Health Tracking & Record Keeping",
            summary="Regular non-invasive biomarker monitoring provides actionable clinical trends rather than isolated snapshot readings.",
            actionable_points=mon_points,
            priority="high" if health_data.trestbps >= 135 else "standard",
            icon="LineChart"
        ))

        # -------------------------------------------------------------
        # 6. Professional Care Collaboration
        # -------------------------------------------------------------
        care_points = [
            "Schedule a routine review with a primary care doctor or cardiologist to discuss these estimated AI risk factors.",
            "Share your family history, dietary habits, and recent lifestyle changes openly with your healthcare team.",
            "Seek immediate emergency medical attention if you ever experience sudden chest pain, pressure radiating to the arm/jaw, severe shortness of breath, or syncope."
        ]
        if risk_severity == "high":
            care_points.insert(0, "Given the higher model-estimated risk profile, an in-person clinical evaluation with a cardiologist is strongly advised.")

        recommendations.append(RecommendationItem(
            category="Professional Care",
            title="Healthcare Provider Collaboration",
            summary="Algorithmic assessments serve as health awareness tools. Professional clinical care remains the cornerstone of heart health.",
            actionable_points=care_points,
            priority="high" if risk_severity == "high" else "standard",
            icon="ShieldAlert"
        ))

        return recommendations


recommendation_service = RecommendationService()
