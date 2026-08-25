import { useState, useEffect, useCallback } from 'react';
import { Match, MatchReminder } from '../types';
import { parseSafeDate } from '../utils/date';

const STORAGE_KEY = 'turkish_match_reminders_v1';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

export function useReminders() {
  const [reminders, setReminders] = useState<Record<string, MatchReminder>>({});
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // İlk yüklemede localStorage'dan oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setReminders(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Hatırlatıcılar yüklenirken hata:', e);
    }
  }, []);

  // Kaydet
  const saveReminders = useCallback((updated: Record<string, MatchReminder>) => {
    setReminders(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Hatırlatıcı kaydedilemedi:', e);
    }
  }, []);

  const showToast = useCallback((type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Bildirim izni isteme
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (e) {
          console.warn('Bildirim izni alınamadı:', e);
        }
      }
    }
  }, []);

  // Hatırlatıcı Aç/Kapat
  const toggleReminder = useCallback(
    async (match: Match, minutesBefore: number = 60) => {
      await requestNotificationPermission();

      const matchId = match.id || `${match.homeTeam}-${match.awayTeam}`;
      const matchTitle = `${match.homeTeam} - ${match.awayTeam}`;
      const isCurrentlyActive = Boolean(reminders[matchId]);

      const updated = { ...reminders };

      if (isCurrentlyActive) {
        delete updated[matchId];
        saveReminders(updated);
        showToast(
          'info',
          'Hatırlatıcı İptal Edildi',
          `"${matchTitle}" maçı için hatırlatma kaldırıldı.`
        );
        return false;
      } else {
        const newReminder: MatchReminder = {
          matchId,
          matchTitle,
          startAt: match.startAt,
          minutesBefore,
          createdAt: new Date().toISOString(),
        };
        updated[matchId] = newReminder;
        saveReminders(updated);
        showToast(
          'success',
          '🔔 Bildirim Ayarlandı!',
          `"${matchTitle}" maçından ${minutesBefore === 60 ? '1 saat' : `${minutesBefore} dakika`} önce size hatırlatılacak.`
        );
        return true;
      }
    },
    [reminders, saveReminders, showToast, requestNotificationPermission]
  );

  const isReminderActive = useCallback(
    (matchId: string) => {
      return Boolean(reminders[matchId]);
    },
    [reminders]
  );

  const getReminder = useCallback(
    (matchId: string) => {
      return reminders[matchId];
    },
    [reminders]
  );

  // Arka planda periyodik kontrol (Aktif sekmede maç saatine yaklaşıldığında uyarı)
  useEffect(() => {
    const checkUpcomingMatches = () => {
      const now = new Date().getTime();
      (Object.values(reminders) as MatchReminder[]).forEach((rem) => {
        const matchDate = parseSafeDate(rem.startAt);
        if (!matchDate) return;
        
        const timeDiff = matchDate.getTime() - now;
        const targetLeadMs = rem.minutesBefore * 60 * 1000;

        // Maça belirlenen süreden az kaldıysa ve maç henüz bitmediyse
        if (timeDiff > 0 && timeDiff <= targetLeadMs && timeDiff >= targetLeadMs - 60000) {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`⚽ Maç Başlamak Üzere!`, {
              body: `${rem.matchTitle} karşılaşması ${rem.minutesBefore} dakika içinde başlıyor.`,
              icon: '/favicon.ico',
            });
          }
          showToast(
            'warning',
            '⚽ Maç Başlamak Üzere!',
            `${rem.matchTitle} karşılaşması ${rem.minutesBefore} dakika içinde başlıyor!`
          );
        }
      });
    };

    const interval = setInterval(checkUpcomingMatches, 60000);
    return () => clearInterval(interval);
  }, [reminders, showToast]);

  return {
    reminders,
    toggleReminder,
    isReminderActive,
    getReminder,
    remindersCount: Object.keys(reminders).length,
    toast,
    closeToast,
    showToast,
  };
}
