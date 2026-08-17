import { HealthInput, AssessmentRecord } from './types';

const STORAGE_KEY_CURRENT_ASSESSMENT = 'heartguard_current_input';
const STORAGE_KEY_LAST_RESULT = 'heartguard_last_result';
const STORAGE_KEY_LOCAL_HISTORY = 'heartguard_local_history';

export const defaultHealthInput: HealthInput = {
  age: 48,
  sex: 1, // Male
  cp: 1, // Atypical Angina
  trestbps: 132, // mmHg
  chol: 228, // mg/dL
  fbs: 0, // <= 120
  restecg: 0, // Normal
  thalach: 154, // bpm
  exang: 0, // No
  oldpeak: 0.8, // mm
  slope: 1, // Flat
  ca: 0, // 0 vessels
  thal: 2, // Fixed defect / Normal
};

export const storage = {
  getCurrentInput(): HealthInput {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CURRENT_ASSESSMENT);
      return data ? JSON.parse(data) : defaultHealthInput;
    } catch {
      return defaultHealthInput;
    }
  },

  setCurrentInput(input: HealthInput) {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_ASSESSMENT, JSON.stringify(input));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  getLastResult(): AssessmentRecord | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LAST_RESULT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setLastResult(result: AssessmentRecord) {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_RESULT, JSON.stringify(result));
      this.saveToLocalHistory(result);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  getLocalHistory(): AssessmentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOCAL_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveToLocalHistory(record: AssessmentRecord) {
    try {
      const history = this.getLocalHistory();
      const filtered = history.filter(h => h.id !== record.id);
      filtered.unshift(record);
      localStorage.setItem(STORAGE_KEY_LOCAL_HISTORY, JSON.stringify(filtered.slice(0, 30)));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  removeLocalHistoryItem(id: string) {
    try {
      const history = this.getLocalHistory().filter(h => h.id !== id);
      localStorage.setItem(STORAGE_KEY_LOCAL_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }
};
