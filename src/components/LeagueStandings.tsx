import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface Props {
  onSelectTeam: (teamId: number) => void;
}

export default function LeagueStandings({ onSelectTeam }: Props) {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const res = await fetch('/api/standings');
      const data = await res.json();
      setStandings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getZone = (pos: number) => {
    if (pos <= 4) return 'ucl';
    if (pos <= 6) return 'europa';
    if (pos === 7 || pos === 8) return 'conference';
    if (pos >= 18) return 'relegation';
    return 'none';
  };

  if (loading) {
    return <div className="p-6">Loading standings...</div>;
  }

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">

      {/* HEADER */}
      <div className="mb-5 border-b pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold">
            Premier League
          </h2>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          2024–2025 Season Standings
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr className="border-b">
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
            {standings.map((team, index) => {
              const pos = index + 1;
              const zone = getZone(pos);

              const zoneColor =
                zone === 'ucl'
                  ? 'border-l-4 border-blue-500'
                  : zone === 'europa'
                  ? 'border-l-4 border-green-500'
                  : zone === 'conference'
                  ? 'border-l-4 border-emerald-500'
                  : zone === 'relegation'
                  ? 'border-l-4 border-red-500'
                  : '';

              return (
                <tr
                  key={team.team_id}
                  onClick={() => onSelectTeam(team.team_id)}
                  className={`${zoneColor} hover:bg-gray-50 cursor-pointer`}
                >
                  <td className="p-3 text-center font-bold">
                    {pos}
                  </td>

                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={team.team.logo}
                      className="w-7 h-7"
                    />
                    <span className="font-medium">
                      {team.team.name}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    {team.played}
                  </td>
                  <td className="p-3 text-center">
                    {team.win}
                  </td>
                  <td className="p-3 text-center">
                    {team.draw}
                  </td>
                  <td className="p-3 text-center">
                    {team.loss}
                  </td>
                  <td className="p-3 text-center">
                    {team.goals_for}
                  </td>
                  <td className="p-3 text-center">
                    {team.goals_against}
                  </td>
                  <td className="p-3 text-center font-semibold">
                    {team.goals_for - team.goals_against}
                  </td>
                  <td className="p-3 text-center font-bold">
                    {team.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* LEGEND (INI HARUS DI BAWAH TABLE) */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500"></div>
          Champions League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500"></div>
          Europa League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500"></div>
          Conference League
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500"></div>
          Relegation
        </div>

      </div>
    </div>
  );
}
