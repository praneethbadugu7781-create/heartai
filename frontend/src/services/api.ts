import {
  HealthInput,
  PredictionResponse,
  AssessmentRecord,
  ModelPerformanceReport,
  ChatMessage
} from './types';

const API_BASE = '/api/v1';

export const api = {
  async checkHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async predict(healthData: HealthInput): Promise<PredictionResponse> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        health_data: healthData,
        explain: true,
        include_recommendations: true
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Prediction request failed' }));
      throw new Error(err.detail || 'Prediction failed');
    }
    return res.json();
  },

  async saveAssessment(
    healthData: HealthInput,
    patientName: string = 'Anonymous Health Profile',
    notes?: string
  ): Promise<AssessmentRecord> {
    const res = await fetch(`${API_BASE}/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        health_data: healthData,
        patient_name: patientName,
        notes: notes
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed saving assessment' }));
      throw new Error(err.detail || 'Failed saving assessment');
    }
    return res.json();
  },

  async getAssessments(): Promise<AssessmentRecord[]> {
    const res = await fetch(`${API_BASE}/assessments?limit=50`);
    if (!res.ok) throw new Error('Failed to retrieve assessment history');
    return res.json();
  },

  async getAssessmentById(id: string): Promise<AssessmentRecord> {
    const res = await fetch(`${API_BASE}/assessment/${id}`);
    if (!res.ok) throw new Error(`Assessment ${id} not found`);
    return res.json();
  },

  async deleteAssessment(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/assessment/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete assessment ${id}`);
  },

  async getModelPerformance(): Promise<ModelPerformanceReport> {
    const res = await fetch(`${API_BASE}/model-performance`);
    if (!res.ok) throw new Error('Failed to fetch model performance metrics');
    return res.json();
  },

  async queryAssistant(
    query: string,
    assessmentId?: string,
    healthData?: HealthInput,
    predictionSummary?: any
  ): Promise<{ answer: string; is_emergency: boolean; suggested_followups: string[] }> {
    const res = await fetch(`${API_BASE}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        assessment_id: assessmentId,
        health_data: healthData,
        prediction_summary: predictionSummary
      })
    });
    if (!res.ok) throw new Error('Failed to communicate with AI Assistant');
    return res.json();
  },

  getReportPdfUrl(assessmentId: string): string {
    return `${API_BASE}/report/pdf/${assessmentId}`;
  }
};
