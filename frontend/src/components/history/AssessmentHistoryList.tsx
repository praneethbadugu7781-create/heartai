import React, { useState, useEffect } from 'react';
import { AssessmentRecord } from '../../services/types';
import { api } from '../../services/api';
import { storage } from '../../services/storage';
import { History, Calendar, Trash2, ArrowRight, ShieldCheck, FileText, Activity } from 'lucide-react';

interface AssessmentHistoryListProps {
  onSelectAssessment: (record: AssessmentRecord) => void;
  onStartNew: () => void;
}

export const AssessmentHistoryList: React.FC<AssessmentHistoryListProps> = ({
  onSelectAssessment,
  onStartNew
}) => {
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setIsLoading(true);
    try {
      // Fetch from API backend
      const records = await api.getAssessments();
      if (records && records.length > 0) {
        setHistory(records);
      } else {
        // Fallback to local storage history
        setHistory(storage.getLocalHistory());
      }
    } catch (e) {
      console.warn('Backend history fetch error, using local storage:', e);
      setHistory(storage.getLocalHistory());
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.deleteAssessment(id);
    } catch (err) {
      console.warn('API delete error, deleting locally:', err);
    }
    storage.removeLocalHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const getTierBadge = (sev: string, cat: string) => {
    if (sev === 'low' || cat.toLowerCase().includes('lower')) {
      return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Lower Risk</span>;
    }
    if (sev === 'moderate' || cat.toLowerCase().includes('moderate')) {
      return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Moderate Risk</span>;
    }
    return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">Higher Risk</span>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-16 space-y-3">
        <Activity className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading previous health records...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-card text-center max-w-lg mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <History className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Assessment History Found</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Complete your first AI heart health risk assessment to see your longitudinal trends and insights here.
        </p>
        <button
          onClick={onStartNew}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Assessment History & Records
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Review past multi-model risk evaluations and tracked physiological parameters.
          </p>
        </div>
        <button
          onClick={onStartNew}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>New Assessment</span>
          <span>+</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((record) => {
          const dateStr = new Date(record.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={record.id}
              onClick={() => onSelectAssessment(record)}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-slate-300 transition-all cursor-pointer space-y-3 relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTierBadge(record.risk_level_severity, record.risk_category)}
                  <button
                    onClick={(e) => handleDelete(e, record.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Score & Models */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 font-sans">
                    {record.risk_percentage?.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5 font-bold uppercase">Estimated Risk</span>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <span>DNN: {(record.dnn_probability * 100).toFixed(0)}% • TabNet: {(record.tabnet_probability * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Vitals Summary Pills */}
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-600 font-medium">
                <span className="px-2 py-0.5 rounded-lg bg-slate-100">
                  BP: {record.health_data?.trestbps} mmHg
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-100">
                  Chol: {record.health_data?.chol} mg/dL
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-100">
                  HR: {record.health_data?.thalach} bpm
                </span>
              </div>

              {/* Footer CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-bold group-hover:text-brand-700">
                <span>View Complete Risk Report</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
