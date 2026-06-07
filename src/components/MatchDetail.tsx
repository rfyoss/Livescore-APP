import { useState, useEffect } from 'react';
import { Match, MatchEvent, Team } from '../types';
import { ArrowLeft, Clock, Goal, Heart, MapPin, Share2, Award, Zap, Shield, HelpCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface MatchDetailProps {
  matchId: number;
  onBack: () => void;
  onSelectTeam: (teamId: number) => void;
}

export default function MatchDetail({ matchId, onBack, onSelectTeam }: MatchDetailProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Stats generation (mocking real-time stats comparing home & away teams)
  const [stats, setStats] = useState({
    possession: [55, 45],
    shots: [14, 11],
    shotsOnTarget: [6, 4],
    corners: [5, 3],
    fouls: [10, 12],
    yellowCards: [1, 2]
  });

  useEffect(() => {
    fetchMatchDetails();

    // SOCKET.IO REALTIME COLLABORATION / UPDATE
    // Connect to port 3000 where our unified Express app resides
    const socket: Socket = io();

    socket.emit('subscribe_to_match', matchId);

    // Listen to live scorer developments
    socket.on('goal_scored', (data: any) => {
      if (data.match_id === matchId) {
        console.log('[Socket Live Goal Feed]', data);
        
        // Update local score
        setMatch(prev => prev ? {
          ...prev,
          home_score: data.home_score,
          away_score: data.away_score
        } : null);

        // Add to chronological events lists
        const newGoalEvent: MatchEvent = {
          id: Date.now(),
          match_id: matchId,
          team_id: data.team_id,
          event_type: 'GOAL',
          minute: data.minute,
          description: data.description || `GOAL! ${data.scorer} scored.`
        };
        setEvents(prev => [newGoalEvent, ...prev]);

        // Adjust statistics
        setStats(prev => ({
          ...prev,
          possession: [Math.min(75, prev.possession[0] + 1), Math.max(25, prev.possession[1] - 1)],
          shots: [prev.shots[0] + 1, prev.shots[1]],
          shotsOnTarget: [prev.shotsOnTarget[0] + 1, prev.shotsOnTarget[1]]
        }));
      }
    });

    // Listen to cards, corner kicks, substitution tickers
    socket.on('live_stats', (data: any) => {
      if (data.match_id === matchId) {
        console.log('[Socket Live Ticker Card/Sub/Corner Feed]', data);

        const newEvent: MatchEvent = {
          id: Date.now(),
          match_id: matchId,
          team_id: data.team_id || 0,
          event_type: data.event_type || 'SHOT',
          minute: data.minute,
          description: data.description
        };
        setEvents(prev => [newEvent, ...prev]);

        // Increment respective stats fields
        if (data.event_type === 'CORNER') {
          setStats(prev => ({
            ...prev,
            corners: [prev.corners[0] + 1, prev.corners[1]]
          }));
        } else if (data.event_type === 'YELLOW_CARD') {
          setStats(prev => ({
            ...prev,
            yellowCards: [prev.yellowCards[0] + 1, prev.yellowCards[1] + 1]
          }));
        }
      }
    });

    socket.on('match_finished', (data: any) => {
      if (data.match_id === matchId) {
        setMatch(prev => prev ? { ...prev, status: 'FINISHED' } : null);
      }
    });

    checkFavoriteStatus();

    return () => {
      socket.emit('unsubscribe_from_match', matchId);
      socket.disconnect();
    };
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const res = await fetch(`/api/matches/${matchId}`);
      if (res.ok) {
        const data = await res.json();
        setMatch(data);
        
        // Populate historical timeline events
        if (data.events) {
          // Sort events by minute descending
          const sorted = [...data.events].sort((a, b) => b.minute - a.minute);
          setEvents(sorted);
        }
      }
    } catch (err) {
      console.error('Failed to get match detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const favors = await res.json();
        if (match) {
          const isFav = favors.some((f: any) => f.team_id === match.home_team_id || f.team_id === match.away_team_id);
          setIsFavorite(isFav);
        }
      }
    } catch (err) {}
  };

  const handleFavoriteToggle = async () => {
    if (!match) return;
    
    // Toggle home club for simplicity
    const targetTeamId = match.home_team_id;
    
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${targetTeamId}`, { method: 'DELETE' });
        if (res.ok) setIsFavorite(false);
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ team_id: targetTeamId })
        });
        if (res.ok) setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed toggling favorite status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-xs">Loading game sheet...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-20 bg-zinc-50 rounded-2xl">
        <ArrowLeft className="w-6 h-6 text-zinc-400 mx-auto mb-2 cursor-pointer" onClick={onBack} />
        <p className="text-zinc-500 text-sm">Match details could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button link header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
          id="match-back-button"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Fixtures
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-xl transition-all border cursor-pointer ${
              isFavorite
                ? 'bg-amber-50 border-amber-250 text-amber-500'
                : 'bg-white border-slate-250 text-slate-400 hover:text-slate-600'
            }`}
            title="Mark Club as Favorite"
            id="match-fav-toggle"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Stats Header Banner Card */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* League Season Text */}
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-6 flex items-center gap-1.5 font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            {match.league_id === 'PL' ? 'ENG Premier League' : match.league_id === 'LL' ? 'ESP La Liga' : 'Premiere League'} • {match.status}
          </span>

          {/* Core Scoreboard grid */}
          <div className="w-full grid grid-cols-7 items-center max-w-2xl">
            {/* Home Side */}
            <div 
              onClick={() => onSelectTeam(match.home_team_id)}
              className="col-span-3 flex flex-col items-center cursor-pointer group"
              id="match-home-team-click"
            >
              <img 
                src={match.home_team?.logo} 
                alt={match.home_team?.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-white/5 border border-white/10 rounded-2xl p-2.5 transition-transform group-hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="text-slate-100 font-extrabold text-sm sm:text-base mt-3 text-center leading-tight group-hover:text-emerald-400 transition-colors font-display">
                {match.home_team?.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 font-semibold uppercase">{match.home_team?.country}</span>
            </div>

            {/* Score Center Segment */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              {match.status === 'UPCOMING' ? (
                <div className="text-slate-500 text-xs text-center">
                  <span className="font-extrabold text-white text-lg font-display">VS</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-5xl font-mono font-black text-emerald-400 tracking-tight flex items-center gap-2">
                    <span>{match.home_score}</span>
                    <span className="text-slate-600 text-xs sm:text-sm">:</span>
                    <span>{match.away_score}</span>
                  </div>
                  
                  {match.status === 'LIVE' ? (
                    <div className="bg-red-500/15 border border-red-500/20 text-red-400 font-extrabold px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 mt-3.5 animate-pulse">
                      <Clock className="w-3 h-3 text-red-400" /> LIVE • {events[0]?.minute || 72}'
                    </div>
                  ) : (
                    <span className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md mt-3 border border-slate-700/60">
                      Full Time
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away Side */}
            <div 
              onClick={() => onSelectTeam(match.away_team_id)}
              className="col-span-3 flex flex-col items-center cursor-pointer group"
              id="match-away-team-click"
            >
              <img 
                src={match.away_team?.logo} 
                alt={match.away_team?.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-white/5 border border-white/10 rounded-2xl p-2.5 transition-transform group-hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="text-slate-100 font-extrabold text-sm sm:text-base mt-3 text-center leading-tight group-hover:text-emerald-400 transition-colors font-display">
                {match.away_team?.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 font-semibold uppercase">{match.away_team?.country}</span>
            </div>
          </div>

          {/* Venue & Locators */}
          <div className="mt-8 border-t border-slate-800/60 pt-4 w-full flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Ground: {match.home_team?.venue || 'Football Plaza Arena'}
            </span>
            <span className="text-slate-700">•</span>
            <span>
              Kickoff: {new Date(match.match_date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Column = Timeline Events; Right Column = CSS Stats charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Events Panel (col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 pb-2.5 border-b border-slate-100 font-display">
            <Clock className="w-4.5 h-4.5 text-slate-500" /> Match Event Timeline
          </h2>

          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-450 flex flex-col items-center gap-1">
              <HelpCircle className="w-8 h-8 text-slate-300 mb-1" />
              <p className="text-xs font-bold text-slate-700">No Match Events Registered</p>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">When the match kicks off in real-time mode, actions such as goals, cards, and substitutions appear here minute-by-minute.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-100 pl-4 ml-3 space-y-5 py-2">
              {events.map((ev, index) => (
                <div key={ev.id || index} className="relative">
                  {/* Position absolute left marker circle */}
                  <div className={`absolute -left-[25px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    ev.event_type === 'GOAL' 
                      ? 'bg-emerald-500 border-white text-white' 
                      : ev.event_type === 'YELLOW_CARD' 
                      ? 'bg-amber-400 border-white text-amber-950'
                      : ev.event_type === 'RED_CARD'
                      ? 'bg-red-500 border-white text-white'
                      : 'bg-slate-200 border-white text-slate-700'
                  }`}>
                    {ev.event_type === 'GOAL' ? (
                      <Goal className="w-2.5 h-2.5" />
                    ) : (
                      <span className="text-[9px] font-extrabold font-sans">
                        {ev.event_type === 'YELLOW_CARD' || ev.event_type === 'RED_CARD' ? 'C' : 'S'}
                      </span>
                    )}
                  </div>

                  {/* Event Text detail */}
                  <div className="pl-4">
                    <span className="bg-slate-100 text-slate-600 border border-slate-200/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded mr-2 inline-block">
                      {ev.minute}'
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {ev.event_type === 'GOAL' ? 'GOAL! ⚽' : ev.event_type === 'YELLOW_CARD' ? 'Yellow/Red Card' : ev.event_type === 'RED_CARD' ? 'Red Card 🟥' : 'Match Action'}
                    </span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {ev.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-Time Stats Display Panel (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 pb-2.5 border-b border-slate-100 font-display">
              <Zap className="w-4.5 h-4.5 text-slate-500" /> Team Performance Statistics
            </h2>

            {match.status === 'UPCOMING' ? (
              <div className="text-center py-12 text-slate-450 text-xs">
                Stats metrics populate during live play.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats row helper function call */}
                {renderStatRow('Ball Possession %', stats.possession[0], stats.possession[1], '%')}
                {renderStatRow('Total Shots Attempted', stats.shots[0], stats.shots[1])}
                {renderStatRow('Shots on Target', stats.shotsOnTarget[0], stats.shotsOnTarget[1])}
                {renderStatRow('Corner Kicks', stats.corners[0], stats.corners[1])}
                {renderStatRow('Fouls Committed', stats.fouls[0], stats.fouls[1])}
                {renderStatRow('Yellow Cards', stats.yellowCards[0], stats.yellowCards[1])}
              </div>
            )}
          </div>

          {/* Quick tips panel */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
            <span className="font-extrabold text-slate-700 block mb-1">💡 Real-Time Simulation Info</span>
            Keep this screen open while games are "LIVE"! The background engine is active, meaning you'll witness goals, yellow cards, substitutions, and statistical bar shifts sliding in dynamically over true websockets.
          </div>
        </div>
      </div>
    </div>
  );

  // Helper renderer for Stats bars
  function renderStatRow(label: string, homeVal: number, awayVal: number, scaleSymbol: string = '') {
    const total = homeVal + awayVal || 2;
    const homePercent = Math.round((homeVal / total) * 100);
    const awayPercent = 100 - homePercent;

    return (
      <div className="space-y-1.5" id={`stat-row-${label.replace(/ /g, '-').toLowerCase()}`}>
        <div className="flex justify-between items-center text-xs font-bold font-mono">
          <span className="text-slate-800">{homeVal}{scaleSymbol}</span>
          <span className="text-slate-500 text-[10px] tracking-wide uppercase font-sans font-semibold">{label}</span>
          <span className="text-slate-800">{awayVal}{scaleSymbol}</span>
        </div>

        {/* Visual progress track */}
        <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-slate-100">
          <div 
            className="bg-emerald-500 rounded-l-full transition-all duration-500" 
            style={{ width: `${homePercent}%` }} 
          />
          <div 
            className="bg-[#0f172a] rounded-r-full transition-all duration-500" 
            style={{ width: `${awayPercent}%` }} 
          />
        </div>
      </div>
    );
  }
}
