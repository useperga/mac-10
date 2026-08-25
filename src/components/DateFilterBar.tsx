import React from 'react';
import { Calendar, Filter, Star, Shield, Trophy, Flag, CheckCircle2, Bell } from 'lucide-react';
import { MatchDay } from '../types';

export type LeagueFilter = 'all' | 'superlig' | 'tff1' | 'national' | 'europe' | 'with-lineup' | 'reminders';

interface DateFilterBarProps {
  days: MatchDay[];
  selectedDateKey: string | 'all';
  onSelectDateKey: (dateKey: string | 'all') => void;
  selectedLeague: LeagueFilter;
  onSelectLeague: (league: LeagueFilter) => void;
  totalMatchCount: number;
  activeReminderCount: number;
}

export const DateFilterBar: React.FC<DateFilterBarProps> = ({
  days,
  selectedDateKey,
  onSelectDateKey,
  selectedLeague,
  onSelectLeague,
  totalMatchCount,
  activeReminderCount,
}) => {
  const leagueOptions: Array<{
    id: LeagueFilter;
    label: string;
    icon: React.ReactNode;
    badgeCount?: number;
  }> = [
    { id: 'all', label: 'Tüm Maçlar', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'superlig', label: 'Süper Lig', icon: <Trophy className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'tff1', label: 'TFF 1. Lig', icon: <Shield className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'national', label: 'A Milli Takım', icon: <Flag className="w-3.5 h-3.5 text-red-500" /> },
    { id: 'europe', label: 'Avrupa Kupaları', icon: <Trophy className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'with-lineup', label: 'Kadrosu Açıklananlar (TFF)', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> },
    {
      id: 'reminders',
      label: 'Hatırlatıcılarım',
      icon: <Bell className="w-3.5 h-3.5 text-amber-500" />,
      badgeCount: activeReminderCount > 0 ? activeReminderCount : undefined,
    },
  ];

  return (
    <div id="date-filter-bar" className="space-y-2.5 select-none">
      {/* 1. Sıra: 7 Günlük Yatay Tarih Şeridi */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
        {/* Tümü Butonu */}
        <button
          type="button"
          onClick={() => onSelectDateKey('all')}
          className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedDateKey === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Tüm Günler</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              selectedDateKey === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {totalMatchCount}
          </span>
        </button>

        {/* Günlük Haplar */}
        {days.map((day) => {
          const isSelected = selectedDateKey === day.dateKey;
          // Gün etiketini parçala ("Bugün · 25 Ağustos Salı" => "Bugün", "25 Ağu")
          const isToday = day.isToday;
          const matchCount = day.matches.length;

          return (
            <button
              key={`day-pill-${day.dateKey}`}
              type="button"
              onClick={() => onSelectDateKey(day.dateKey)}
              className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                  : isToday
                  ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex flex-col text-left leading-tight">
                <span className="truncate max-w-[120px]">{day.label}</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected
                    ? 'bg-white text-indigo-700'
                    : isToday
                    ? 'bg-amber-200 text-amber-950'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {matchCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Sıra: Lig ve Özel Filtre Çipleri */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {leagueOptions.map((opt) => {
          const isSelected = selectedLeague === opt.id;
          return (
            <button
              key={`league-opt-${opt.id}`}
              type="button"
              onClick={() => onSelectLeague(opt.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
              {opt.badgeCount !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">
                  {opt.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
