import { API_CONFIG } from '../config/api';
import { CachePayload, Match } from '../types';

/**
 * Platformlar arası güvenli yerel depolama adaptörü (Web LocalStorage / Mobile AsyncStorage)
 */
class StorageAdapter {
  private inMemoryFallback = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return this.inMemoryFallback.get(key) || null;
    } catch {
      return this.inMemoryFallback.get(key) || null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      this.inMemoryFallback.set(key, value);
    } catch {
      this.inMemoryFallback.set(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      this.inMemoryFallback.delete(key);
    } catch {
      this.inMemoryFallback.delete(key);
    }
  }
}

const storage = new StorageAdapter();

/**
 * Başarılı maç verisini önbelleğe kaydeder
 */
export async function saveMatchesToCache(matches: Match[]): Promise<boolean> {
  try {
    const payload: CachePayload = {
      version: API_CONFIG.CACHE_VERSION,
      updatedAt: new Date().toISOString(),
      matches,
    };
    await storage.setItem(API_CONFIG.CACHE_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Cache] Önbelleğe yazma hatası:', error);
    }
    return false;
  }
}

/**
 * Önbellekteki son maç verisini ve kaydedilme zamanını okur
 */
export async function loadMatchesFromCache(): Promise<{ matches: Match[]; updatedAt: string } | null> {
  try {
    const rawData = await storage.getItem(API_CONFIG.CACHE_STORAGE_KEY);
    if (!rawData) return null;

    const parsed: CachePayload = JSON.parse(rawData);

    // Versiyon kontrolü
    if (!parsed || parsed.version !== API_CONFIG.CACHE_VERSION || !Array.isArray(parsed.matches)) {
      await storage.removeItem(API_CONFIG.CACHE_STORAGE_KEY);
      return null;
    }

    return {
      matches: parsed.matches,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    // Bozuk veri durumunda sessizce temizle ve çökme engelle
    await storage.removeItem(API_CONFIG.CACHE_STORAGE_KEY).catch(() => {});
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Cache] Bozuk önbellek temizlendi:', error);
    }
    return null;
  }
}

/**
 * Önbelleği manuel temizleme
 */
export async function clearMatchesCache(): Promise<void> {
  await storage.removeItem(API_CONFIG.CACHE_STORAGE_KEY).catch(() => {});
}
