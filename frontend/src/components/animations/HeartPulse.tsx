import React from 'react';

interface HeartPulseProps {
  size?: number;
  className?: string;
  pulsing?: boolean;
}

export const HeartPulse: React.FC<HeartPulseProps> = ({ size = 48, className = '', pulsing = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {pulsing && (
        <div
          className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping"
          style={{ width: size * 1.3, height: size * 1.3, margin: `-${size * 0.15}px` }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 transition-transform text-brand-600 ${pulsing ? 'animate-heart-pulse' : ''}`}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="currentColor"
          className="drop-shadow-sm"
        />
        {/* Subtle inner cardiac chamber lines */}
        <path
          d="M12 6.5v9M8.5 10.5h7"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};
