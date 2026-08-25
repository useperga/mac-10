import React, { useState } from 'react';

interface TeamAvatarProps {
  name: string;
  logoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Türk ve Dünya kulüpleri için özelleştirilmiş kurumsal renkler ve kısaltmalar
interface ClubStyle {
  initials: string;
  bg: string;
  textColor: string;
  border?: string;
  secondaryBg?: string;
}

const KNOWN_CLUBS: Record<string, ClubStyle> = {
  galatasaray: {
    initials: 'GS',
    bg: 'bg-gradient-to-br from-amber-500 via-amber-600 to-red-600',
    textColor: 'text-white',
    border: 'border-amber-400/40',
  },
  fenerbahçe: {
    initials: 'FB',
    bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-amber-400',
    textColor: 'text-amber-300',
    border: 'border-amber-400/40',
  },
  fenerbahce: {
    initials: 'FB',
    bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-amber-400',
    textColor: 'text-amber-300',
    border: 'border-amber-400/40',
  },
  beşiktaş: {
    initials: 'BJK',
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950',
    textColor: 'text-white',
    border: 'border-slate-400/50',
  },
  besiktas: {
    initials: 'BJK',
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950',
    textColor: 'text-white',
    border: 'border-slate-400/50',
  },
  trabzonspor: {
    initials: 'TS',
    bg: 'bg-gradient-to-br from-rose-900 via-rose-800 to-sky-500',
    textColor: 'text-sky-200',
    border: 'border-sky-400/40',
  },
  kocaelispor: {
    initials: 'KOC',
    bg: 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900',
    textColor: 'text-emerald-100',
    border: 'border-emerald-500/40',
  },
  amedspor: {
    initials: 'AMD',
    bg: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-red-600',
    textColor: 'text-white',
    border: 'border-emerald-400/40',
  },
  'amed sportif faaliyetler': {
    initials: 'AMD',
    bg: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-red-600',
    textColor: 'text-white',
    border: 'border-emerald-400/40',
  },
  sivasspor: {
    initials: 'SVS',
    bg: 'bg-gradient-to-br from-red-600 via-red-700 to-slate-900',
    textColor: 'text-white',
    border: 'border-red-400/40',
  },
  sakaryaspor: {
    initials: 'SAK',
    bg: 'bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-950',
    textColor: 'text-emerald-200',
    border: 'border-emerald-500/40',
  },
  gençlerbirliği: {
    initials: 'GB',
    bg: 'bg-gradient-to-br from-red-700 via-slate-900 to-slate-950',
    textColor: 'text-red-200',
    border: 'border-red-500/40',
  },
  'manisa fk': {
    initials: 'MAN',
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-600',
    textColor: 'text-white',
    border: 'border-slate-500/40',
  },
  türkiye: {
    initials: 'TR',
    bg: 'bg-gradient-to-br from-red-600 via-red-700 to-red-800',
    textColor: 'text-white',
    border: 'border-red-400/50',
  },
  'adana demirspor': {
    initials: 'ADS',
    bg: 'bg-gradient-to-br from-sky-600 via-blue-700 to-blue-900',
    textColor: 'text-white',
    border: 'border-sky-400/40',
  },
  kasımpaşa: {
    initials: 'KAS',
    bg: 'bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900',
    textColor: 'text-white',
    border: 'border-blue-400/40',
  },
  göztepe: {
    initials: 'GÖZ',
    bg: 'bg-gradient-to-br from-amber-500 via-amber-600 to-red-600',
    textColor: 'text-white',
    border: 'border-amber-400/40',
  },
  'bodrum fk': {
    initials: 'BOD',
    bg: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-amber-500',
    textColor: 'text-white',
    border: 'border-emerald-400/40',
  },
  kayserispor: {
    initials: 'KAY',
    bg: 'bg-gradient-to-br from-yellow-500 via-amber-600 to-red-600',
    textColor: 'text-slate-950',
    border: 'border-yellow-400/40',
  },
  alanyaspor: {
    initials: 'ALA',
    bg: 'bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-600',
    textColor: 'text-white',
    border: 'border-orange-400/40',
  },
  'young boys': {
    initials: 'YB',
    bg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-slate-950',
    textColor: 'text-slate-950',
    border: 'border-amber-400/40',
  },
  'olympique lyon': {
    initials: 'OL',
    bg: 'bg-gradient-to-br from-blue-700 via-blue-800 to-red-600',
    textColor: 'text-white',
    border: 'border-blue-400/40',
  },
  'kauno zalgiris': {
    initials: 'KZ',
    bg: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900',
    textColor: 'text-white',
    border: 'border-emerald-400/40',
  },
  'st. gallen': {
    initials: 'STG',
    bg: 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900',
    textColor: 'text-white',
    border: 'border-emerald-400/40',
  },
};

// Takım isminden deterministik kısaltma çıkarma
function extractInitials(name: string): string {
  if (!name) return 'FC';
  const cleanName = name.trim();
  const lower = cleanName.toLowerCase();

  // Bilinen kulüp kontrolü
  if (KNOWN_CLUBS[lower]) {
    return KNOWN_CLUBS[lower].initials;
  }

  // Kelimeleri böl
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return cleanName.slice(0, 3).toUpperCase();
  }
  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Bilinmeyen takımlar için renk üretimi
function getFallbackGradient(name: string): { bg: string; textColor: string } {
  const gradients = [
    { bg: 'bg-gradient-to-br from-blue-600 to-indigo-800', textColor: 'text-white' },
    { bg: 'bg-gradient-to-br from-teal-600 to-emerald-800', textColor: 'text-white' },
    { bg: 'bg-gradient-to-br from-purple-600 to-indigo-900', textColor: 'text-white' },
    { bg: 'bg-gradient-to-br from-amber-600 to-rose-700', textColor: 'text-white' },
    { bg: 'bg-gradient-to-br from-cyan-600 to-blue-800', textColor: 'text-white' },
    { bg: 'bg-gradient-to-br from-rose-600 to-slate-900', textColor: 'text-white' },
    { bg: 'bg-gradient-to-br from-slate-700 to-slate-900', textColor: 'text-white' },
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-xs sm:text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-18 h-18 text-xl font-bold',
};

export const TeamAvatar: React.FC<TeamAvatarProps> = ({
  name,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const cleanName = name || 'Takım';
  const lowerName = cleanName.toLowerCase();
  const knownClub = KNOWN_CLUBS[lowerName];
  const fallback = getFallbackGradient(cleanName);

  const initials = extractInitials(cleanName);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  const bgClasses = knownClub?.bg || fallback.bg;
  const textColorClasses = knownClub?.textColor || fallback.textColor;
  const borderClasses = knownClub?.border || 'border-slate-200/50';

  if (logoUrl && !imageError) {
    return (
      <div
        className={`relative shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xs border ${borderClasses} ${sizeClasses} ${className}`}
        title={cleanName}
      >
        <img
          src={logoUrl}
          alt={`${cleanName} logosu`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-1"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center font-extrabold tracking-tight shadow-xs border select-none transition-transform ${bgClasses} ${textColorClasses} ${borderClasses} ${sizeClasses} ${className}`}
      title={cleanName}
      aria-label={`${cleanName} simgesi`}
    >
      <span className="drop-shadow-xs">{initials}</span>
    </div>
  );
};
