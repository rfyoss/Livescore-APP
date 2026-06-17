import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface LeagueStandingsProps {
  onSelectTeam: (teamId: number) => void;
}

export default function LeagueStandings({ onSelectTeam }: LeagueStandingsProps) {
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<any[]>([]);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch('/api/standings');
        const data = await res.json();

        // pastikan sorted by points
        const sorted = data.sort((a: any, b: any) => b.points - a.points);
        setStandings(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  const getZone = (position: number) => {
    if (position <= 4) return 'ucl';
    if (position <= 6) return 'europa';
    if (position === 7) return 'conference';
    if (position >= 18) return 'relegation';
    return 'mid';
  };

  const zoneColor = (zone: string) => {
    switch (zone) {
      case 'ucl':
        return 'border-l-4 border-blue-500';
      case 'europa':
        return 'border-l-4 border-yellow-500';
      case 'conference':
        return 'border-l-4 border-green-500';
      case 'relegation':
        return 'border-l-4 border-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* HEADER GOOGLE STYLE */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl font-extrabold">
              Premier League
            </h2>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            2024–2025 Season Standings
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="py-20 text-center">Loading standings...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-3">#</th>
                <th className="p-3 text-left">Club</th>
                <th className="p-3">MP</th>
                <th className="p-3">W</th>
                <th className="p-3">D</th>
                <th className="p-3">L</th>
                <th className="p-3">GF</th>
                <th className="p-3">GA</th>
                <th className="p-3">GD</th>
                <th className="p-3">Pts</th>
              </tr>
            </thead>

            <tbody>
              {standings.map((row, index) => {
                const position = index + 1;
                const gd = row.goals_for - row.goals_against;
                const zone = getZone(position);

                return (
                  <tr
                    key={row.team_id}
                    onClick={() => onSelectTeam(row.team_id)}
                    className={`
                      ${zoneColor(zone)}
                      hover:bg-slate-50 cursor-pointer transition
                    `}
                  >

                    {/* POSITION */}
                    <td className="p-3 text-center font-bold">
                      {position}
                    </td>

                    {/* CLUB */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.team.logo}
                          alt={row.team.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            // FIX BROKEN IMAGE
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/32';
                          }}
                        />
                        <span className="font-semibold">
                          {row.team.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-center">{row.played}</td>
                    <td className="p-3 text-center">{row.win}</td>
                    <td className="p-3 text-center">{row.draw}</td>
                    <td className="p-3 text-center">{row.loss}</td>
                    <td className="p-3 text-center">{row.goals_for}</td>
                    <td className="p-3 text-center">{row.goals_against}</td>

                    <td className="p-3 text-center font-semibold">
                      {gd > 0 ? `+${gd}` : gd}
                    </td>

                    <td className="p-3 text-center font-bold">
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* LEGEND (GOOGLE STYLE ZONES) */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          Champions League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          Europa League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          Conference League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          Relegation
        </div>

      </div>
    </div>
  );
}
