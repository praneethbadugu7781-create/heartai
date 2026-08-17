import React, { useState } from 'react';
import { AssessmentRecord } from '../services/types';
import { RiskScoreGauge } from '../components/results/RiskScoreGauge';
import { ModelBreakdownCard } from '../components/results/ModelBreakdownCard';
import { FeatureContributionChart } from '../components/results/FeatureContributionChart';
import { RecommendationGrid } from '../components/results/RecommendationGrid';
import { ReportDownloadButton } from '../components/results/ReportDownloadButton';
import { ChatAssistantDrawer } from '../components/assistant/ChatAssistantDrawer';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import { Bot, Sparkles, RefreshCw, Calendar, ArrowLeft } from 'lucide-react';

interface ResultsPageProps {
  assessment: AssessmentRecord;
  onRetake: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ assessment, onRetake }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const formattedDate = new Date(assessment.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Top Breadcrumb & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retake or Adjust Health Assessment</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Your Heart Health Risk Assessment Report
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Completed on {formattedDate} UTC</span>
            <span>•</span>
            <span className="font-mono">ID: {assessment.id.slice(0, 8)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm border border-brand-200 transition-all flex items-center gap-2 shadow-xs"
          >
            <Bot className="w-4 h-4 text-brand-600" />
            <span>Ask AI Assistant</span>
          </button>

          <ReportDownloadButton assessmentId={assessment.id} />
        </div>
      </div>

      {/* 1. Main Risk Score Gauge Visualization */}
      <RiskScoreGauge
        scorePercentage={assessment.risk_percentage}
        category={assessment.risk_category}
        severity={assessment.risk_level_severity}
        agreement={assessment.model_agreement}
      />

      {/* 2. Multi-Model Breakdown (DNN vs MLP vs TabNet) */}
      <ModelBreakdownCard
        models={assessment.models_breakdown || []}
        ensemblePercentage={assessment.risk_percentage}
        ensembleRiskCategory={assessment.risk_category}
      />

      {/* 3. Explainable AI (Top Contributing Factors) */}
      <FeatureContributionChart factors={assessment.top_factors || []} />

      {/* 4. Personalized 6-Pillar Lifestyle Guidance */}
      <RecommendationGrid recommendations={assessment.recommendations || []} />

      {/* 5. Medical Safety Disclaimer Banner */}
      <MedicalDisclaimer />

      {/* Floating Bottom AI Assistant Action Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-700 hover:to-rose-700 text-white font-bold px-5 py-3.5 rounded-full shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 hover:scale-105 transition-all flex items-center gap-2.5 text-xs sm:text-sm group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span>Questions about your result? Ask AI</span>
        </button>
      </div>

      {/* AI Assistant Chat Drawer */}
      <ChatAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        healthData={assessment.health_data}
        predictionSummary={{
          risk_percentage: assessment.risk_percentage,
          risk_category: assessment.risk_category,
          dnn_probability: assessment.dnn_probability,
          mlp_probability: assessment.mlp_probability,
          tabnet_probability: assessment.tabnet_probability
        }}
        assessmentId={assessment.id}
      />
    </div>
  );
};
