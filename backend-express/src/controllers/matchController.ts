import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';
import { redis } from '../config/redis';

export const getMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'matches:all';
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: matches } = await db.query('SELECT * FROM matches ORDER BY match_date DESC');
    await redis.set(cacheKey, matches, 'fixtures');
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

export const getLiveMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'matches:live';
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: matches } = await db.query("SELECT * FROM matches WHERE status = 'LIVE' ORDER BY match_date DESC");
    await redis.set(cacheKey, matches, 'live_match');
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

export const getUpcomingMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cacheKey = 'matches:upcoming';
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: matches } = await db.query("SELECT * FROM matches WHERE status = 'UPCOMING' ORDER BY match_date ASC");
    await redis.set(cacheKey, matches, 'fixtures');
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

export const getMatchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const cacheKey = `matches:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: matches } = await db.query('SELECT * FROM matches WHERE id = $1', [id]);
    if (matches.length === 0) {
      res.status(404).json({ message: 'Match not found' });
      return;
    }

    const matchAndStats = matches[0];
    await redis.set(cacheKey, matchAndStats, 'live_match');
    res.json(matchAndStats);
  } catch (err) {
    next(err);
  }
};
