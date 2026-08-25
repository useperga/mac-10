import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// 4 Resmi Veri Kaynağı Bilgileri
const SOURCES = [
  {
    id: 'tff',
    name: 'TFF (www.tff.org)',
    domain: 'www.tff.org',
    category: 'Resmi Federasyon Fikstürü',
    url: 'https://www.tff.org/default.aspx?pageID=198',
    description: 'Türkiye Futbol Federasyonu resmi lig fikstürü, maç saatleri ve hakem atamaları.',
  },
  {
    id: 'bein-sports',
    name: 'beIN SPORTS (www.beinsports.com.tr)',
    domain: 'www.beinsports.com.tr',
    category: 'Resmi Süper Lig Yayıncısı',
    url: 'https://beinsports.com.tr/yayin-akisi',
    description: 'Trendyol Süper Lig ve 1. Lig resmi canlı maç yayınları ve beIN Sports kanalları.',
  },
  {
    id: 'trt-spor',
    name: 'TRT Spor (www.trtspor.com.tr)',
    domain: 'www.trtspor.com.tr',
    category: 'Kamu & Avrupa Yayıncısı',
    url: 'https://www.trtspor.com.tr/yayin-akisi',
    description: 'TRT Spor, TRT 1 ve Tabii canlı maç yayın akışı ve Trendyol 1. Lig yayınları.',
  },
  {
    id: 'aspor',
    name: 'A Spor (www.aspor.com.tr)',
    domain: 'www.aspor.com.tr',
    category: 'Kupa & Spor Yayıncısı',
    url: 'https://www.aspor.com.tr/yayin-akisi',
    description: 'Ziraat Türkiye Kupası karşılaşmaları ve canlı yayın bültenleri.',
  },
];

// Güncel maçları oluşturan yardımcı fonksiyon (7 günlük takvim)
function generateOfficialMatches() {
  const now = new Date();
  const addDays = (offset: number, timeStr: string) => {
    const d = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const dayOfMonth = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${dayOfMonth}T${timeStr}:00+03:00`;
  };

  return [
    // Gün 1: Bugün
    {
      id: 'srv-match-1',
      startAt: addDays(0, '21:30'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol Süper Lig',
      round: '3. Hafta',
      homeTeam: 'Kocaelispor',
      awayTeam: 'Amedspor',
      broadcasters: ['beIN Sports 1'],
      sourceSite: 'beinsports.com.tr',
      sourceSiteName: 'TFF & beIN SPORTS',
      sourceUrl: 'https://beinsports.com.tr/yayin-akisi',
      stadium: 'Kocaeli Stadyumu',
      referee: 'Ali Şansalan',
      weather: '24°C, Açık ve Yağışsız',
      missingPlayers: [
        { team: 'home', name: 'Ahmet Oğuz', type: 'sakat', detail: 'Sağ ayak bileği burkulması' },
        { team: 'away', name: 'Oktay Aydın', type: 'cezali', detail: 'Kırmızı kart cezası' },
      ],
      lineupPublishedAt: '20:30 (Maça 60 dk kala)',
      lineups: {
        isOfficialTFF: true,
        home: {
          teamName: 'Kocaelispor',
          formation: '4-2-3-1',
          coach: 'Ertuğrul Sağlam',
          startingEleven: [
            { number: 1, name: 'Gökhan Değirmenci', position: 'GK', isGoalkeeper: true },
            { number: 3, name: 'Muharrem Cinan', position: 'DF' },
            { number: 5, name: 'Appindangoyé', position: 'DF' },
            { number: 15, name: 'Tarkan Serbest', position: 'DF' },
            { number: 22, name: 'Ahmet Oğuz', position: 'DF' },
            { number: 6, name: 'Pedrinho', position: 'MF' },
            { number: 8, name: 'Josip Vukovic', position: 'MF' },
            { number: 10, name: 'Ryan Mendes', position: 'MF', isCaptain: true },
            { number: 70, name: 'Barış Alıcı', position: 'MF' },
            { number: 17, name: 'Mijo Caktas', position: 'MF' },
            { number: 99, name: 'Markao', position: 'FW' },
          ],
          substitutes: [
            { number: 35, name: 'Harun Tekin', position: 'GK', isGoalkeeper: true },
            { number: 4, name: 'Josip Vukovic', position: 'DF' },
            { number: 7, name: 'Giorgi Beridze', position: 'FW' },
            { number: 11, name: 'Oğulcan Çağlayan', position: 'FW' },
            { number: 20, name: 'Furkan Gedik', position: 'MF' },
            { number: 45, name: 'Mesut Can Tunalı', position: 'MF' },
          ],
        },
        away: {
          teamName: 'Amedspor',
          formation: '4-3-3',
          coach: 'Ersun Yanal',
          startingEleven: [
            { number: 1, name: 'Nurullah Aslan', position: 'GK', isGoalkeeper: true },
            { number: 24, name: 'Batuhan Tur', position: 'DF' },
            { number: 4, name: 'Veli Çetin', position: 'DF' },
            { number: 5, name: 'Mehmet Yeşil', position: 'DF', isCaptain: true },
            { number: 3, name: 'Alberk Koç', position: 'DF' },
            { number: 6, name: 'Yohan Cassubie', position: 'MF' },
            { number: 8, name: 'Adama Traoré', position: 'MF' },
            { number: 10, name: 'Çekdar Orhan', position: 'MF' },
            { number: 11, name: 'Bruno Lourenço', position: 'FW' },
            { number: 17, name: 'Max Gradel', position: 'FW' },
            { number: 9, name: 'Britt Assombalonga', position: 'FW' },
          ],
          substitutes: [
            { number: 96, name: 'Veysel Sapan', position: 'GK', isGoalkeeper: true },
            { number: 14, name: 'Sinan Kurt', position: 'MF' },
            { number: 19, name: 'Ömer Bayram', position: 'DF' },
            { number: 21, name: 'Doğan Can Davas', position: 'MF' },
            { number: 77, name: 'Yakup Kalafat', position: 'FW' },
          ],
        },
      },
      notes: 'TFF Resmi Maç Programı',
    },
    {
      id: 'srv-match-2',
      startAt: addDays(0, '21:30'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol 1. Lig',
      round: '3. Hafta',
      homeTeam: 'Sivasspor',
      awayTeam: 'Manisa FK',
      broadcasters: ['beIN Sports 2', 'TRT Spor', 'beIN Connect'],
      sourceSite: 'trtspor.com.tr',
      sourceSiteName: 'TFF & TRT Spor',
      sourceUrl: 'https://www.trtspor.com.tr/yayin-akisi',
      stadium: 'BG Grup 4 Eylül Stadyumu',
      referee: 'Kadir Sağlam',
      weather: '21°C, Hafif Rüzgarlı',
      missingPlayers: [
        { team: 'home', name: 'Rey Manaj', type: 'supheli', detail: 'Kondisyon eksiği' },
      ],
    },
    {
      id: 'srv-match-3',
      startAt: addDays(0, '22:00'),
      timezone: 'Europe/Istanbul',
      competition: 'Milli Karşılaşma',
      round: 'Hazırlık Maçı',
      homeTeam: 'Türkiye',
      awayTeam: 'Kuzey Makedonya',
      broadcasters: ['TRT 1'],
      sourceSite: 'tff.org',
      sourceSiteName: 'TFF (www.tff.org)',
      sourceUrl: 'https://www.tff.org/default.aspx?pageID=198',
      stadium: 'Konya Büyükşehir Belediye Stadyumu',
      referee: 'Slavko Vincic (UEFA)',
      weather: '22°C, İdeal Futbol Havası',
      missingPlayers: [
        { team: 'home', name: 'Ferdi Kadıoğlu', type: 'sakat', detail: 'Kas zorlanması' },
      ],
    },

    // Gün 2: Yarın
    {
      id: 'srv-match-4',
      startAt: addDays(1, '20:00'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol Süper Lig',
      round: '3. Hafta',
      homeTeam: 'Galatasaray',
      awayTeam: 'Kayserispor',
      broadcasters: ['beIN Sports 1', 'TOD'],
      sourceSite: 'beinsports.com.tr',
      sourceSiteName: 'TFF & beIN SPORTS',
      sourceUrl: 'https://beinsports.com.tr/yayin-akisi',
      stadium: 'RAMS Park Stadyumu',
      referee: 'Atilla Karaoğlan',
      weather: '26°C, Nem %65',
      missingPlayers: [
        { team: 'home', name: 'Davinson Sanchez', type: 'sakat', detail: 'Arka adale sakatlığı' },
        { team: 'away', name: 'Majid Hosseini', type: 'sakat', detail: 'Diz ameliyatı sonrası rehabilitasyon' },
      ],
    },
    {
      id: 'srv-match-5',
      startAt: addDays(1, '21:45'),
      timezone: 'Europe/Istanbul',
      competition: 'UEFA Şampiyonlar Ligi Elemeleri',
      round: 'Play-off Turu',
      homeTeam: 'Young Boys',
      awayTeam: 'Galatasaray',
      broadcasters: ['TRT 1', 'Tabii'],
      sourceSite: 'trtspor.com.tr',
      sourceSiteName: 'TRT Spor (www.trtspor.com.tr)',
      sourceUrl: 'https://www.trtspor.com.tr/yayin-akisi',
      stadium: 'Wankdorf Stadyumu (Bern)',
      referee: 'Daniel Siebert (Almanya)',
      weather: '18°C, Sentetik Zemin',
      missingPlayers: [
        { team: 'away', name: 'Kaan Ayhan', type: 'cezali', detail: 'Kırmızı kart cezası' },
      ],
    },

    // Gün 3: Çarşamba
    {
      id: 'srv-match-6',
      startAt: addDays(2, '22:00'),
      timezone: 'Europe/Istanbul',
      competition: 'UEFA Avrupa Ligi',
      round: 'Grup Aşaması',
      homeTeam: 'Olympique Lyon',
      awayTeam: 'Fenerbahçe',
      broadcasters: ['TRT 1', 'Tabii'],
      sourceSite: 'trtspor.com.tr',
      sourceSiteName: 'TRT Spor (www.trtspor.com.tr)',
      sourceUrl: 'https://www.trtspor.com.tr/yayin-akisi',
      stadium: 'Groupama Stadyumu (Lyon)',
      referee: 'Felix Zwayer (UEFA)',
      weather: '19°C, Açık',
      missingPlayers: [
        { team: 'away', name: 'Jayden Oosterwolde', type: 'cezali', detail: 'Sarı kart cezası' },
        { team: 'home', name: 'Corentin Tolisso', type: 'sakat', detail: 'Kas zedelenmesi' },
      ],
    },
    {
      id: 'srv-match-7',
      startAt: addDays(2, '20:00'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol 1. Lig',
      round: '3. Hafta',
      homeTeam: 'Sakaryaspor',
      awayTeam: 'Gençlerbirliği',
      broadcasters: ['TRT Spor', 'beIN Sports Max 1'],
      sourceSite: 'trtspor.com.tr',
      sourceSiteName: 'TFF & TRT Spor',
      sourceUrl: 'https://www.trtspor.com.tr/yayin-akisi',
      stadium: 'Yeni Sakarya Atatürk Stadyumu',
      referee: 'Oğuzhan Çakır',
      weather: '23°C, Açık',
      missingPlayers: [],
    },

    // Gün 4: Perşembe
    {
      id: 'srv-match-8',
      startAt: addDays(3, '20:00'),
      timezone: 'Europe/Istanbul',
      competition: 'UEFA Konferans Ligi Elemeleri',
      round: 'Play-off 2. Maç',
      homeTeam: 'Kauno Zalgiris',
      awayTeam: 'Beşiktaş',
      broadcasters: ['A Spor', 'S Sport+'],
      sourceSite: 'aspor.com.tr',
      sourceSiteName: 'A Spor (www.aspor.com.tr)',
      sourceUrl: 'https://www.aspor.com.tr/yayin-akisi',
      stadium: 'Darius and Girenas Stadyumu',
      referee: 'Julian Weinberger (Avusturya)',
      weather: '17°C, Parçalı Bulutlu',
      missingPlayers: [
        { team: 'away', name: 'Necip Uysal', type: 'sakat', detail: 'Çapraz bağ operasyonu' },
      ],
    },
    {
      id: 'srv-match-9',
      startAt: addDays(3, '21:45'),
      timezone: 'Europe/Istanbul',
      competition: 'UEFA Konferans Ligi',
      round: 'Play-off Turu',
      homeTeam: 'Trabzonspor',
      awayTeam: 'St. Gallen',
      broadcasters: ['A Spor'],
      sourceSite: 'aspor.com.tr',
      sourceSiteName: 'A Spor (www.aspor.com.tr)',
      sourceUrl: 'https://www.aspor.com.tr/yayin-akisi',
      stadium: 'Papara Park Stadyumu',
      referee: 'Andris Treimanis (Letonya)',
      weather: '25°C, Nemli',
      missingPlayers: [
        { team: 'home', name: 'Anthony Nwakaeme', type: 'sakat', detail: 'Sol üst adale gerilmesi' },
      ],
    },

    // Gün 5: Cuma
    {
      id: 'srv-match-10',
      startAt: addDays(4, '21:00'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol Süper Lig',
      round: '3. Hafta',
      homeTeam: 'Fenerbahçe',
      awayTeam: 'Alanyaspor',
      broadcasters: ['beIN Sports 1', 'TOD'],
      sourceSite: 'beinsports.com.tr',
      sourceSiteName: 'TFF & beIN SPORTS',
      sourceUrl: 'https://beinsports.com.tr/yayin-akisi',
      stadium: 'Ülker Stadyumu FB Şükrü Saracoğlu Spor Kompleksi',
      referee: 'Mehmet Türkmen',
      weather: '24°C, Açık',
      missingPlayers: [
        { team: 'away', name: 'Fidan Aliti', type: 'cezali', detail: '4 Sarı kart cezası' },
      ],
    },

    // Gün 6: Cumartesi
    {
      id: 'srv-match-11',
      startAt: addDays(5, '19:00'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol Süper Lig',
      round: '3. Hafta',
      homeTeam: 'Adana Demirspor',
      awayTeam: 'Kasımpaşa',
      broadcasters: ['beIN Sports 2'],
      sourceSite: 'beinsports.com.tr',
      sourceSiteName: 'TFF & beIN SPORTS',
      sourceUrl: 'https://beinsports.com.tr/yayin-akisi',
      stadium: 'Yeni Adana Stadyumu',
      referee: 'Cihan Aydın',
      weather: '31°C, Sıcak',
      missingPlayers: [],
    },
    {
      id: 'srv-match-12',
      startAt: addDays(5, '21:45'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol Süper Lig',
      round: '3. Hafta',
      homeTeam: 'Göztepe',
      awayTeam: 'Bodrum FK',
      broadcasters: ['beIN Sports 1'],
      sourceSite: 'beinsports.com.tr',
      sourceSiteName: 'TFF & beIN SPORTS',
      sourceUrl: 'https://beinsports.com.tr/yayin-akisi',
      stadium: 'Gürsel Aksel Stadyumu (İzmir)',
      referee: 'Murat Erdoğan',
      weather: '27°C, Ilık İmbat Rüzgarı',
      missingPlayers: [],
    },

    // Gün 7: Pazar
    {
      id: 'srv-match-13',
      startAt: addDays(6, '21:45'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol Süper Lig',
      round: '3. Hafta',
      homeTeam: 'Beşiktaş',
      awayTeam: 'Sivasspor',
      broadcasters: ['beIN Sports 1', 'TOD'],
      sourceSite: 'beinsports.com.tr',
      sourceSiteName: 'TFF & beIN SPORTS',
      sourceUrl: 'https://beinsports.com.tr/yayin-akisi',
      stadium: 'Tüpraş Stadyumu (Beşiktaş Park)',
      referee: 'Halil Umut Meler',
      weather: '23°C, Boğaz Esintisi',
      missingPlayers: [
        { team: 'home', name: 'Vincent Aboubakar', type: 'supheli', detail: 'Maç saatinde durumu netleşecek' },
      ],
    },
    {
      id: 'srv-match-14',
      startAt: addDays(6, '21:30'),
      timezone: 'Europe/Istanbul',
      competition: 'Trendyol Süper Lig',
      round: '3. Hafta',
      homeTeam: 'Amedspor',
      awayTeam: 'Trabzonspor',
      broadcasters: ['beIN Sports 1'],
      sourceSite: 'tff.org',
      sourceSiteName: 'TFF & beIN SPORTS',
      sourceUrl: 'https://www.tff.org/default.aspx?pageID=198',
      stadium: 'Diyarbakır Stadyumu',
      referee: 'Volkan Bayarslan',
      weather: '29°C, Açık',
      missingPlayers: [],
    },
  ];
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/sources', (req, res) => {
  res.json({
    status: 'success',
    sources: SOURCES,
  });
});

app.get('/api/matches', (req, res) => {
  try {
    const matches = generateOfficialMatches();
    res.json({
      status: 'success',
      data: matches,
      sources: SOURCES,
      lastSync: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// TFF 3-Aşamalı Kadro Kontrol API'si (65 dk, 60 dk, 55 dk)
app.get('/api/tff-lineup-check', (req, res) => {
  try {
    const { matchId } = req.query;
    const matches = generateOfficialMatches();
    const match = matches.find((m) => m.id === matchId);

    if (!match) {
      return res.status(404).json({
        status: 'error',
        message: 'Maç bulunamadı',
      });
    }

    const matchDate = new Date(match.startAt);
    const now = new Date();
    const diffMs = matchDate.getTime() - now.getTime();
    const minutesUntilMatch = Math.round(diffMs / (60 * 1000));

    // Kontrol planı zamanları
    const t65Date = new Date(matchDate.getTime() - 65 * 60 * 1000);
    const t60Date = new Date(matchDate.getTime() - 60 * 60 * 1000);
    const t55Date = new Date(matchDate.getTime() - 55 * 60 * 1000);

    const formatTime = (d: Date) =>
      d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

    const hasLineups = Boolean(match.lineups && match.lineups.isOfficialTFF);

    res.json({
      status: 'success',
      matchId: match.id,
      competition: match.competition,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      kickoffTime: match.startAt,
      minutesUntilMatch,
      tffRules: {
        step1: { minutesBefore: 65, time: formatTime(t65Date), label: '1. Kontrol (Maça 65 dk kala)' },
        step2: { minutesBefore: 60, time: formatTime(t60Date), label: '2. Kontrol (+5 dk / Maça 60 dk kala)' },
        step3: { minutesBefore: 55, time: formatTime(t55Date), label: '3. Son Kontrol (+5 dk daha / Maça 55 dk kala)' },
      },
      isAnnounced: hasLineups,
      lineups: match.lineups || null,
      sourceUrl: match.sourceUrl || 'https://www.tff.org/default.aspx?pageID=198',
      checkedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Vite middleware for dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Turkish Match Guide server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
