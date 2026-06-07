import { useState, useEffect } from 'react';
import { Favorite, Team } from '../types';
import { Heart, HelpCircle, ChevronRight, RefreshCw, Trash2 } from 'lucide-react';

interface FavoritesListProps {
  onSelectTeam: (teamId: number) => void;
}

export default function FavoritesList({ onSelectTeam }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFavoritesAndTeams();
  }, []);

  const fetchFavoritesAndTeams = async () => {
    try {
      setLoading(true);
      // Fetch favorites
      const favRes = await fetch('/api/favorites');
      const allTeamsRes = await fetch('/api/teams');
      
      if (favRes.ok) {
        setFavorites(await favRes.json());
      }
      if (allTeamsRes.ok) {
        setAvailableTeams(await allTeamsRes.json());
      }
    } catch (err) {
      console.error('Failed fetching favorites database:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (teamId: number) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: teamId })
      });
      if (res.ok) {
        fetchFavoritesAndTeams();
      }
    } catch (err) {
      console.error('Failed adding favorite:', err);
    }
  };

  const removeFavorite = async (teamId: number) => {
    try {
      const res = await fetch(`/api/favorites/${teamId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchFavoritesAndTeams();
      }
    } catch (err) {
      console.error('Failed deleting favorite:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="favorites-board">
      
      {/* Pinned clubs list */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-1.5 mb-5 font-display">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" /> My Pinned Favorites
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-xs">Paging favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 w-full flex flex-col items-center">
              <HelpCircle className="w-9 h-9 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No Pinned Clubs Yet</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                Add squads and clubs from the list on the right. Keeping your favorites pinned grants immediate shortcuts!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 hover:bg-slate-100/40 transition-all group"
                  id={`fav-card-${fav.team_id}`}
                >
                  <div 
                    onClick={() => onSelectTeam(fav.team_id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <img
                      src={fav.team?.logo}
                      alt={fav.team?.name}
                      className="w-10 h-10 object-cover bg-white border border-slate-200 rounded-lg p-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-850 text-xs sm:text-xs leading-tight group-hover:text-emerald-700 transition-colors">
                        {fav.team?.name}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-mono mt-0.5 uppercase tracking-wider">{fav.team?.country}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFavorite(fav.team_id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available clubs addition panel */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-1.5 mb-4 font-display">
          <Heart className="w-4.5 h-4.5 text-slate-400" /> Explore Clubs
        </h2>

        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {availableTeams.map((team) => {
            const isFav = favorites.some(f => f.team_id === team.id);

            return (
              <div
                key={team.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 text-xs hover:bg-slate-50 transition-all"
                id={`explore-add-fav-${team.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-8 h-8 object-cover bg-slate-50 border border-slate-100 p-0.5 rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs leading-tight">{team.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{team.country}</p>
                  </div>
                </div>

                {isFav ? (
                  <button
                    onClick={() => removeFavorite(team.id)}
                    className="px-2.5 py-1 text-[10px] uppercase font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Pinned
                  </button>
                ) : (
                  <button
                    onClick={() => addFavorite(team.id)}
                    className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-[#0f172a] hover:text-white hover:border-slate-[#0f172a] transition-all cursor-pointer"
                  >
                    Pin Team
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
