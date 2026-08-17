import React, { useState } from 'react';
import { TopFactorItem } from '../../services/types';
import { Sparkles, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface FeatureContributionChartProps {
  factors: TopFactorItem[];
}

export const FeatureContributionChart: React.FC<FeatureContributionChartProps> = ({ factors }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Take top 7 factors for clean visual presentation
  const topFactors = factors.slice(0, 7);
  const maxScore = Math.max(...topFactors.map((f) => f.importance_score), 0.15);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable AI (XAI)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            What Influenced Your Estimated Risk?
          </h3>
          <p className="text-xs text-slate-500">
            Feature attributions extracted from TabNet sequential attention masks and neural gradient weighting.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] self-start sm:self-auto">
          <span className="flex items-center gap-1 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Elevates Risk
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Protective Factor
          </span>
        </div>
      </div>

      {/* Feature Attribution List */}
      <div className="space-y-4">
        {topFactors.map((factor) => {
          const isElevating = factor.direction === 'elevates_risk';
          const fillWidth = Math.min(100, Math.max(12, (factor.importance_score / maxScore) * 100));
          const isSelected = selectedFeature === factor.feature;

          return (
            <div
              key={factor.feature}
              onClick={() => setSelectedFeature(isSelected ? null : factor.feature)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-400 bg-slate-50 shadow-sm'
                  : 'border-slate-150 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {/* Feature Header Line */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{factor.feature_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono">
                    {factor.display_value}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {isElevating ? (
                    <span className="flex items-center text-rose-600 font-bold text-[11px] gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Elevates Risk
                    </span>
                  ) : (
                    <span className="flex items-center text-emerald-600 font-bold text-[11px] gap-0.5">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      Protective
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Contribution Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isElevating
                      ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                      : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  }`}
                  style={{ width: `${fillWidth}%` }}
                />
              </div>

              {/* Clinical Insight Detail */}
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-1 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{factor.clinical_insight}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
