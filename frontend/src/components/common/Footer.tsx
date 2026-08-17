import React from 'react';
import { Activity, Shield, Heart, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-10 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">HeartGuard<span className="text-brand-500 font-extrabold ml-0.5">AI</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Powered Heart Disease Risk Assessment & Lifestyle Intelligence platform utilizing triple-model deep learning and transparent Explainable AI.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict Privacy: Zero Unencrypted Health Storage</span>
            </div>
          </div>

          {/* Col 2: Platform Navigation */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveTab('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Overview & Architecture
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('assessment'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Start Health Assessment
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('models'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Model Performance Lab (DNN / MLP / TabNet)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('history'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Assessment History & Trends
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Machine Learning & Science */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">ML Models</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-slate-400">
                <span>Deep Neural Network</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-brand-400 rounded">Dense 4-Layer</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>Multi-Layer Perceptron</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-rose-400 rounded">LeakyReLU</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>TabNet Attention</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-amber-400 rounded">Sparse Attention</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>Ensemble Strategy</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-emerald-400 rounded">Calibrated AUC</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Dataset & Compliance */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Data & Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Trained on validated clinical datasets (Kaggle / UCI Cleveland Heart Disease Database) using zero-leakage 70/15/15 stratified partitioning.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              <span>For Educational Research Only</span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HeartGuard AI. Non-diagnostic educational platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Medical Safety First</span>
            <span>•</span>
            <span>Explainable AI</span>
            <span>•</span>
            <span>Ethical Machine Learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
