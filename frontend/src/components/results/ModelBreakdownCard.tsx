import React from 'react';
import { ModelPredictionDetail } from '../../services/types';
import { Network, Cpu, Shield, Sparkles } from 'lucide-react';

interface ModelBreakdownCardProps {
  models: ModelPredictionDetail[];
  ensemblePercentage: number;
  ensembleRiskCategory: string;
}

export const ModelBreakdownCard: React.FC<ModelBreakdownCardProps> = ({
  models,
  ensemblePercentage,
  ensembleRiskCategory
}) => {
  const getModelIcon = (name: string) => {
    if (name.includes('DNN') || name.includes('Deep Neural')) return Network;
    if (name.includes('MLP') || name.includes('Perceptron')) return Cpu;
    if (name.includes('TabNet')) return Shield;
    return Sparkles;
  };

  const getTierBadge = (pct: number) => {
    if (pct < 35) return { label: 'Lower Risk', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (pct < 65) return { label: 'Moderate Risk', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Higher Risk', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Multi-Model Prediction Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Real outputs from 3 independent machine learning models trained on the heart disease dataset.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {models.map((model) => {
          const Icon = getModelIcon(model.model_name);
          const tier = getTierBadge(model.percentage);

          return (
            <div
              key={model.model_name}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3 relative overflow-hidden group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{model.model_name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block">{model.architecture}</span>
                  </div>
                </div>
              </div>

              {/* Score & Tier */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
                  {model.percentage.toFixed(1)}%
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.bg}`}>
                  {tier.label}
                </span>
              </div>

              {/* Probability Fill Bar */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-1000"
                    style={{ width: `${model.percentage}%` }}
                  />
                </div>
              </div>

              {/* Characteristics footnote */}
              <p className="text-[11px] text-slate-500 leading-tight pt-1 border-t border-slate-100">
                {model.key_characteristics}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
