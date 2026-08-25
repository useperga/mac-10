/**
 * Türk Maç Rehberi - Merkezi Tema ve Stil Sabitleri
 */

export const THEME = {
  colors: {
    // Arka planlar
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    cardHighlight: '#F1F5F9',
    divider: '#E2E8F0',
    border: '#E2E8F0',

    // Tipografi Renkleri
    textPrimary: '#0F172A', // Koyu lacivert
    textSecondary: '#64748B', // Nötr gri
    textMuted: '#94A3B8', // Açık gri
    textInverse: '#FFFFFF',

    // Vurgu ve Marka Renkleri
    primary: '#4338CA', // Koyu lacivert-mor
    primaryLight: '#EEF2FF',
    primaryDark: '#312E81',
    accent: '#6366F1',

    // Yayıncı Etiketi Renkleri (Mor Tonları)
    broadcasterBg: '#EEF2FF',
    broadcasterText: '#4338CA',
    broadcasterBorder: '#C7D2FE',
    broadcasterUnannouncedBg: '#F1F5F9',
    broadcasterUnannouncedText: '#64748B',

    // Durum Renkleri
    success: '#10B981', // Canlı / Güncel
    successBg: '#ECFDF5',
    warning: '#F59E0B', // Cache / Eski veri
    warningBg: '#FFFBEB',
    error: '#EF4444', // Hata
    errorBg: '#FEF2F2',
    info: '#3B82F6', // Demo
    infoBg: '#EFF6FF',

    // Etkileşim
    touchHighlight: '#E0E7FF',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    section: 32,
  },

  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    pill: 9999,
  },

  typography: {
    fontSizes: {
      caption: 12,
      small: 13,
      body: 15,
      subheading: 17,
      title: 20,
      header: 24,
    },
    fontWeights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
  },

  // Dokunmatik Hedef Standartları
  accessibility: {
    minTouchTargetSize: 44, // WCAG / Apple & Android standardı (44x44 dp)
  },

  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
  },
};
