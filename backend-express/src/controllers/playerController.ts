import { Request, Response, NextFunction } from 'express';
import { db, store } from '../config/db';
import { redis } from '../config/redis';

export const getPlayerById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const cacheKey = `players:detail:${id}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: players } = await db.query(
      'SELECT * FROM players WHERE id = $1',
      [id]
    );

    if (players.length === 0) {
      res.status(404).json({
        error: 'Player not found'
      });
      return;
    }

    const player = players[0];

    const { rows: teams } = await db.query(
      'SELECT * FROM teams WHERE id = $1',
      [player.team_id]
    );

    const team = teams.length > 0 ? teams[0] : null;

    const stats = getMockPlayerStats(
      player.position || '',
      player.name || ''
    );

    const fullDetails = {
      ...player,
      team,
      stats
    };

    await redis.set(cacheKey, fullDetails, 'players');

    res.json(fullDetails);
  } catch (err) {
    next(err);
  }
};

export const searchPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const queryStr = req.query.q
      ? String(req.query.q).toLowerCase()
      : '';

    const cacheKey = `players:search:${queryStr || 'all'}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      res.json(cached);
      return;
    }

    const { rows: players } = await db.query(
      'SELECT * FROM players'
    );

    const filtered = queryStr
      ? players.filter((p: any) => {
          const name = (p.name || '').toLowerCase();
          const nationality = (p.nationality || '').toLowerCase();
          const position = (p.position || '').toLowerCase();

          return (
            name.includes(queryStr) ||
            nationality.includes(queryStr) ||
            position.includes(queryStr)
          );
        })
      : players;

    const enriched = filtered.map((player: any) => ({
      ...player,
      team: store.teams.find(
        t => t.id === player.team_id
      )
    }));

    await redis.set(cacheKey, enriched, 'players');

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

const getMockPlayerStats = (
  position: string,
  name: string
) => {
  if (position === 'Forward') {
    return {
      appearances: 34,
      goals:
        name.includes('Haaland')
          ? 31
          : 22,
      assists: 8,
      shots_on_target: 65,
      minutes_played: 2890,
      rating: 8.2
    };
  }

  if (position === 'Midfielder') {
    return {
      appearances: 31,
      goals: 9,
      assists: 18,
      key_passes: 92,
      pass_accuracy: '89.4%',
      rating: 8.4
    };
  }

  if (position === 'Defender') {
    return {
      appearances: 35,
      tackles: 58,
      interceptions: 41,
      blocks: 22,
      duels_won: '64.2%',
      goals: 2,
      rating: 7.5
    };
  }

  return {
    appearances: 33,
    clean_sheets: 14,
    saves: 95,
    conceded: 27,
    save_percentage: '77.8%',
    penalties_saved: 2,
    rating: 7.6
  };
};
