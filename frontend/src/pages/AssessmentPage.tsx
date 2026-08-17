import React from 'react';
import { MultiStepAssessment } from '../components/assessment/MultiStepAssessment';
import { AssessmentRecord } from '../services/types';

interface AssessmentPageProps {
  onAssessmentComplete: (record: AssessmentRecord) => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onAssessmentComplete }) => {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2 mb-2">
        <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Guided Clinical Wizard
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Cardiovascular Risk Assessment
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Complete the four structured steps below to receive your multi-model risk estimation and lifestyle intelligence.
        </p>
      </div>

      <MultiStepAssessment onAssessmentComplete={onAssessmentComplete} />
    </div>
  );
};
