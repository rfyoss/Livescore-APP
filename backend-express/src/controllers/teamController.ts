import { Request, Response, NextFunction } from 'express';
import { db, store } from '../config/db';
import { redis } from '../config/redis';

export const getTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryStr = req.query.q ? String(req.query.q).toLowerCase() : '';
    const cacheKey = `teams:list:${queryStr || 'all'}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: teams } = await db.query('SELECT * FROM teams');
    const filteredTeams = queryStr 
      ? teams.filter((t: any) => t.name.toLowerCase().includes(queryStr) || t.country.toLowerCase().includes(queryStr))
      : teams;

    await redis.set(cacheKey, filteredTeams, 'teams');
    res.json(filteredTeams);
  } catch (err) {
    next(err);
  }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const cacheKey = `teams:detail:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: teams } = await db.query('SELECT * FROM teams WHERE id = $1', [id]);
    if (teams.length === 0) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const team = leaguesEnrich(teams[0]);
    // Load squad
    const { rows: squad } = await db.query('SELECT * FROM players WHERE team_id = $1', [id]);
    
    // Load recent matches
    const { rows: allMatches } = await db.query('SELECT * FROM matches');
    const teamIdNum = parseInt(id);
    const matches = allMatches.filter((m: any) => m.home_team_id === teamIdNum || m.away_team_id === teamIdNum);

    const fullDetails = {
      ...team,
      squad,
      matches
    };

    await redis.set(cacheKey, fullDetails, 'teams');
    res.json(fullDetails);
  } catch (err) {
    next(err);
  }
};

// Helper to look up simple league association if needed
const leaguesEnrich = (team: any) => {
  const isSpanish = team.country === 'Spain';
  const isGerman = team.country === 'Germany';
  const isFrench = team.country === 'France';
  
  let league_id = 'PL';
  if (isSpanish) league_id = 'LL';
  else if (isGerman || isFrench) league_id = 'UCL';

  return {
    ...team,
    league_id
  };
};
