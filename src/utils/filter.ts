import { Match, MatchDay } from '../types';
import { formatDaySectionLabel, getIstanbulDateKey, parseSafeDate } from './date';

/**
 * Türkçe karakter duyarlı metin normalizasyonu
 * (Büyük/küçük harf, noktalama ve Türkçe harf dönüşümleri)
 */
export function normalizeTurkishText(text: string): string {
  if (!text) return '';
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .trim();
}

/**
 * Arama sorgusuna göre maçları filtreler (Takım adı ve Yayıncı adı)
 */
export function filterMatches(matches: Match[], query: string): Match[] {
  const normalizedQuery = normalizeTurkishText(query);
  if (!normalizedQuery) return matches;

  return matches.filter((match) => {
    const home = normalizeTurkishText(match.homeTeam);
    const away = normalizeTurkishText(match.awayTeam);
    const competition = normalizeTurkishText(match.competition);
    const broadcasters = match.broadcasters.map(normalizeTurkishText).join(' ');

    return (
      home.includes(normalizedQuery) ||
      away.includes(normalizedQuery) ||
      competition.includes(normalizedQuery) ||
      broadcasters.includes(normalizedQuery)
    );
  });
}

/**
 * Maçları tarihlerine göre kronolojik sıralar ve günlere göre gruplar.
 */
export function groupMatchesByDay(matches: Match[]): MatchDay[] {
  // Önce maçları başlama saatine göre artan sırada diz
  const sortedMatches = [...matches].sort((a, b) => {
    const timeA = new Date(a.startAt).getTime() || 0;
    const timeB = new Date(b.startAt).getTime() || 0;
    return timeA - timeB;
  });

  const groupMap = new Map<string, Match[]>();

  for (const match of sortedMatches) {
    const parsedDate = parseSafeDate(match.startAt);
    if (!parsedDate) continue; // Geçersiz tarihli maçları güvenle atla

    const dateKey = getIstanbulDateKey(parsedDate);
    const existing = groupMap.get(dateKey) || [];
    existing.push(match);
    groupMap.set(dateKey, existing);
  }

  const result: MatchDay[] = [];
  for (const [dateKey, dayMatches] of groupMap.entries()) {
    const { label, isToday } = formatDaySectionLabel(dateKey);
    result.push({
      dateKey,
      label,
      isToday,
      matches: dayMatches,
    });
  }

  return result;
}

/**
 * Kararlı ve çakışmayan benzersiz maç kimliği (id yoksa fallback)
 */
export function getStableMatchKey(match: Match, index?: number): string {
  if (match.id && match.id.trim().length > 0) {
    return match.id;
  }
  const cleanHome = match.homeTeam.replace(/\s+/g, '-').toLowerCase();
  const cleanAway = match.awayTeam.replace(/\s+/g, '-').toLowerCase();
  const time = match.startAt.replace(/[:.\s]/g, '-');
  return `match-${cleanHome}-${cleanAway}-${time}-${index ?? 0}`;
}
