import { useState, useEffect } from 'react';
import { Player, Team, Match } from '../types';
import { ArrowLeft, MapPin, Calendar, Users, Trophy, ChevronRight, Hash, Star } from 'lucide-react';

interface TeamDetailProps {
  teamId: number;
  onBack: () => void;
  onSelectPlayer: (playerId: number) => void;
  onSelectMatch: (matchId: number) => void;
}

interface FullTeamDetails extends Team {
  squad: Player[];
  matches: Match[];
}

export default function TeamDetail({ teamId, onBack, onSelectPlayer, onSelectMatch }: TeamDetailProps) {
  const [team, setTeam] = useState<FullTeamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (err) {
      console.error('Failed to get team details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-xs">Fetching squad details...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-20 bg-zinc-50 rounded-2xl">
        <ArrowLeft className="w-6 h-6 text-zinc-400 mx-auto mb-2 cursor-pointer" onClick={onBack} />
        <p className="text-zinc-500 text-sm">Team profile could not be found.</p>
      </div>
    );
  }

  // De-duplicate squad players categorized by tactical positions
  const goalkeepers = team.squad.filter(p => p.position === 'Goalkeeper');
  const defenders = team.squad.filter(p => p.position === 'Defender');
  const midfielders = team.squad.filter(p => p.position === 'Midfielder');
  const forwards = team.squad.filter(p => p.position === 'Forward');

  return (
    <div className="space-y-6">
      {/* Return link header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
          id="team-back-button"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Standings
        </button>
      </div>

      {/* Team profile header banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative shadow-sm">
        <img
          src={team.logo}
          alt={team.name}
          className="w-24 h-24 sm:w-28 sm:h-28 object-cover border border-slate-200 bg-white p-2.5 rounded-2xl shadow-sm"
          referrerPolicy="no-referrer"
        />

        <div className="text-center md:text-left flex-1 space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {team.name}
            </h1>
            <p className="text-slate-500 font-bold text-xs mt-0.5">{team.country} • European Football Club</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs font-mono text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-450" /> Established: {team.founded}
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-450" /> Arena: {team.venue}
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-450" /> Squad Size: {team.squad.length} Players
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Columns = Squad Roster List (L), Recent matches list (R) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Squad list sidebar columns */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 pb-2.5 border-b border-slate-100 font-display">
            <Users className="w-4.5 h-4.5 text-slate-500" /> Team Squad & Players
          </h2>

          {team.squad.length === 0 ? (
            <p className="text-xs text-slate-400">Roster data is loading.</p>
          ) : (
            <div className="space-y-6">
              {/* Category: Forwards */}
              {renderRosterSection('Forwards / Attackers', forwards)}
              
              {/* Category: Midfields */}
              {renderRosterSection('Midfield Playmakers', midfielders)}

              {/* Category: Defenders */}
              {renderRosterSection('Defensive Wall', defenders)}

              {/* Category: Goalkeeper */}
              {renderRosterSection('Goalkeepers', goalkeepers)}
            </div>
          )}
        </div>

        {/* Recent match lists */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 pb-2.5 border-b border-slate-100 font-display">
            <Trophy className="w-4.5 h-4.5 text-slate-500" /> Campaign Fixtures
          </h2>

          {team.matches.length === 0 ? (
            <p className="text-xs text-slate-400">No played matches registered for this club.</p>
          ) : (
            <div className="space-y-3">
              {team.matches.map((match) => {
                const isHome = match.home_team_id === team.id;
                
                // Fetch opponent name
                const oppName = isHome ? match.away_team?.name || 'Away Adversary' : match.home_team?.name || 'Home Adversary';

                const scoreText = match.status === 'UPCOMING' 
                  ? 'Scheduled'
                  : `${match.home_score} - ${match.away_score}`;

                return (
                  <div
                    key={match.id}
                    onClick={() => onSelectMatch(match.id)}
                    className="border border-slate-200 rounded-xl p-3 hover:bg-slate-50 hover:border-slate-350 cursor-pointer transition-colors flex items-center justify-between text-xs group"
                    id={`team-match-${match.id}`}
                  >
                    <div>
                      <span className="font-mono text-[9px] text-slate-450 uppercase tracking-wider block mb-0.5 bold">
                        {match.status === 'FINISHED' ? 'Completed' : match.status === 'LIVE' ? 'Playing Live' : 'Fixture'}
                      </span>
                      <span className="font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {isHome ? 'vs ' : 'at '} {oppName}
                      </span>
                    </div>

                    <span className="bg-slate-100 font-mono font-extrabold text-[#0f172a] px-2.5 py-1 border border-slate-200 rounded text-[11px] min-w-[50px] text-center">
                      {scoreText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderRosterSection(title: string, group: Player[]) {
    if (group.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
          {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {group.map((player) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player.id)}
              className="border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all group shadow-sm bg-white"
              id={`squad-player-${player.id}`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <Star className="w-4 h-4 text-slate-400 group-hover:text-amber-500 fill-transparent group-hover:fill-amber-500 transition-colors" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-850 text-xs sm:text-xs tracking-tight group-hover:text-emerald-700 transition-colors">
                    {player.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold mb-0">Age {player.age} • {player.nationality}</p>
                </div>
              </div>
              
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                View stats <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
