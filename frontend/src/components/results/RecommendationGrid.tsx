import React from 'react';
import { RecommendationItem } from '../../services/types';
import {
  Utensils,
  Activity,
  Moon,
  Sparkles,
  LineChart,
  ShieldAlert,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

interface RecommendationGridProps {
  recommendations: RecommendationItem[];
}

export const RecommendationGrid: React.FC<RecommendationGridProps> = ({ recommendations }) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nutrition':
        return Utensils;
      case 'physical activity':
        return Activity;
      case 'sleep':
        return Moon;
      case 'stress management':
        return Sparkles;
      case 'monitoring & biometrics':
        return LineChart;
      case 'professional care':
      default:
        return ShieldAlert;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">High Priority</span>;
    }
    if (priority === 'medium') {
      return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Key Pillar</span>;
    }
    return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Standard Habit</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          Personalized Lifestyle Intelligence & Guidance
        </h3>
        <p className="text-xs text-slate-500">
          Evidence-based cardiovascular health recommendations tailored to your unique vital metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((rec) => {
          const Icon = getCategoryIcon(rec.category);

          return (
            <div
              key={rec.category}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Category & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                      {rec.category}
                    </span>
                  </div>
                  {getPriorityBadge(rec.priority)}
                </div>

                {/* Title & Summary */}
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{rec.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.summary}</p>
                </div>

                {/* Actionable Points */}
                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {rec.actionable_points.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
