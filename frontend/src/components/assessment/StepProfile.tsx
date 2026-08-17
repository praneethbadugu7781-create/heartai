import React from 'react';
import { HealthInput } from '../../services/types';
import { User, Users, HeartPulse, HelpCircle } from 'lucide-react';

interface StepProfileProps {
  data: HealthInput;
  onChange: (field: keyof HealthInput, val: any) => void;
  onNext: () => void;
}

export const StepProfile: React.FC<StepProfileProps> = ({ data, onChange, onNext }) => {
  const chestPainTypes = [
    { value: 0, label: 'Typical Angina', desc: 'Substernal chest pressure or squeezing provoked by exertion/stress, relieved by rest.' },
    { value: 1, label: 'Atypical Angina', desc: 'Chest discomfort meeting some, but not all, classic ischemic features.' },
    { value: 2, label: 'Non-Anginal Pain', desc: 'Sharp, positional, or fleeting discomfort unlikely related to coronary ischemia.' },
    { value: 3, label: 'Asymptomatic', desc: 'No active chest discomfort or sensations reported.' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">Step 01 of 04</span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
          Personal Profile & Symptoms
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Begin by providing foundational demographic characteristics and any chest sensations.
        </p>
      </div>

      {/* Field 1: Age */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <User className="w-4 h-4 text-brand-600" />
            <span>Age (Years)</span>
          </label>
          <span className="text-base font-extrabold text-brand-600 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200/70">
            {data.age} yrs
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Age is a primary non-modifiable risk indicator reflecting cumulative arterial exposure over time.
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min={18}
            max={95}
            value={data.age}
            onChange={(e) => onChange('age', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>18 yrs</span>
            <span>45 yrs</span>
            <span>65 yrs</span>
            <span>95 yrs</span>
          </div>
        </div>
      </div>

      {/* Field 2: Biological Sex */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-brand-600" />
          <span>Biological Sex</span>
        </label>
        <p className="text-[11px] text-slate-500">
          Clinical risk curves differ statistically between biological male and female phenotypes in population studies.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange('sex', 1)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              data.sex === 1
                ? 'border-brand-600 bg-brand-50/60 text-brand-900 shadow-sm font-bold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="text-base block mb-0.5 font-bold">Male</span>
            <span className="text-[11px] text-slate-500">Dataset code: 1</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('sex', 0)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              data.sex === 0
                ? 'border-brand-600 bg-brand-50/60 text-brand-900 shadow-sm font-bold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="text-base block mb-0.5 font-bold">Female</span>
            <span className="text-[11px] text-slate-500">Dataset code: 0</span>
          </button>
        </div>
      </div>

      {/* Field 3: Chest Pain Type (cp) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-brand-600" />
            <span>Chest Discomfort / Angina Phenotype</span>
          </label>
          <span className="text-[11px] font-semibold text-slate-400">Clinical code: cp</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Select the option that most closely resembles your sensations or clinical history.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {chestPainTypes.map((cp) => {
            const isSelected = data.cp === cp.value;
            return (
              <button
                key={cp.value}
                type="button"
                onClick={() => onChange('cp', cp.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm">{cp.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-brand-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{cp.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center gap-2"
        >
          <span>Continue to Health Vitals</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
