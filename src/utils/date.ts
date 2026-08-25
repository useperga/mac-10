/**
 * Türk Maç Rehberi - Tarih ve Saat Dilimi Yardımcı Fonksiyonları
 * Türkiye Saati (Europe/Istanbul - UTC+3) tutarlı hesaplamaları
 */

const TURKISH_DAYS = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

const TURKISH_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

/**
 * ISO veya YYYY-MM-DDTHH:mm formatındaki tarihi güvenle Date nesnesine çevirir.
 */
export function parseSafeDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') return null;

  try {
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) {
      // Alternatif regex ile YYYY-MM-DD veya YYYY-MM-DD HH:mm parse
      const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = parseInt(match[3], 10);
        const hour = match[4] ? parseInt(match[4], 10) : 0;
        const minute = match[5] ? parseInt(match[5], 10) : 0;
        const fallbackDate = new Date(Date.UTC(year, month, day, hour - 3, minute)); // TR saati UTC+3
        return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
      }
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Verilen tarihi Türkiye Saat Dilimi'nde YYYY-MM-DD anahtarına dönüştürür.
 */
export function getIstanbulDateKey(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // Format: YYYY-MM-DD
}

/**
 * Türkiye Saati ile maçın saatini "21:30" formatında döndürür.
 */
export function formatMatchTime(dateString: string): string {
  const date = parseSafeDate(dateString);
  if (!date) return '--:--';

  try {
    return new Intl.DateTimeFormat('tr-TR', {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

/**
 * Gün başlığını oluşturur:
 * - "Bugün · 24 Ağustos Pazartesi"
 * - "Yarın · 25 Ağustos Salı"
 * - "26 Ağustos Çarşamba"
 */
export function formatDaySectionLabel(dateKey: string): { label: string; isToday: boolean } {
  try {
    const [year, month, day] = dateKey.split('-').map((v) => parseInt(v, 10));
    if (!year || !month || !day) {
      return { label: dateKey, isToday: false };
    }

    const targetDate = new Date(year, month - 1, day);
    const now = new Date();
    const todayKey = getIstanbulDateKey(now);

    const dayName = TURKISH_DAYS[targetDate.getDay()] || '';
    const monthName = TURKISH_MONTHS[month - 1] || '';
    const formattedDate = `${day} ${monthName} ${dayName}`;

    if (dateKey === todayKey) {
      return { label: `Bugün · ${formattedDate}`, isToday: true };
    }

    // Yarın kontrolü
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowKey = getIstanbulDateKey(tomorrow);
    if (dateKey === tomorrowKey) {
      return { label: `Yarın · ${formattedDate}`, isToday: false };
    }

    return { label: formattedDate, isToday: false };
  } catch {
    return { label: dateKey, isToday: false };
  }
}

/**
 * Tarihi "28 Ağustos 2026 Cuma" formatında döndürür.
 */
export function formatMatchDateTurkish(dateString: string): string {
  const date = parseSafeDate(dateString);
  if (!date) return 'Tarih Belirsiz';

  try {
    const day = date.getDate();
    const month = TURKISH_MONTHS[date.getMonth()] || '';
    const year = date.getFullYear();
    const dayName = TURKISH_DAYS[date.getDay()] || '';
    return `${day} ${month} ${year} ${dayName}`;
  } catch {
    return dateString;
  }
}

/**
 * Göreceli gün etiketini döndürür ("Bugün", "Yarın", "Çarşamba", vb.)
 */
export function getRelativeDayLabel(dateString: string): string {
  const date = parseSafeDate(dateString);
  if (!date) return 'Maç Günü';

  const dateKey = getIstanbulDateKey(date);
  const now = new Date();
  const todayKey = getIstanbulDateKey(now);
  if (dateKey === todayKey) return 'Bugün';

  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowKey = getIstanbulDateKey(tomorrow);
  if (dateKey === tomorrowKey) return 'Yarın';

  return TURKISH_DAYS[date.getDay()] || 'Gelecek Maç';
}

/**
 * Türkçe son güncelleme zamanı metni
 */
export function formatLastUpdatedTime(isoString: string): string {
  const date = parseSafeDate(isoString);
  if (!date) return 'Bilinmiyor';

  try {
    const timeStr = new Intl.DateTimeFormat('tr-TR', {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    }).format(date);
    return timeStr;
  } catch {
    return 'Az önce';
  }
}
