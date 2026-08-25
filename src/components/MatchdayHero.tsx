import React, { useState, useEffect } from 'react';
import { Match } from '../types';
import { formatMatchTime, formatMatchDateTurkish, parseSafeDate } from '../utils/date';
import { getLineupStatusInfo } from '../utils/lineup';
import { TeamAvatar } from './TeamAvatar';
import { generateGoogleCalendarUrl } from '../utils/calendar';
import {
  Clock,
  Tv,
  Bell,
  BellRing,
  CalendarPlus,
  ShieldCheck,
  MapPin,
  Flame,
  ChevronRight,
  ExternalLink,
  Users,
} from 'lucide-react';

interface MatchdayHeroProps {
  match: Match;
  onSelectMatch: (match: Match) => void;
  isReminderActive: boolean;
  onToggleReminder: (match: Match) => void;
}

export const MatchdayHero: React.FC<MatchdayHeroProps> = ({
  match,
  onSelectMatch,
  isReminderActive,
  onToggleReminder,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isPast: false });

  const matchDate = parseSafeDate(match.startAt);
  const timeFormatted = formatMatchTime(match.startAt);
  const dateFormatted = formatMatchDateTurkish(match.startAt);
  const lineupInfo = getLineupStatusInfo(match);

  // Canlı saniyelik geri sayım sayacı
  useEffect(() => {
    if (!matchDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const diffMs = matchDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [match.startAt]);

  const handleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateGoogleCalendarUrl(match);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasLineup = Boolean(match.lineups && match.lineups.home.startingEleven.length > 0);

  return (
    <div
      id="matchday-hero-card"
      onClick={() => onSelectMatch(match)}
      className="group relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 border border-indigo-900/60 shadow-2xl overflow-hidden cursor-pointer select-none transition-all hover:border-indigo-500/80 hover:shadow-indigo-950/50"
    >
      {/* Arka Plan Işık Efekti (Ambient Glow) */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Çubuk: Canlı Durum Rozeti & Lig Bilgisi */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            Öne Çıkan Maç Günü
          </span>

          <span className="text-xs font-semibold text-slate-300">
            {match.competition} {match.round ? `· ${match.round}` : ''}
          </span>
        </div>

        {/* Canlı Geri Sayım Rozeti */}
        {!timeLeft.isPast ? (
          <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 backdrop-blur px-3 py-1 rounded-full font-mono text-xs font-bold text-amber-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}sa {String(timeLeft.minutes).padStart(2, '0')}dk{' '}
              {String(timeLeft.seconds).padStart(2, '0')}sn
            </span>
          </div>
        ) : (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
            Maç Saati Geldi / Canlı
          </span>
        )}
      </div>

      {/* Orta Alan: Dev Takım Karşılaşması & Kulüp Renkleri */}
      <div className="relative z-10 grid grid-cols-11 items-center gap-2 py-3 my-1">
        {/* Ev Sahibi */}
        <div className="col-span-5 flex items-center gap-3 min-w-0">
          <TeamAvatar name={match.homeTeam} logoUrl={match.homeLogo} size="lg" />
          <div className="min-w-0">
            <h3 className="text-base sm:text-xl font-black text-white group-hover:text-indigo-300 transition-colors truncate">
              {match.homeTeam}
            </h3>
            <span className="text-xs text-slate-400 block font-medium">Ev Sahibi</span>
          </div>
        </div>

        {/* VS / Maç Saati */}
        <div className="col-span-1 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-black text-indigo-400 tracking-widest bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
            VS
          </span>
        </div>

        {/* Deplasman */}
        <div className="col-span-5 flex items-center justify-end gap-3 min-w-0 text-right">
          <div className="min-w-0 text-right">
            <h3 className="text-base sm:text-xl font-black text-white group-hover:text-indigo-300 transition-colors truncate">
              {match.awayTeam}
            </h3>
            <span className="text-xs text-slate-400 block font-medium">Deplasman</span>
          </div>
          <TeamAvatar name={match.awayTeam} logoUrl={match.awayLogo} size="lg" />
        </div>
      </div>

      {/* TFF 3-Aşamalı Kadro Durumu & Bilgi Şeridi */}
      <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Yayıncı Kanal */}
          {match.broadcasters && match.broadcasters.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-900/70 border border-indigo-700/60 text-indigo-200 font-bold shadow-xs">
              <Tv className="w-3.5 h-3.5 text-indigo-400" />
              {match.broadcasters.join(', ')}
            </span>
          )}

          {/* Başlama Saati */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 text-slate-200 font-bold border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {dateFormatted} · {timeFormatted}
          </span>

          {/* TFF Kadro Durumu Rozeti */}
          {hasLineup ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-black">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              TFF 11'leri Onaylandı
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              TFF T-65 Kontrolü Hazır
            </span>
          )}
        </div>

        {/* Hızlı Aksiyon Butonları */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Hatırlatıcı Butonu */}
          <button
            type="button"
            onClick={() => onToggleReminder(match)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isReminderActive
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Maç için 1 saat önce bildirim kur"
          >
            {isReminderActive ? (
              <BellRing className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
            ) : (
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isReminderActive ? 'Hatırlatıcı Aktif' : 'Hatırlat'}</span>
          </button>

          {/* Takvime Ekle */}
          <button
            type="button"
            onClick={handleCalendar}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
            title="Google Takvime Ekle"
          >
            <CalendarPlus className="w-4 h-4 text-indigo-300" />
          </button>

          {/* Detay / Taktik Aç */}
          <button
            type="button"
            onClick={() => onSelectMatch(match)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <span>Taktik & Detay</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
