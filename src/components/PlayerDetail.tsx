import { useState, useEffect } from 'react';
import { Player, Team } from '../types';
import { ArrowLeft, User, Club, Shield, Flag, Award, Activity, Heart } from 'lucide-react';

interface PlayerDetailProps {
  playerId: number;
  onBack: () => void;
  onSelectTeam: (teamId: number) => void;
}

interface FullPlayerDetails extends Player {
  team: Team | null;
  stats: any;
}

export default function PlayerDetail({ playerId, onBack, onSelectTeam }: PlayerDetailProps) {
  const [player, setPlayer] = useState<FullPlayerDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPlayerDetails();
  }, [playerId]);

  const fetchPlayerDetails = async () => {
    try {
      const res = await fetch(`/api/players/${playerId}`);
      if (res.ok) {
        const data = await res.json();
        setPlayer(data);
      }
    } catch (err) {
      console.error('Failed to get player details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-xs">Fetching player profile...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20 bg-zinc-50 rounded-2xl">
        <ArrowLeft className="w-6 h-6 text-zinc-400 mx-auto mb-2 cursor-pointer" onClick={onBack} />
        <p className="text-zinc-500 text-sm font-semibold">Player details could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
          id="player-back-link"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Squad
        </button>
      </div>

      {/* Main player card banner element */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-slate-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Subtle geometric overlay background */}
        <div className="absolute right-0 top-0 bottom-0 pr-8 opacity-5 flex items-center justify-center select-none pointer-events-none">
          <User className="w-48 h-48 text-slate-100" />
        </div>

        {/* Character profile mockup */}
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-200 text-lg font-black shadow-inner font-mono">
          {player.position === 'Forward' && 'FW'}
          {player.position === 'Midfielder' && 'MF'}
          {player.position === 'Defender' && 'DF'}
          {player.position === 'Goalkeeper' && 'GK'}
        </div>

        <div className="text-center sm:text-left flex-1 space-y-3">
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                {player.name}
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-widest">
                {player.position}
              </span>
            </div>
            
            {player.team && (
              <p 
                onClick={() => onSelectTeam(player.team!.id)}
                className="text-slate-455 hover:text-emerald-400 mt-1 uppercase font-extrabold tracking-widest flex items-center justify-center sm:justify-start gap-1 cursor-pointer text-xs"
                id="player-team-link"
              >
                <Award className="w-4 h-4 text-emerald-400" /> {player.team.name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-500" /> Born: {player.nationality}
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" /> Age: {player.age} Years Old
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Stat blocks */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-1.5 pb-2.5 border-b border-slate-100 font-display">
          <Activity className="w-4.5 h-4.5 text-slate-500" /> Campaign Metrics & Stats
        </h2>

        {/* Dynamic block metrics bento catalog */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Appearances</span>
            <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.appearances}</span>
          </div>

          {player.position === 'Forward' && (
            <>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Goals Scored</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">{player.stats.goals}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Assists</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.assists}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Shots on Target</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.shots_on_target}</span>
              </div>
            </>
          )}

          {player.position === 'Midfielder' && (
            <>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Assists Provided</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">{player.stats.assists}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Key Passes</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.key_passes}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Pass Accuracy</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.pass_accuracy}</span>
              </div>
            </>
          )}

          {player.position === 'Defender' && (
            <>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tackles</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">{player.stats.tackles}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Duels Won</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.duels_won}</span>
               </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Interceptions</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.interceptions}</span>
              </div>
            </>
          )}

          {player.position === 'Goalkeeper' && (
            <>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Clean Sheets</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">{player.stats.clean_sheets}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Saves Registered</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.saves}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Goals Conceded</span>
                <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{player.stats.conceded}</span>
              </div>
            </>
          )}

          <div className="bg-slate-50/50 border border-slate-200/60 hover:bg-slate-100/40 hover:border-slate-300 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tactical Rating</span>
            <span className="text-2xl font-black text-amber-500 mt-1 font-mono">★ {player.stats.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
