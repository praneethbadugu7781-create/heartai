import React, { useState, useEffect } from 'react';
import { ModelPerformanceReport } from '../services/types';
import { api } from '../services/api';
import { ModelPerformanceTable } from '../components/models/ModelPerformanceTable';
import { ROCCurveChart } from '../components/models/ROCCurveChart';
import { ConfusionMatrixView } from '../components/models/ConfusionMatrixView';
import { Shield, Database, Cpu, Activity, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const ModelPerformancePage: React.FC = () => {
  const [report, setReport] = useState<ModelPerformanceReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPerformanceMetrics();
  }, []);

  const loadPerformanceMetrics = async () => {
    try {
      const data = await api.getModelPerformance();
      setReport(data);
    } catch (e) {
      console.warn('API metrics fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-24 space-y-3">
        <Activity className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-semibold">Loading empirical model benchmarks...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Benchmark Data Not Available</h3>
        <p className="text-sm text-slate-500">Please ensure the backend training pipeline has completed.</p>
      </div>
    );
  }

  const ds = report.dataset_stats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>Clinical ML Benchmarking</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Model Performance &amp; Evaluation Lab
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Comprehensive empirical metrics generated from actual trained models (DNN, MLP, TabNet) evaluated strictly on the independent 15% test split.
        </p>
      </div>

      {/* Dataset Overview Statistics */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base border-b border-slate-100 pb-3">
          <Database className="w-4 h-4 text-brand-600" />
          <span>Training Cohort &amp; Partition Strategy</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Dataset Source</span>
            <span className="font-bold text-slate-900 text-sm block">Kaggle / UCI Cleveland</span>
            <span className="text-[10px] text-slate-500">14 clinical features</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Total Cohort Records</span>
            <span className="font-bold text-slate-900 text-sm block font-mono">{ds.total_samples} samples</span>
            <span className="text-[10px] text-slate-500">{ds.unique_patients} unique patients</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Partition Split</span>
            <span className="font-bold text-slate-900 text-sm block font-mono">70% / 15% / 15%</span>
            <span className="text-[10px] text-slate-500">{ds.train_samples} Train / {ds.test_samples} Test</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Ensemble Strategy</span>
            <span className="font-bold text-brand-700 text-sm block">Performance-Weighted</span>
            <span className="text-[10px] text-slate-500">35% DNN + 30% MLP + 35% TabNet</span>
          </div>
        </div>
      </div>

      {/* 1. Main Model Comparison Table */}
      <ModelPerformanceTable metrics={report.metrics_summary || []} />

      {/* 2. Interactive Charts (ROC Curve & Confusion Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ROCCurveChart curves={report.roc_curves || []} />
        <ConfusionMatrixView matrices={report.confusion_matrices || []} />
      </div>

      {/* 3. Global Feature Importance Rankings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Global Feature Importance Rankings across Models
            </h3>
            <p className="text-xs text-slate-500">
              Comparative attribution rankings derived from TabNet attention steps and neural gradient weighting.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {report.feature_importances.map((item, idx) => (
            <div
              key={item.feature}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center text-[10px]">
                  #{idx + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{item.feature_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.feature}</span>
                </div>
              </div>

              {/* Attribution Scores Pill */}
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <div className="text-slate-600">
                  <span className="text-[10px] text-slate-400 block font-sans">DNN</span>
                  <span className="font-bold">{(item.dnn_score * 100).toFixed(1)}%</span>
                </div>
                <div className="text-slate-600">
                  <span className="text-[10px] text-slate-400 block font-sans">MLP</span>
                  <span className="font-bold">{(item.mlp_score * 100).toFixed(1)}%</span>
                </div>
                <div className="text-slate-600">
                  <span className="text-[10px] text-slate-400 block font-sans">TabNet</span>
                  <span className="font-bold">{(item.tabnet_score * 100).toFixed(1)}%</span>
                </div>
                <div className="text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xl border border-brand-200">
                  <span className="text-[10px] text-brand-600 block font-sans font-bold">Ensemble</span>
                  <span className="font-extrabold">{(item.ensemble_score * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalDisclaimer />
    </div>
  );
};
