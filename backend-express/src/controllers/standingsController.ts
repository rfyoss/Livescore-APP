import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';
import { redis } from '../config/redis';

export const getStandingsByLeague = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { leagueId } = req.params;
    const cacheKey = `standings:${leagueId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: standings } = await db.query('SELECT * FROM standings WHERE league_id = $1', [leagueId.toUpperCase()]);
    
    // Sort table by Points DESC, then Goal Difference DESC
    const sortedStandings = standings.sort((a: any, b: any) => {
      const ptsDiff = b.points - a.points;
      if (ptsDiff !== 0) return ptsDiff;
      
      const gdA = a.goals_for - a.goals_against;
      const gdB = b.goals_for - b.goals_against;
      return gdB - gdA;
    });

    await redis.set(cacheKey, sortedStandings, 'standings');
    res.json(sortedStandings);
  } catch (err) {
    next(err);
  }
};
