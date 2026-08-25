import React from 'react';
import { Match, MatchDay } from '../types';
import { MatchCard } from './MatchCard';

interface DaySectionProps {
  day: MatchDay;
  onSelectMatch?: (match: Match) => void;
  isReminderActive?: (matchId: string) => boolean;
  onToggleReminder?: (match: Match) => void;
}

export const DaySection: React.FC<DaySectionProps> = ({
  day,
  onSelectMatch,
  isReminderActive,
  onToggleReminder,
}) => {
  return (
    <section id={`day-section-${day.dateKey}`} className="space-y-3" aria-labelledby={`day-heading-${day.dateKey}`}>
      {/* Gün Başlığı */}
      <div className="sticky top-0 z-10 py-1.5 backdrop-blur-md bg-slate-50/90 -mx-1 px-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              day.isToday ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'
            }`}
            aria-hidden="true"
          />
          <h2
            id={`day-heading-${day.dateKey}`}
            className={`text-sm sm:text-base font-bold tracking-tight ${
              day.isToday ? 'text-indigo-950' : 'text-slate-700'
            }`}
          >
            {day.label}
          </h2>
          <span className="text-xs font-medium text-slate-400 ml-auto">
            {day.matches.length} maç
          </span>
        </div>
      </div>

      {/* Maç Kartları */}
      <div className="space-y-2.5">
        {day.matches.map((match, idx) => (
          <MatchCard
            key={match.id || `match-${day.dateKey}-${idx}`}
            match={match}
            index={idx}
            onSelect={onSelectMatch}
            isReminderActive={isReminderActive ? isReminderActive(match.id || `${match.homeTeam}-${match.awayTeam}`) : false}
            onToggleReminder={onToggleReminder}
          />
        ))}
      </div>
    </section>
  );
};
