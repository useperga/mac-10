/**
 * Türk Maç Rehberi - API & Ağ Yapılandırması
 */

export const API_CONFIG = {
  // Uzak API URL'si (Varsayılan olarak Express /api/matches uç noktası)
  MATCHES_API_URL: process.env.EXPO_PUBLIC_MATCHES_API_URL || '/api/matches',

  // API Anahtarı (Gerekiyorsa backend proxy arkasında tutulmalıdır)
  MATCHES_API_KEY: process.env.EXPO_PUBLIC_MATCHES_API_KEY || '',

  // Zaman aşımı süresi (Milisaniye) - 12 saniye
  REQUEST_TIMEOUT_MS: 12000,

  // Önbellek geçerlilik süresi (Dakika) - 30 dakika
  CACHE_TTL_MINUTES: 30,

  // Varsayılan saat dilimi
  DEFAULT_TIMEZONE: 'Europe/Istanbul',

  // Önbellek anahtarı ve versiyonu
  CACHE_STORAGE_KEY: '@turk_mac_rehberi_matches_v1',
  CACHE_VERSION: 1,
};
