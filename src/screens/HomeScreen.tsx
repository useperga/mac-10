import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DaySection } from '../components/DaySection';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { SourcesSection } from '../components/SourcesSection';
import { EmptyView, ErrorView, LoadingView, NoSearchResultsView } from '../components/StateViews';
import { StatusBanner } from '../components/StatusBanner';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { MatchdayHero } from '../components/MatchdayHero';
import { DateFilterBar, LeagueFilter } from '../components/DateFilterBar';
import { QuickTeamFilter } from '../components/QuickTeamFilter';
import { Toast } from '../components/Toast';
import { useReminders } from '../hooks/useReminders';
import { fetchMatches } from '../services/matchesService';
import { DataSourceStatus, Match } from '../types';
import { filterMatches, groupMatchesByDay, normalizeTurkishText } from '../utils/filter';

export const HomeScreen: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState<DataSourceStatus>('live');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isCacheFallback, setIsCacheFallback] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtreleme State'leri
  const [selectedDateKey, setSelectedDateKey] = useState<string | 'all'>('all');
  const [selectedLeague, setSelectedLeague] = useState<LeagueFilter>('all');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Seçilen Maç ve Modal Durumu
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Hatırlatıcı / Bildirim Yönetimi Hook'u
  const {
    toggleReminder,
    isReminderActive,
    reminders,
    toast,
    closeToast,
  } = useReminders();

  // Veri yükleme fonksiyonu
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await fetchMatches();
      setMatches(result.matches);
      setStatus(result.status);
      setLastUpdated(result.lastUpdated);
      setIsCacheFallback(Boolean(result.isCacheFallback));
      setErrorMessage(result.errorMessage);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtreleme Pipeline'ı
  const filteredMatches = useMemo(() => {
    let result = filterMatches(matches, searchQuery);

    // 1. Takım Filtresi
    if (selectedTeam) {
      const normTeam = normalizeTurkishText(selectedTeam);
      result = result.filter((m) => {
        const h = normalizeTurkishText(m.homeTeam);
        const a = normalizeTurkishText(m.awayTeam);
        return h.includes(normTeam) || a.includes(normTeam);
      });
    }

    // 2. Lig / Özel Durum Filtresi
    if (selectedLeague !== 'all') {
      if (selectedLeague === 'superlig') {
        result = result.filter((m) => normalizeTurkishText(m.competition).includes('süper lig'));
      } else if (selectedLeague === 'tff1') {
        result = result.filter((m) => normalizeTurkishText(m.competition).includes('1. lig'));
      } else if (selectedLeague === 'national') {
        result = result.filter(
          (m) =>
            normalizeTurkishText(m.competition).includes('milli') ||
            normalizeTurkishText(m.homeTeam).includes('türkiye') ||
            normalizeTurkishText(m.awayTeam).includes('türkiye')
        );
      } else if (selectedLeague === 'europe') {
        result = result.filter(
          (m) =>
            normalizeTurkishText(m.competition).includes('uefa') ||
            normalizeTurkishText(m.competition).includes('avrupa') ||
            normalizeTurkishText(m.competition).includes('şampiyonlar') ||
            normalizeTurkishText(m.competition).includes('konferans')
        );
      } else if (selectedLeague === 'with-lineup') {
        result = result.filter((m) => Boolean(m.lineups && m.lineups.isOfficialTFF));
      } else if (selectedLeague === 'reminders') {
        result = result.filter((m) => isReminderActive(m.id || `${m.homeTeam}-${m.awayTeam}`));
      }
    }

    return result;
  }, [matches, searchQuery, selectedTeam, selectedLeague, isReminderActive]);

  // Günlere göre gruplama (Tüm maçlar için gün listesi)
  const allGroupedDays = useMemo(() => {
    return groupMatchesByDay(matches);
  }, [matches]);

  // Filtrelenmiş gün listesi
  const groupedDays = useMemo(() => {
    const days = groupMatchesByDay(filteredMatches);
    if (selectedDateKey === 'all') {
      return days;
    }
    return days.filter((d) => d.dateKey === selectedDateKey);
  }, [filteredMatches, selectedDateKey]);

  // Öne Çıkan / Sıradaki En Yakın Maç (Hero Card)
  const featuredMatch = useMemo(() => {
    if (matches.length === 0) return null;
    // Bugün veya ilk maç
    return matches[0];
  }, [matches]);

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const activeRemindersCount = Object.keys(reminders || {}).length;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDateKey('all');
    setSelectedLeague('all');
    setSelectedTeam(null);
  };

  const isFilteringActive =
    searchQuery.trim().length > 0 ||
    selectedDateKey !== 'all' ||
    selectedLeague !== 'all' ||
    selectedTeam !== null;

  return (
    <div id="home-screen" className="min-h-screen bg-slate-50 flex flex-col antialiased relative selection:bg-indigo-500 selection:text-white">
      {/* Üst Başlık & Canlı TSİ Saati */}
      <Header
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        activeRemindersCount={activeRemindersCount}
      />

      {/* Ana İçerik Konteyneri */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Arama Alanı */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Popüler Kulüpler Hızlı Filtre Şeridi */}
        <QuickTeamFilter
          selectedTeam={selectedTeam}
          onSelectTeam={(team) => {
            setSelectedTeam(team);
          }}
        />

        {/* 7 Günlük Yatay Tarih Şeridi & Lig Filtre Çipleri */}
        {matches.length > 0 && (
          <DateFilterBar
            days={allGroupedDays}
            selectedDateKey={selectedDateKey}
            onSelectDateKey={setSelectedDateKey}
            selectedLeague={selectedLeague}
            onSelectLeague={setSelectedLeague}
            totalMatchCount={matches.length}
            activeReminderCount={activeRemindersCount}
          />
        )}

        {/* Veri Durum & TFF Güvenlik Rozeti */}
        {!isLoading && (
          <StatusBanner
            status={status}
            lastUpdated={lastUpdated}
            isCacheFallback={isCacheFallback}
            errorMessage={errorMessage}
            onRetry={() => loadData(true)}
          />
        )}

        {/* Öne Çıkan Maç Günü (Hero Card) - Arama veya derin filtre yoksa göster */}
        {!isLoading && !isFilteringActive && featuredMatch && (
          <MatchdayHero
            match={featuredMatch}
            onSelectMatch={handleSelectMatch}
            isReminderActive={isReminderActive(featuredMatch.id || `${featuredMatch.homeTeam}-${featuredMatch.awayTeam}`)}
            onToggleReminder={toggleReminder}
          />
        )}

        {/* Aktif Filtre Bilgisi ve Sıfırlama Butonu */}
        {isFilteringActive && (
          <div className="flex items-center justify-between bg-indigo-50/80 border border-indigo-200 px-3.5 py-2 rounded-2xl text-xs">
            <span className="font-semibold text-indigo-950">
              Filtrelenen Sonuçlar ({filteredMatches.length} maç bulundu)
            </span>
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline underline-offset-2"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Durum Ekranları ve Maç Listesi */}
        {isLoading ? (
          <LoadingView />
        ) : status === 'error' && matches.length === 0 ? (
          <ErrorView message={errorMessage} onRetry={() => loadData(true)} />
        ) : matches.length === 0 ? (
          <EmptyView onRefresh={() => loadData(true)} />
        ) : filteredMatches.length === 0 ? (
          <NoSearchResultsView query={searchQuery || selectedTeam || selectedLeague} onClear={resetAllFilters} />
        ) : (
          <div id="matches-list-container" className="space-y-6 pt-1">
            {groupedDays.map((day) => (
              <DaySection
                key={day.dateKey}
                day={day}
                onSelectMatch={handleSelectMatch}
                isReminderActive={isReminderActive}
                onToggleReminder={toggleReminder}
              />
            ))}
          </div>
        )}

        {/* Doğrulama ve Kaynaklar Alanı */}
        <SourcesSection />
      </main>

      {/* Maç Detay Modalı (Taktik Tahtası, 3 Aşamalı TFF Kontrolü, Hatırlatıcılar) */}
      <MatchDetailModal
        match={selectedMatch}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isReminderActive={selectedMatch ? isReminderActive(selectedMatch.id || `${selectedMatch.homeTeam}-${selectedMatch.awayTeam}`) : false}
        onToggleReminder={toggleReminder}
      />

      {/* Bildirim / Toast Uyarıları */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};
