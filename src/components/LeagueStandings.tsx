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
          name: 'Manchester City',
          logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        },
      },
      {
        id: 4,
        team_id: 4,
        played: 38,
        win: 20,
        draw: 9,
        loss: 9,
        goals_for: 64,
        goals_against: 43,
        points: 69,
        team: {
          name: 'Chelsea',
          logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
        },
      },
      {
        id: 5,
        team_id: 5,
        played: 38,
        win: 20,
        draw: 6,
        loss: 12,
        goals_for: 68,
        goals_against: 47,
        points: 66,
        team: {
          name: 'Newcastle',
          logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
        },
      },
      {
        id: 6,
        team_id: 6,
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
        team_id: 7,
        played: 38,
        win: 19,
        draw: 8,
        loss: 11,
        goals_for: 58,
        goals_against: 46,
        points: 65,
        team: {
          name: 'Nottingham Forest',
          logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg',
        },
      },
      {
        id: 8,
        team_id: 8,
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
        team_id: 9,
        played: 38,
        win: 15,
        draw: 11,
        loss: 12,
        goals_for: 58,
        goals_against: 46,
        points: 56,
        team: {
          name: 'Bournemouth',
          logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
        },
      },
      {
        id: 10,
        team_id: 10,
        played: 38,
        win: 16,
        draw: 8,
        loss: 14,
        goals_for: 66,
        goals_against: 57,
        points: 56,
        team: {
          name: 'Brentford',
          logo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg',
        },
      },
      {
        id: 11,
        team_id: 11,
        played: 38,
        win: 15,
        draw: 9,
        loss: 14,
        goals_for: 54,
        goals_against: 54,
        points: 54,
        team: {
          name: 'Fulham',
          logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
        },
      },
      {
        id: 12,
        team_id: 12,
        played: 38,
        win: 13,
        draw: 14,
        loss: 11,
        goals_for: 51,
        goals_against: 51,
        points: 53,
        team: {
          name: 'Crystal Palace',
          logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg',
        },
      },
      {
        id: 13,
        team_id: 13,
        played: 38,
        win: 11,
        draw: 15,
        loss: 12,
        goals_for: 42,
        goals_against: 44,
        points: 48,
        team: {
          name: 'Everton',
          logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
        },
      },
      {
        id: 14,
        team_id: 14,
        played: 38,
        win: 11,
        draw: 10,
        loss: 17,
        goals_for: 46,
        goals_against: 62,
        points: 43,
        team: {
          name: 'West Ham',
          logo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
        },
      },
      {
        id: 15,
        team_id: 15,
        played: 38,
        win: 11,
        draw: 9,
        loss: 18,
        goals_for: 44,
        goals_against: 54,
        points: 42,
        team: {
          name: 'Manchester United',
          logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        },
      },
      {
        id: 16,
        team_id: 16,
        played: 38,
        win: 12,
        draw: 6,
        loss: 20,
        goals_for: 54,
        goals_against: 69,
        points: 42,
        team: {
          name: 'Wolves',
          logo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
        },
      },
      {
        id: 17,
        team_id: 17,
        played: 38,
        win: 11,
        draw: 5,
        loss: 22,
        goals_for: 64,
        goals_against: 65,
        points: 38,
        team: {
          name: 'Tottenham',
          logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
        },
      },
      {
        id: 18,
        team_id: 18,
        played: 38,
        win: 6,
        draw: 7,
        loss: 25,
        goals_for: 33,
        goals_against: 80,
        points: 25,
        team: {
          name: 'Leicester City',
          logo: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
        },
      },
      {
        id: 19,
        team_id: 19,
        played: 38,
        win: 4,
        draw: 10,
        loss: 24,
        goals_for: 36,
        goals_against: 82,
        points: 22,
        team: {
          name: 'Ipswich Town',
          logo: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg',
        },
      },
      {
        id: 20,
        team_id: 20,
        played: 38,
        win: 2,
        draw: 6,
        loss: 30,
        goals_for: 26,
        goals_against: 86,
        points: 12,
        team: {
          name: 'Southampton',
          logo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
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
                const gd =
                  row.goals_for - row.goals_against;

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
                    onClick={() =>
                      onSelectTeam(row.team_id)
                    }
                    className={`${borderColor} hover:bg-slate-50 cursor-pointer transition`}
                  >
                    <td className="p-3 text-center font-bold">
                      {position}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.team.logo}
                          alt={row.team.name}
                          className="w-8 h-8"
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
