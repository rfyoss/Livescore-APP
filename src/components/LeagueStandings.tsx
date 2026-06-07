import { useState, useEffect } from 'react';
import { Standing, League } from '../types';
import { Trophy, Shield, HelpCircle, Activity } from 'lucide-react';

interface LeagueStandingsProps {
  onSelectTeam: (teamId: number) => void;
}

export default function LeagueStandings({ onSelectTeam }: LeagueStandingsProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('PL');
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    fetchStandings();
  }, [selectedLeague]);

  const fetchLeagues = async () => {
    try {
      setLeagues([
        { id: 'PL', name: 'Premier League', country: 'England', logo: '', season: '2025/2026' },
        { id: 'LL', name: 'La Liga', country: 'Spain', logo: '', season: '2025/2026' }
      ]);
    } catch (err) {}
  };

  const fetchStandings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/standings/${selectedLeague}`);
      if (res.ok) {
        const data = await res.json();
        setStandings(data);
      }
    } catch (err) {
      console.error('Failed to grab standings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5 font-display">
            <Trophy className="w-4.5 h-4.5 text-slate-500" /> League Standing Matrices
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Real-time updated win/draw records of active campaigns.</p>
        </div>

        {/* League selection pills */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-max border border-slate-200/40">
          <button
            onClick={() => setSelectedLeague('PL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedLeague === 'PL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
            }`}
            id="league-btn-pl"
          >
            Premier League 🇬🇧
          </button>
          <button
            onClick={() => setSelectedLeague('LL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedLeague === 'LL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
            }`}
            id="league-btn-ll"
          >
            La Liga 🇪🇸
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-semibold">Fetching standing positions...</p>
        </div>
      ) : standings.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No Standings Data Recorded</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/70 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[9px] tracking-wider">
                <th className="py-3 px-4 font-bold text-center w-12">Pos</th>
                <th className="py-3 px-4 font-bold">Club Team</th>
                <th className="py-3 px-3 font-bold text-center w-12">Pl</th>
                <th className="py-3 px-3 font-bold text-center w-10 font-bold">W</th>
                <th className="py-3 px-3 font-bold text-center w-10 font-bold">D</th>
                <th className="py-3 px-3 font-bold text-center w-10 font-bold">L</th>
                <th className="py-3 px-3 font-bold text-center w-16 font-bold">GD</th>
                <th className="py-3 px-4 font-bold text-center w-16 bg-slate-50">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standings.map((row, index) => {
                const gd = row.goals_for - row.goals_against;
                const position = index + 1;
                
                // Highlight Champions League qualifying zones
                const isUCLQualifier = position <= 2;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectTeam(row.team_id)}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    id={`standing-row-${row.team_id}`}
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center mx-auto font-extrabold ${
                        position === 1 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200/50' 
                          : isUCLQualifier 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                          : 'text-slate-500 bg-slate-100 border border-slate-200/30'
                      }`}>
                        {position}
                      </span>
                    </td>

                    {/* Team Profile */}
                    <td className="py-3.5 px-4 text-slate-900 font-extrabold">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.team?.logo}
                          alt={row.team?.name}
                          className="w-7 h-7 object-cover bg-slate-50 border border-slate-200 p-0.5 rounded"
                          referrerPolicy="no-referrer"
                        />
                        <span className="hover:text-emerald-600 transition-colors font-extrabold whitespace-nowrap">
                          {row.team?.name}
                        </span>
                      </div>
                    </td>

                    {/* Stats columns */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-700 font-medium">{row.played}</td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-600">{row.win}</td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-600">{row.draw}</td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-600">{row.loss}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-extrabold text-slate-700">
                      {gd > 0 ? `+${gd}` : gd}
                    </td>
                    
                    {/* Points values */}
                    <td className="py-3.5 px-4 text-center font-mono font-black text-slate-900 bg-slate-50/80">
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Qualification indicators legends */}
      <div className="flex flex-wrap gap-4 text-[9px] font-mono text-slate-500 pt-3 border-t border-slate-100 uppercase tracking-widest font-extrabold">
        <span className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 bg-amber-100 border border-amber-200/40 rounded" /> League Leader
        </span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 bg-emerald-50 border border-emerald-100 rounded" /> Champions League Qual
        </span>
      </div>
    </div>
  );
}
