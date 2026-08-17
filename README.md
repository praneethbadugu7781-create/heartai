# HeartGuard AI
### AI-Powered Heart Disease Risk Assessment & Lifestyle Intelligence

[![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-emerald.svg)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.4%2B-orange.svg)](https://pytorch.org/)
[![React](https://img.shields.io/badge/React-18.3%20%7C%20TypeScript-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

---

## 1. Important Medical & Algorithmic Safety Disclaimer

> [!IMPORTANT]
> **HeartGuard AI is an educational and exploratory risk-assessment platform, NOT a medical diagnosis system.**
>
> - It does **not** replace clinical diagnostic procedures (such as angiography, 12-lead ECGs, or physician consultations).
> - It never claims: *"You have heart disease"*, *"You are cured"*, or *"Take this medication"*.
> - All results are framed as **"Estimated model risk"** derived from statistical pattern associations in clinical research datasets.
> - **Emergency Protocol**: If you experience acute symptoms such as severe chest tightness, crushing pressure radiating to the jaw/arm, or sudden shortness of breath, contact emergency medical services (**911**, **112**, or your local emergency number) immediately.

---

## 2. Platform Overview & System Architecture

HeartGuard AI delivers an end-to-end clinical machine learning pipeline and a luxury healthcare user experience:

```
                          ┌──────────────────────────┐
                          │   Patient Health Input   │
                          │ (Demographics & Vitals)  │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │ Zero-Leakage Transformer │
                          │  (Scaling & Validation)  │
                          └─────────────┬────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
┌─────────────────────────┐┌─────────────────────────┐┌─────────────────────────┐
│ Model 1: Deep Neural Net││ Model 2: Multi-Layer    ││ Model 3: TabNet         │
│ (4 Dense + BatchNorm)   ││ Perceptron (LeakyReLU)  ││ (Attentive Transformer) │
│       Acc: 85.7%        ││       Acc: 83.1%        ││       Acc: 83.8%        │
│      ROC-AUC: 0.936     ││      ROC-AUC: 0.922     ││      ROC-AUC: 0.916     │
└────────────┬────────────┘└────────────┬────────────┘└────────────┬────────────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │ Calibrated Ensemble Risk │
                          │ (35% DNN+30% MLP+35% Tab)│
                          │   ROC-AUC: 0.934 (Test)  │
                          └─────────────┬────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌─────────────────────────┐                               ┌─────────────────────────┐
│  Explainable AI (XAI)   │                               │ 6 Lifestyle Pillars     │
│ (Top Directional Drivers│                               │ Nutrition, Activity,    │
│  & Protective Factors)  │                               │ Sleep, Stress, Tracking │
└─────────────────────────┘                               └─────────────────────────┘
```

---

## 3. Dataset & Preprocessing Pipeline

- **Dataset**: [Kaggle / UCI Cleveland Heart Disease Dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)
- **Features (14 clinical variables)**:
  - `age`: Patient age in years (18–105)
  - `sex`: Biological sex (1 = Male, 0 = Female)
  - `cp`: Chest pain phenotype (0: Typical Angina, 1: Atypical Angina, 2: Non-anginal, 3: Asymptomatic)
  - `trestbps`: Resting systolic blood pressure in mm Hg (80–220)
  - `chol`: Total serum cholesterol in mg/dL (100–600)
  - `fbs`: Fasting blood sugar > 120 mg/dL (1 = True, 0 = False)
  - `restecg`: Resting electrocardiographic results (0: Normal, 1: ST-T abnormality, 2: LVH)
  - `thalach`: Maximum achieved heart rate in bpm (60–220)
  - `exang`: Exercise-induced angina (1 = Yes, 0 = No)
  - `oldpeak`: ST depression induced by exercise relative to rest (0.0–7.0 mm)
  - `slope`: Slope of peak exercise ST segment (0: Upsloping, 1: Flat, 2: Downsloping)
  - `ca`: Number of major coronary vessels (0–3) colored by fluoroscopy
  - `thal`: Thalassemia nuclear perfusion status (1: Normal, 2: Fixed defect, 3: Reversible defect)
  - `target`: Disease status (0 = Lower risk, 1 = Higher risk)
- **Zero-Leakage Splitting**:
  - Stratified 70% Train (717 samples), 15% Validation (154 samples), and 15% Independent Test (154 samples).
  - Preprocessor scalers (`StandardScaler`) and imputers are strictly fitted on the train split only.

---

## 4. Machine Learning Models & Evaluation

Models are evaluated on the held-out test split with zero data leakage:

| Model Architecture | Accuracy | Precision | Recall (Sensitivity) | Specificity | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Deep Neural Network (DNN)** | **85.7%** | 89.5% | 82.9% | 88.9% | 86.1% | **0.936** |
| **Multi-Layer Perceptron (MLP)** | **83.1%** | 85.9% | 81.7% | 84.7% | 83.8% | **0.922** |
| **TabNet Attention Classifier** | **83.8%** | 89.0% | 79.3% | 88.9% | 83.9% | **0.916** |
| **HeartGuard Ensemble** | **84.4%** | **89.2%** | **80.5%** | **88.9%** | **84.6%** | **0.934** |

---

## 5. Quick Start & Setup Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd d:/heartai/backend

# Activate virtual environment
# Windows:
..\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train models and generate empirical benchmarks
python train_models.py

# Launch FastAPI Backend Server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd d:/heartai/frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 6. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health, database connection, and model loading status |
| `POST` | `/api/v1/predict` | Synchronized DNN, MLP, TabNet inference & XAI factor extraction |
| `POST` | `/api/v1/assessment` | Runs prediction and saves record to MongoDB/fallback store |
| `GET` | `/api/v1/assessments` | Retrieves previous assessment records |
| `GET` | `/api/v1/assessment/{id}` | Retrieves a single assessment report by ID |
| `DELETE` | `/api/v1/assessment/{id}` | Deletes an assessment record |
| `GET` | `/api/v1/model-performance` | Returns real test metrics, ROC curves, confusion matrices |
| `POST` | `/api/v1/assistant` | Context-aware AI cardiac health communicator |
| `GET` | `/api/v1/report/pdf/{id}` | Generates and streams medical-grade assessment PDF report |

---

## 7. Automated Testing Suite

To run backend unit tests verifying preprocessing, neural models, ensemble calibration, and assistant safety:
```bash
python -m unittest backend/tests/test_pipeline.py
```

---

## 8. License & Ethical Notice

This software is released under the **MIT License**.
HeartGuard AI is built for educational, research, and preventive health awareness.
Always consult a licensed medical provider for individual clinical guidance.
