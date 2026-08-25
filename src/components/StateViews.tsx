import React from 'react';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = 'Maçlar yükleniyor...' }) => (
  <div
    id="loading-view"
    className="py-16 flex flex-col items-center justify-center text-center space-y-4 px-4 select-none"
    role="status"
    aria-live="polite"
  >
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
    </div>
    <div className="space-y-1">
      <p className="text-base font-semibold text-slate-800">{message}</p>
      <p className="text-xs text-slate-400">Türkiye saatiyle güncel fikstür hazırlanıyor</p>
    </div>
  </div>
);

interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'Maç verilerine şu anda ulaşılamıyor.',
  onRetry,
}) => (
  <div
    id="error-view"
    className="py-12 px-6 bg-white rounded-2xl border border-red-100 text-center space-y-4 shadow-sm select-none"
    role="alert"
  >
    <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>

    <div className="space-y-1 max-w-sm mx-auto">
      <h3 className="text-base font-bold text-slate-900">{message}</h3>
      <p className="text-xs text-slate-500">
        Ağ bağlantınızı kontrol edebilir veya yerel rehber verileriyle tekrar deneyebilirsiniz.
      </p>
    </div>

    <button
      id="retry-btn"
      type="button"
      onClick={onRetry}
      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
      aria-label="Maç verilerini tekrar yüklemeyi dene"
    >
      Tekrar dene
    </button>
  </div>
);

interface EmptyViewProps {
  message?: string;
  onRefresh?: () => void;
}

export const EmptyView: React.FC<EmptyViewProps> = ({
  message = 'Gösterilecek maç bulunamadı.',
  onRefresh,
}) => (
  <div
    id="empty-view"
    className="py-14 px-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4 select-none"
  >
    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <div className="space-y-1">
      <p className="text-base font-semibold text-slate-800">{message}</p>
      <p className="text-xs text-slate-400">Önümüzdeki 7 gün için planlanan maç bulunmuyor.</p>
    </div>
    {onRefresh && (
      <button
        type="button"
        onClick={onRefresh}
        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
      >
        Fikstürü Yenile
      </button>
    )}
  </div>
);

interface NoSearchResultsViewProps {
  query: string;
  onClear: () => void;
}

export const NoSearchResultsView: React.FC<NoSearchResultsViewProps> = ({ query, onClear }) => (
  <div
    id="no-search-results-view"
    className="py-12 px-6 bg-white rounded-2xl border border-slate-200 text-center space-y-4 select-none"
    role="status"
  >
    <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <div className="space-y-1">
      <p className="text-base font-bold text-slate-900">Aramanızla eşleşen maç bulunamadı.</p>
      <p className="text-xs text-slate-500">
        &quot;{query}&quot; araması için sonuç yok. Takım veya yayıncı kanal adını kontrol edebilirsiniz.
      </p>
    </div>
    <button
      id="clear-search-btn"
      type="button"
      onClick={onClear}
      className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
      aria-label="Aramayı temizle ve tüm maçları göster"
    >
      Aramayı Temizle
    </button>
  </div>
);
