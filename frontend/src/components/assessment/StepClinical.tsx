import React from 'react';
import { HealthInput } from '../../services/types';
import { Stethoscope, Activity, TrendingUp, Disc, ShieldAlert } from 'lucide-react';

interface StepClinicalProps {
  data: HealthInput;
  onChange: (field: keyof HealthInput, val: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepClinical: React.FC<StepClinicalProps> = ({ data, onChange, onNext, onPrev }) => {
  const restEcgOptions = [
    { value: 0, label: 'Normal Baseline ECG', desc: 'Standard sinus rhythm without diagnostic ST-T abnormality.' },
    { value: 1, label: 'ST-T Wave Abnormality', desc: 'T wave inversions or ST segment elevation/depression > 0.05 mV.' },
    { value: 2, label: 'Left Ventricular Hypertrophy', desc: 'Showing probable or definite LVH by Estes criteria.' },
  ];

  const slopeOptions = [
    { value: 0, label: 'Upsloping', desc: 'Normal rapid upsloping ST recovery after stress.' },
    { value: 1, label: 'Flat', desc: 'Horizontal ST segment indicative of subendocardial workload strain.' },
    { value: 2, label: 'Downsloping', desc: 'Downsloping ST segment correlating with coronary ischemia.' },
  ];

  const thalOptions = [
    { value: 1, label: 'Normal Myocardial Flow', desc: 'Uniform radioactive tracer distribution on nuclear stress test.' },
    { value: 2, label: 'Fixed Perfusion Defect', desc: 'Persistent perfusion deficit representing non-reversible scar tissue.' },
    { value: 3, label: 'Reversible Perfusion Defect', desc: 'Perfusion defect present on exertion that normalizes with rest (ischemia).' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">Step 03 of 04</span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
          Clinical Electrocardiography & Stress Markers
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed physiological indicators derived from resting ECG, exercise stress tests, and imaging.
        </p>
      </div>

      {/* Field 1: Resting ECG (restecg) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-brand-600" />
          <span>Resting Electrocardiogram (`restecg`)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {restEcgOptions.map((opt) => {
            const isSelected = data.restecg === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('restecg', opt.value)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block mb-1">{opt.label}</span>
                <span className="text-[11px] text-slate-500 block leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Field 2: Exercise Induced Angina (exang) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-brand-600" />
          <span>Exercise-Induced Angina (`exang`)</span>
        </label>
        <p className="text-[11px] text-slate-500">
          Did you experience chest discomfort provoked specifically during physical exertion or stress testing?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange('exang', 0)}
            className={`p-3.5 rounded-xl border-2 text-center transition-all ${
              data.exang === 0
                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="text-sm font-bold block">No Angina during Exercise</span>
            <span className="text-[10px] text-slate-500">Dataset code: 0</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('exang', 1)}
            className={`p-3.5 rounded-xl border-2 text-center transition-all ${
              data.exang === 1
                ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-bold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <span className="text-sm font-bold block">Yes (Exercise Angina)</span>
            <span className="text-[10px] text-slate-500">Dataset code: 1</span>
          </button>
        </div>
      </div>

      {/* Field 3: ST Depression (oldpeak) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span>ST Depression Induced by Exercise (`oldpeak`)</span>
          </label>
          <span className="text-base font-extrabold text-brand-600 bg-brand-50 px-3 py-0.5 rounded-xl border border-brand-200/70">
            {data.oldpeak.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">mm</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          ST segment depression relative to baseline measured during peak treadmill stress in millimeters.
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min={0.0}
            max={5.5}
            step={0.1}
            value={data.oldpeak}
            onChange={(e) => onChange('oldpeak', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.0 mm (Normal)</span>
            <span>1.5 mm (Moderate)</span>
            <span>3.0 mm (Significant)</span>
            <span>5.5 mm</span>
          </div>
        </div>
      </div>

      {/* Field 4: Peak Exercise ST Slope */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-brand-600" />
          <span>Peak Exercise ST Segment Slope (`slope`)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {slopeOptions.map((opt) => {
            const isSelected = data.slope === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('slope', opt.value)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block mb-1">{opt.label}</span>
                <span className="text-[11px] text-slate-500 block leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Field 5: Major Coronary Vessels (ca) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Disc className="w-4 h-4 text-brand-600" />
            <span>Major Vessels Colored by Fluoroscopy (`ca`)</span>
          </label>
          <span className="text-base font-extrabold text-slate-900 bg-slate-100 px-3 py-0.5 rounded-xl">
            {data.ca} {data.ca === 1 ? 'vessel' : 'vessels'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Number of major coronary arteries (0-3) showing fluoroscopic contrast dye narrowing.
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {[0, 1, 2, 3].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange('ca', v)}
              className={`p-3 rounded-xl border-2 text-center font-bold text-sm transition-all ${
                data.ca === v
                  ? 'border-brand-600 bg-brand-50/80 text-brand-950 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              {v} {v === 0 ? '(Clean)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Field 6: Thalassemia Perfusion Status (thal) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-brand-600" />
          <span>Nuclear Perfusion Scan / Thalassemia (`thal`)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {thalOptions.map((opt) => {
            const isSelected = data.thal === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('thal', opt.value)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block mb-1">{opt.label}</span>
                <span className="text-[11px] text-slate-500 block leading-tight">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50"
        >
          ← Back to Vitals
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center gap-2"
        >
          <span>Review Assessment Summary</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
