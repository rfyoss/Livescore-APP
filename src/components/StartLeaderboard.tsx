import { useEffect, useState } from 'react';

interface Player {
  player_id: number;
  name: string;
  team_id: number;
  photo: string;
}

interface Event {
  event_id: number;
  fixture_id: number;
  time_elapsed: number;
  team_id: number;
  player_name: string;
  event_type: string;
  detail: string;
}

interface PlayerStats {
  player_id: number;
  goals: number;
  assists: number;
  minutes: number;
}

type TabType = 'goals' | 'assists' | 'yellow' | 'red';

export default function StatsLeaderboard() {
  const [tab, setTab] = useState<TabType>('goals');

  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [pRes, eRes, sRes] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/events'),
        fetch('/api/player-stats'),
      ]);

      const pData = await pRes.json();
      const eData = await eRes.json();
      const sData = await sRes.json();

      setPlayers(pData);
      setEvents(eData);
      setStats(sData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPlayer = (name: string) => {
    return players.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
  };

  const buildLeaderboard = () => {
    if (tab === 'goals') {
      const map = new Map<number, any>();

      stats.forEach((s) => {
        map.set(s.player_id, {
          player_id: s.player_id,
          goals: (map.get(s.player_id)?.goals || 0) + s.goals,
          assists: s.assists,
        });
      });

      return Array.from(map.values())
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10);
    }

    if (tab === 'assists') {
      const map = new Map<number, any>();

      stats.forEach((s) => {
        map.set(s.player_id, {
          player_id: s.player_id,
          assists: (map.get(s.player_id)?.assists || 0) + s.assists,
        });
      });

      return Array.from(map.values())
        .sort((a, b) => b.assists - a.assists)
        .slice(0, 10);
    }

    if (tab === 'yellow') {
      const map = new Map<number, any>();

      events
        .filter((e) => e.event_type === 'Card' && e.detail.includes('Yellow'))
        .forEach((e) => {
          const player = getPlayer(e.player_name);
          if (!player) return;

          map.set(player.player_id, {
            player_id: player.player_id,
            count: (map.get(player.player_id)?.count || 0) + 1,
          });
        });

      return Array.from(map.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }

    if (tab === 'red') {
      const map = new Map<number, any>();

      events
        .filter((e) => e.event_type === 'Card' && e.detail.includes('Red'))
        .forEach((e) => {
          const player = getPlayer(e.player_name);
          if (!player) return;

          map.set(player.player_id, {
            player_id: player.player_id,
            count: (map.get(player.player_id)?.count || 0) + 1,
          });
        });

      return Array.from(map.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }

    return [];
  };

  const list = buildLeaderboard();

  const getPlayerInfo = (id: number) => {
    return players.find((p) => p.player_id === id);
  };

  if (loading) {
    return <div className="p-6">Loading stats...</div>;
  }

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">
            Premier League Stats
          </h2>
          <p className="text-sm text-gray-500">
            Top performers this season
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6 text-sm">
        {[
          { key: 'goals', label: 'Goals' },
          { key: 'assists', label: 'Assists' },
          { key: 'yellow', label: 'Yellow Cards' },
          { key: 'red', label: 'Red Cards' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as TabType)}
            className={`px-3 py-1 rounded-full border ${
              tab === t.key
                ? 'bg-black text-white'
                : 'bg-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-12 text-xs text-gray-500 border-b pb-2 mb-2">
        <div className="col-span-1">#</div>
        <div className="col-span-7">Player</div>
        <div className="col-span-4 text-right">
          {tab === 'goals' && 'Goals'}
          {tab === 'assists' && 'Assists'}
          {tab === 'yellow' && 'Yellow'}
          {tab === 'red' && 'Red'}
        </div>
      </div>

      {/* LIST */}
      {list.map((item, index) => {
        const player = getPlayerInfo(item.player_id);

        if (!player) return null;

        const value =
          item.goals ?? item.assists ?? item.count;

        return (
          <div
            key={item.player_id}
            className="grid grid-cols-12 items-center py-3 border-b hover:bg-gray-50"
          >
            {/* RANK */}
            <div className="col-span-1 text-sm font-bold">
              {index + 1}
            </div>

            {/* PLAYER */}
            <div className="col-span-7 flex items-center gap-3">
              <img
                src={player.photo}
                alt={player.name}
                className="w-9 h-9 rounded-full object-cover border"
              />

              <div>
                <div className="font-semibold text-sm">
                  {player.name}
                </div>
                <div className="text-xs text-gray-500">
                  Team ID: {player.team_id}
                </div>
              </div>
            </div>

            {/* VALUE */}
            <div className="col-span-4 text-right font-bold">
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
