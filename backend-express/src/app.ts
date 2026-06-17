import express from 'express';
import cors from 'cors';

import { notFoundMiddleware } from './middlewares/notFoundMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';

import matchRoutes from './routes/matchRoutes';
import teamRoutes from './routes/teamRoutes';
import playerRoutes from './routes/playerRoutes';
import standingsRoutes from './routes/standingsRoutes';

import * as dbConfig from './config/db';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

/* =========================================================
   DATABASE STATUS
========================================================= */
app.get('/api/db-status', (req, res) => {
  const isConnected = dbConfig.pool !== null;

  res.json({
    connected: isConnected,
    backendMode: isConnected ? 'SUPABASE' : 'IN_MEMORY',
    error: isConnected ? null : dbConfig.lastConnectionError
  });
});

/* =========================================================
   MAIN API ROUTES
========================================================= */
app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/standings', standingsRoutes);

/* =========================================================
   FAVORITES API
========================================================= */

/**
 * GET ALL FAVORITES
 */
app.get('/api/favorites', async (req, res, next) => {
  try {
    const { rows } = await dbConfig.db.query(
      'SELECT * FROM favorites'
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * ADD FAVORITE
 */
app.post('/api/favorites', async (req, res, next) => {
  try {
    const { team_id } = req.body;

    if (!team_id) {
      return res.status(400).json({
        success: false,
        error: 'team_id is required'
      });
    }

    const teamIdNum = Number(team_id);

    const existing = await dbConfig.db.query(
      'SELECT * FROM favorites'
    );

    const alreadyExists = existing.rows.some(
      (fav: any) => fav.team_id === teamIdNum
    );

    if (!alreadyExists) {
      await dbConfig.db.query(
        'INSERT INTO favorites (team_id) VALUES ($1)',
        [teamIdNum]
      );
    }

    const { rows } = await dbConfig.db.query(
      'SELECT * FROM favorites'
    );

    res.status(201).json({
      success: true,
      favorites: rows
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE FAVORITE
 */
app.delete('/api/favorites/:teamId', async (req, res, next) => {
  try {
    const teamIdNum = Number(req.params.teamId);

    await dbConfig.db.query(
      'DELETE FROM favorites WHERE team_id = $1',
      [teamIdNum]
    );

    const { rows } = await dbConfig.db.query(
      'SELECT * FROM favorites'
    );

    res.json({
      success: true,
      favorites: rows
    });
  } catch (err) {
    next(err);
  }
});

/* =========================================================
   HEALTH CHECK
========================================================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

/* =========================================================
   ERROR HANDLING
========================================================= */
app.use('/api', notFoundMiddleware);
app.use(errorMiddleware);

export default app;
