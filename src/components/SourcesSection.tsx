import React, { useState } from 'react';
import { VERIFIED_SOURCES } from '../config/sources';
import { SourceLink } from '../types';

export const SourcesSection: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const handleOpenSource = (source: SourceLink) => {
    if (source.url) {
      // Güvenli pencere açma (target=_blank, rel=noopener noreferrer)
      window.open(source.url, '_blank', 'noopener,noreferrer');
    } else {
      setActiveNotification(`${source.name} için harici bağlantı yapılandırılmadı.`);
      setTimeout(() => setActiveNotification(null), 3000);
    }
  };

  return (
    <footer id="sources-section" className="mt-8 mb-6 pt-6 border-t border-slate-200/80 space-y-4 select-none">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Kaynaklar — kendin doğrula
        </h2>
        <p className="text-xs text-slate-500">
          Bir bilgiden emin değilsen asıl siteden kontrol edebilirsin.
        </p>
      </div>

      {activeNotification && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800" role="alert">
          {activeNotification}
        </div>
      )}

      {/* Kaynak Kartları Izgarası */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {VERIFIED_SOURCES.map((source) => (
          <button
            key={source.id}
            id={`source-btn-${source.id}`}
            type="button"
            onClick={() => handleOpenSource(source)}
            className="flex flex-col items-start p-3 bg-white hover:bg-indigo-50/50 active:bg-indigo-100/60 border border-slate-200/80 hover:border-indigo-200 rounded-xl text-left transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`${source.name} kaynağını yeni sekmede aç`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600">
                {source.category}
              </span>
              <svg
                className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 truncate w-full">
              {source.name}
            </span>
          </button>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-[11px] text-slate-400">
          Türk Maç Rehberi v1.0.0 · Türkiye Saat Dilimi (UTC+3)
        </p>
      </div>
    </footer>
  );
};
