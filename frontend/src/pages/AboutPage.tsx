import React from 'react';
import { Shield, Sparkles, Network, Cpu, Lock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Scientific Foundation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Clinical Methodology &amp; AI Safety
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          HeartGuard AI was engineered to bridge machine learning interpretability with responsible, transparent cardiovascular risk exploration.
        </p>
      </div>

      {/* 1. Medical Scope & Non-Diagnostic Boundary */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Educational Scope &amp; Ethical Healthcare AI</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          HeartGuard AI is designed strictly as an <strong>educational risk-assessment platform</strong>. It does not replace medical diagnostics, clinical electrocardiography, or consultation with a board-certified physician. The model outputs represent statistical associations derived from standardized clinical trial cohorts rather than definitive individual medical diagnoses.
        </p>
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-950 space-y-1">
          <strong className="font-bold block">Guiding Safety Rule:</strong>
          <span>Never initiate, adjust, or discontinue any prescribed cardiovascular medication (such as statins, beta-blockers, or ACE inhibitors) based on algorithmic risk scores.</span>
        </div>
      </section>

      {/* 2. Dataset & Zero-Leakage Pipeline */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          <span>The Training Dataset &amp; Preprocessing Strategy</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          HeartGuard AI is trained on the canonical <strong>Kaggle / UCI Cleveland Heart Disease Database</strong> consisting of 14 key clinical features across hemodynamics, serum chemistry, electrocardiography, nuclear perfusion scans, and coronary fluoroscopy.
        </p>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Zero Data Leakage:</strong> All numerical scaling and median imputations are fitted strictly on the 70% training split. Validation (15%) and test (15%) partitions remain completely unseen during pipeline fitting.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Stratified Sampling:</strong> Splitting preserves exact outcome ratios (54% positive / 46% negative class balance) across all experimental subsets.</span>
          </li>
        </ul>
      </section>

      {/* 3. Triple-Model Ensemble Architecture */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Network className="w-5 h-5 text-brand-600" />
          <span>Triple-Model Machine Learning Ensemble</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <strong className="font-bold text-slate-900 block">DNN (Deep Neural Network)</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              4-layer dense network with Batch Normalization and Dropout to prevent tabular overfitting.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <strong className="font-bold text-slate-900 block">MLP (Multi-Layer Perceptron)</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Compact 2-layer baseline using LeakyReLU activations and L2 weight decay regularization.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <strong className="font-bold text-slate-900 block">TabNet Classifier</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Canonical sequential sparse attention mechanism providing transparent decision masks.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Privacy & Data Security */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <span>Patient Privacy &amp; Data Integrity</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          HeartGuard AI does not require government-issued IDs, insurance numbers, or real personal identities. All assessments are stored under pseudonymous session identifiers. Users retain full rights to delete individual records or clear local history at any time.
        </p>
      </section>

      <MedicalDisclaimer />
    </div>
  );
};
