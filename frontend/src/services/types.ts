export interface HealthInput {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface TopFactorItem {
  feature: string;
  feature_name: string;
  value: any;
  display_value: string;
  importance_score: number;
  direction: 'elevates_risk' | 'protective';
  clinical_insight: string;
}

export interface RecommendationItem {
  category: string;
  title: string;
  summary: string;
  actionable_points: string[];
  priority: 'high' | 'medium' | 'standard';
  icon: string;
}

export interface ModelPredictionDetail {
  model_name: string;
  probability: number;
  percentage: number;
  risk_tier: string;
  architecture: string;
  key_characteristics: string;
}

export interface PredictionResponse {
  dnn_probability: number;
  mlp_probability: number;
  tabnet_probability: number;
  ensemble_probability: number;
  risk_percentage: number;
  risk_category: string;
  risk_level_severity: 'low' | 'moderate' | 'high';
  model_agreement: string;
  models_breakdown: ModelPredictionDetail[];
  top_factors: TopFactorItem[];
  recommendations: RecommendationItem[];
  disclaimer: string;
}

export interface AssessmentRecord extends PredictionResponse {
  id: string;
  created_at: string;
  patient_name: string;
  health_data: HealthInput;
  notes?: string;
}

export interface ROCCurvePoint {
  fpr: number;
  tpr: number;
  threshold: number;
}

export interface ROCCurveData {
  model_key: string;
  model_name: string;
  auc: number;
  points: ROCCurvePoint[];
}

export interface ConfusionMatrixData {
  model_key: string;
  model_name: string;
  true_negative: number;
  false_positive: number;
  false_negative: number;
  true_positive: number;
  total_test_samples: number;
}

export interface MetricDetail {
  model_key: string;
  model_name: string;
  architecture: string;
  accuracy: number;
  precision: number;
  recall_sensitivity: number;
  specificity: number;
  f1_score: number;
  roc_auc: number;
  log_loss: number;
  training_time_seconds: number;
  epoch_count: number;
}

export interface GlobalFeatureImportance {
  feature: string;
  feature_name: string;
  dnn_score: number;
  mlp_score: number;
  tabnet_score: number;
  ensemble_score: number;
  description: string;
}

export interface DatasetStatistics {
  dataset_name: string;
  total_samples: number;
  unique_patients: number;
  feature_count: number;
  positive_class_count: number;
  negative_class_count: number;
  train_samples: number;
  val_samples: number;
  test_samples: number;
  split_strategy: string;
}

export interface ModelPerformanceReport {
  generated_at: string;
  dataset_stats: DatasetStatistics;
  metrics_summary: MetricDetail[];
  roc_curves: ROCCurveData[];
  confusion_matrices: ConfusionMatrixData[];
  feature_importances: GlobalFeatureImportance[];
  ensemble_strategy: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
  suggestedFollowups?: string[];
}
