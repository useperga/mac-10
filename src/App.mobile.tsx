/**
 * Türk Maç Rehberi - Saf Expo / React Native Ana Giriş Bileşeni (App.mobile.tsx)
 * iOS ve Android cihazlar için saf React Native bileşenleri ve StyleSheet mimarisi
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { VERIFIED_SOURCES } from './config/sources';
import { fetchMatches } from './services/matchesService';
import { THEME } from './theme';
import { DataSourceStatus, Match, MatchDay } from './types';
import { formatDaySectionLabel, formatMatchTime } from './utils/date';
import { filterMatches, groupMatchesByDay } from './utils/filter';

export default function MobileApp() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState<DataSourceStatus>('live');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isCacheFallback, setIsCacheFallback] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    } catch {
      setStatus('error');
      setErrorMessage('Beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredMatches = useMemo(() => filterMatches(matches, searchQuery), [matches, searchQuery]);
  const groupedDays = useMemo(() => groupMatchesByDay(filteredMatches), [filteredMatches]);

  const handleOpenUrl = async (url?: string) => {
    if (!url) return;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.warn('URL açma hatası:', err);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>TR</Text>
        </View>
        <View style={styles.titleTextContainer}>
          <Text style={styles.appTitle}>Türk Maç Rehberi</Text>
          <Text style={styles.appSubtitle}>Önümüzdeki 7 gün · Türk takımları</Text>
        </View>
      </View>

      {/* Arama Alanı */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Takım ara (Galatasaray, Fenerbahçe...)"
          placeholderTextColor={THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Takım veya yayıncı ara"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery('')}
            style={styles.searchClearBtn}
            accessibilityRole="button"
            accessibilityLabel="Aramayı temizle"
          >
            <Text style={styles.searchClearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Durum Rozeti */}
      {isCacheFallback && (
        <View style={styles.statusNoticeWarning}>
          <Text style={styles.statusNoticeTextWarning}>
            Son kaydedilen veriler gösteriliyor ({lastUpdated}).
          </Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.sourcesHeader}>Kaynaklar — kendin doğrula</Text>
      <Text style={styles.sourcesSub}>Bir bilgiden emin değilsen asıl siteden kontrol edebilirsin.</Text>

      <View style={styles.sourcesGrid}>
        {VERIFIED_SOURCES.map((source) => (
          <Pressable
            key={source.id}
            onPress={() => handleOpenUrl(source.url)}
            style={styles.sourceCard}
            accessibilityRole="link"
            accessibilityLabel={`${source.name} kaynağını aç`}
          >
            <Text style={styles.sourceCategory}>{source.category}</Text>
            <Text style={styles.sourceName} numberOfLines={1}>
              {source.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.versionFooter}>Türk Maç Rehberi v1.0.0 · TR Saati</Text>
    </View>
  );

  const renderMatchCard = (match: Match, index: number) => {
    const timeFormatted = formatMatchTime(match.startAt);
    const hasBroadcasters = match.broadcasters && match.broadcasters.length > 0;

    return (
      <View key={match.id || index} style={styles.matchCard}>
        <View style={styles.matchCardTop}>
          <Text style={styles.competitionText} numberOfLines={1}>
            {match.competition}
          </Text>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{timeFormatted}</Text>
          </View>
        </View>

        <View style={styles.teamsRow}>
          <Text style={[styles.teamName, styles.homeTeam]} numberOfLines={1}>
            {match.homeTeam}
          </Text>
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <Text style={[styles.teamName, styles.awayTeam]} numberOfLines={1}>
            {match.awayTeam}
          </Text>
        </View>

        <View style={styles.broadcasterRow}>
          <Text style={styles.broadcasterLabel}>Yayın:</Text>
          {hasBroadcasters ? (
            match.broadcasters.map((ch, idx) => (
              <View key={idx} style={styles.broadcasterPill}>
                <Text style={styles.broadcasterPillText}>{ch}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.unannouncedText}>Yayıncı henüz açıklanmadı</Text>
          )}
        </View>
      </View>
    );
  };

  const renderDayGroup = ({ item }: { item: MatchDay }) => (
    <View style={styles.dayGroupContainer}>
      <View style={styles.dayHeader}>
        <View style={[styles.dayDot, item.isToday && styles.dayDotToday]} />
        <Text style={[styles.dayTitle, item.isToday && styles.dayTitleToday]}>{item.label}</Text>
        <Text style={styles.dayCount}>{item.matches.length} maç</Text>
      </View>
      {item.matches.map((m, idx) => renderMatchCard(m, idx))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Maçlar yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={groupedDays}
          keyExtractor={(item) => item.dateKey}
          renderItem={renderDayGroup}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadData(true)}
              colors={[THEME.colors.primary]}
              tintColor={THEME.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                {searchQuery.length > 0
                  ? 'Aramanızla eşleşen maç bulunamadı.'
                  : 'Gösterilecek maç bulunamadı.'}
              </Text>
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                  <Text style={styles.clearSearchBtnText}>Aramayı Temizle</Text>
                </Pressable>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    paddingVertical: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  titleTextContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  appSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: THEME.colors.textPrimary,
    paddingVertical: 8,
  },
  searchClearBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchClearText: {
    color: THEME.colors.textMuted,
    fontSize: 16,
  },
  statusNoticeWarning: {
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: THEME.colors.warningBg,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusNoticeTextWarning: {
    fontSize: 12,
    color: '#92400E',
  },
  dayGroupContainer: {
    marginTop: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.textMuted,
    marginRight: 8,
  },
  dayDotToday: {
    backgroundColor: THEME.colors.primary,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  dayTitleToday: {
    color: THEME.colors.textPrimary,
  },
  dayCount: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  matchCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  matchCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  competitionText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    flex: 1,
    marginRight: 8,
    textTransform: 'uppercase',
  },
  timeBadge: {
    backgroundColor: '#0F172A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  teamName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  homeTeam: {
    textAlign: 'left',
  },
  awayTeam: {
    textAlign: 'right',
  },
  vsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  vsText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  broadcasterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  broadcasterLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginRight: 6,
  },
  broadcasterPill: {
    backgroundColor: THEME.colors.broadcasterBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: THEME.colors.broadcasterBorder,
  },
  broadcasterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.broadcasterText,
  },
  unannouncedText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  clearSearchBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: THEME.colors.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  clearSearchBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  footerContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  sourcesHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  sourcesSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sourceCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minHeight: 48,
    justifyContent: 'center',
  },
  sourceCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  sourceName: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  versionFooter: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
