import { useState, useEffect } from 'react';
import { Match } from '../types';
import { Play, Calendar, Trophy, Search, Activity, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface LiveMatchesProps {
  onSelectMatch: (matchId: number) => void;
}

export default function LiveMatches({ onSelectMatch }: LiveMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'FINISHED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchMatches();
    // In live mode, poll matches list every 10s to keep scores synchronous
    const t = setInterval(fetchMatches, 10000);
    return () => clearInterval(t);
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to grab matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMatches = () => {
    let result = [...matches];
    
    if (filter !== 'ALL') {
      result = result.filter(m => m.status === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        (m.home_team?.name || '').toLowerCase().includes(q) || 
        (m.away_team?.name || '').toLowerCase().includes(q)
      );
    }

    return result;
  };

  const filtered = getFilteredMatches();

  return (
    <div className="space-y-6">
      {/* Banner Search & Ticker */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center justify-center p-12 select-none pointer-events-none">
          <Zap className="w-64 h-64 text-emerald-400" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full w-max font-extrabold mb-3.5 flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" /> Live Tracker Mode Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 font-display">
            Real-Time Pitch Tracker
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
            Follow major European campaigns with live stats, real-time score overlays, and simulated action updates.
          </p>

          {/* Search box overlay */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams (e.g. Manchester City...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/40 hover:bg-slate-950/60 border border-slate-700/60 focus:border-emerald-500/80 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all duration-200 font-medium"
              id="match-search-input"
            />
            <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-3" />
          </div>
        </div>
      </div>

      {/* Tabs Filter Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-1">
          {(['ALL', 'LIVE', 'UPCOMING', 'FINISHED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === tab
                  ? 'bg-[#0f172a] text-white shadow'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id={`tab-filter-${tab}`}
            >
              {tab === 'ALL' && 'All Fixtures'}
              {tab === 'LIVE' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Games
                </span>
              )}
              {tab === 'UPCOMING' && 'Scheduled'}
              {tab === 'FINISHED' && 'Results'}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-bold font-mono text-slate-500 bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-md">
          {filtered.length} Matches Found
        </div>
      </div>

      {/* Fixtures List Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-semibold">Fetching match list...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-800 font-bold text-sm">No Matches Found</h3>
          <p className="text-slate-500 text-xs mt-1">There are no matches under the current selections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((match) => (
            <motion.div
              layoutId={`match-card-${match.id}`}
              key={match.id}
              onClick={() => onSelectMatch(match.id)}
              className="bg-white hover:bg-slate-50/40 border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between group"
              id={`match-item-${match.id}`}
            >
              {/* Card Meta Details */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 border-b border-slate-100 pb-3">
                <span className="font-extrabold text-slate-700 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded text-[10px]">
                  {match.league_id === 'PL' ? 'Premier League 🇬🇧' : match.league_id === 'LL' ? 'La Liga 🇪🇸' : 'Premiere League 🇬🇧'}
                </span>
                
                {match.status === 'LIVE' ? (
                  <span className="bg-red-50 text-red-650 border border-red-200 px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1 uppercase text-[10px] animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-650 rounded-full" /> LIVE OVERLAY
                  </span>
                ) : match.status === 'FINISHED' ? (
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border border-slate-200/40">
                    Full Time
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                    {new Date(match.match_date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {/* Clubs vs score details layout */}
              <div className="grid grid-cols-7 items-center gap-2 mb-4">
                {/* Home Club */}
                <div className="col-span-3 flex flex-col items-center text-center">
                  <img
                    src={match.home_team?.logo}
                    alt={match.home_team?.name}
                    className="w-11 h-11 object-cover rounded-xl border border-slate-100 p-1 bg-slate-50 transition-transform group-hover:scale-105 duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-extrabold text-slate-800 text-xs mt-2 leading-tight min-h-[32px] flex items-center justify-center">
                    {match.home_team?.name}
                  </span>
                </div>

                {/* score values inside container */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  {match.status === 'UPCOMING' ? (
                    <span className="text-slate-400 font-extrabold text-xs">VS</span>
                  ) : (
                    <div className="bg-[#0f172a] text-white font-mono text-base font-black px-2.5 py-1 rounded-xl flex items-center justify-center gap-1.5 shadow-sm border border-slate-750">
                      <span>{match.home_score}</span>
                      <span className="text-slate-500 text-xs">:</span>
                      <span>{match.away_score}</span>
                    </div>
                  )}
                </div>

                {/* Away Club */}
                <div className="col-span-3 flex flex-col items-center text-center">
                  <img
                    src={match.away_team?.logo}
                    alt={match.away_team?.name}
                    className="w-11 h-11 object-cover rounded-xl border border-slate-100 p-1 bg-slate-50 transition-transform group-hover:scale-105 duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-extrabold text-slate-800 text-xs mt-2 leading-tight min-h-[32px] flex items-center justify-center">
                    {match.away_team?.name}
                  </span>
                </div>
              </div>

              {/* View Match Details Footer button */}
              <div className="pt-2.5 mb-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-800 transition-colors">
                <span className="text-[10px] font-medium text-slate-500">
                  {match.status === 'LIVE' ? 'Currently playing' : match.status === 'FINISHED' ? 'Final result recorded' : 'Fixture scheduled'}
                </span>
                <span className="font-bold flex items-center gap-0.5 text-emerald-600 group-hover:mr-1 transition-all duration-200">
                  Watch Live <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
