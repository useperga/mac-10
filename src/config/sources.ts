import { SourceLink } from '../types';

/**
 * Türk Maç Rehberi - "Kaynaklar — kendin doğrula" Yapılandırması
 * Gerçek spor fikstür ve yayın kaynakları
 */
export const VERIFIED_SOURCES: SourceLink[] = [
  {
    id: 'tff',
    name: 'TFF (www.tff.org)',
    category: 'Resmi Fikstür & Program',
    url: 'https://www.tff.org/default.aspx?pageID=198',
    description: 'Türkiye Futbol Federasyonu resmi lig fikstürü, maç saatleri ve hakem atamaları.',
  },
  {
    id: 'bein-sports',
    name: 'beIN SPORTS (www.beinsports.com.tr)',
    category: 'Resmi Süper Lig Yayıncısı',
    url: 'https://beinsports.com.tr/yayin-akisi',
    description: 'Trendyol Süper Lig ve 1. Lig resmi canlı maç yayınları, beIN Sports 1/2 ve TOD akışı.',
  },
  {
    id: 'trt-spor',
    name: 'TRT Spor (www.trtspor.com.tr)',
    category: 'Kamu & Avrupa Yayıncısı',
    url: 'https://www.trtspor.com.tr/yayin-akisi',
    description: 'TRT Spor, TRT 1, TRT Spor Yıldız ve Tabii canlı maç yayın akışı.',
  },
  {
    id: 'aspor',
    name: 'A Spor (www.aspor.com.tr)',
    category: 'Kupa & Spor Yayıncısı',
    url: 'https://www.aspor.com.tr/yayin-akisi',
    description: 'Ziraat Türkiye Kupası karşılaşmaları ve spor bültenleri yayın akışı.',
  },
];
