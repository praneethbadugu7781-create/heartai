import React, { useState } from 'react';
import { ConfusionMatrixData } from '../../services/types';
import { Grid } from 'lucide-react';

interface ConfusionMatrixViewProps {
  matrices: ConfusionMatrixData[];
}

export const ConfusionMatrixView: React.FC<ConfusionMatrixViewProps> = ({ matrices }) => {
  const [selectedKey, setSelectedKey] = useState<string>('ensemble');

  const activeMatrix = matrices.find((m) => m.model_key === selectedKey) || matrices[0];

  if (!activeMatrix) return null;

  const total = activeMatrix.total_test_samples || 154;
  const tnPct = Math.round((activeMatrix.true_negative / total) * 100);
  const fpPct = Math.round((activeMatrix.false_positive / total) * 100);
  const fnPct = Math.round((activeMatrix.false_negative / total) * 100);
  const tpPct = Math.round((activeMatrix.true_positive / total) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-brand-600" />
            <span>Confusion Matrix Heatmap</span>
          </h4>
          <p className="text-xs text-slate-500">Classification distribution across test set</p>
        </div>

        {/* Model Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {matrices.map((m) => (
            <button
              key={m.model_key}
              onClick={() => setSelectedKey(m.model_key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedKey === m.model_key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {m.model_key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 Heatmap */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {/* True Negative */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-emerald-800">
            <span>True Negative (TN)</span>
            <span>{tnPct}%</span>
          </div>
          <span className="text-2xl font-extrabold text-emerald-950 font-mono block">
            {activeMatrix.true_negative}
          </span>
          <p className="text-[10px] text-emerald-700">Correctly classified as lower risk</p>
        </div>

        {/* False Positive */}
        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-rose-800">
            <span>False Positive (FP)</span>
            <span>{fpPct}%</span>
          </div>
          <span className="text-2xl font-extrabold text-rose-950 font-mono block">
            {activeMatrix.false_positive}
          </span>
          <p className="text-[10px] text-rose-700">Incorrectly flagged as higher risk</p>
        </div>

        {/* False Negative */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-amber-800">
            <span>False Negative (FN)</span>
            <span>{fnPct}%</span>
          </div>
          <span className="text-2xl font-extrabold text-amber-950 font-mono block">
            {activeMatrix.false_negative}
          </span>
          <p className="text-[10px] text-amber-700">Missed higher risk profile</p>
        </div>

        {/* True Positive */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-emerald-800">
            <span>True Positive (TP)</span>
            <span>{tpPct}%</span>
          </div>
          <span className="text-2xl font-extrabold text-emerald-950 font-mono block">
            {activeMatrix.true_positive}
          </span>
          <p className="text-[10px] text-emerald-700">Correctly identified higher risk</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center font-mono">
        Total held-out test cohort: {total} patient samples
      </p>
    </div>
  );
};
