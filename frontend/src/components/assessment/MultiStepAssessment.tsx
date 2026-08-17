import React, { useState } from 'react';
import { HealthInput, PredictionResponse, AssessmentRecord } from '../../services/types';
import { ProgressBar } from './ProgressBar';
import { StepProfile } from './StepProfile';
import { StepVitals } from './StepVitals';
import { StepClinical } from './StepClinical';
import { StepReview } from './StepReview';
import { ModelAnalysisAnimation } from '../animations/ModelAnalysisAnimation';
import { api } from '../../services/api';
import { storage } from '../../services/storage';

interface MultiStepAssessmentProps {
  onAssessmentComplete: (record: AssessmentRecord) => void;
}

export const MultiStepAssessment: React.FC<MultiStepAssessmentProps> = ({ onAssessmentComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HealthInput>(() => storage.getCurrentInput());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingResult, setPendingResult] = useState<AssessmentRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (field: keyof HealthInput, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    storage.setCurrentInput(updated);
  };

  const handleRunAssessment = async () => {
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      // 1. Trigger backend assessment API (saves to DB and runs inference)
      const record = await api.saveAssessment(formData, 'Personal Health Profile');
      storage.setLastResult(record);
      setPendingResult(record);
    } catch (err: any) {
      console.error('Assessment execution failed:', err);
      // Fallback local prediction calculation if backend is temporarily unreachable
      try {
        const predRes = await api.predict(formData);
        const fallbackRecord: AssessmentRecord = {
          id: 'local-' + Date.now(),
          created_at: new Date().toISOString(),
          patient_name: 'Personal Health Profile',
          health_data: formData,
          ...predRes
        };
        storage.setLastResult(fallbackRecord);
        setPendingResult(fallbackRecord);
      } catch (fallbackErr: any) {
        setIsAnalyzing(false);
        setErrorMsg(fallbackErr.message || 'Unable to connect to the AI model server. Please check connection and try again.');
      }
    }
  };

  const handleAnimationComplete = () => {
    setIsAnalyzing(false);
    if (pendingResult) {
      onAssessmentComplete(pendingResult);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Step Progress Track */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={4}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold underline text-rose-700 ml-3">Dismiss</button>
        </div>
      )}

      {/* Wizard Steps */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        {currentStep === 1 && (
          <StepProfile
            data={formData}
            onChange={handleFieldChange}
            onNext={() => { setCurrentStep(2); window.scrollTo({ top: 180, behavior: 'smooth' }); }}
          />
        )}

        {currentStep === 2 && (
          <StepVitals
            data={formData}
            onChange={handleFieldChange}
            onNext={() => { setCurrentStep(3); window.scrollTo({ top: 180, behavior: 'smooth' }); }}
            onPrev={() => { setCurrentStep(1); window.scrollTo({ top: 180, behavior: 'smooth' }); }}
          />
        )}

        {currentStep === 3 && (
          <StepClinical
            data={formData}
            onChange={handleFieldChange}
            onNext={() => { setCurrentStep(4); window.scrollTo({ top: 180, behavior: 'smooth' }); }}
            onPrev={() => { setCurrentStep(2); window.scrollTo({ top: 180, behavior: 'smooth' }); }}
          />
        )}

        {currentStep === 4 && (
          <StepReview
            data={formData}
            onEditStep={(step) => { setCurrentStep(step); window.scrollTo({ top: 180, behavior: 'smooth' }); }}
            onSubmit={handleRunAssessment}
            isLoading={isAnalyzing}
          />
        )}
      </div>

      {/* Phased High-Tech AI Heart Analysis Modal */}
      {isAnalyzing && (
        <ModelAnalysisAnimation onComplete={handleAnimationComplete} />
      )}
    </div>
  );
};
