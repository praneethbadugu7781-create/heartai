import React from 'react';
import { HealthInput } from '../../services/types';
import { Activity, Droplets, Zap, Heart } from 'lucide-react';

interface StepVitalsProps {
  data: HealthInput;
  onChange: (field: keyof HealthInput, val: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepVitals: React.FC<StepVitalsProps> = ({ data, onChange, onNext, onPrev }) => {
  // Blood pressure classification helper
  const getBpStatus = (bp: number) => {
    if (bp < 120) return { label: 'Optimal (<120 mmHg)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bp < 130) return { label: 'Elevated (120-129 mmHg)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (bp < 140) return { label: 'Stage 1 Hypertension (130-139 mmHg)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Stage 2 Hypertension (≥140 mmHg)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  // Cholesterol classification helper
  const getCholStatus = (chol: number) => {
    if (chol < 200) return { label: 'Desirable (<200 mg/dL)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (chol < 240) return { label: 'Borderline High (200-239 mg/dL)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'High Plaque Risk (≥240 mg/dL)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const bpStatus = getBpStatus(data.trestbps);
  const cholStatus = getCholStatus(data.chol);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">Step 02 of 04</span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
          Vital Biomarkers & Hemodynamics
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Input resting cardiovascular vitals and laboratory lipid markers.
        </p>
      </div>

      {/* Field 1: Resting Blood Pressure */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-brand-600" />
            <span>Resting Blood Pressure (Systolic)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${bpStatus.color}`}>
              {bpStatus.label}
            </span>
            <span className="text-base font-extrabold text-slate-900 bg-slate-100 px-3 py-0.5 rounded-xl">
              {data.trestbps} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Systolic measurement in mm Hg taken while seated and at rest.
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min={90}
            max={200}
            step={1}
            value={data.trestbps}
            onChange={(e) => onChange('trestbps', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>90 mmHg (Low)</span>
            <span>120 (Optimal)</span>
            <span>140 (Stage 2)</span>
            <span>200 mmHg</span>
          </div>
        </div>
      </div>

      {/* Field 2: Serum Cholesterol */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-brand-600" />
            <span>Serum Total Cholesterol</span>
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cholStatus.color}`}>
              {cholStatus.label}
            </span>
            <span className="text-base font-extrabold text-slate-900 bg-slate-100 px-3 py-0.5 rounded-xl">
              {data.chol} <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Total circulating serum lipid concentration in mg/dL.
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min={120}
            max={500}
            step={2}
            value={data.chol}
            onChange={(e) => onChange('chol', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>120 mg/dL</span>
            <span>200 (Optimal)</span>
            <span>240 (High)</span>
            <span>500 mg/dL</span>
          </div>
        </div>
      </div>

      {/* Field 3: Fasting Blood Sugar (fbs) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-brand-600" />
          <span>Fasting Blood Sugar &gt; 120 mg/dL</span>
        </label>
        <p className="text-[11px] text-slate-500">
          Indicates whether your fasting plasma glucose exceeds 120 mg/dL (correlating with pre-diabetic or diabetic metabolic states).
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange('fbs', 0)}
            className={`p-3.5 rounded-xl border-2 text-center transition-all ${
              data.fbs === 0
                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="text-sm block font-bold">≤ 120 mg/dL (Normal)</span>
            <span className="text-[10px] text-slate-500">Dataset code: 0</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('fbs', 1)}
            className={`p-3.5 rounded-xl border-2 text-center transition-all ${
              data.fbs === 1
                ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-bold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="text-sm block font-bold">&gt; 120 mg/dL (Elevated)</span>
            <span className="text-[10px] text-slate-500">Dataset code: 1</span>
          </button>
        </div>
      </div>

      {/* Field 4: Maximum Heart Rate (thalach) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-brand-600" />
            <span>Maximum Heart Rate Achieved (`thalach`)</span>
          </label>
          <span className="text-base font-extrabold text-brand-600 bg-brand-50 px-3 py-0.5 rounded-xl border border-brand-200/70">
            {data.thalach} <span className="text-[10px] font-normal text-slate-500">bpm</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Peak heart rate in beats per minute reached during cardiovascular stress testing or peak exertion.
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min={70}
            max={210}
            value={data.thalach}
            onChange={(e) => onChange('thalach', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>70 bpm</span>
            <span>120 bpm</span>
            <span>160 bpm</span>
            <span>210 bpm</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center gap-2"
        >
          <span>Continue to Clinical Tests</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
