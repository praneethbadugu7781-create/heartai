import React from 'react';
import {
  Activity,
  Shield,
  Sparkles,
  ArrowRight,
  Cpu,
  Network,
  CheckCircle2,
  Lock,
  Heart,
  TrendingUp,
  LineChart,
  Stethoscope,
  Info
} from 'lucide-react';
import { ECGWaveform } from '../components/animations/ECGWaveform';
import { HeartPulse } from '../components/animations/HeartPulse';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

interface LandingPageProps {
  onStartAssessment: () => void;
  onExploreModels: () => void;
  onViewMethodology: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onExploreModels,
  onViewMethodology
}) => {
  const steps = [
    { num: '01', title: 'Enter Health Information', desc: 'Provide non-invasive demographic, vital, and resting clinical test markers with our guided wizard.' },
    { num: '02', title: 'Triple-AI Analysis', desc: 'Our ML backend simultaneously evaluates your profile across DNN, MLP, and TabNet architectures.' },
    { num: '03', title: 'Model Comparison', desc: 'Compare independent model probabilities and verify consensus across diverse mathematical frameworks.' },
    { num: '04', title: 'Estimated Risk Insights', desc: 'Receive a transparent, calibrated ensemble risk tier with Explainable AI feature attributions.' },
    { num: '05', title: 'Lifestyle Intelligence', desc: 'Get personalized lifestyle guidance across Nutrition, Physical Activity, Sleep, Stress, and Care.' }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pt-8 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
              <span>AI-POWERED HEART HEALTH RISK INTELLIGENCE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
              Understand Your Heart Health With <span className="text-brand-600 underline decoration-brand-300 underline-offset-8">AI</span>.
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
              Assess your estimated cardiovascular risk using multiple transparent machine-learning models (DNN, MLP, TabNet) and receive personalized lifestyle insights.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                onClick={onStartAssessment}
                className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-700 hover:to-rose-700 text-white px-8 py-4 rounded-2xl text-sm sm:text-base font-extrabold shadow-xl shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>Start Health Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreModels}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm sm:text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-soft hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-brand-600" />
                <span>Explore AI Tech & Models</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="block text-xl font-extrabold text-slate-900 font-sans">3 Models</span>
                <span className="text-[11px] text-slate-500">DNN + MLP + TabNet</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-brand-600 font-sans">0.936 AUC</span>
                <span className="text-[11px] text-slate-500">Empirical Test Split</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-slate-900 font-sans">100% XAI</span>
                <span className="text-[11px] text-slate-500">Attention Masks</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-elevated border border-slate-200/80 space-y-5">
              {/* Cardiac Monitor Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <HeartPulse size={24} />
                  <span className="font-bold text-xs text-slate-900">Live Cardiac Telemetry Sim</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Feed
                </span>
              </div>

              {/* Real-time ECG Waveform Canvas */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1 px-1">
                  <span>LEAD II • 25mm/s</span>
                  <span className="text-rose-400 font-bold">72 BPM</span>
                </div>
                <ECGWaveform height={80} bpm={72} color="#F43F5E" />
              </div>

              {/* Floating Health Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Resting Blood Pressure</span>
                  <span className="text-base font-extrabold text-slate-900 block font-mono">124 mmHg</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Optimal Range</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Serum Lipids</span>
                  <span className="text-base font-extrabold text-slate-900 block font-mono">198 mg/dL</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Desirable Target</span>
                </div>
              </div>

              {/* AI Multi-Model Assessment Badge */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-brand-50 to-rose-50 border border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span className="font-bold text-brand-950">Multi-Model Ensemble</span>
                </div>
                <span className="text-xs font-extrabold text-brand-700 bg-white px-2.5 py-1 rounded-xl shadow-xs">
                  Lower Risk (18.4%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED TECHNOLOGY (DNN + MLP + TabNet) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-brand-600 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Robust Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Three Independent Machine Learning Architectures
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Rather than relying on a single model, HeartGuard AI trains three fundamentally different model paradigms for balanced statistical consensus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Model 1: DNN */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-brand-600 font-bold uppercase">Model 01</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Deep Neural Network (DNN)</h3>
              <p className="text-xs text-slate-500 mt-1">4 Dense Layers with Batch Normalization & Dropout</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Captures complex, non-linear interactions across combined biometric markers (e.g. cholesterol coupled with resting BP and ST depression).
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Test ROC-AUC:</span>
              <span className="font-bold text-slate-900">0.936</span>
            </div>
          </div>

          {/* Model 2: MLP */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-rose-600 font-bold uppercase">Model 02</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Multi-Layer Perceptron (MLP)</h3>
              <p className="text-xs text-slate-500 mt-1">2-Layer Baseline with LeakyReLU & Weight Decay</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides a compact, highly regularized baseline that avoids overfitting on smaller clinical cohorts and tests linear-threshold boundaries.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Test ROC-AUC:</span>
              <span className="font-bold text-slate-900">0.922</span>
            </div>
          </div>

          {/* Model 3: TabNet */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-amber-600 font-bold uppercase">Model 03</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">TabNet Attention Network</h3>
              <p className="text-xs text-slate-500 mt-1">Sequential Attentive Transformers & Sparse Masks</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employs sparse attention to isolate the most clinically critical features at each decision step, delivering high interpretability.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Test ROC-AUC:</span>
              <span className="font-bold text-slate-900">0.916</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (5 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 mb-10">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-wider">Step-by-Step Experience</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">How HeartGuard AI Works</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A transparent, medically safe workflow designed to provide actionable cardiovascular health insights in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-2xl font-extrabold text-brand-400 font-mono block">{s.num}</span>
                <h4 className="font-bold text-sm text-white">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY MULTIPLE MODELS? & EXPLAINABLE AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Why Multiple Models */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-brand-600 text-xs font-bold uppercase tracking-wider">
                <Network className="w-4 h-4" />
                <span>Multi-Model Rationale</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Why Use Multiple Models?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In clinical tabular risk assessment, single-model architectures can suffer from inductive biases. By deploying a deep network (DNN), a compact baseline (MLP), and an attention network (TabNet), HeartGuard AI cross-validates predictions and flags divergent cases where models express clinical uncertainty.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Ensemble Strategy:</span>
              <span className="text-brand-600 font-bold">Performance-Weighted Calibration</span>
            </div>
          </div>

          {/* Explainable AI */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-brand-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Explainability</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Zero Black-Box Predictions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every assessment report displays exact feature attributions generated directly from model attention weights and saliency maps. Users see which biomarkers increased estimated risk (e.g. resting BP &gt; 140 mmHg) and which acted protectively (e.g. normal resting ECG).
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Interpretability:</span>
              <span className="text-brand-600 font-bold">Directional Attribution &amp; Insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY PLEDGE & MEDICAL DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <MedicalDisclaimer />
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 via-rose-600 to-rose-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-brand-500/20 space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-balance">
            Check Your Estimated Heart Health Risk Today
          </h2>
          <p className="text-xs sm:text-base text-rose-100 max-w-lg mx-auto leading-relaxed">
            Take 3 minutes to input your health vitals and receive a multi-model AI risk evaluation with personalized lifestyle guidance.
          </p>
          <button
            onClick={onStartAssessment}
            className="bg-white hover:bg-slate-50 text-brand-700 font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all inline-flex items-center gap-2"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
