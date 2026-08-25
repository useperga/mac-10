/**
 * Türk Maç Rehberi - Veri Modelleri ve Tipler
 */

export interface MissingPlayer {
  team: 'home' | 'away';
  name: string;
  type: 'sakat' | 'cezali' | 'supheli';
  detail?: string;
}

export interface LineupPlayer {
  number: number;
  name: string;
  position?: 'GK' | 'DF' | 'MF' | 'FW' | string;
  isCaptain?: boolean;
  isGoalkeeper?: boolean;
}

export interface TeamLineup {
  teamName?: string;
  formation?: string; // örn: "4-2-3-1"
  coach?: string; // örn: "Okan Buruk"
  startingEleven: LineupPlayer[];
  substitutes?: LineupPlayer[];
}

export interface MatchLineup {
  isOfficialTFF: boolean;
  publishedAt?: string; // ISO string veya "20:30 (Maça 60 dk kala)"
  source?: string; // "www.tff.org Resmi Esame Listesi"
  sourceUrl?: string;
  home: TeamLineup;
  away: TeamLineup;
}

export interface Match {
  id: string;
  startAt: string; // ISO 8601 string veya YYYY-MM-DDTHH:mm:ss
  timezone: string; // örn: "Europe/Istanbul"
  competition: string; // örn: "Trendyol Süper Lig"
  homeTeam: string; // örn: "Galatasaray"
  awayTeam: string; // örn: "Fenerbahçe"
  homeLogo?: string;
  awayLogo?: string;
  broadcasters: string[]; // örn: ["beIN Sports 1", "beIN Connect"]
  sourceUrl?: string;
  sourceSite?: 'tff.org' | 'beinsports.com.tr' | 'trtspor.com.tr' | 'aspor.com.tr' | string;
  sourceSiteName?: string; // örn: "TFF & beIN SPORTS", "TRT Spor", "A Spor"
  stadium?: string; // örn: "Kocaeli Stadyumu"
  referee?: string; // örn: "Ali Şansalan"
  round?: string; // örn: "3. Hafta"
  weather?: string; // örn: "23°C, Açık"
  missingPlayers?: MissingPlayer[];
  lineups?: MatchLineup;
  lineupStatus?: 'announced' | 'waiting';
  lineupPublishedAt?: string;
  probableLineups?: {
    home: string[];
    away: string[];
  };
  notes?: string;
  isDemo?: boolean;
}

export interface MatchReminder {
  matchId: string;
  matchTitle: string;
  startAt: string;
  minutesBefore: number;
  createdAt: string;
}

export interface MatchDay {
  dateKey: string; // YYYY-MM-DD
  label: string; // örn: "Bugün · 24 Ağustos Pazartesi"
  isToday?: boolean;
  matches: Match[];
}

export type DataSourceStatus = 'live' | 'cache' | 'demo' | 'error';

export interface CachePayload {
  version: number;
  updatedAt: string; // ISO format
  matches: Match[];
}

export interface FetchMatchesResult {
  matches: Match[];
  status: DataSourceStatus;
  lastUpdated: string; // Formatlı Türkçe saat
  errorMessage?: string;
  isCacheFallback?: boolean;
}

export interface SourceLink {
  id: string;
  name: string;
  category: string;
  url?: string;
  description?: string;
}
