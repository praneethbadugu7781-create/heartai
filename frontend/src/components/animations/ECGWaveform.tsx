import React, { useEffect, useRef } from 'react';

interface ECGWaveformProps {
  height?: number;
  bpm?: number;
  color?: string;
  className?: string;
  showGrid?: boolean;
}

export const ECGWaveform: React.FC<ECGWaveformProps> = ({
  height = 90,
  bpm = 72,
  color = '#E11D48',
  className = '',
  showGrid = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    canvas.height = height;

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        canvas.height = height;
      }
    };
    window.addEventListener('resize', handleResize);

    // Standard P-Q-R-S-T Normalized Waveform Template
    // Values relative to baseline (0)
    const ecgPattern = [
      0, 0, 0.02, 0.05, 0.08, 0.12, 0.08, 0.03, 0, // P Wave
      0, -0.05, -0.15,                              // Q Dip
      0.2, 0.6, 1.0, 0.4, -0.3,                    // R Peak & S Dip
      -0.08, 0, 0.02,                               // ST Segment
      0.05, 0.12, 0.22, 0.28, 0.22, 0.12, 0.04, 0, // T Wave
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // Isoelectric Baseline
    ];

    let offset = 0;
    const speed = (bpm / 60) * 2.2;
    const midY = height / 2;
    const amplitude = height * 0.38;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Clinical ECG Grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(225, 29, 72, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 16;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 2. Draw Waveform
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(225, 29, 72, 0.35)';
      ctx.shadowBlur = 6;

      const patternLen = ecgPattern.length;
      const stepX = 4.5;

      for (let x = 0; x < width; x += stepX) {
        const patternIndex = Math.floor((x + offset) / stepX) % patternLen;
        const yVal = ecgPattern[patternIndex];
        const y = midY - yVal * amplitude;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 3. Glowing Lead Sweep Cursor
      const cursorX = (width - (offset * 1.5) % width);
      const gradient = ctx.createLinearGradient(cursorX - 40, 0, cursorX, 0);
      gradient.addColorStop(0, 'rgba(225, 29, 72, 0)');
      gradient.addColorStop(1, 'rgba(225, 29, 72, 0.7)');

      ctx.fillStyle = gradient;
      ctx.fillRect(cursorX - 40, 0, 40, height);

      offset += speed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [height, bpm, color, showGrid]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
};
