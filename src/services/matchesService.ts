import { API_CONFIG } from '../config/api';
import { loadMatchesFromCache, saveMatchesToCache } from '../storage/cache';
import { FetchMatchesResult, Match } from '../types';
import { formatLastUpdatedTime } from '../utils/date';
import { getDemoMatches } from './demoMatches';

/**
 * Gelen ham veriyi Match tipine güvenli normalize eder.
 */
function normalizeMatchData(raw: any, index: number): Match | null {
  if (!raw || typeof raw !== 'object') return null;

  const homeTeam = typeof raw.homeTeam === 'string' ? raw.homeTeam.trim() : '';
  const awayTeam = typeof raw.awayTeam === 'string' ? raw.awayTeam.trim() : '';
  const competition = typeof raw.competition === 'string' ? raw.competition.trim() : 'Futbol Karşılaşması';
  const startAt = typeof raw.startAt === 'string' ? raw.startAt.trim() : '';

  if (!homeTeam || !awayTeam || !startAt) {
    return null;
  }

  // Broadcasters her zaman dizi olmalı
  let broadcasters: string[] = [];
  if (Array.isArray(raw.broadcasters)) {
    broadcasters = raw.broadcasters.filter((b: any) => typeof b === 'string' && b.trim().length > 0);
  } else if (typeof raw.broadcaster === 'string' && raw.broadcaster.trim().length > 0) {
    broadcasters = [raw.broadcaster.trim()];
  }

  const id = typeof raw.id === 'string' && raw.id.trim().length > 0 ? raw.id.trim() : `match-remote-${index}`;

  return {
    id,
    startAt,
    timezone: typeof raw.timezone === 'string' ? raw.timezone : API_CONFIG.DEFAULT_TIMEZONE,
    competition,
    homeTeam,
    awayTeam,
    broadcasters,
    sourceUrl: typeof raw.sourceUrl === 'string' ? raw.sourceUrl : undefined,
    sourceSite: typeof raw.sourceSite === 'string' ? raw.sourceSite : undefined,
    sourceSiteName: typeof raw.sourceSiteName === 'string' ? raw.sourceSiteName : undefined,
    homeLogo: typeof raw.homeLogo === 'string' ? raw.homeLogo : undefined,
    awayLogo: typeof raw.awayLogo === 'string' ? raw.awayLogo : undefined,
    stadium: typeof raw.stadium === 'string' ? raw.stadium : undefined,
    referee: typeof raw.referee === 'string' ? raw.referee : undefined,
    round: typeof raw.round === 'string' ? raw.round : undefined,
    weather: typeof raw.weather === 'string' ? raw.weather : undefined,
    missingPlayers: Array.isArray(raw.missingPlayers) ? raw.missingPlayers : undefined,
    lineups: raw.lineups ? raw.lineups : undefined,
    lineupPublishedAt: typeof raw.lineupPublishedAt === 'string' ? raw.lineupPublishedAt : undefined,
    isDemo: Boolean(raw.isDemo),
    notes: typeof raw.notes === 'string' ? raw.notes : undefined,
  };
}

/**
 * Maç verilerini API, Önbellek veya Demo kaynağından güvenli biçimde çeker.
 */
export async function fetchMatches(): Promise<FetchMatchesResult> {
  const apiUrl = API_CONFIG.MATCHES_API_URL;

  // 1. API URL'si yoksa doğrudan Demo verisine geç
  if (!apiUrl) {
    const demoData = getDemoMatches();
    // Demo verisini önbelleğe de yazalım
    await saveMatchesToCache(demoData);
    return {
      matches: demoData,
      status: 'demo',
      lastUpdated: formatLastUpdatedTime(new Date().toISOString()),
      isCacheFallback: false,
    };
  }

  // 2. Uzak API çağrısı (Timeout ve Hata Yönetimli)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (API_CONFIG.MATCHES_API_KEY) {
      headers['Authorization'] = `Bearer ${API_CONFIG.MATCHES_API_KEY}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}: Maç servisi yanıt vermedi.`);
    }

    const rawJson = await response.json();
    const rawList = Array.isArray(rawJson) ? rawJson : Array.isArray(rawJson?.data) ? rawJson.data : [];

    const normalizedList: Match[] = rawList
      .map((item: any, idx: number) => normalizeMatchData(item, idx))
      .filter((item: Match | null): item is Match => item !== null);

    if (normalizedList.length > 0) {
      await saveMatchesToCache(normalizedList);
      return {
        matches: normalizedList,
        status: 'live',
        lastUpdated: formatLastUpdatedTime(new Date().toISOString()),
        isCacheFallback: false,
      };
    }

    // API boş liste döndüyse
    return {
      matches: [],
      status: 'live',
      lastUpdated: formatLastUpdatedTime(new Date().toISOString()),
      isCacheFallback: false,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (process.env.NODE_ENV !== 'production') {
      console.warn('[MatchesService] Ağ/API Hatası:', error?.message || error);
    }

    // 3. Ağ hatasında Önbelleği (Cache) dene
    const cached = await loadMatchesFromCache();
    if (cached && cached.matches.length > 0) {
      return {
        matches: cached.matches,
        status: 'cache',
        lastUpdated: formatLastUpdatedTime(cached.updatedAt),
        isCacheFallback: true,
        errorMessage: 'İnternet bağlantısı kesildi veya sunucuya ulaşılamadı. Son kaydedilen veriler gösteriliyor.',
      };
    }

    // 4. Önbellek de yoksa kontrollü biçimde Demo verisine geç
    const fallbackDemo = getDemoMatches();
    return {
      matches: fallbackDemo,
      status: 'demo',
      lastUpdated: formatLastUpdatedTime(new Date().toISOString()),
      isCacheFallback: true,
      errorMessage: 'Maç verilerine şu anda ulaşılamıyor. Örnek rehber verileri gösteriliyor.',
    };
  }
}
