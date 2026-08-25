import React, { useState } from 'react';
import { Match } from '../types';
import { formatMatchTime } from '../utils/date';
import { getStableMatchKey } from '../utils/filter';
import { getLineupStatusInfo } from '../utils/lineup';
import { TeamAvatar } from './TeamAvatar';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import {
  Bell,
  BellRing,
  CalendarPlus,
  Tv,
  ChevronRight,
  ExternalLink,
  Download,
  ShieldCheck,
} from 'lucide-react';

interface MatchCardProps {
  match: Match;
  index: number;
  onSelect?: (match: Match) => void;
  isReminderActive?: boolean;
  onToggleReminder?: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  index,
  onSelect,
  isReminderActive = false,
  onToggleReminder,
}) => {
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const timeFormatted = formatMatchTime(match.startAt);
  const cardId = getStableMatchKey(match, index);
  const hasBroadcasters = match.broadcasters && match.broadcasters.length > 0;
  const lineupInfo = getLineupStatusInfo(match);

  // Ekran okuyucu için tam erişilebilir metin
  const accessibilityLabel = `${match.competition}, ${timeFormatted} saatinde ${match.homeTeam} ile ${match.awayTeam} maçı. Detaylar, kadrolar ve yayın bilgisi.`;

  const handleCardClick = (e: React.MouseEvent) => {
    // Tıklanan eleman buton veya link ise kart tıklamasını tetikleme
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    if (onSelect) {
      onSelect(match);
    }
  };

  const handleToggleReminderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleReminder) {
      onToggleReminder(match);
    }
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarMenuOpen((prev) => !prev);
  };

  const handleGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarMenuOpen(false);
    const url = generateGoogleCalendarUrl(match);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarMenuOpen(false);
    downloadIcsFile(match);
  };

  return (
    <article
      id={cardId}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all select-none relative cursor-pointer"
      aria-label={accessibilityLabel}
    >
      {/* Üst Satır: Lig Bilgisi, Bildirim Butonu, Takvim Butonu ve Saat Rozeti */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Lig Bilgisi */}
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider truncate">
            {match.competition || 'Futbol'}
          </span>
          {match.round && (
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
              · {match.round}
            </span>
          )}
          {lineupInfo.isAnnounced ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kadrolar Açıklandı (TFF)
            </span>
          ) : lineupInfo.checkPlan.isPollingActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              TFF Taraması Devrede ({lineupInfo.checkPlan.currentAttempt}. Aşama)
            </span>
          ) : null}
        </div>

        {/* Sağ Üst: Aksiyon Butonları & Saat */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Bildirim / Alert Butonu */}
          <button
            type="button"
            onClick={handleToggleReminderClick}
            className={`p-1.5 rounded-lg border transition-all ${
              isReminderActive
                ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50'
            }`}
            title={isReminderActive ? 'Bildirim devrede (İptal etmek için tıklayın)' : 'Maç için bildirim kur'}
            aria-label={isReminderActive ? 'Bildirimi iptal et' : 'Maç bildirimi kur'}
          >
            {isReminderActive ? (
              <BellRing className="w-3.5 h-3.5 text-amber-500 animate-wiggle" />
            ) : (
              <Bell className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Takvime Ekle Menüsü */}
          <div className="relative">
            <button
              type="button"
              onClick={handleCalendarClick}
              className={`p-1.5 rounded-lg border transition-all ${
                calendarMenuOpen
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50'
              }`}
              title="Takvime Ekle (Google / iCal)"
              aria-label="Takvime Ekle"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
            </button>

            {calendarMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleGoogleCalendar}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  Google Takvim
                </button>
                <button
                  onClick={handleDownloadIcs}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center gap-2 transition-colors border-t border-slate-100"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  iCal (.ics Dosyası)
                </button>
              </div>
            )}
          </div>

          {/* Saat Rozeti */}
          <div className="flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded-lg font-bold text-xs sm:text-sm tracking-tight shrink-0 shadow-xs">
            <time dateTime={match.startAt}>{timeFormatted}</time>
          </div>
        </div>
      </div>

      {/* Orta Alan: Takım Logoları ve İsimleri */}
      <div className="flex items-center justify-between gap-3 py-2 my-0.5">
        {/* Ev Sahibi */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5 text-left">
          <TeamAvatar name={match.homeTeam} logoUrl={match.homeLogo} size="md" />
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors truncate">
              {match.homeTeam}
            </h2>
            <span className="text-[10px] font-medium text-slate-400 block">Ev Sahibi</span>
          </div>
        </div>

        {/* Ayırıcı / VS */}
        <div className="shrink-0 px-2 flex flex-col items-center justify-center" aria-hidden="true">
          <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
            VS
          </span>
        </div>

        {/* Deplasman */}
        <div className="flex-1 min-w-0 flex items-center justify-end gap-2.5 text-right">
          <div className="min-w-0 text-right">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors truncate">
              {match.awayTeam}
            </h2>
            <span className="text-[10px] font-medium text-slate-400 block">Deplasman</span>
          </div>
          <TeamAvatar name={match.awayTeam} logoUrl={match.awayLogo} size="md" />
        </div>
      </div>

      {/* Alt Satır: Yayıncı Kanallar ve Kaynak Bilgisi */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-medium text-slate-400 shrink-0">Yayın:</span>
          {hasBroadcasters ? (
            match.broadcasters.map((channel, cIdx) => (
              <span
                key={`${cardId}-bc-${cIdx}`}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100/80"
              >
                <Tv className="w-3 h-3 mr-1 text-indigo-500" />
                {channel}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-500 bg-slate-100">
              Yayıncı henüz açıklanmadı
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {match.sourceSiteName && (
            <a
              href={match.sourceUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              title={`Resmi Kaynak: ${match.sourceSiteName}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {match.sourceSiteName}
            </a>
          )}

          <span className="inline-flex items-center text-[11px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            Detaylar <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
