import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RiskScoreGaugeProps {
  scorePercentage: number;
  category: string;
  severity: 'low' | 'moderate' | 'high';
  agreement: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  scorePercentage,
  category,
  severity,
  agreement
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Animated number count-up
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = scorePercentage / (duration / 20);
    const timer = setInterval(() => {
      start += increment;
      if (start >= scorePercentage) {
        setDisplayScore(scorePercentage);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start * 10) / 10);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [scorePercentage]);

  // Radius and SVG Circle calculations
  const size = 220;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  const getThemeConfig = () => {
    switch (severity) {
      case 'low':
        return {
          strokeColor: '#059669',
          gradientStart: '#10B981',
          gradientEnd: '#059669',
          bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          leadText: 'Favorable Cardiovascular Profile',
          descText: 'Your physiological biomarkers align with lower statistical probability of coronary disease in reference trial data.'
        };
      case 'moderate':
        return {
          strokeColor: '#D97706',
          gradientStart: '#F59E0B',
          gradientEnd: '#D97706',
          bgBadge: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: AlertTriangle,
          leadText: 'Intermediate Cardiovascular Risk',
          descText: 'Certain biomarkers (such as elevated blood pressure or cholesterol) suggest borderline cardiovascular strain.'
        };
      case 'high':
      default:
        return {
          strokeColor: '#E11D48',
          gradientStart: '#FB7185',
          gradientEnd: '#E11D48',
          bgBadge: 'bg-rose-50 text-rose-900 border-rose-200',
          icon: AlertOctagon,
          leadText: 'Elevated Estimated Model Risk',
          descText: 'Multiple predictive clinical markers (e.g. ST depression, elevated vitals) elevated the model risk score.'
        };
    }
  };

  const theme = getThemeConfig();
  const Icon = theme.icon;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      {/* Radial Gauge Visual */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Defs for gradient */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.gradientStart} />
              <stop offset="100%" stopColor={theme.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated active progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
            {displayScore.toFixed(1)}%
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Estimated Risk
          </span>
        </div>
      </div>

      {/* Right Details & Interpretation */}
      <div className="space-y-3 flex-1 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border shadow-sm ${theme.bgBadge}`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span>{category}</span>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {agreement}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          {theme.leadText}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {theme.descText}
        </p>

        <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center md:justify-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span>Synthesized from calibrated DNN, MLP, and TabNet machine learning models.</span>
        </div>
      </div>
    </div>
  );
};
