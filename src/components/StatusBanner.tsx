import React from 'react';
import { DataSourceStatus } from '../types';

interface StatusBannerProps {
  status: DataSourceStatus;
  lastUpdated: string;
  isCacheFallback?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  lastUpdated,
  isCacheFallback,
  errorMessage,
  onRetry,
}) => {
  if (status === 'live' && !isCacheFallback) {
    return (
      <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-lg text-xs text-emerald-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span className="font-medium">Güncel Fikstür</span>
        </div>
        <span className="text-emerald-700">Son kontrol: {lastUpdated}</span>
      </div>
    );
  }

  if (isCacheFallback || status === 'cache') {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Son kaydedilen veriler gösteriliyor.</strong> ({lastUpdated})
          </span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="self-end sm:self-auto font-semibold text-amber-800 hover:text-amber-950 underline text-xs"
          >
            Yenilemeyi dene
          </button>
        )}
      </div>
    );
  }

  if (status === 'demo') {
    return (
      <div className="flex items-center justify-between px-3 py-1.5 bg-indigo-50 border border-indigo-200/60 rounded-lg text-xs text-indigo-900">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-indigo-200/70 text-indigo-800 font-bold text-[10px] uppercase tracking-wide">
            Örnek Veri
          </span>
          <span>Önümüzdeki 7 günlük maç rehberi</span>
        </div>
        <span className="text-indigo-600 text-[11px]">Türkiye Saati</span>
      </div>
    );
  }

  return null;
};
