import React from 'react';
import { User, Activity, Stethoscope, CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { num: 1, label: 'Profile', sub: 'Demographics', icon: User },
    { num: 2, label: 'Vitals', sub: 'BP & Lipids', icon: Activity },
    { num: 3, label: 'Clinical', sub: 'ECG & Stress', icon: Stethoscope },
    { num: 4, label: 'Review', sub: 'AI Execution', icon: CheckCircle },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0 rounded-full" />
        {/* Active progress fill */}
        <div
          className="absolute top-5 left-8 h-1 bg-brand-600 -z-0 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 88}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <button
              key={step.num}
              onClick={() => onStepClick(step.num)}
              disabled={step.num > currentStep && !isCompleted}
              className={`flex flex-col items-center relative z-10 group focus:outline-none transition-transform ${
                step.num <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-brand-500/30 scale-110 ring-4 ring-brand-100'
                    : isCompleted
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="mt-2 text-center">
                <span className={`block text-xs font-bold ${isCurrent ? 'text-brand-700' : 'text-slate-700'}`}>
                  {step.label}
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400">{step.sub}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
