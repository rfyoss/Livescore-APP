import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  Team,
  Player,
  League,
  Match,
  MatchEvent,
  Standing,
  Favorite
} from '../types';

// ES module equivalent of __dirname
import dotenv from 'dotenv';

dotenv.config();
// Also try root .env as a fallback
const { Pool } = pg;

// Connection Pool — initialized lazily inside initDatabase()
export let pool: pg.Pool | null = null;
export let lastConnectionError: string | null = null;

// ==========================================
// SEED DATA FOR fallback (In-Memory Database)
// ==========================================

export const initialLeagues: League[] = [];
export const initialTeams: Team[] = [];
export const initialPlayers: Player[] = [];
export const initialStandings: Standing[] = [];
export const initialMatches: Match[] = [];
export const initialMatchEvents: MatchEvent[] = [];

// Active mock store matching the requested tables structure
export const store = {
  leagues: [],
  teams: [],
  players: [],
  standings: [],
  matches: [],
  matchEvents: [],
  favorites: [] as Favorite[]
};

// Auto-creates database schema and seeds initial records if Supabase tables are empty
export const initDatabase = async () => {
  // --- Build connection pool here so env vars are guaranteed to be loaded ---
  const dbUrl      = process.env.SUPABASE_DB_URL;
  const dbHost     = process.env.DB_HOST;
  const dbPort     = process.env.DB_PORT;
  const dbName     = process.env.DB_NAME;
  const dbUser     = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;

  if (!pool) {
    if (dbUrl) {
      try {
        let sanitizedDbUrl = dbUrl;
        if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
          const urlObj = new URL(dbUrl);
          let rawPassword = urlObj.password;
          try { rawPassword = decodeURIComponent(rawPassword); } catch (_) {}
          urlObj.password = encodeURIComponent(rawPassword);
          sanitizedDbUrl = urlObj.toString();
        }
        pool = new Pool({ connectionString: sanitizedDbUrl, ssl: { rejectUnauthorized: false } });
        console.log('[Supabase Connect] Pool created via SUPABASE_DB_URL.');
      } catch (e) {
        console.error('[Supabase Connect] Failed to create pool from SUPABASE_DB_URL:', e);
      }
    } else if (dbHost && dbUser && dbPassword) {
      try {
        pool = new Pool({
          host: dbHost,
          port: parseInt(dbPort || '5432', 10),
          database: dbName || 'postgres',
          user: dbUser,
          password: dbPassword,
          ssl: { rejectUnauthorized: false }
        });
        console.log('[Supabase Connect] Pool created via individual DB_* params.');
      } catch (e) {
        console.error('[Supabase Connect] Failed to create pool from individual params:', e);
      }
    } else {
      console.warn('[Supabase Connect] No DB credentials found. Running in in-memory mode.');
      lastConnectionError = 'No DB credentials. Set SUPABASE_DB_URL or DB_HOST/DB_USER/DB_PASSWORD in .env';
      return;
    }
  }

  if (!pool) return;

  // --- Test the connection before doing anything else ---
  try {
    await pool.query('SELECT 1');
    console.log('[Supabase Connect] ✅ Database connection verified successfully!');
  } catch (pingErr: any) {
    const msg = pingErr?.message || String(pingErr);
    console.error('[Supabase Connect] ❌ Connection test failed:', msg);
    if (msg.includes('password authentication')) {
      console.error('[Supabase Connect] ➡ Fix: Update DB_PASSWORD (and password in SUPABASE_DB_URL) in backend-express/src/.env with your Supabase database password.');
    } else if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
      console.error('[Supabase Connect] ➡ Fix: Check DB_HOST value — make sure the Supabase project is active and the host URL is correct.');
    }
    lastConnectionError = msg;
    try { await pool.end(); } catch (_) {}
    pool = null;
    console.log('[Supabase Connect] Running in in-memory mode due to connection failure.');
    return;
  }

  try {
    console.log('[Supabase Connect] Initializing database tables alignment with custom schema...');
    
    // 1. Create table teams
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        team_id    INTEGER PRIMARY KEY,
        name       VARCHAR,
        code       VARCHAR,
        country    VARCHAR,
        founded    INTEGER,
        logo       TEXT,
        stadium    VARCHAR,
        capacity   INTEGER
      );
    `);

    // 2. Create table players
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        player_id   INTEGER PRIMARY KEY,
        team_id     INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
        name        VARCHAR,
        age         INTEGER,
        nationality VARCHAR,
        position    VARCHAR,
        photo       TEXT
      );
    `);

    // 3. Create table fixtures
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fixtures (
        fixture_id   INTEGER PRIMARY KEY,
        league_id    VARCHAR,
        season       VARCHAR,
        match_date   TIMESTAMP,
        status       VARCHAR,
        home_team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
        away_team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
        home_goals   INTEGER DEFAULT 0,
        away_goals   INTEGER DEFAULT 0
      );
    `);

    // 4. Create table events
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        event_id     SERIAL PRIMARY KEY,
        fixture_id   INTEGER REFERENCES fixtures(fixture_id) ON DELETE CASCADE,
        time_elapsed INTEGER,
        team_id      INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
        player_name  VARCHAR,
        event_type   VARCHAR,
        detail       VARCHAR
      );
    `);

    // 5. Create table player_stats
    await pool.query(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id         SERIAL PRIMARY KEY,
        player_id  INTEGER REFERENCES players(player_id) ON DELETE CASCADE,
        fixture_id INTEGER REFERENCES fixtures(fixture_id) ON DELETE CASCADE,
        goals      INTEGER DEFAULT 0,
        assists    INTEGER DEFAULT 0,
        shots      INTEGER DEFAULT 0,
        passes     INTEGER DEFAULT 0,
        minutes    INTEGER DEFAULT 0
      );
    `);

    // 6. Create table live_matches
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_matches (
        fixture_id INTEGER PRIMARY KEY REFERENCES fixtures(fixture_id) ON DELETE CASCADE,
        home_team  VARCHAR,
        away_team  VARCHAR,
        home_goals INTEGER DEFAULT 0,
        away_goals INTEGER DEFAULT 0,
        match_time VARCHAR,
        status     VARCHAR,
        updated_at TIMESTAMP
      );
    `);

    // Leagues and Standings for front-end support integration
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leagues (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        logo TEXT,
        season VARCHAR(50) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS standings (
        id SERIAL PRIMARY KEY,
        league_id VARCHAR(50) REFERENCES leagues(id) ON DELETE CASCADE,
        team_id INT REFERENCES teams(team_id) ON DELETE CASCADE,
        played INT DEFAULT 0,
        win INT DEFAULT 0,
        draw INT DEFAULT 0,
        loss INT DEFAULT 0,
        goals_for INT DEFAULT 0,
        goals_against INT DEFAULT 0,
        points INT DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        team_id INT REFERENCES teams(team_id) ON DELETE CASCADE UNIQUE
      );
    `);

    console.log('[Supabase Connect] Tables verified & prepared with explicit schema design.');

    // Skip seeding because we use real Supabase data
    console.log('[Supabase Connect] Tables verified & prepared. Using actual Supabase dataset.');

    // Load remote DB records and adapt them to robust in-memory emulator store formats
    const { rows: dbLeagues } = await pool.query('SELECT * FROM leagues');
    const { rows: dbTeams } = await pool.query('SELECT * FROM teams');
    const { rows: dbPlayers } = await pool.query('SELECT * FROM players');
    const { rows: dbStandings } = await pool.query('SELECT * FROM standings');
    const { rows: dbFixtures } = await pool.query('SELECT * FROM fixtures');
    const { rows: dbEvents } = await pool.query('SELECT * FROM events');
    const { rows: dbFavorites } = await pool.query('SELECT * FROM favorites');

    // Adapt database formats to client models
    store.leagues = dbLeagues;
    store.teams = dbTeams.map((t: any) => ({
      id: t.team_id,
      name: t.name,
      logo: t.logo,
      country: t.country,
      founded: t.founded,
      venue: t.stadium || 'Stamford Bridge'
    }));
    store.players = dbPlayers.map((p: any) => ({
      id: p.player_id,
      team_id: p.team_id,
      name: p.name,
      age: p.age,
      nationality: p.nationality,
      position: p.position,
      photo: p.photo
    }));
    store.standings = dbStandings;
    store.matches = dbFixtures.map((f: any) => ({
      id: f.fixture_id,
      league_id: f.league_id,
      home_team_id: f.home_team_id,
      away_team_id: f.away_team_id,
      match_date: f.match_date,
      status: f.status,
      home_score: f.home_goals,
      away_score: f.away_goals
    }));
    store.matchEvents = dbEvents.map((e: any) => ({
      id: e.event_id,
      match_id: e.fixture_id,
      team_id: e.team_id,
      event_type: e.event_type,
      minute: e.time_elapsed,
      description: e.detail,
      player_name: e.player_name
    }));
    store.favorites = dbFavorites.map((fav: any) => ({
      id: fav.id,
      user_id: 'default_user',
      team_id: fav.team_id
    }));

    console.log('[Supabase Connect] In-memory store synchronized with remote Supabase.');
  } catch (err) {
    lastConnectionError = err instanceof Error ? err.message : String(err);
    console.error('[Supabase Connect] Table initialization / sync failed:', err);
    try {
      if (pool) {
        await pool.end();
      }
    } catch (e) {}
    pool = null;
    console.log('[Supabase Connect] Reset pool to null. Application is running in robust in-memory mode.');
  }
};

// SQL string and parameter rewrites for transparent adapter
function rewriteQuery(text: string, params: any[]): { text: string; params: any[] } {
  let sql = text.trim();
  const mutableParams = [...params];

  // Map matches and match_events table names
  sql = sql.replace(/\bmatches\b/gi, 'fixtures');
  sql = sql.replace(/\bmatch_events\b/gi, 'events');

  if (sql.toLowerCase().includes('fixtures')) {
    sql = sql.replace(/\bhome_score\b/gi, 'home_goals');
    sql = sql.replace(/\baway_score\b/gi, 'away_goals');
    sql = sql.replace(/\bid =/gi, 'fixture_id =');
  }

  if (sql.toLowerCase().includes('teams')) {
    sql = sql.replace(/\bid =/gi, 'team_id =');
    sql = sql.replace(/\bvenue\b/gi, 'stadium');
  }

  if (sql.toLowerCase().includes('players')) {
    sql = sql.replace(/\bid =/gi, 'player_id =');
  }

  if (sql.toLowerCase().includes('events')) {
    sql = sql.replace(/\bid =/gi, 'event_id =');
    sql = sql.replace(/\bmatch_id\b/gi, 'fixture_id');
    sql = sql.replace(/\bminute\b/gi, 'time_elapsed');
    sql = sql.replace(/\bdescription\b/gi, 'detail');

    if (sql.includes('INSERT INTO events')) {
      sql = 'INSERT INTO events (event_id, fixture_id, team_id, player_name, event_type, time_elapsed, detail) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (event_id) DO NOTHING';
      
      // Transform incoming $4 parameter (player_id) into player_name VARCHAR
      const playerId = mutableParams[3];
      let resolvedPlayerName = null;
      if (playerId) {
        const p = store.players.find(it => it.id === playerId);
        if (p) resolvedPlayerName = p.name;
      }
      mutableParams[3] = resolvedPlayerName;
    }
  }

  return { text: sql, params: mutableParams };
}

// Convert DB schema results back to client expected formats
function adaptResults(rows: any[]): any[] {
  return rows.map((row: any) => {
    const mapped: any = { ...row };

    if (row.hasOwnProperty('team_id')) {
      mapped.id = row.team_id;
    }
    if (row.hasOwnProperty('stadium')) {
      mapped.venue = row.stadium;
    }
    if (row.hasOwnProperty('player_id')) {
      mapped.id = row.player_id;
    }
    if (row.hasOwnProperty('fixture_id')) {
      mapped.id = row.fixture_id;
    }
    if (row.hasOwnProperty('home_goals')) {
      mapped.home_score = row.home_goals;
    }
    if (row.hasOwnProperty('away_goals')) {
      mapped.away_score = row.away_goals;
    }
    if (row.hasOwnProperty('event_id')) {
      mapped.id = row.event_id;
    }
    if (row.hasOwnProperty('time_elapsed')) {
      mapped.minute = row.time_elapsed;
    }
    if (row.hasOwnProperty('detail')) {
      mapped.description = row.detail;
    }

    return mapped;
  });
}

// Database queries aggregator
export const db = {
  query: async (text: string, params: any[] = []): Promise<any> => {
    // If pool is set, try executing Postgres SQL statement, otherwise fall back to store engine execution.
    if (pool) {
      try {
        const { text: adaptedSql, params: adaptedParams } = rewriteQuery(text, params);
        const result = await pool.query(adaptedSql, adaptedParams);
        
        // Map database result schema properties back to frontend model types
        result.rows = adaptResults(result.rows);
        const queryLower = text.toLowerCase().trim();

        // Dynamically enrich database returns to match nested relational shapes expected by Client (same as offline store)
        if (queryLower.includes('from standings')) {
          const { rows: dbTeams } = await pool.query('SELECT * FROM teams');
          const adaptedTeams = adaptResults(dbTeams);
          result.rows = result.rows.map((row: any) => ({
            ...row,
            team: adaptedTeams.find((t: any) => t.id === row.team_id)
          }));
        } else if (queryLower.includes('from matches') || queryLower.includes('from fixtures')) {
          const { rows: dbTeams } = await pool.query('SELECT * FROM teams');
          const { rows: dbEvents } = await pool.query('SELECT * FROM events ORDER BY time_elapsed ASC');
          const adaptedTeams = adaptResults(dbTeams);
          const adaptedEvents = adaptResults(dbEvents);
          result.rows = result.rows.map((row: any) => ({
            ...row,
            home_team: adaptedTeams.find((t: any) => t.id === row.home_team_id),
            away_team: adaptedTeams.find((t: any) => t.id === row.away_team_id),
            events: adaptedEvents.filter((e: any) => e.match_id === row.id)
          }));
        } else if (queryLower.includes('from players')) {
          const { rows: dbTeams } = await pool.query('SELECT * FROM teams');
          const adaptedTeams = adaptResults(dbTeams);
          result.rows = result.rows.map((row: any) => ({
            ...row,
            team: adaptedTeams.find((t: any) => t.id === row.team_id)
          }));
        } else if (queryLower.includes('from favorites')) {
          const { rows: dbTeams } = await pool.query('SELECT * FROM teams');
          const adaptedTeams = adaptResults(dbTeams);
          result.rows = result.rows.map((row: any) => ({
            ...row,
            team: adaptedTeams.find((t: any) => t.id === row.team_id)
          }));
        }

        return result;
      } catch (err: any) {
        console.error(`[Supabase Connect] Database query error (${err.code || 'unknown'}):`, err.message);
        console.log('[Supabase Connect] Falling back to in-memory emulation for this specific query, but keeping pool active.');
        // We purposefully DO NOT destroy the pool here so transient errors (like ECONNRESET)
        // don't permanently switch the app to Local Fallback mode.
      }
    }
    
    // OFFLINE QUERY FALLBACK EMULATION
    const queryLower = text.toLowerCase().trim();
    
    if (queryLower.startsWith('select * from leagues') || queryLower.includes('from leagues')) {
      return { rows: store.leagues };
    }
    if (queryLower.startsWith('select * from teams') || queryLower.includes('from teams')) {
      if (queryLower.includes('id =')) {
        const id = parseInt(params[0]) || 0;
        return { rows: store.teams.filter(t => t.id === id) };
      }
      return { rows: store.teams };
    }
    if (queryLower.startsWith('select * from players') || queryLower.includes('from players')) {
      if (queryLower.includes('team_id =')) {
        const team_id = parseInt(params[0]) || 0;
        return { rows: store.players.filter(p => p.team_id === team_id) };
      }
      if (queryLower.includes('id =')) {
        const id = parseInt(params[0]) || 0;
        return { rows: store.players.filter(p => p.id === id) };
      }
      return { rows: store.players };
    }
    if (queryLower.startsWith('select * from standings') || queryLower.includes('from standings')) {
      if (queryLower.includes('league_id =')) {
        const lid = params[0];
        const rows = store.standings
          .filter(s => s.league_id === lid)
          .map(s => ({
            ...s,
            team: store.teams.find(t => t.id === s.team_id)
          }));
        return { rows };
      }
      return { rows: store.standings };
    }
    if (queryLower.startsWith('select * from matches') || queryLower.includes('from matches') || queryLower.includes('from fixtures')) {
      const enrichMatch = (m: Match) => ({
        ...m,
        home_team: store.teams.find(t => t.id === m.home_team_id),
        away_team: store.teams.find(t => t.id === m.away_team_id),
        events: store.matchEvents.filter(e => e.match_id === m.id)
      });

      if (queryLower.includes('status =')) {
        const status = params[0];
        return { rows: store.matches.filter(m => m.status === status).map(enrichMatch) };
      }
      if (queryLower.includes('id =') || queryLower.includes('fixture_id =')) {
        const id = parseInt(params[0]) || 0;
        return { rows: store.matches.filter(m => m.id === id).map(enrichMatch) };
      }
      return { rows: store.matches.map(enrichMatch) };
    }
    if (queryLower.startsWith('select * from match_events') || queryLower.includes('from match_events') || queryLower.includes('from events')) {
      if (queryLower.includes('match_id =') || queryLower.includes('fixture_id =')) {
        const mid = parseInt(params[0]) || 0;
        return { rows: store.matchEvents.filter(e => e.match_id === mid) };
      }
      return { rows: store.matchEvents };
    }
    if (queryLower.startsWith('select * from favorites') || queryLower.includes('from favorites')) {
      return { rows: store.favorites.map(f => ({ ...f, team: store.teams.find(t => t.id === f.team_id) })) };
    }
    if (queryLower.startsWith('insert into favorites')) {
      const teamIdNum = params[0];
      const alreadyHas = store.favorites.some(f => f.team_id === teamIdNum);
      if (!alreadyHas) {
        store.favorites.push({
          id: store.favorites.length + 1,
          user_id: 'default_user',
          team_id: teamIdNum
        });
      }
      return { rows: store.favorites };
    }
    if (queryLower.startsWith('delete from favorites')) {
      const teamIdNum = params[0];
      store.favorites = store.favorites.filter(f => f.team_id !== teamIdNum);
      return { rows: [{ success: true }] };
    }

    return { rows: [] };
  }
};
