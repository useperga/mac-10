import React, { useState } from 'react';
import { TeamLineup, LineupPlayer } from '../types';
import { ShieldCheck, User, Star, Shirt } from 'lucide-react';

interface TacticalPitchProps {
  homeLineup: TeamLineup;
  awayLineup: TeamLineup;
  homeTeamName: string;
  awayTeamName: string;
  homeColor?: string;
  awayColor?: string;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  homeLineup,
  awayLineup,
  homeTeamName,
  awayTeamName,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const [selectedPlayer, setSelectedPlayer] = useState<LineupPlayer | null>(null);

  const currentLineup = selectedTeam === 'home' ? homeLineup : awayLineup;
  const currentTeamName = selectedTeam === 'home' ? homeTeamName : awayTeamName;

  // Formasyona göre oyuncuları hatlara böl (Örn: 4-2-3-1 => GK, 4 DF, 2 MF, 3 MF, 1 FW)
  const players = currentLineup.startingEleven || [];

  // Pozisyona veya formasyona göre katmanlar oluştur
  const gk = players.filter((p) => p.position === 'GK' || p.isGoalkeeper);
  const others = players.filter((p) => p.position !== 'GK' && !p.isGoalkeeper);

  // Hatları tespit et: Standart 4 hat (DF, MF_DEF, MF_ATT, FW) veya 3 hat (DF, MF, FW)
  const df = others.filter((p) => p.position === 'DF');
  const mf = others.filter((p) => p.position === 'MF');
  const fw = others.filter((p) => p.position === 'FW');

  // Eğer MF sayısı çoksa (örn: 5), iki hatta böl (3 ve 2)
  let midDef: LineupPlayer[] = [];
  let midAtt: LineupPlayer[] = [];

  if (mf.length >= 4) {
    const half = Math.floor(mf.length / 2);
    midDef = mf.slice(0, half);
    midAtt = mf.slice(half);
  } else {
    midDef = mf;
  }

  const isHome = selectedTeam === 'home';
  const jerseyColor = isHome
    ? 'bg-gradient-to-b from-red-600 to-amber-500 text-white border-amber-300'
    : 'bg-gradient-to-b from-indigo-800 to-sky-600 text-white border-sky-300';

  const gkJerseyColor = 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white border-emerald-300';

  return (
    <div className="space-y-3 select-none">
      {/* Takım Seçim Sekmesi & Formasyon Bilgisi */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => {
              setSelectedTeam('home');
              setSelectedPlayer(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedTeam === 'home'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="truncate">{homeTeamName}</span>
            {homeLineup.formation && (
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono font-normal">
                {homeLineup.formation}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTeam('away');
              setSelectedPlayer(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedTeam === 'away'
                ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="truncate">{awayTeamName}</span>
            {awayLineup.formation && (
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono font-normal">
                {awayLineup.formation}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Taktik Yeşil Futbol Sahası */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-emerald-800 flex flex-col justify-between p-4">
        {/* Çim Çizgileri ve Doku */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(0,0,0,0.15) 32px, rgba(0,0,0,0.15) 64px)',
          }}
        />

        {/* Saha Dış Çizgisi & Orta Çizgi */}
        <div className="absolute inset-3 border-2 border-white/40 rounded-xl pointer-events-none" />
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 border-t-2 border-white/40 pointer-events-none" />

        {/* Orta Yuvarlak & Nokta */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 border-2 border-white/40 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full pointer-events-none" />

        {/* Üst Ceza Sahası (Rakip Kale) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-14 sm:h-20 border-b-2 border-l-2 border-r-2 border-white/40 rounded-b-xl pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-6 sm:h-8 border-b-2 border-l-2 border-r-2 border-white/40 pointer-events-none" />
        </div>

        {/* Alt Ceza Sahası (Bizim Kale) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-14 sm:h-20 border-t-2 border-l-2 border-r-2 border-white/40 rounded-t-xl pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-6 sm:h-8 border-t-2 border-l-2 border-r-2 border-white/40 pointer-events-none" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-12 border-t-2 border-white/40 rounded-t-full pointer-events-none" />
        </div>

        {/* Saha İçi Taktik Başlık */}
        <div className="relative z-10 flex items-center justify-between text-white/90 text-[11px] font-bold px-1">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            TFF Onaylı 11
          </span>
          {currentLineup.coach && (
            <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md text-amber-300 truncate max-w-[150px]">
              TD: {currentLineup.coach}
            </span>
          )}
        </div>

        {/* Saha İçi Oyuncular: Hat Hat Dizilim */}
        <div className="relative z-20 flex-1 flex flex-col justify-around py-2">
          {/* Forvet Hattı (FW) */}
          <div className="flex items-center justify-around px-4">
            {fw.map((player) => (
              <PlayerPitchNode
                key={`fw-${player.number}-${player.name}`}
                player={player}
                jerseyColor={jerseyColor}
                isSelected={selectedPlayer?.name === player.name}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>

          {/* Ofansif / İleri Orta Saha (MF_ATT) */}
          {midAtt.length > 0 && (
            <div className="flex items-center justify-around px-2">
              {midAtt.map((player) => (
                <PlayerPitchNode
                  key={`mf-att-${player.number}-${player.name}`}
                  player={player}
                  jerseyColor={jerseyColor}
                  isSelected={selectedPlayer?.name === player.name}
                  onClick={() => setSelectedPlayer(player)}
                />
              ))}
            </div>
          )}

          {/* Defansif / Merkez Orta Saha (MF_DEF) */}
          <div className="flex items-center justify-around px-4">
            {midDef.map((player) => (
              <PlayerPitchNode
                key={`mf-def-${player.number}-${player.name}`}
                player={player}
                jerseyColor={jerseyColor}
                isSelected={selectedPlayer?.name === player.name}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>

          {/* Defans Hattı (DF) */}
          <div className="flex items-center justify-around px-2">
            {df.map((player) => (
              <PlayerPitchNode
                key={`df-${player.number}-${player.name}`}
                player={player}
                jerseyColor={jerseyColor}
                isSelected={selectedPlayer?.name === player.name}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>

          {/* Kaleci (GK) */}
          <div className="flex items-center justify-center">
            {gk.map((player) => (
              <PlayerPitchNode
                key={`gk-${player.number}-${player.name}`}
                player={player}
                jerseyColor={gkJerseyColor}
                isSelected={selectedPlayer?.name === player.name}
                onClick={() => setSelectedPlayer(player)}
                isGK
              />
            ))}
          </div>
        </div>

        {/* Seçili Oyuncu Detay Alt Popover'ı */}
        {selectedPlayer && (
          <div className="relative z-30 bg-slate-950/95 backdrop-blur border border-slate-700 text-white rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-indigo-400">
                {selectedPlayer.number}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-bold truncate text-slate-100">{selectedPlayer.name}</h5>
                  {selectedPlayer.isCaptain && (
                    <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1 rounded">
                      (C) KAPTAN
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">
                  {selectedPlayer.position === 'GK'
                    ? 'Kaleci'
                    : selectedPlayer.position === 'DF'
                    ? 'Defans'
                    : selectedPlayer.position === 'MF'
                    ? 'Orta Saha'
                    : selectedPlayer.position === 'FW'
                    ? 'Forvet'
                    : 'Oyuncu'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlayer(null)}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-md"
            >
              Kapat
            </button>
          </div>
        )}
      </div>

      {/* Yedek Kulübesi Listesi */}
      {currentLineup.substitutes && currentLineup.substitutes.length > 0 && (
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-slate-400" />
              Yedek Kulübesi ({currentLineup.substitutes.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {currentLineup.substitutes.map((sub) => (
              <div
                key={`sub-${sub.number}-${sub.name}`}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs text-slate-200"
              >
                <span className="w-5 text-center font-mono font-bold text-slate-400 text-[11px] shrink-0">
                  {sub.number}
                </span>
                <span className="truncate text-[11px] font-medium">{sub.name}</span>
                {sub.position && (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-900/80 px-1 py-0.5 rounded ml-auto shrink-0">
                    {sub.position}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface PlayerPitchNodeProps {
  player: LineupPlayer;
  jerseyColor: string;
  isSelected: boolean;
  onClick: () => void;
  isGK?: boolean;
}

const PlayerPitchNode: React.FC<PlayerPitchNodeProps> = ({
  player,
  jerseyColor,
  isSelected,
  onClick,
  isGK,
}) => {
  // İsmi kısalt (Örn: "Gökhan Değirmenci" => "Değirmenci" veya "G. Değirmenci")
  const nameParts = player.name.trim().split(' ');
  const displayName =
    nameParts.length > 1 ? `${nameParts[0][0]}. ${nameParts.slice(1).join(' ')}` : player.name;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center justify-center p-0.5 rounded-lg transition-transform focus:outline-none ${
        isSelected ? 'scale-115 z-30' : 'hover:scale-108 z-20'
      }`}
      title={`${player.number} - ${player.name} (${player.position || 'Oyuncu'})`}
    >
      {/* Forma Dairesi */}
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono font-black text-xs sm:text-sm border-2 shadow-lg relative transition-all ${jerseyColor} ${
          isSelected ? 'ring-3 ring-amber-400 ring-offset-1 ring-offset-emerald-900' : ''
        }`}
      >
        <span>{player.number}</span>

        {/* Kaptan Rozeti */}
        {player.isCaptain && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 text-[8px] font-black rounded-full flex items-center justify-center shadow-xs border border-white">
            C
          </span>
        )}

        {/* Kaleci Rozeti */}
        {isGK && (
          <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-emerald-400 text-slate-950 text-[8px] font-black rounded-full flex items-center justify-center shadow-xs border border-white">
            🧤
          </span>
        )}
      </div>

      {/* Oyuncu Adı Etiketi */}
      <span
        className={`mt-1 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-md shadow-xs truncate max-w-[76px] sm:max-w-[90px] text-center leading-tight transition-colors ${
          isSelected
            ? 'bg-amber-400 text-slate-950 font-black'
            : 'bg-black/60 text-white/95 backdrop-blur-xs group-hover:bg-black/80'
        }`}
      >
        {displayName}
      </span>
    </button>
  );
};
