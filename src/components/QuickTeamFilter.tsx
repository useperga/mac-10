import React from 'react';
import { TeamAvatar } from './TeamAvatar';

interface QuickTeamFilterProps {
  selectedTeam: string | null;
  onSelectTeam: (teamName: string | null) => void;
}

const POPULAR_TEAMS = [
  { name: 'Galatasaray', short: 'GS' },
  { name: 'Fenerbahçe', short: 'FB' },
  { name: 'Beşiktaş', short: 'BJK' },
  { name: 'Trabzonspor', short: 'TS' },
  { name: 'Kocaelispor', short: 'KOC' },
  { name: 'Amedspor', short: 'AMD' },
  { name: 'Türkiye', short: 'TR' },
  { name: 'Sivasspor', short: 'SVS' },
];

export const QuickTeamFilter: React.FC<QuickTeamFilterProps> = ({
  selectedTeam,
  onSelectTeam,
}) => {
  return (
    <div id="quick-team-filter" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-0.5">
        Kulüpler:
      </span>

      {/* Tümü Rozeti */}
      <button
        type="button"
        onClick={() => onSelectTeam(null)}
        className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
          selectedTeam === null
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        Tümü
      </button>

      {/* Popüler Takımlar */}
      {POPULAR_TEAMS.map((team) => {
        const isSelected = selectedTeam === team.name;
        return (
          <button
            key={`quick-team-${team.name}`}
            type="button"
            onClick={() => onSelectTeam(isSelected ? null : team.name)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <TeamAvatar name={team.name} size="xs" />
            <span>{team.name}</span>
          </button>
        );
      })}
    </div>
  );
};
