import { Match, MatchLineup } from '../types';
import { parseSafeDate, formatMatchTime } from './date';

/**
 * TFF Talimatlarına ve Kullanıcı Kurallarına Göre Kadro Sorgulama Takvimi:
 * 1. Adım: Maç başlamadan 65 dakika önce ilk kontrol (T-65)
 * 2. Adım: Eğer açıklanmamışsa 5 dakika sonra tekrar kontrol (T-60 / Maça 1 saat kala)
 * 3. Adım: Eğer hala açıklanmamışsa 5 dakika sonra son kez kontrol (T-55)
 */

export interface TFFCheckStep {
  stepNumber: 1 | 2 | 3;
  minutesBeforeKickoff: 65 | 60 | 55;
  targetTime: Date | null;
  timeStr: string;
  label: string;
  subLabel: string;
  status: 'pending' | 'in-progress' | 'completed-empty' | 'completed-found';
  description: string;
}

export interface LineupStatusInfo {
  isAnnounced: boolean;
  statusText: string;
  badgeColor: 'emerald' | 'amber' | 'slate' | 'indigo';
  estimatedAnnouncementTime: string;
  minutesUntilAnnouncement?: number;
  minutesUntilMatch?: number;
  tffSourceUrl: string;
  // 3 Aşamalı TFF Kontrol Planı
  checkPlan: {
    currentAttempt: 1 | 2 | 3 | 0;
    maxAttempts: 3;
    steps: TFFCheckStep[];
    nextCheckTime: string | null;
    nextCheckMinutes: number | null;
    scheduleSummary: string;
    isPollingActive: boolean;
    allAttemptsExhausted: boolean;
  };
}

export function getLineupStatusInfo(match: Match): LineupStatusInfo {
  const matchDate = parseSafeDate(match.startAt);
  const now = new Date();
  const tffSourceUrl = match.sourceUrl && match.sourceUrl.includes('tff.org')
    ? match.sourceUrl
    : 'https://www.tff.org/default.aspx?pageID=198';

  const hasLineupData = Boolean(
    match.lineups &&
    match.lineups.isOfficialTFF &&
    match.lineups.home &&
    match.lineups.home.startingEleven &&
    match.lineups.home.startingEleven.length > 0
  );

  // Maç tarihi geçersizse fallback
  if (!matchDate) {
    return {
      isAnnounced: hasLineupData,
      statusText: hasLineupData ? 'TFF Resmi Kadroları Açıklandı' : 'Kadro Durumu Bekleniyor',
      badgeColor: hasLineupData ? 'emerald' : 'slate',
      estimatedAnnouncementTime: 'Maçtan 65-55 dk önce',
      tffSourceUrl,
      checkPlan: {
        currentAttempt: 0,
        maxAttempts: 3,
        steps: [],
        nextCheckTime: null,
        nextCheckMinutes: null,
        scheduleSummary: 'TFF sorgulama zamanı maç saatine göre planlanır.',
        isPollingActive: false,
        allAttemptsExhausted: false,
      },
    };
  }

  // Maça kalan süre (dakika)
  const diffMs = matchDate.getTime() - now.getTime();
  const minutesUntilMatch = Math.round(diffMs / (60 * 1000));

  // TFF 3 Aşamalı Kontrol Saatleri:
  // 1. Kontrol: T-65 dk
  const step1Date = new Date(matchDate.getTime() - 65 * 60 * 1000);
  const step1TimeStr = formatMatchTime(step1Date.toISOString());

  // 2. Kontrol: T-60 dk (+5 dk)
  const step2Date = new Date(matchDate.getTime() - 60 * 60 * 1000);
  const step2TimeStr = formatMatchTime(step2Date.toISOString());

  // 3. Kontrol (Son): T-55 dk (+5 dk daha)
  const step3Date = new Date(matchDate.getTime() - 55 * 60 * 1000);
  const step3TimeStr = formatMatchTime(step3Date.toISOString());

  // Adımların durumlarını hesapla
  let step1Status: TFFCheckStep['status'] = 'pending';
  let step2Status: TFFCheckStep['status'] = 'pending';
  let step3Status: TFFCheckStep['status'] = 'pending';

  let currentAttempt: 1 | 2 | 3 | 0 = 0;
  let nextCheckTime: string | null = null;
  let nextCheckMinutes: number | null = null;
  let isPollingActive = false;
  let allAttemptsExhausted = false;

  if (hasLineupData) {
    // Kadro bulundu
    if (minutesUntilMatch <= 55) {
      step1Status = 'completed-empty';
      step2Status = 'completed-empty';
      step3Status = 'completed-found';
      currentAttempt = 3;
    } else if (minutesUntilMatch <= 60) {
      step1Status = 'completed-empty';
      step2Status = 'completed-found';
      step3Status = 'pending';
      currentAttempt = 2;
    } else {
      step1Status = 'completed-found';
      step2Status = 'pending';
      step3Status = 'pending';
      currentAttempt = 1;
    }
  } else {
    // Kadro henüz yok
    if (minutesUntilMatch > 65) {
      // 1. kontrol zamanı henüz gelmedi
      currentAttempt = 0;
      nextCheckTime = step1TimeStr;
      nextCheckMinutes = minutesUntilMatch - 65;
      isPollingActive = false;
    } else if (minutesUntilMatch > 60) {
      // 1. kontrol yapıldı, 2. kontrol bekleniyor (5 dk sonra / T-60)
      step1Status = 'completed-empty';
      step2Status = 'in-progress';
      currentAttempt = 1;
      nextCheckTime = step2TimeStr;
      nextCheckMinutes = minutesUntilMatch - 60;
      isPollingActive = true;
    } else if (minutesUntilMatch > 55) {
      // 2. kontrol yapıldı, 3. son kontrol bekleniyor (5 dk sonra / T-55)
      step1Status = 'completed-empty';
      step2Status = 'completed-empty';
      step3Status = 'in-progress';
      currentAttempt = 2;
      nextCheckTime = step3TimeStr;
      nextCheckMinutes = minutesUntilMatch - 55;
      isPollingActive = true;
    } else {
      // 3. son kontrol de yapıldı (T-55 geçti)
      step1Status = 'completed-empty';
      step2Status = 'completed-empty';
      step3Status = 'completed-empty';
      currentAttempt = 3;
      allAttemptsExhausted = true;
      isPollingActive = false;
    }
  }

  const steps: TFFCheckStep[] = [
    {
      stepNumber: 1,
      minutesBeforeKickoff: 65,
      targetTime: step1Date,
      timeStr: step1TimeStr,
      label: '1. TFF Kontrolü (65 dk Kala)',
      subLabel: 'İlk resmi esame kontrolü',
      status: step1Status,
      description: `Maçtan 65 dakika önce (${step1TimeStr}) tff.org sorgulanır.`,
    },
    {
      stepNumber: 2,
      minutesBeforeKickoff: 60,
      targetTime: step2Date,
      timeStr: step2TimeStr,
      label: '2. TFF Kontrolü (60 dk Kala)',
      subLabel: '+5 dk sonra tekrar kontrol',
      status: step2Status,
      description: `1. kontrolde yoksa 5 dk sonra (${step2TimeStr}) 2. kez sorgulanır.`,
    },
    {
      stepNumber: 3,
      minutesBeforeKickoff: 55,
      targetTime: step3Date,
      timeStr: step3TimeStr,
      label: '3. Son TFF Kontrolü (55 dk Kala)',
      subLabel: '+5 dk sonra son kontrol',
      status: step3Status,
      description: `Hala yoksa 5 dk sonra (${step3TimeStr}) 3. ve son kez kontrol edilir.`,
    },
  ];

  if (hasLineupData) {
    return {
      isAnnounced: true,
      statusText: 'TFF Resmi Kadroları Açıklandı',
      badgeColor: 'emerald',
      estimatedAnnouncementTime: match.lineupPublishedAt || `${step1TimeStr} - ${step3TimeStr} arası onaylandı`,
      minutesUntilMatch,
      tffSourceUrl,
      checkPlan: {
        currentAttempt,
        maxAttempts: 3,
        steps,
        nextCheckTime: null,
        nextCheckMinutes: null,
        scheduleSummary: `TFF resmi esame listesi onaylandı (${match.lineupPublishedAt || step2TimeStr}).`,
        isPollingActive: false,
        allAttemptsExhausted: false,
      },
    };
  }

  // Henüz kadro yoksa duruma göre metin üret
  let statusText = `Kadrolar ${step1TimeStr}'de TFF'den Taranacak`;
  let badgeColor: LineupStatusInfo['badgeColor'] = 'amber';

  if (minutesUntilMatch > 65) {
    statusText = `1. Kontrol: ${step1TimeStr} (Maça 65 dk kala)`;
    badgeColor = 'slate';
  } else if (minutesUntilMatch > 60) {
    statusText = `1. Kontrolde yok, 2. Kontrol ${step2TimeStr}'de (60 dk kala)`;
    badgeColor = 'amber';
  } else if (minutesUntilMatch > 55) {
    statusText = `2. Kontrolde yok, Son Kontrol ${step3TimeStr}'de (55 dk kala)`;
    badgeColor = 'indigo';
  } else {
    statusText = '3 TFF Kontrolü Yapıldı (TFF esame bekleniyor)';
    badgeColor = 'amber';
  }

  return {
    isAnnounced: false,
    statusText,
    badgeColor,
    estimatedAnnouncementTime: `${step1TimeStr} (T-65) - ${step3TimeStr} (T-55)`,
    minutesUntilAnnouncement: Math.max(0, minutesUntilMatch - 65),
    minutesUntilMatch,
    tffSourceUrl,
    checkPlan: {
      currentAttempt,
      maxAttempts: 3,
      steps,
      nextCheckTime,
      nextCheckMinutes: nextCheckMinutes !== null ? Math.max(0, nextCheckMinutes) : null,
      scheduleSummary: 'TFF Kuralı: Maçtan 65 dk önce bak, yoksa 5 dk sonra tekrar bak, hala yoksa 5 dk sonra son kez bak.',
      isPollingActive,
      allAttemptsExhausted,
    },
  };
}

