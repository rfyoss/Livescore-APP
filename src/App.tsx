/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Trophy, 
  Activity, 
  Heart, 
  Search, 
  Bell, 
  Sliders, 
  User, 
  Target, 
  ChevronRight, 
  Calendar,
  Goal,
  Github
} from 'lucide-react';

import LiveMatches from './components/LiveMatches';
import MatchDetail from './components/MatchDetail';
import TeamDetail from './components/TeamDetail';
import PlayerDetail from './components/PlayerDetail';
import LeagueStandings from './components/LeagueStandings';
import FavoritesList from './components/FavoritesList';
import NotificationToast, { ToastAlert } from './components/NotificationToast';

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'STANDINGS' | 'FAVORITES' | 'SEARCH'>('MATCHES');
  
  // Database status monitoring
  const [dbStatus, setDbStatus] = useState<{ connected: boolean, backendMode: 'SUPABASE' | 'IN_MEMORY', error?: string | null } | null>(null);
  
  // Detailed focus states (Overlays)
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  // Search tab queries
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'TEAMS' | 'PLAYERS'>('TEAMS');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  // Global Goal Event Toasts list
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  useEffect(() => {
    // Connect to port 3000 unified WebSocket server
    const socket: Socket = io();

    socket.on('connect', () => {
      console.log('[Socket Global Channel Connected] Listening for worldwide score flashes.');
    });

    // Real-Time Goal score flash alerts triggers
    socket.on('goal_scored', (data: any) => {
      console.log('[WebSocket Broadcast Received in App]', data);
      
      const newToast: ToastAlert = {
        id: String(Date.now()),
        matchId: data.match_id,
        homeTeam: data.home_team,
        awayTeam: data.away_team,
        homeScore: data.home_score,
        awayScore: data.away_score,
        scorer: data.scorer,
        minute: data.minute,
        description: data.description
      };

      // Push to notifications alerts
      setToasts(prev => [newToast, ...prev]);

      // Highlight auto-clear timer
      setTimeout(() => {
        removeToast(newToast.id);
      }, 7000);
    });

    // Fetch database status
    const fetchDbStatus = async () => {
      try {
        const res = await fetch('/api/db-status');
        if (res.ok) {
          const data = await res.json();
          setDbStatus(data);
        }
      } catch (err) {
        console.error('Failed to fetch DB status:', err);
      }
    };
    fetchDbStatus();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Sync Searches
  useEffect(() => {
    if (activeTab === 'SEARCH') {
      triggerSearch();
    }
  }, [searchQuery, searchType]);

  const triggerSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const endpoint = searchType === 'TEAMS' 
        ? `/api/teams?q=${encodeURIComponent(searchQuery)}`
        : `/api/players/search?q=${encodeURIComponent(searchQuery)}`;
      
      const res = await fetch(endpoint);
      // PERUBAHAN 3: Memastikan data yang di-set berupa Array
      if (res.ok) {
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Unified Search Failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Safe tab switches clearing focus overlays
  const switchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSelectedMatchId(null);
    setSelectedTeamId(null);
    setSelectedPlayerId(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Slide-In Goal Toasts */}
      <NotificationToast toasts={toasts} removeToast={removeToast} />

      {/* 2. Page Navigation Header */}
      <header className="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 text-white sticky top-0 z-40">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <div 
              onClick={() => switchTab('MATCHES')} 
              className="flex items-center gap-2 cursor-pointer select-none group"
              id="brand-logo"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight block font-display">
                  STRIKER<span className="text-emerald-400">.IO</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block leading-none">Live Pitch Tracker</span>
              </div>
            </div>

            {/* Desktop/Tablet Nav menu links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <button
                onClick={() => switchTab('MATCHES')}
                className={`py-1.5 transition-colors border-b-2 hover:text-white text-xs font-bold ${
                  activeTab === 'MATCHES' 
                    ? 'text-white border-emerald-500 font-extrabold' 
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
                id="nav-btn-matches"
              >
                Live Scores
              </button>
              <button
                onClick={() => switchTab('STANDINGS')}
                className={`py-1.5 transition-colors border-b-2 hover:text-white text-xs font-bold ${
                  activeTab === 'STANDINGS' 
                    ? 'text-white border-emerald-500 font-extrabold' 
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
                id="nav-btn-standings"
              >
                Standings
              </button>
              <button
                onClick={() => switchTab('FAVORITES')}
                className={`py-1.5 transition-colors border-b-2 hover:text-white text-xs font-bold ${
                  activeTab === 'FAVORITES' 
                    ? 'text-white border-emerald-500 font-extrabold' 
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
                id="nav-btn-favorites"
              >
                My Favorites
              </button>
              <button
                onClick={() => switchTab('SEARCH')}
                className={`py-1.5 transition-colors border-b-2 hover:text-white text-xs font-bold ${
                  activeTab === 'SEARCH' 
                    ? 'text-white border-emerald-500 font-extrabold' 
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
                id="nav-btn-search"
              >
                Search
              </button>
            </nav>
          </div>

          {/* Quick-indicators connected box */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Tablet navigation fallbacks */}
            <nav className="flex md:hidden items-center gap-1">
              <button
                onClick={() => switchTab('MATCHES')}
                className={`p-1.5 rounded-lg text-xs transition-all ${activeTab === 'MATCHES' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                title="Scores"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => switchTab('STANDINGS')}
                className={`p-1.5 rounded-lg text-xs transition-all ${activeTab === 'STANDINGS' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                title="Standings"
              >
                <Trophy className="w-4 h-4" />
              </button>
              <button
                onClick={() => switchTab('FAVORITES')}
                className={`p-1.5 rounded-lg text-xs transition-all ${activeTab === 'FAVORITES' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                title="Favorites"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={() => switchTab('SEARCH')}
                className={`p-1.5 rounded-lg text-xs transition-all ${activeTab === 'SEARCH' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </nav>

            {dbStatus && (
              <div 
                title={dbStatus.error ? `Koneksi Terputus: ${dbStatus.error}` : 'Terkoneksi ke Supabase secara Live!'}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border cursor-help ${
                  dbStatus.connected 
                    ? 'bg-emerald-950/40 border-emerald-800/85 text-emerald-400' 
                    : 'bg-amber-950/40 border-amber-800/85 text-amber-400'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest font-semibold whitespace-nowrap">
                  {dbStatus.connected ? 'Supabase ONAIR' : 'Local Fallback'}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold whitespace-nowrap">Socket Connected</span>
            </div>
          </div>

        </div>
      </header>

      {/* 3. Main Container Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {dbStatus && !dbStatus.connected && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-200 text-xs flex flex-col md:flex-row md:items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0 mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold text-amber-400 text-sm">Mode Cadangan Lokal Aktif (In-Memory Fallback)</p>
                <p className="text-slate-300 mt-1">
                  Koneksi database Postgres / Supabase Anda belum terhubung. Aplikasi saat ini berjalan lancar menggunakan data simulasi lokal dalam memori.
                </p>
                {dbStatus.error && (
                  <p className="text-emerald-400 mt-2 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-[10px] leading-relaxed break-all">
                    <span className="text-amber-400 font-bold block mb-1">Catatan Kesalahan DB:</span>
                    {dbStatus.error}
                  </p>
                )}
                <p className="text-slate-400 mt-2">
                  💡 <strong>Cara Menghubungkan Supabase Anda:</strong> Silakan tambahkan variabel lingkungan Anda di menu <strong>Settings</strong> di Google AI Studio dengan nilai kunci berikut:
                  <span className="block font-mono text-[10px] mt-1 text-slate-300 bg-slate-950 p-2 rounded">
                    DB_HOST = [Host pooler Supabase Anda]<br/>
                    DB_USER = [Username Postgres Anda]<br/>
                    DB_PASSWORD = [Password database Anda]<br/>
                    DB_NAME = postgres<br/>
                    DB_PORT = 5432
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW RESOLVERS: DETAILED FOCUS STATES OR TAB GRIDS */}
        {selectedPlayerId ? (
          <PlayerDetail 
            playerId={selectedPlayerId} 
            onBack={() => setSelectedPlayerId(null)} 
            onSelectTeam={(tid) => {
              setSelectedPlayerId(null);
              setSelectedTeamId(tid);
            }}
          />
        ) : selectedTeamId ? (
          <TeamDetail 
            teamId={selectedTeamId}
            onBack={() => setSelectedTeamId(null)}
            onSelectPlayer={(pid) => setSelectedPlayerId(pid)}
            onSelectMatch={(mid) => setSelectedMatchId(mid)}
          />
        ) : selectedMatchId ? (
          <MatchDetail 
            matchId={selectedMatchId} 
            onBack={() => setSelectedMatchId(null)}
            onSelectTeam={(tid) => setSelectedTeamId(tid)}
          />
        ) : (
          /* STANDARD TAB DIRECTORIES RENDERING */
          <>
            {activeTab === 'MATCHES' && (
              <LiveMatches 
                onSelectMatch={(mid) => setSelectedMatchId(mid)} 
              />
            )}

            {activeTab === 'STANDINGS' && (
              <LeagueStandings 
                onSelectTeam={(tid) => setSelectedTeamId(tid)} 
              />
            )}

            {activeTab === 'FAVORITES' && (
              <FavoritesList 
                onSelectTeam={(tid) => setSelectedTeamId(tid)} 
              />
            )}

            {activeTab === 'SEARCH' && (
              <div className="space-y-6">
                {/* Search query header control */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-1.5 font-display">
                    <Search className="w-4.5 h-4.5 text-slate-500" /> Global Football Encyclopedia
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Search query textbox */}
                    <div className="sm:col-span-8 relative">
                      <input
                        type="text"
                        placeholder={searchType === 'TEAMS' ? "Search clubs (e.g. Real Madrid, Arsenal...)" : "Search players (e.g. Haaland, Saka...)"}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-emerald-500/80 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                        id="encyclopedia-search"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>

                    {/* Selector switches to switch categories */}
                    <div className="sm:col-span-4 flex rounded-xl border border-slate-200 p-1 bg-slate-50 h-max">
                      <button
                        onClick={() => { setSearchType('TEAMS'); setSearchQuery(''); setSearchResults([]); }}
                        className={`flex-1 py-1.5 text-[10px] uppercase font-extrabold rounded-lg transition-all ${
                          searchType === 'TEAMS' ? 'bg-[#0f172a] text-white shadow' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                        id="search-type-teams"
                      >
                        Teams List
                      </button>
                      <button
                        onClick={() => { setSearchType('PLAYERS'); setSearchQuery(''); setSearchResults([]); }}
                        className={`flex-1 py-1.5 text-[10px] uppercase font-extrabold rounded-lg transition-all ${
                          searchType === 'PLAYERS' ? 'bg-[#0f172a] text-white shadow' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                        id="search-type-players"
                      >
                        Players List
                      </button>
                    </div>
                  </div>
                </div>

                {/* Query listings response grids */}
                {searching ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 text-xs">Querying database...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 flex flex-col items-center">
                    <Sliders className="w-10 h-10 mb-2 text-slate-300" />
                    <h4 className="text-xs font-bold text-slate-700">Type above to explore</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">Search profiles of major teams and star players across Europe's leading campaigns.</p>
                  </div>
                ) : (
                  <div>
                    {searchType === 'TEAMS' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchResults.map((team) => (
                          <div
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
                            id={`search-team-item-${team.id}`}
                          >
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-11 h-11 object-cover bg-slate-50 border border-slate-100 rounded-lg p-1"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-xs leading-tight group-hover:text-emerald-600 transition-colors">
                                {team.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">{team.country}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchResults.map((player) => (
                          <div
                            key={player.id}
                            onClick={() => setSelectedPlayerId(player.id)}
                            className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
                            id={`search-player-item-${player.id}`}
                          >
                            <div className="flex items-center gap-3">
                              {/* PERUBAHAN 1: Memberikan fallback 'NA' jika posisi bernilai null */}
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">
                                {player.position
                                  ? player.position.slice(0, 2).toUpperCase()
                                  : 'NA'}
                              </div>
                              <div>
                                {/* PERUBAHAN 2: Memberikan fallback nama 'Unknown Player' jika nama bernilai null */}
                                <h4 className="font-extrabold text-slate-800 text-xs leading-tight group-hover:text-emerald-600 transition-colors">
                                  {player.name || 'Unknown Player'}
                                </h4>
                                <p className="text-[10px] text-slate-400">{player.team?.name || 'Club Roster'}</p>
                              </div>
                            </div>

                            <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              Metrics <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. Page Layout Footer */}
      <footer className="bg-[#0f172a] text-slate-400 border-t border-slate-800 text-xs py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-bold text-slate-200 block text-sm font-display">
              STRIKER FOOTBALL TRACKER
            </span>
            <p className="max-w-md text-slate-400 leading-relaxed text-[11px]">
              Full-Stack relational soccer monitoring system driven by Node.js, Express, Socket.IO updates, and an animated React front-end dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] font-mono justify-center">
            <span className="bg-slate-800/60 border border-slate-700 px-3 py-1 rounded-full text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> DEV PREVIEW SYSTEM LIVE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
