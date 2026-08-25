# Türk Maç Rehberi (Mobile App - Expo / React Native)

Türk takımlarının ve futbol karşılaşmalarının önümüzdeki 7 günlük maç takvimini, başlama saatlerini, lig ve yayıncı kanallarını listeleyen, Android ve iOS uyumlu mobil uygulama.

---

## 📱 Özellikler
- **Önümüzdeki 7 Günlük Fikstür:** Günlere göre gruplanmış maç kartları (Tarih, Saat, Lig, Ev Sahibi - Deplasman, Yayıncı Kanallar).
- **Türkiye Saati (Europe/Istanbul UTC+3):** Cihaz hangi saat diliminde olursa olsun maç saatleri Türkiye yerel saatiyle tutarlı gösterilir.
- **Anlık Filtreleme & Arama:** Takım adı veya yayıncı kanal adına göre Türkçe karakter duyarlı hızlı arama.
- **Ağ & Çevrimdışı Dayanıklılığı (Offline Cache):** Son başarılı veriyi önbelleğe alma, bağlantı kesildiğinde kullanıcıya bildirimle önbellekten sunma, API yoksa zengin demo veri sağlayıcısı.
- **Erişilebilirlik (A11y):** WCAG uyumlu kontrast, en az 44x44 dp dokunmatik butonlar ve ekran okuyucu etiketleri (`accessibilityRole`, `accessibilityLabel`).
- **Kaynaklar & Doğrulama:** TFF, Maçkolik, TRT Spor, A Spor, beIN Sports ve MacEkran doğrudan erişim bağlantıları.

---

## 🛠️ Teknoloji ve Mimari
- **Framework:** Expo Managed Workflow (SDK 52+)
- **Dil:** TypeScript (Strict Mod)
- **Arayüz:** React Native Bileşenleri (`View`, `Text`, `FlatList`, `RefreshControl`, `SafeAreaView`, `TextInput`, `Pressable`, `StyleSheet`)
- **Stil & Tema:** `src/theme/index.ts` merkezi renk ve spacing sistemi
- **Depolama:** AsyncStorage / Web adaptörü ile versiyonlu önbellek (`src/storage/cache.ts`)

---

## 📂 Proje Dizin Yapısı
```
├── app.json                  # Expo mobil yapılandırması (iOS & Android paket bilgileri)
├── eas.json                  # Expo Application Services (EAS) derleme profilleri
├── src/
│   ├── components/           # UI Bileşenleri
│   │   ├── DaySection.tsx    # Gün başlığı ve maç listesi
│   │   ├── Header.tsx        # Üst başlık çubuğu ve yenile butonu
│   │   ├── MatchCard.tsx     # Maç kartı (saat, takımlar, yayıncı etiketleri)
│   │   ├── SearchBar.tsx     # Arama çubuğu ve temizleme butonu
│   │   ├── SourcesSection.tsx# Doğrulama kaynakları linkleri
│   │   ├── StateViews.tsx    # Yükleniyor, Hata, Boş durum ve Sonuç yok ekranları
│   │   └── StatusBanner.tsx  # Veri durumu, önbellek ve güncelleme rozeti
│   ├── config/               # Yapılandırmalar
│   │   ├── api.ts            # API URL, zaman aşımı ve cache TTL
│   │   └── sources.ts        # Resmi spor ve yayın kaynakları listesi
│   ├── screens/
│   │   └── HomeScreen.tsx    # Ana ekran orkestrasyonu
│   ├── services/
│   │   ├── demoMatches.ts    # 7 günlük örnek rehber verisi
│   │   └── matchesService.ts # Uzak API çekme, normalizasyon ve hata yönetimi
│   ├── storage/
│   │   └── cache.ts          # Cihaz önbellek adaptörü
│   ├── theme/
│   │   └── index.ts          # Renk, tipografi, boşluk ve gölge sabitleri
│   ├── types/                # TypeScript interface ve modelleri
│   └── utils/
│       ├── date.ts           # TR saat dilimi tarih/saat yardımcıları
│       └── filter.ts         # Türkçe arama ve gruplama fonksiyonları
├── App.tsx                   # Canlı Web Önizleme ve Mobil Cihaz Simülatörü
└── App.mobile.tsx            # Saf Expo/React Native Native Giriş Dosyası
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ ve npm / yarn / bun
- Expo CLI (`npx expo`)

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Ortamını Başlatın (Expo)
```bash
npx expo start
```
- **Android Emulator:** Terminalde `a` tuşuna basın.
- **iOS Simulator:** Terminalde `i` tuşuna basın.
- **Expo Go (Fiziksel Cihaz):** Ekrana gelen QR kodu Expo Go uygulaması ile taratın.

---

## 📦 Android ve iOS Üretim (EAS Build)

### EAS CLI Kurulumu
```bash
npm install -g eas-cli
eas login
```

### Android APK / AAB Üretimi
```bash
# Test APK'sı oluşturma (Cihaza doğrudan yükleme için)
eas build --platform android --profile preview

# Google Play Store için AAB paketi oluşturma
eas build --platform android --profile production
```

### iOS Simulator & TestFlight Üretimi
```bash
# iOS Simulator için derleme
eas build --platform ios --profile development

# App Store / TestFlight için derleme
eas build --platform ios --profile production
```

---

## 🔐 API Güvenliği ve Ortam Değişkenleri
- `EXPO_PUBLIC_MATCHES_API_URL`: Uzak API adresi (boş ise yerel demo veri kullanılır).
- `EXPO_PUBLIC_MATCHES_API_KEY`: API anahtarı.
> ⚠️ **Önemli Not:** Mobil uygulama paketleri tersine mühendislikle incelenebildiği için gizli API anahtarları doğrudan mobil koda gömülmemelidir. Üretim ortamında API anahtarlarının backend proxy arkasında tutulması önerilir.
