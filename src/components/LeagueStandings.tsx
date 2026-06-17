import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface LeagueStandingsProps {
  onSelectTeam: (teamId: number) => void;
}

export default function LeagueStandings({
  onSelectTeam,
}: LeagueStandingsProps) {
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<any[]>([]);

  useEffect(() => {
    setStandings([
      {
        id: 1,
        team_id: 40, // Liverpool asli = 40
        played: 38,
        win: 25,
        draw: 9,
        loss: 4,
        goals_for: 86,
        goals_against: 41,
        points: 84,
        team: {
          name: 'Liverpool',
          logo: 'https://media.api-sports.io/football/teams/40.png',
        },
      },
      {
        id: 2,
        team_id: 42, // Arsenal asli = 42
        played: 38,
        win: 20,
        draw: 14,
        loss: 4,
        goals_for: 69,
        goals_against: 34,
        points: 74,
        team: {
          name: 'Arsenal',
          logo: 'https://media.api-sports.io/football/teams/42.png',
        },
      },
      {
        id: 3,
        team_id: 50, // Manchester City asli = 50
        played: 38,
        win: 21,
        draw: 8,
        loss: 9,
        goals_for: 72,
        goals_against: 44,
        points: 71,
        team: {
          name: 'Manchester City',
          logo: 'https://media.api-sports.io/football/teams/50.png',
        },
      },
      {
        id: 4,
        team_id: 49, // Chelsea asli = 49
        played: 38,
        win: 20,
        draw: 9,
        loss: 9,
        goals_for: 64,
        goals_against: 43,
        points: 69,
        team: {
          name: 'Chelsea',
          logo: 'https://media.api-sports.io/football/teams/49.png',
        },
      },
      {
        id: 5,
        team_id: 34, // Newcastle asli = 34
        played: 38,
        win: 20,
        draw: 6,
        loss: 12,
        goals_for: 68,
        goals_against: 47,
        points: 66,
        team: {
          name: 'Newcastle',
          logo: 'https://media.api-sports.io/football/teams/34.png',
        },
      },
      {
        id: 6,
        team_id: 66, // Aston Villa asli = 66
        played: 38,
        win: 19,
        draw: 9,
        loss: 10,
        goals_for: 58,
        goals_against: 51,
        points: 66,
        team: {
          name: 'Aston Villa',
          logo: 'https://media.api-sports.io/football/teams/66.png',
        },
      },
      {
        id: 7,
        team_id: 65, // Nottingham Forest asli = 65
        played: 38,
        win: 19,
        draw: 8,
        loss: 11,
        goals_for: 58,
        goals_against: 46,
        points: 65,
        team: {
          name: 'Nottingham Forest',
          logo: 'https://media.api-sports.io/football/teams/65.png',
        },
      },
      {
        id: 8,
        team_id: 51, // Brighton asli = 51
        played: 38,
        win: 16,
        draw: 13,
        loss: 9,
        goals_for: 66,
        goals_against: 59,
        points: 61,
        team: {
          name: 'Brighton',
          logo: 'https://media.api-sports.io/football/teams/51.png',
        },
      },
      {
        id: 9,
        team_id: 35, // Bournemouth asli = 35
        played: 38,
        win: 15,
        draw: 11,
        loss: 12,
        goals_for: 58,
        goals_against: 46,
        points: 56,
        team: {
          name: 'Bournemouth',
          logo: 'https://media.api-sports.io/football/teams/35.png',
        },
      },
      {
        id: 10,
        team_id: 55, // Brentford asli = 55
        played: 38,
        win: 16,
        draw: 8,
        loss: 14,
        goals_for: 66,
        goals_against: 57,
        points: 56,
        team: {
          name: 'Brentford',
          logo: 'https://media.api-sports.io/football/teams/55.png',
        },
      },
      {
        id: 11,
        team_id: 36, // Fulham asli = 36
        played: 38,
        win: 15,
        draw: 9,
        loss: 14,
        goals_for: 54,
        goals_against: 54,
        points: 54,
        team: {
          name: 'Fulham',
          logo: 'https://media.api-sports.io/football/teams/36.png',
        },
      },
      {
        id: 12,
        team_id: 52, // Crystal Palace asli = 52
        played: 38,
        win: 13,
        draw: 14,
        loss: 11,
        goals_for: 51,
        goals_against: 51,
        points: 53,
        team: {
          name: 'Crystal Palace',
          logo: 'https://media.api-sports.io/football/teams/52.png',
        },
      },
      {
        id: 13,
        team_id: 45, // Everton asli = 45
        played: 38,
        win: 11,
        draw: 15,
        loss: 12,
        goals_for: 42,
        goals_against: 44,
        points: 48,
        team: {
          name: 'Everton',
          logo: 'https://media.api-sports.io/football/teams/45.png',
        },
      },
      {
        id: 14,
        team_id: 48, // West Ham asli = 48
        played: 38,
        win: 11,
        draw: 10,
        loss: 17,
        goals_for: 46,
        goals_against: 62,
        points: 43,
        team: {
          name: 'West Ham',
          logo: 'https://media.api-sports.io/football/teams/48.png',
        },
      },
      {
        id: 15,
        team_id: 33, // Manchester United asli = 33
        played: 38,
        win: 11,
        draw: 9,
        loss: 18,
        goals_for: 44,
        goals_against: 54,
        points: 42,
        team: {
          name: 'Manchester United',
          logo: 'https://media.api-sports.io/football/teams/33.png',
        },
      },
      {
        id: 16,
        team_id: 39, // Wolves asli = 39
        played: 38,
        win: 12,
        draw: 6,
        loss: 20,
        goals_for: 54,
        goals_against: 69,
        points: 42,
        team: {
          name: 'Wolves',
          logo: 'https://media.api-sports.io/football/teams/39.png',
        },
      },
      {
        id: 17,
        team_id: 47, // Tottenham asli = 47
        played: 38,
        win: 11,
        draw: 5,
        loss: 22,
        goals_for: 64,
        goals_against: 65,
        points: 38,
        team: {
          name: 'Tottenham',
          logo: 'https://media.api-sports.io/football/teams/47.png',
        },
      },
      {
        id: 18,
        team_id: 46, // Leicester City asli = 46
        played: 38,
        win: 6,
        draw: 7,
        loss: 25,
        goals_for: 33,
        goals_against: 80,
        points: 25,
        team: {
          name: 'Leicester City',
          logo: 'https://media.api-sports.io/football/teams/46.png',
        },
      },
      {
        id: 19,
        team_id: 57, // Ipswich Town asli = 57
        played: 38,
        win: 4,
        draw: 10,
        loss: 24,
        goals_for: 36,
        goals_against: 82,
        points: 22,
        team: {
          name: 'Ipswich Town',
          logo: 'https://media.api-sports.io/football/teams/57.png',
        },
      },
      {
        id: 20,
        team_id: 41, // Southampton asli = 41
        played: 38,
        win: 2,
        draw: 6,
        loss: 30,
        goals_for: 26,
        goals_against: 86,
        points: 12,
        team: {
          name: 'Southampton',
          logo: 'https://media.api-sports.io/football/teams/41.png',
        },
      },
    ]);

    setLoading(false);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
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
              {standings.map((row, index) => {
                const gd = row.goals_for - row.goals_against;
                const position = index + 1;

                const zoneBorder =
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
                    onClick={() => onSelectTeam(row.team_id)}
                    className="hover:bg-slate-50 cursor-pointer transition select-none"
                  >
                    <td className={`p-3 text-center font-bold ${zoneBorder}`}>
                      {position}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.team.logo}
                          alt={row.team.name}
                          className="w-8 h-8 object-contain"
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
