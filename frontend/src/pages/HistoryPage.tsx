import React from 'react';
import { AssessmentRecord } from '../services/types';
import { AssessmentHistoryList } from '../components/history/AssessmentHistoryList';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

interface HistoryPageProps {
  onSelectAssessment: (record: AssessmentRecord) => void;
  onStartNew: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectAssessment, onStartNew }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <AssessmentHistoryList
        onSelectAssessment={onSelectAssessment}
        onStartNew={onStartNew}
      />
      <MedicalDisclaimer />
    </div>
  );
};
