import React, { useState } from 'react';
import { Download, FileText, Check, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface ReportDownloadButtonProps {
  assessmentId: string;
  className?: string;
}

export const ReportDownloadButton: React.FC<ReportDownloadButtonProps> = ({
  assessmentId,
  className = ''
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setIsSuccess(false);

    try {
      // Direct window download or blob fetch
      const url = api.getReportPdfUrl(assessmentId);
      const res = await fetch(url);
      if (!res.ok) throw new Error('PDF generation failed');

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `HeartGuard_Risk_Report_${assessmentId.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.warn('Backend PDF endpoint error, triggering browser print report:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all ${className}`}
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
      ) : isSuccess ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <Download className="w-4 h-4 text-brand-400" />
      )}
      <span>{isDownloading ? 'Generating Report...' : isSuccess ? 'Report Downloaded!' : 'Download Assessment PDF Report'}</span>
    </button>
  );
};
