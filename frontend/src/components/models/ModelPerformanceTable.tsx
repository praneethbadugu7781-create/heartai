import React from 'react';
import { MetricDetail } from '../../services/types';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface ModelPerformanceTableProps {
  metrics: MetricDetail[];
}

export const ModelPerformanceTable: React.FC<ModelPerformanceTableProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Empirical Validation</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Multi-Model Evaluation Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Evaluated strictly on the independent 15% held-out test split (154 patient records) with zero data leakage.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
              <th className="py-3 px-4 rounded-l-xl">Model Architecture</th>
              <th className="py-3 px-3">Accuracy</th>
              <th className="py-3 px-3">Precision</th>
              <th className="py-3 px-3">Recall (Sensitivity)</th>
              <th className="py-3 px-3">Specificity</th>
              <th className="py-3 px-3">F1-Score</th>
              <th className="py-3 px-4 rounded-r-xl">ROC-AUC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {metrics.map((m) => {
              const isEnsemble = m.model_key === 'ensemble';

              return (
                <tr
                  key={m.model_key}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isEnsemble ? 'bg-brand-50/40 font-bold text-brand-950' : 'text-slate-700'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {isEnsemble && <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />}
                      <div>
                        <span className="font-bold text-slate-900 block">{m.model_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{m.architecture}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {(m.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">
                    {(m.precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">
                    {(m.recall_sensitivity * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">
                    {(m.specificity * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-brand-700">
                    {(m.f1_score * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                      {m.roc_auc.toFixed(3)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
