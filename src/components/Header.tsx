import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Bell, Radio, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  activeRemindersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isRefreshing,
  activeRemindersCount = 0,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="app-header"
      className="pt-4 pb-3.5 px-4 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shrink-0 select-none sticky top-0 z-30 shadow-xs"
      role="banner"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        {/* Sol Alan: Logo & Başlık */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 text-white font-black text-sm shadow-md ring-2 ring-indigo-200/60"
              aria-hidden="true"
            >
              TR
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                Türk Maç Rehberi
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                TFF & Yayıncı Canlı
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Önümüzdeki 7 günün tüm resmi maçları, saatleri ve yayıncıları
            </p>
          </div>
        </div>

        {/* Sağ Alan: TSİ Canlı Saat & Yenileme */}
        <div className="flex items-center gap-2">
          {/* Canlı Türkiye Saati */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-700 border border-slate-200 text-xs font-mono font-bold shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>TSİ {currentTime || '--:--:--'}</span>
          </div>

          {/* Aktif Hatırlatıcı Rozeti (varsa) */}
          {activeRemindersCount > 0 && (
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs"
              title={`${activeRemindersCount} maç için bildirim aktif`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
              <span>{activeRemindersCount}</span>
            </div>
          )}

          {/* Yenile Butonu */}
          {onRefresh && (
            <button
              id="header-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-200/80 active:scale-95 ${
                isRefreshing ? 'animate-spin text-indigo-600 bg-indigo-50 border-indigo-200' : ''
              }`}
              aria-label="Maç listesini yenile"
              title="Yenile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
