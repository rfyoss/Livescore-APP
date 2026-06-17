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
        id: 40,
        team_id: 40,
        played: 38,
        win: 29,
        draw: 6,
        loss: 3,
        goals_for: 92,
        goals_against: 28,
        points: 93,
        team: {
          name: 'Liverpool',
          logo: 'https://media.api-sports.io/football/teams/40.png',
        },
      },
      {
        id: 42,
        team_id: 42,
        played: 38,
        win: 27,
        draw: 8,
        loss: 3,
        goals_for: 88,
        goals_against: 32,
        points: 89,
        team: {
          name: 'Arsenal',
          logo: 'https://media.api-sports.io/football/teams/42.png',
        },
      },
      {
        id: 50,
        team_id: 50,
        played: 38,
        win: 26,
        draw: 9,
        loss: 3,
        goals_for: 85,
        goals_against: 30,
        points: 87,
        team: {
          name: 'Man City',
          logo: 'https://media.api-sports.io/football/teams/50.png',
        },
      },
    ]);

    setLoading(false);
  }, []);

  const getZone = (pos: number) => {
    if (pos <= 4) return 'UCL';
    if (pos <= 6) return 'EUROPA';
    if (pos <= 7) return 'CONFERENCE';
    if (pos >= 18) return 'RELEGATION';
    return '';
  };

  const getZoneStyle = (zone: string) => {
    switch (zone) {
      case 'UCL':
        return 'text-blue-600 font-bold';
      case 'EUROPA':
        return 'text-green-600 font-bold';
      case 'CONFERENCE':
        return 'text-emerald-600 font-bold';
      case 'RELEGATION':
        return 'text-red-600 font-bold';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      {/* HEADER GOOGLE STYLE */}
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Premier League
        </h2>

        <p className="text-sm text-slate-500">
          2024–2025 Season Standings
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading standings...
        </div>
      ) : (
        <div className="overflow-x-auto">

          {/* ZONE LABELS */}
          <div className="flex flex-wrap gap-4 text-xs mb-4">
            <span className="text-blue-600 font-bold">Champions League</span>
            <span className="text-green-600 font-bold">Europa League</span>
            <span className="text-emerald-600 font-bold">Conference League</span>
            <span className="text-red-600 font-bold">Relegation</span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-600">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Club</th>
                <th className="p-3">MP</th>
                <th className="p-3">W</th>
                <th className="p-3">D</th>
                <th className="p-3">L</th>
                <th className="p-3">GF</th>
                <th className="p-3">GA</th>
                <th className="p-3">GD</th>
                <th className="p-3 font-bold">Pts</th>
              </tr>
            </thead>

            <tbody>
              {standings
                .sort((a, b) => b.points - a.points)
                .map((row, index) => {
                  const pos = index + 1;
                  const gd = row.goals_for - row.goals_against;
                  const zone = getZone(pos);

                  return (
                    <tr
                      key={row.id}
                      onClick={() => onSelectTeam(row.team_id)}
                      className="border-b hover:bg-slate-50 cursor-pointer transition"
                    >

                      {/* POSITION + ZONE */}
                      <td className="p-3 font-bold">
                        {pos}
                        <div className={`text-[10px] ${getZoneStyle(zone)}`}>
                          {zone}
                        </div>
                      </td>

                      {/* CLUB */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.team?.logo || 'https://via.placeholder.com/30'}
                            alt={row.team?.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://via.placeholder.com/30';
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
    </div>
  );
}
