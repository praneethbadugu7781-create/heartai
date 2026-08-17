import React, { useState } from 'react';
import { ROCCurveData } from '../../services/types';
import { TrendingUp } from 'lucide-react';

interface ROCCurveChartProps {
  curves: ROCCurveData[];
}

export const ROCCurveChart: React.FC<ROCCurveChartProps> = ({ curves }) => {
  const [activeModel, setActiveModel] = useState<string | null>(null);

  const colors: Record<string, string> = {
    dnn: '#E11D48',      // Rose Red
    mlp: '#F59E0B',      // Amber
    tabnet: '#0EA5E9',   // Sky Blue
    ensemble: '#059669', // Emerald
  };

  const size = 320;
  const padding = 35;
  const plotWidth = size - padding * 2;
  const plotHeight = size - padding * 2;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span>Receiver Operating Characteristic (ROC)</span>
          </h4>
          <p className="text-xs text-slate-500">True Positive Rate vs False Positive Rate</p>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="flex justify-center py-2">
        <svg width={size} height={size} className="overflow-visible">
          {/* Chart Background */}
          <rect
            x={padding}
            y={padding}
            width={plotWidth}
            height={plotHeight}
            fill="#F8FAFC"
            rx="8"
          />

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((val) => (
            <g key={val}>
              <line
                x1={padding}
                y1={padding + plotHeight * (1 - val)}
                x2={padding + plotWidth}
                y2={padding + plotHeight * (1 - val)}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <line
                x1={padding + plotWidth * val}
                y1={padding}
                x2={padding + plotWidth * val}
                y2={padding + plotHeight}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
            </g>
          ))}

          {/* Diagonal Random Chance Line */}
          <line
            x1={padding}
            y1={padding + plotHeight}
            x2={padding + plotWidth}
            y2={padding}
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />

          {/* ROC Curves */}
          {curves.map((curve) => {
            const color = colors[curve.model_key] || '#E11D48';
            const isFaded = activeModel && activeModel !== curve.model_key;
            const points = curve.points
              .map((pt) => {
                const x = padding + pt.fpr * plotWidth;
                const y = padding + plotHeight - pt.tpr * plotHeight;
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <polyline
                key={curve.model_key}
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={curve.model_key === 'ensemble' ? 3 : 2}
                opacity={isFaded ? 0.2 : 1}
                className="transition-opacity duration-300"
              />
            );
          })}

          {/* Axis Labels */}
          <text x={size / 2} y={size - 5} textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">
            False Positive Rate (1 - Specificity)
          </text>
          <text
            x={10}
            y={size / 2}
            textAnchor="middle"
            transform={`rotate(-90 10 ${size / 2})`}
            className="text-[10px] fill-slate-400 font-mono"
          >
            True Positive Rate (Recall)
          </text>
        </svg>
      </div>

      {/* Legend & AUC Toggles */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
        {curves.map((c) => {
          const color = colors[c.model_key] || '#E11D48';
          const isSelected = activeModel === c.model_key;

          return (
            <button
              key={c.model_key}
              onClick={() => setActiveModel(isSelected ? null : c.model_key)}
              className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                isSelected ? 'border-slate-400 bg-slate-100 font-bold' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-slate-800 font-semibold">{c.model_name}</span>
              </div>
              <span className="font-mono text-slate-500 font-bold">AUC {c.auc.toFixed(3)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
