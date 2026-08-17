import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface MedicalDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 text-rose-900 text-xs ${className}`}>
        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Educational Assessment Notice:</strong> HeartGuard AI produces model-predicted risk estimations for educational awareness. It is <strong>NOT</strong> a medical diagnosis. For health decisions or emergencies, consult a qualified physician immediately.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/90 via-slate-50 to-rose-50/60 border border-rose-200/70 shadow-soft text-slate-800 ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
            <span>Official Medical & Algorithmic Safety Disclaimer</span>
          </h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            HeartGuard AI is an experimental cardiovascular risk calculation platform powered by trained Deep Neural Networks (DNN), Multi-Layer Perceptrons (MLP), and TabNet tabular attention architectures. This platform does <strong>NOT</strong> provide medical diagnoses, treatment prescriptions, or clinical guarantees. Never modify or discontinue prescribed medications based on algorithmic scores. If you experience severe chest tightness, left arm/jaw pain, or acute shortness of breath, please seek emergency medical attention immediately.
          </p>
        </div>
      </div>
    </div>
  );
};
