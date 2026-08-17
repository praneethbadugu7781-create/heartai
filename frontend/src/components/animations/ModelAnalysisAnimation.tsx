import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Cpu, Shield, Sparkles, Network } from 'lucide-react';
import { ECGWaveform } from './ECGWaveform';

interface ModelAnalysisAnimationProps {
  onComplete: () => void;
}

export const ModelAnalysisAnimation: React.FC<ModelAnalysisAnimationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Standardizing Clinical Features', desc: 'Validating vitals, scaling distributions, and mapping non-linear clinical dimensions.', icon: Activity },
    { title: 'Executing Deep Neural Network (DNN)', desc: 'Evaluating 4-layer dense representations with batch normalization.', icon: Network },
    { title: 'Running Multi-Layer Perceptron (MLP)', desc: 'Calculating baseline parametric decision boundaries and LeakyReLU features.', icon: Cpu },
    { title: 'Extracting TabNet Sparse Attention', desc: 'Isolating key decision masks and individual patient feature attributions.', icon: Shield },
    { title: 'Calibrating Multi-Model Ensemble', desc: 'Synthesizing weighted probabilities and risk severity stratification.', icon: Sparkles },
    { title: 'Generating Personalized Lifestyle Insights', desc: 'Formulating cardioprotective lifestyle pillars and doctor discussion topics.', icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 700);
    const timer2 = setTimeout(() => setCurrentStep(2), 1400);
    const timer3 = setTimeout(() => setCurrentStep(3), 2100);
    const timer4 = setTimeout(() => setCurrentStep(4), 2800);
    const timer5 = setTimeout(() => setCurrentStep(5), 3400);
    const timer6 = setTimeout(() => onComplete(), 4100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Top Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
            <span>AI Risk Estimation in Progress</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Analyzing Your Cardiac Profile
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Processing multiple machine learning models in parallel to evaluate your cardiovascular risk indicators.
          </p>
        </div>

        {/* Real-Time ECG Monitor Waveform */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-6 shadow-inner relative">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 px-2">
            <span className="flex items-center gap-1.5 font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE HEMODYNAMIC TELEMETRY
            </span>
            <span className="font-mono text-rose-400 font-bold">78 BPM</span>
          </div>
          <ECGWaveform height={75} bpm={82} color="#F43F5E" />
        </div>

        {/* Phased Execution Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <div
                key={step.title}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-brand-50/80 border border-brand-200/90 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50/60 opacity-90'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isCurrent
                      ? 'bg-brand-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-brand-950' : 'text-slate-800'}`}>
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                        Running...
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-semibold text-emerald-600">Done</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Progress Track */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Overall Model Pipeline</span>
            <span className="text-brand-600 font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-rose-500 to-rose-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
