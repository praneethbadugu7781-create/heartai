import os
import re
from typing import Dict, Any, List, Optional
from ..schemas.assistant import AssistantQueryRequest, AssistantQueryResponse
from ..core.config import settings

EMERGENCY_KEYWORDS = [
    r"chest pain", r"crushing pain", r"tightness in chest", r"pressure on chest",
    r"pain radiating", r"left arm pain", r"jaw pain", r"shortness of breath",
    r"difficulty breathing", r"cannot breathe", r"fainted", r"fainting",
    r"syncope", r"passed out", r"heart attack right now", r"emergency"
]


class AssistantService:
    """
    HeartGuard conversational health assistant providing context-aware educational guidance,
    strict non-diagnostic safety boundaries, and immediate emergency symptom escalation.
    """
    def __init__(self):
        self.emergency_pattern = re.compile("|".join(EMERGENCY_KEYWORDS), re.IGNORECASE)

    def is_emergency_query(self, query: str) -> bool:
        return bool(self.emergency_pattern.search(query))

    def generate_response(self, request: AssistantQueryRequest) -> AssistantQueryResponse:
        query = request.query.strip()

        # 1. Emergency Safety Check
        if self.is_emergency_query(query):
            emergency_notice = (
                "EMERGENCY HEALTH ALERT: The symptoms you described (such as severe chest pain, "
                "radiating pressure, shortness of breath, or fainting) may indicate a serious acute cardiovascular event. "
                "Please do not wait or rely on this AI application. Contact emergency services (911, 112, or your local emergency number) "
                "or go to the nearest emergency medical facility immediately."
            )
            return AssistantQueryResponse(
                answer=emergency_notice,
                is_emergency=True,
                emergency_notice=emergency_notice,
                suggested_followups=[
                    "What emergency numbers should I contact?",
                    "What are typical signs of acute coronary syndrome?",
                    "How does HeartGuard AI handle emergency symptoms?"
                ]
            )

        # 2. Context Extraction
        vitals_context = ""
        prediction_context = ""
        if request.health_data:
            hd = request.health_data
            vitals_context = (
                f"User Profile: Age {hd.age}, Sex {'Male' if hd.sex == 1 else 'Female'}, "
                f"Resting BP {hd.trestbps} mmHg, Serum Cholesterol {hd.chol} mg/dL, "
                f"Max HR {hd.thalach} bpm, ST Depression {hd.oldpeak:.1f} mm, "
                f"Exercise Angina {'Yes' if hd.exang == 1 else 'No'}."
            )

        if request.prediction_summary:
            ps = request.prediction_summary
            prediction_context = (
                f"Model Predictions: Ensemble Risk {ps.get('risk_percentage', 'N/A')}%, "
                f"Category: {ps.get('risk_category', 'N/A')}, "
                f"DNN: {ps.get('dnn_probability', 'N/A')}, "
                f"MLP: {ps.get('mlp_probability', 'N/A')}, "
                f"TabNet: {ps.get('tabnet_probability', 'N/A')}."
            )

        # 3. Optional LLM API call if API key available
        if settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY"):
            try:
                import google.generativeai as genai
                api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                
                system_prompt = (
                    "You are HeartGuard Assistant, an educational AI health communicator. "
                    "You explain risk assessments, cardiovascular vitals, and heart-healthy lifestyle habits. "
                    "CRITICAL RULES: NEVER diagnose, NEVER prescribe medications, NEVER say 'you have heart disease'. "
                    "Always refer to 'estimated risk' and recommend consulting a licensed physician. "
                    "Keep answers structured, concise, supportive, and clear.\n"
                    f"Context: {vitals_context}\n{prediction_context}\n"
                )
                res = model.generate_content(f"{system_prompt}\nUser Question: {query}")
                if res.text:
                    return AssistantQueryResponse(
                        answer=res.text.strip(),
                        is_emergency=False,
                        suggested_followups=self._get_default_followups(query)
                    )
            except Exception as e:
                print(f"Gemini API fallback to internal dialogue system: {e}")

        # 4. Built-in Context-Aware Medical Health Dialogue Engine
        answer, followups = self._generate_internal_dialogue(query, request.health_data, request.prediction_summary)
        return AssistantQueryResponse(
            answer=answer,
            is_emergency=False,
            suggested_followups=followups
        )

    def _generate_internal_dialogue(
        self,
        query: str,
        health_data: Optional[Any],
        prediction_summary: Optional[Dict[str, Any]]
    ) -> tuple:
        q = query.lower()

        # Topic: Why is my risk score what it is?
        if any(w in q for w in ["why is my risk", "why is risk", "what influenced", "why high", "why moderate", "why low", "predict this risk", "why did the models", "risk score", "explain my result", "why this score"]):
            if health_data and prediction_summary:
                risk_pct = prediction_summary.get("risk_percentage", "N/A")
                risk_cat = prediction_summary.get("risk_category", "N/A")
                factors = []
                if health_data.trestbps >= 135:
                    factors.append(f"• **Resting Blood Pressure ({health_data.trestbps} mmHg)**: Elevated pressure places increased mechanical stress on arterial walls.")
                if health_data.chol >= 200:
                    factors.append(f"• **Serum Cholesterol ({health_data.chol} mg/dL)**: Higher cholesterol levels correlate with higher atherogenic plaque potential.")
                if health_data.oldpeak > 1.0:
                    factors.append(f"• **ST Depression ({health_data.oldpeak:.1f} mm)**: Indicates myocardial workload response during peak exercise stress.")
                if health_data.exang == 1:
                    factors.append("• **Exercise-Induced Angina**: Discomfort during physical exertion is a key clinical marker.")

                if not factors:
                    factors.append("• Your primary physiological vitals (blood pressure, cholesterol, resting ECG) were within healthy target reference ranges.")

                factor_str = "\n".join(factors)
                answer = (
                    f"### Key Contributors to Your {risk_pct}% Estimated Risk ({risk_cat})\n\n"
                    f"The machine learning ensemble (DNN, MLP, and TabNet) evaluated your complete health profile. "
                    f"The primary variables driving this statistical estimation include:\n\n"
                    f"{factor_str}\n\n"
                    f"**Important Clinical Note**: This percentage is an algorithmic calculation reflecting pattern similarity to clinical trial datasets, "
                    f"not a definitive diagnosis. Variations in individual genetics, fitness, and laboratory markers should be evaluated by a healthcare professional."
                )
            else:
                answer = (
                    "### Understanding Estimated Risk Factors\n\n"
                    "Our AI models evaluate multiple clinical parameters simultaneously, including:\n"
                    "1. **Hemodynamics**: Resting systolic blood pressure and peak exercise heart rate.\n"
                    "2. **Lipids & Metabolism**: Serum cholesterol and fasting blood sugar.\n"
                    "3. **Electrocardiography**: ST-segment depression (`oldpeak`), ST slope, and resting ECG changes.\n"
                    "4. **Symptom Phenotype**: Type of chest discomfort and exercise-induced angina.\n\n"
                    "Complete a risk assessment to receive a personalized breakdown of your specific contributing factors."
                )
            followups = [
                "What do the different models (DNN vs TabNet) measure?",
                "How can I lower my estimated cardiovascular risk?",
                "What questions should I ask my doctor about these results?"
            ]
            return answer, followups

        # Topic: Why did models give different results?
        elif any(w in q for w in ["different models", "dnn vs", "tabnet", "mlp", "model difference", "why do models disagree"]):
            answer = (
                "### Why Do DNN, MLP, and TabNet Produce Different Probabilities?\n\n"
                "Each of our three machine learning models analyzes your tabular health data using a distinct mathematical architecture:\n\n"
                "1. **Deep Neural Network (DNN)**: Employs deep multi-layer dense transformations with Batch Normalization and Dropout, excelling at capturing subtle non-linear interactions across multiple combined vitals.\n"
                "2. **Multi-Layer Perceptron (MLP)**: Uses a streamlined two-layer architecture with LeakyReLU activations, establishing a robust parametric baseline.\n"
                "3. **TabNet Classifier**: Uses sequential multi-step attention mechanisms designed specifically for tabular data, focusing dynamically on the most predictive clinical features (such as ST depression and fluoroscopy vessels) while masking irrelevant noise.\n\n"
                "Our **Ensemble Engine** computes a performance-calibrated combination of all three models to minimize individual model bias and provide a balanced risk assessment."
            )
            followups = [
                "Which model is considered most accurate?",
                "How is the ensemble risk score calculated?",
                "Can you explain TabNet feature importance?"
            ]
            return answer, followups

        # Topic: Blood Pressure explanation
        elif any(w in q for w in ["blood pressure", "trestbps", "hypertension", "systolic"]):
            answer = (
                "### Understanding Resting Blood Pressure (`trestbps`)\n\n"
                "Resting blood pressure measures the pressure exerted by circulating blood against the walls of your systemic arteries:\n\n"
                "• **Normal Range**: < 120 mmHg systolic\n"
                "• **Elevated**: 120–129 mmHg systolic\n"
                "• **Stage 1 Hypertension**: 130–139 mmHg systolic\n"
                "• **Stage 2 Hypertension**: ≥ 140 mmHg systolic\n\n"
                "**Cardiovascular Significance**: Chronic high blood pressure increases cardiac workload, causing the left ventricle to thicken and accelerating arterial plaque formation. "
                "Lifestyle modifications such as the DASH diet, sodium moderation (< 2,300 mg/day), regular aerobic movement, and stress management can help maintain healthy blood pressure."
            )
            followups = [
                "How should I track my blood pressure at home?",
                "What dietary changes support healthy blood pressure?",
                "How does blood pressure affect my overall risk score?"
            ]
            return answer, followups

        # Topic: Cholesterol explanation
        elif any(w in q for w in ["cholesterol", "chol", "ldl", "hdl", "lipids"]):
            answer = (
                "### Understanding Serum Cholesterol (`chol`)\n\n"
                "Serum cholesterol represents the total concentration of lipids circulating in your bloodstream, measured in mg/dL:\n\n"
                "• **Desirable**: < 200 mg/dL\n"
                "• **Borderline High**: 200–239 mg/dL\n"
                "• **High**: ≥ 240 mg/dL\n\n"
                "**Clinical Context**: Excess circulating LDL particles can penetrate the endothelial lining of coronary arteries, undergoing oxidation and forming atherosclerotic plaques. "
                "Increasing soluble dietary fiber (oats, legumes, psyllium) and replacing saturated fats with healthy polyunsaturated fats (extra virgin olive oil, nuts, avocados) supports healthy lipid balance."
            )
            followups = [
                "What is the difference between LDL and HDL?",
                "What foods naturally help lower cholesterol?",
                "When should I get a full lipid panel done?"
            ]
            return answer, followups

        # Topic: Lifestyle improvements / general advice
        elif any(w in q for w in ["improve", "lifestyle", "diet", "exercise", "habits", "lower risk", "prevent"]):
            answer = (
                "### Evidence-Based Cardiovascular Lifestyle Strategies\n\n"
                "Supporting your heart health involves sustainable daily habits across key health pillars:\n\n"
                "1. **Nutrition**: Adopt a Mediterranean or DASH pattern rich in colorful vegetables, berries, legumes, wild fish, and whole grains. Minimize processed ultra-refined foods and excess sodium.\n"
                "2. **Movement**: Target 150+ minutes of moderate aerobic exercise weekly (brisk walking, cycling) combined with 2 days of strength/mobility conditioning.\n"
                "3. **Sleep Quality**: Aim for 7–9 hours of consistent, uninterrupted sleep to support nocturnal cardiovascular recovery.\n"
                "4. **Stress Downregulation**: Practice 5 minutes of resonance breathing (4-second inhale, 4-second exhale) twice daily to optimize autonomic tone.\n"
                "5. **Routine Healthcare**: Review your biometrics annually with your doctor for comprehensive cardiovascular care."
            )
            followups = [
                "Can you suggest a beginner-friendly exercise routine?",
                "How does stress directly impact heart function?",
                "What foods should I add to my grocery list?"
            ]
            return answer, followups

        # General cardiology question fallback
        else:
            answer = (
                "### HeartGuard Educational Guidance\n\n"
                "HeartGuard AI is designed to help you understand cardiovascular risk indicators and evidence-based lifestyle habits.\n\n"
                "• **Multi-Model Intelligence**: Combining Deep Neural Networks, Multi-Layer Perceptrons, and TabNet attention architectures for balanced risk estimation.\n"
                "• **Lifestyle Guidance**: Actionable steps across nutrition, exercise, sleep, stress reduction, and vital tracking.\n"
                "• **Medical Collaboration**: Always consult your primary physician or cardiologist for individualized diagnosis and clinical decision-making.\n\n"
                "Feel free to ask specific questions about your vitals, ECG readings, cholesterol, blood pressure, or how our machine learning models work!"
            )
            followups = self._get_default_followups(query)
            return answer, followups

    def _get_default_followups(self, query: str) -> List[str]:
        return [
            "What factors influenced my risk prediction?",
            "What do the DNN vs TabNet models mean?",
            "How can I improve my cardiovascular health?"
        ]


assistant_service = AssistantService()
