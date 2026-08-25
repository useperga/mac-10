import { Match } from '../types';
import { parseSafeDate } from './date';

/**
 * Türk Maç Rehberi - Takvim Entegrasyon Yardımcıları
 * 1. Google Takvim Web Bağlantısı
 * 2. iCal / Apple Takvim / Outlook (.ics dosyası indirme)
 */

// UTC formatında iCalendar tarih dizisi (YYYYMMDDTHHmmssZ)
function formatToIcsDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Google Takvim URL'si oluşturur (Yeni sekmede açılabilir)
 */
export function generateGoogleCalendarUrl(match: Match): string {
  const startDate = parseSafeDate(match.startAt) || new Date();
  // Varsayılan maç süresi: 1 saat 50 dakika (110 dk)
  const endDate = new Date(startDate.getTime() + 110 * 60 * 1000);

  const startUtc = formatToIcsDate(startDate);
  const endUtc = formatToIcsDate(endDate);

  const title = `⚽ ${match.homeTeam} - ${match.awayTeam} (${match.competition})`;
  
  const broadcastersText = match.broadcasters?.length
    ? match.broadcasters.join(', ')
    : 'Açıklanmadı';
    
  const sourceText = match.sourceSiteName
    ? `Kaynak: ${match.sourceSiteName} (${match.sourceUrl || ''})`
    : '';

  const stadiumText = match.stadium ? `Stadyum: ${match.stadium}` : '';
  const refereeText = match.referee ? `Hakem: ${match.referee}` : '';

  const details = [
    `Lig: ${match.competition}${match.round ? ` - ${match.round}` : ''}`,
    `Canlı Yayın: ${broadcastersText}`,
    stadiumText,
    refereeText,
    sourceText,
    '\nTürk Maç Rehberi ile eklendi.',
  ]
    .filter(Boolean)
    .join('\n');

  const location = match.stadium || 'Türkiye';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startUtc}/${endUtc}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * .ics (iCalendar) dosya içeriği oluşturur ve tarayıcıdan indirme başlatır
 */
export function downloadIcsFile(match: Match): void {
  const startDate = parseSafeDate(match.startAt) || new Date();
  const endDate = new Date(startDate.getTime() + 110 * 60 * 1000);
  const now = new Date();

  const startUtc = formatToIcsDate(startDate);
  const endUtc = formatToIcsDate(endDate);
  const stampUtc = formatToIcsDate(now);

  const title = `⚽ ${match.homeTeam} vs ${match.awayTeam} - ${match.competition}`;
  const broadcasters = match.broadcasters?.length ? match.broadcasters.join(', ') : 'Açıklanmadı';
  const location = match.stadium || 'Türkiye';
  const uid = `match-${match.id || Date.now()}@turk-mac-rehberi.app`;

  const descriptionLines = [
    `Karsilasma: ${match.homeTeam} - ${match.awayTeam}`,
    `Lig: ${match.competition}`,
    `Yayin: ${broadcasters}`,
    match.stadium ? `Stadyum: ${match.stadium}` : '',
    match.referee ? `Hakem: ${match.referee}` : '',
    match.sourceUrl ? `Detaylar: ${match.sourceUrl}` : '',
    'Kaynak: Turk Mac Rehberi',
  ].filter(Boolean);

  // iCalendar standart formatı (\r\n satır sonları)
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Turk Mac Rehberi//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stampUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${descriptionLines.join('\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Maç 15 dakika içinde başlayacak: ${match.homeTeam} - ${match.awayTeam}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Güvenli dosya adı üretimi
  const safeHome = match.homeTeam.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeAway = match.awayTeam.toLowerCase().replace(/[^a-z0-9]/g, '-');
  link.download = `mac-${safeHome}-${safeAway}.ics`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
