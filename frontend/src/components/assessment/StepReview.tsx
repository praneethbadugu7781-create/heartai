import React from 'react';
import { HealthInput } from '../../services/types';
import { Sparkles, User, Activity, Stethoscope, Edit2, ShieldCheck, AlertCircle } from 'lucide-react';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface StepReviewProps {
  data: HealthInput;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({ data, onEditStep, onSubmit, isLoading }) => {
  const getChestPainLabel = (cp: number) => {
    const map = ['Typical Angina', 'Atypical Angina', 'Non-Anginal Discomfort', 'Asymptomatic'];
    return map[cp] || `Code ${cp}`;
  };

  const getRestEcgLabel = (ecg: number) => {
    const map = ['Normal Sinus Rhythm', 'ST-T Wave Abnormality', 'Left Ventricular Hypertrophy'];
    return map[ecg] || `Code ${ecg}`;
  };

  const getSlopeLabel = (slope: number) => {
    const map = ['Upsloping', 'Flat', 'Downsloping'];
    return map[slope] || `Code ${slope}`;
  };

  const getThalLabel = (thal: number) => {
    const map = ['Unknown', 'Normal Perfusion', 'Fixed Defect', 'Reversible Defect'];
    return map[thal] || `Code ${thal}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">Step 04 of 04</span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
          Review & Execute AI Assessment
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verify your physiological data before sending it to the multi-model machine learning inference engine.
        </p>
      </div>

      {/* Summary Section 1: Demographics & Chest Pain */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <User className="w-4 h-4 text-brand-600" />
            <span>Personal Profile & Chest Symptoms</span>
          </div>
          <button
            onClick={() => onEditStep(1)}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age</span>
            <span className="font-bold text-slate-900 text-sm">{data.age} years</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Biological Sex</span>
            <span className="font-bold text-slate-900 text-sm">{data.sex === 1 ? 'Male' : 'Female'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Chest Pain Phenotype</span>
            <span className="font-bold text-slate-900 text-sm">{getChestPainLabel(data.cp)}</span>
          </div>
        </div>
      </div>

      {/* Summary Section 2: Vitals & Lipids */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Activity className="w-4 h-4 text-brand-600" />
            <span>Resting Biomarkers & Vitals</span>
          </div>
          <button
            onClick={() => onEditStep(2)}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Resting Blood Pressure</span>
            <span className="font-bold text-slate-900 text-sm">{data.trestbps} mmHg</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Serum Cholesterol</span>
            <span className="font-bold text-slate-900 text-sm">{data.chol} mg/dL</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Fasting Blood Sugar</span>
            <span className="font-bold text-slate-900 text-sm">{data.fbs === 1 ? '> 120 mg/dL' : '≤ 120 mg/dL'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Heart Rate</span>
            <span className="font-bold text-slate-900 text-sm">{data.thalach} bpm</span>
          </div>
        </div>
      </div>

      {/* Summary Section 3: Clinical & ECG */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Stethoscope className="w-4 h-4 text-brand-600" />
            <span>Electrocardiography & Nuclear Findings</span>
          </div>
          <button
            onClick={() => onEditStep(3)}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Resting ECG</span>
            <span className="font-bold text-slate-900 text-sm truncate block">{getRestEcgLabel(data.restecg)}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Exercise Angina</span>
            <span className="font-bold text-slate-900 text-sm">{data.exang === 1 ? 'Yes (Reported)' : 'No (None)'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">ST Depression (`oldpeak`)</span>
            <span className="font-bold text-slate-900 text-sm">{data.oldpeak.toFixed(1)} mm</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">ST Slope</span>
            <span className="font-bold text-slate-900 text-sm">{getSlopeLabel(data.slope)}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Coronary Fluoroscopy</span>
            <span className="font-bold text-slate-900 text-sm">{data.ca} {data.ca === 1 ? 'vessel' : 'vessels'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Nuclear Perfusion</span>
            <span className="font-bold text-slate-900 text-sm truncate block">{getThalLabel(data.thal)}</span>
          </div>
        </div>
      </div>

      {/* Medical Safety Disclaimer */}
      <MedicalDisclaimer compact />

      {/* CTA Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-brand-600 via-rose-600 to-rose-700 hover:from-brand-700 hover:to-rose-800 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-brand-600/25 hover:shadow-brand-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Execute Multi-Model AI Heart Health Assessment</span>
          <span>→</span>
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Runs synchronized inference across Deep Neural Network, Multi-Layer Perceptron, and TabNet Attention models.
        </p>
      </div>
    </div>
  );
};
