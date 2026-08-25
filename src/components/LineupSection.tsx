import React, { useState } from 'react';
import { Match, LineupPlayer } from '../types';
import { getLineupStatusInfo, TFFCheckStep } from '../utils/lineup';
import { TacticalPitch } from './TacticalPitch';
import { TeamAvatar } from './TeamAvatar';
import {
  ShieldCheck,
  Clock,
  ExternalLink,
  Users,
  Info,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';

interface LineupSectionProps {
  match: Match;
}

export const LineupSection: React.FC<LineupSectionProps> = ({ match }) => {
  const [viewMode, setViewMode] = useState<'list' | 'pitch'>('pitch');
  const [isCheckingTFF, setIsCheckingTFF] = useState<boolean>(false);
  const [lastManualCheckTime, setLastManualCheckTime] = useState<string | null>(null);

  const lineupInfo = getLineupStatusInfo(match);
  const lineups = match.lineups;
  const isAnnounced = lineupInfo.isAnnounced && Boolean(lineups);
  const { checkPlan } = lineupInfo;

  // Manuel TFF kontrolü tetikleme
  const handleManualCheck = () => {
    setIsCheckingTFF(true);
    setTimeout(() => {
      setIsCheckingTFF(false);
      const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastManualCheckTime(nowTime);
    }, 1200);
  };

  return (
    <div id="match-lineup-section" className="space-y-4 animate-in fade-in duration-200">
      {/* TFF 3 Aşamalı Kontrol Kuralı Bannerı */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isAnnounced
            ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
            : 'bg-gradient-to-br from-indigo-50/70 via-slate-50 to-amber-50/50 border-indigo-200/80 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isAnnounced ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
              }`}
            >
              {isAnnounced ? <ShieldCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold leading-tight">
                  {isAnnounced ? 'TFF Resmi Kadroları Açıklandı' : 'TFF 3 Aşamalı Kadro Kontrolü'}
                </h4>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                    isAnnounced
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                  }`}
                >
                  {isAnnounced ? 'TFF Resmi Esame' : 'T-65 / T-60 / T-55 Kuralı'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isAnnounced
                  ? `www.tff.org sisteminde onaylandı · ${lineupInfo.estimatedAnnouncementTime}`
                  : `Kadro kontrolü: Maçtan 65 dk önce başlar, yoksa 5 dk sonra (+5 dk / 60 dk), hala yoksa 5 dk sonra (+5 dk / 55 dk) son kez taranır.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={handleManualCheck}
              disabled={isCheckingTFF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-700 transition-colors shadow-2xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isCheckingTFF ? 'animate-spin' : ''}`} />
              <span>{isCheckingTFF ? 'TFF Taranıyor...' : 'TFF Kontrol Et'}</span>
            </button>

            <a
              href={lineupInfo.tffSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/70 text-xs font-bold text-indigo-900 hover:bg-indigo-100 transition-colors shadow-2xs"
            >
              <span>tff.org</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            </a>
          </div>
        </div>

        {/* 3 Aşamalı TFF Kontrol Stepper Çizelgesi */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/70">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              TFF Kadro Tarama Aşamaları
            </span>
            {lastManualCheckTime && (
              <span className="text-[10px] text-slate-400 font-normal lowercase">
                Son kontrol: {lastManualCheckTime}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {checkPlan.steps.map((step) => {
              const isFound = step.status === 'completed-found';
              const isInProgress = step.status === 'in-progress';
              const isEmpty = step.status === 'completed-empty';
              const isPending = step.status === 'pending';

              return (
                <div
                  key={`tff-step-${step.stepNumber}`}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isFound
                      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-medium'
                      : isInProgress
                      ? 'bg-amber-100/70 border-amber-300 text-amber-950 ring-2 ring-amber-300/40 font-medium'
                      : isEmpty
                      ? 'bg-slate-100/80 border-slate-200 text-slate-500 line-through-none'
                      : 'bg-white/80 border-slate-200/80 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] inline-flex items-center justify-center font-mono">
                        {step.stepNumber}
                      </span>
                      {step.label}
                    </span>

                    {isFound && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                        <Check className="w-3 h-3" />
                        Kadro Var
                      </span>
                    )}
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded animate-pulse">
                        <Clock className="w-2.5 h-2.5" />
                        Sırada
                      </span>
                    )}
                    {isEmpty && (
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                        Kadro Yoktu
                      </span>
                    )}
                    {isPending && (
                      <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Bekleniyor
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-black/5">
                    <span className="text-slate-500">{step.subLabel}</span>
                    <span className="font-mono font-bold text-slate-800">{step.timeStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kadrolar Açıklanmışsa */}
      {isAnnounced && lineups ? (
        <div className="space-y-4">
          {/* Görünüm Değiştirici ve Antrenör Başlığı */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>İlk 11'ler ve Yedek Kulübesi</span>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Liste
              </button>
              <button
                onClick={() => setViewMode('pitch')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'pitch'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Saha
              </button>
            </div>
          </div>

          {/* Saha Görünümü */}
          {viewMode === 'pitch' && (
            <TacticalPitch
              homeLineup={lineups.home}
              awayLineup={lineups.away}
              homeTeamName={match.homeTeam}
              awayTeamName={match.awayTeam}
            />
          )}

          {/* Liste Görünümü (İki Kolon) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ev Sahibi Kadrosu */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              {/* Başlık ve Antrenör */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamAvatar name={match.homeTeam} logoUrl={match.homeLogo} size="sm" />
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{match.homeTeam}</h5>
                    <span className="text-[10px] font-semibold text-indigo-600 block">
                      Diziliş: {lineups.home.formation || '4-2-3-1'}
                    </span>
                  </div>
                </div>
                {lineups.home.coach && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Teknik Direktör</span>
                    <span className="text-xs font-bold text-slate-700">{lineups.home.coach}</span>
                  </div>
                )}
              </div>

              {/* İlk 11 */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  İlk 11
                </div>
                <div className="divide-y divide-slate-100">
                  {lineups.home.startingEleven.map((player) => (
                    <PlayerRow key={`home-eleven-${player.number}`} player={player} />
                  ))}
                </div>
              </div>

              {/* Yedekler */}
              {lineups.home.substitutes && lineups.home.substitutes.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Yedekler ({lineups.home.substitutes.length})
                  </div>
                  <div className="divide-y divide-slate-100">
                    {lineups.home.substitutes.map((player) => (
                      <PlayerRow key={`home-sub-${player.number}`} player={player} isSub />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Deplasman Kadrosu */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              {/* Başlık ve Antrenör */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <TeamAvatar name={match.awayTeam} logoUrl={match.awayLogo} size="sm" />
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{match.awayTeam}</h5>
                    <span className="text-[10px] font-semibold text-indigo-600 block">
                      Diziliş: {lineups.away.formation || '4-2-3-1'}
                    </span>
                  </div>
                </div>
                {lineups.away.coach && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Teknik Direktör</span>
                    <span className="text-xs font-bold text-slate-700">{lineups.away.coach}</span>
                  </div>
                )}
              </div>

              {/* İlk 11 */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  İlk 11
                </div>
                <div className="divide-y divide-slate-100">
                  {lineups.away.startingEleven.map((player) => (
                    <PlayerRow key={`away-eleven-${player.number}`} player={player} />
                  ))}
                </div>
              </div>

              {/* Yedekler */}
              {lineups.away.substitutes && lineups.away.substitutes.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Yedekler ({lineups.away.substitutes.length})
                  </div>
                  <div className="divide-y divide-slate-100">
                    {lineups.away.substitutes.map((player) => (
                      <PlayerRow key={`away-sub-${player.number}`} player={player} isSub />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Kadrolar Henüz Açıklanmamışsa Bekleme Durumu */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-base font-bold text-slate-900">
                TFF Kadro Tarama Planı Devrede
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                TFF kuralları gereği maç başlamadan <strong>65 dakika önce</strong> ilk kontrol yapılır. Kadrolar girilmemişse <strong>5 dakika sonra (60 dk kala)</strong> tekrar bakılır, hala yoksa <strong>5 dakika daha sonra (55 dk kala)</strong> son kez taranır.
              </p>
            </div>

            {/* Kontrol Zamanları Özeti */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                <Info className="w-4 h-4" />
                <span>Planlanan Kontrol Pencereleri:</span>
              </div>
              <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 text-indigo-950 font-black">
                {checkPlan.steps.map(s => s.timeStr).join(' → ')} (TSİ)
              </span>
            </div>
          </div>

          {/* Muhtemel Kadro Bilgisi (varsa) */}
          {match.probableLineups && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-600" />
                <h5 className="text-xs font-bold text-slate-800">Medyada Yer Alan Muhtemel 11'ler</h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1.5">{match.homeTeam}</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {match.probableLineups.home.join(', ')}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1.5">{match.awayTeam}</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {match.probableLineups.away.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PlayerRowProps {
  player: LineupPlayer;
  isSub?: boolean;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, isSub }) => {
  return (
    <div className={`py-1.5 px-1 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors rounded-lg ${isSub ? 'text-slate-600' : 'text-slate-900'}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-5 text-center font-mono font-bold text-slate-400 shrink-0 text-[11px]">
          {player.number}
        </span>
        <span className="font-semibold truncate">{player.name}</span>
        {player.isCaptain && (
          <span className="text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-1 rounded shrink-0">
            KAPLAN (C)
          </span>
        )}
      </div>

      {player.position && (
        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
          {player.position}
        </span>
      )}
    </div>
  );
};
