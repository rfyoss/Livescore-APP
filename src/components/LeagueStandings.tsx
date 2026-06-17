import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface LeagueStandingsProps {
  onSelectTeam: (teamId: number) => void;
}

export default function LeagueStandings({ onSelectTeam }: LeagueStandingsProps) {
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<any[]>([]);

  useEffect(() => {
    setStandings([
      {
        id: 1,
        team_id: 1,
        played: 38,
        win: 25,
        draw: 9,
        loss: 4,
        goals_for: 86,
        goals_against: 41,
        points: 84,
        team: {
          name: 'Liverpool',
          logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        },
      },
      {
        id: 2,
        team_id: 2,
        played: 38,
        win: 20,
        draw: 14,
        loss: 4,
        goals_for: 69,
        goals_against: 34,
        points: 74,
        team: {
          name: 'Arsenal',
          logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
        },
      },
      {
        id: 3,
        team_id: 3,
        played: 38,
        win: 21,
        draw: 8,
        loss: 9,
        goals_for: 72,
        goals_against: 44,
        points: 71,
        team: {
          name: 'Man City',
          logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        },
      },
    ]);

    setLoading(false);
  }, []);

  const getLogo = (url: string | undefined) => {
    return url || 'https://via.placeholder.com/40';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Premier League 2024/25 Standings
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Final league table
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="font-bold text-emerald-700">
            Premier League
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          Loading standings...
        </div>
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
              {standings
                .sort((a, b) => b.points - a.points)
                .map((row, index) => {
                  const gd = row.goals_for - row.goals_against;
                  const position = index + 1;

                  const borderColor =
                    position === 1
                      ? 'border-l-4 border-amber-500'
                      : position <= 4
                      ? 'border-l-4 border-blue-500'
                      : position <= 6
                      ? 'border-l-4 border-green-500'
                      : position >= 18
                      ? 'border-l-4 border-red-500'
                      : '';

                  return (
                    <tr
                      key={row.id}
                      onClick={() => {
                        if (row.team_id) onSelectTeam(row.team_id);
                      }}
                      className={`${borderColor} hover:bg-slate-50 cursor-pointer transition`}
                    >

                      {/* POSITION */}
                      <td className="p-3 text-center font-bold">
                        {position}
                      </td>

                      {/* CLUB */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getLogo(row.team?.logo)}
                            alt={row.team?.name || 'team'}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://via.placeholder.com/40';
                            }}
                          />

                          <span className="font-semibold">
                            {row.team?.name || 'Unknown Team'}
                          </span>
                        </div>
                      </td>

                      <td className="text-center">{row.played}</td>
                      <td className="text-center">{row.win}</td>
                      <td className="text-center">{row.draw}</td>
                      <td className="text-center">{row.loss}</td>
                      <td className="text-center">{row.goals_for}</td>
                      <td className="text-center">{row.goals_against}</td>

                      <td className="text-center font-semibold">
                        {gd > 0 ? `+${gd}` : gd}
                      </td>

                      <td className="text-center font-bold">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

        </div>
      )}

      {/* LEGEND */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded"></div>
          Champion
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          Champions League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          Europa League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          Relegation
        </div>
      </div>

    </div>
  );
}
