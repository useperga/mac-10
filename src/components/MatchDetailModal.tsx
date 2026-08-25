import React, { useState, useEffect } from 'react';
import { Match, MissingPlayer } from '../types';
import { TeamAvatar } from './TeamAvatar';
import { LineupSection } from './LineupSection';
import { formatMatchTime, formatMatchDateTurkish, getRelativeDayLabel } from '../utils/date';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { getLineupStatusInfo } from '../utils/lineup';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Tv,
  Bell,
  BellRing,
  ExternalLink,
  ShieldAlert,
  SunMedium,
  CalendarPlus,
  Download,
  Share2,
  Check,
  Info,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface MatchDetailModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  isReminderActive: boolean;
  onToggleReminder: (match: Match, minutesBefore?: number) => void;
  initialTab?: 'overview' | 'lineups';
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  isOpen,
  onClose,
  isReminderActive,
  onToggleReminder,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lineups'>('overview');
  const [reminderMinutes, setReminderMinutes] = useState<number>(60);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState<boolean>(false);

  // Tab sıfırlama
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab, match?.id]);

  // ESC tuşu ile kapatma dinleyicisi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !match) return null;

  const timeFormatted = formatMatchTime(match.startAt);
  const dateFormatted = formatMatchDateTurkish(match.startAt);
  const relativeDay = getRelativeDayLabel(match.startAt);
  const hasBroadcasters = match.broadcasters && match.broadcasters.length > 0;
  const lineupInfo = getLineupStatusInfo(match);

  // Paylaş / Bağlantı Kopyala
  const handleShare = () => {
    const text = `⚽ ${match.homeTeam} - ${match.awayTeam} | ${match.competition}\n📅 ${dateFormatted} - ${timeFormatted}\n📺 ${
      hasBroadcasters ? match.broadcasters.join(', ') : 'Yayıncı Açıklanmadı'
    }\n${match.sourceUrl || ''}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(match);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    downloadIcsFile(match);
  };

  // Sakat ve cezalı oyuncuları grupla
  const homeMissing = match.missingPlayers?.filter((p) => p.team === 'home') || [];
  const awayMissing = match.missingPlayers?.filter((p) => p.team === 'away') || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-match-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-xl rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-250 transition-all">
        {/* Mobil Tutma Çizgisi (Pull Bar) */}
        <div className="sm:hidden w-full pt-3 pb-1 flex justify-center bg-slate-900">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Modal Başlık Çubuğu */}
        <div className="bg-slate-900 text-white px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span id="modal-match-title" className="text-xs font-semibold uppercase tracking-wider text-slate-300 truncate">
              {match.competition} {match.round ? `· ${match.round}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Maç Bilgisini Kopyala"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal İçerik Gövdesi */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Karşılaşma Bannerı */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl p-5 border border-indigo-100/80">
            <div className="flex items-center justify-between gap-4">
              {/* Ev Sahibi */}
              <div className="flex-1 flex flex-col items-center text-center">
                <TeamAvatar name={match.homeTeam} logoUrl={match.homeLogo} size="lg" className="mb-2" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {match.homeTeam}
                </h3>
                <span className="text-[11px] font-medium text-slate-400 mt-0.5">Ev Sahibi</span>
              </div>

              {/* Orta: Saat ve VS */}
              <div className="shrink-0 flex flex-col items-center justify-center px-2">
                <div className="bg-indigo-600 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-widest shadow-xs mb-1.5">
                  VS
                </div>
                <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {timeFormatted}
                </div>
                <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md mt-0.5">
                  {relativeDay}
                </span>
              </div>

              {/* Deplasman */}
              <div className="flex-1 flex flex-col items-center text-center">
                <TeamAvatar name={match.awayTeam} logoUrl={match.awayLogo} size="lg" className="mb-2" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {match.awayTeam}
                </h3>
                <span className="text-[11px] font-medium text-slate-400 mt-0.5">Deplasman</span>
              </div>
            </div>

            {/* Tarih Şeridi */}
            <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{dateFormatted}</span>
              <span className="text-slate-300">·</span>
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{timeFormatted} (TSİ)</span>
            </div>
          </div>

          {/* Sekmeler (Tab Bar) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-indigo-950 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Genel Bilgiler</span>
            </button>

            <button
              onClick={() => setActiveTab('lineups')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'lineups'
                  ? 'bg-white text-indigo-950 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Kadrolar (TFF)</span>
              {lineupInfo.isAnnounced ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Yayında
                </span>
              ) : (
                <span className="text-[9px] font-medium bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full">
                  ~1 Saat Kala
                </span>
              )}
            </button>
          </div>

          {/* SEKME 1: GENEL BİLGİLER */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Kadro Durum Bildirim Çağrısı (Callout) */}
              <div
                onClick={() => setActiveTab('lineups')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-slate-50 border border-indigo-100 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-200 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-xl shrink-0 ${lineupInfo.isAnnounced ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}>
                    {lineupInfo.isAnnounced ? <ShieldCheck className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {lineupInfo.isAnnounced ? 'İlk 11 Kadroları Açıklandı' : 'Kadro Esame Listeleri'}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${lineupInfo.isAnnounced ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                        {lineupInfo.isAnnounced ? 'TFF Resmi' : 'TFF ~1 Saat'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lineupInfo.isAnnounced
                        ? 'Resmi kadroları ve taktik dizilişi görmek için tıklayın'
                        : `Kadrolar www.tff.org'da ${lineupInfo.estimatedAnnouncementTime} civarında yayınlanacaktır`}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform shrink-0">
                  Kadrolar &rarr;
                </span>
              </div>

              {/* Hızlı Aksiyon Butonları (Bildirim & Takvim) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bildirim Kur Butonu */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-xl ${
                          isReminderActive ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isReminderActive ? <BellRing className="w-4 h-4 animate-wiggle" /> : <Bell className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Maç Bildirimi</h4>
                        <p className="text-[11px] text-slate-500">
                          {isReminderActive ? 'Bildirim devrede' : 'Hatırlatıcı kur'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleReminder(match, reminderMinutes)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isReminderActive
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isReminderActive ? 'İptal Et' : 'Kur'}
                    </button>
                  </div>

                  {!isReminderActive && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="shrink-0">Zaman:</span>
                      {[15, 30, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setReminderMinutes(mins)}
                          className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-colors ${
                            reminderMinutes === mins
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {mins} dk önce
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Takvime Ekle Menüsü */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between gap-2.5 relative">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <CalendarPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Takvime Ekle</h4>
                      <p className="text-[11px] text-slate-500">Cihaz takvimine kaydet</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={handleGoogleCalendar}
                      className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3 h-3 text-indigo-600" />
                      Google Takvim
                    </button>
                    <button
                      onClick={handleDownloadIcs}
                      className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
                    >
                      <Download className="w-3 h-3 text-indigo-600" />
                      iCal (.ics)
                    </button>
                  </div>
                </div>
              </div>

              {/* Maç ve Stat / Hakem Bilgileri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Stat Bilgisi */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">Stadyum</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                      {match.stadium || 'TFF Tarafından Belirlenecek'}
                    </span>
                  </div>
                </div>

                {/* Hakem Bilgisi */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">Hakem</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                      {match.referee || 'MHK Tarafından Açıklanacak'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Canlı Yayın Kanalları & Doğrulanmış Kaynak */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900">Canlı Yayın Bilgisi</h4>
                  </div>
                  {match.sourceSiteName && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {match.sourceSiteName}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {hasBroadcasters ? (
                    match.broadcasters.map((channel, idx) => (
                      <span
                        key={`modal-bc-${idx}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200/80"
                      >
                        <Tv className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                        {channel}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      Resmi yayıncı henüz açıklanmadı
                    </span>
                  )}
                </div>

                {match.sourceUrl && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Resmi Kaynak Doğrulama:</span>
                    <a
                      href={match.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      Sayfayı Aç <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Sakat ve Cezalı Oyuncular Bilgisi */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold text-slate-900">Sakat / Cezalı Oyuncu Durumu</h4>
                </div>

                {homeMissing.length === 0 && awayMissing.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                    Takımlarda henüz resmi olarak açıklanmış kritik bir sakat veya cezalı oyuncu bulunmamaktadır.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Ev Sahibi Eksikler */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">{match.homeTeam}</span>
                      {homeMissing.length > 0 ? (
                        homeMissing.map((p, idx) => (
                          <div
                            key={`home-miss-${idx}`}
                            className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                          >
                            <span className="font-semibold text-slate-800">{p.name}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                p.type === 'cezali'
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.type === 'sakat'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {p.type === 'cezali' ? 'Cezalı' : p.type === 'sakat' ? 'Sakat' : 'Şüpheli'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">Eksik oyuncu yok</span>
                      )}
                    </div>

                    {/* Deplasman Eksikler */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">{match.awayTeam}</span>
                      {awayMissing.length > 0 ? (
                        awayMissing.map((p, idx) => (
                          <div
                            key={`away-miss-${idx}`}
                            className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                          >
                            <span className="font-semibold text-slate-800">{p.name}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                p.type === 'cezali'
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.type === 'sakat'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {p.type === 'cezali' ? 'Cezalı' : p.type === 'sakat' ? 'Sakat' : 'Şüpheli'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">Eksik oyuncu yok</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Hava Durumu ve Notlar */}
              {match.weather && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900">
                  <SunMedium className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Maç Saati Tahmini: <strong>{match.weather}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* SEKME 2: KADROLAR (TFF) */}
          {activeTab === 'lineups' && (
            <LineupSection match={match} />
          )}
        </div>

        {/* Modal Alt Kapatma Çubuğu */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-400">
            Resmi kaynaklar: tff.org, beinsports.com.tr, trtspor.com.tr, aspor.com.tr
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

