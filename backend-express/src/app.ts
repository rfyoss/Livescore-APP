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

// Database status API — reads pool dynamically (after initDatabase has run)
app.get('/api/db-status', (req, res) => {
  const isConnected = dbConfig.pool !== null;
  res.json({
    connected: isConnected,
    backendMode: isConnected ? 'SUPABASE' : 'IN_MEMORY',
    error: isConnected ? null : dbConfig.lastConnectionError
  });
});

// API Endpoints
app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/standings', standingsRoutes);

// Bonus: Favorites API endpoint to fully bind the requested "Favorite Team" feature
app.get('/api/favorites', async (req, res, next) => {
  try {
    const { rows: favors } = await dbConfig.db.query('SELECT * FROM favorites');
    res.json(favors);
  } catch (err) {
    next(err);
  }
});

app.post('/api/favorites', async (req, res, next) => {
  try {
    const { team_id } = req.body;
    if (!team_id) {
      res.status(400).json({ error: 'team_id is required' });
      return;
    }
    
    const teamIdNum = parseInt(team_id);
    await db.query('INSERT INTO favorites (team_id) VALUES ($1)', [teamIdNum]);
    const { rows: updatedFavs } = await db.query('SELECT * FROM favorites');
    res.status(201).json({ success: true, favorites: updatedFavs });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/favorites/:teamId', async (req, res, next) => {
  try {
    const teamIdNum = parseInt(req.params.teamId);
    await db.query('DELETE FROM favorites WHERE team_id = $1', [teamIdNum]);
    const { rows: updatedFavs } = await db.query('SELECT * FROM favorites');
    res.json({ success: true, favorites: updatedFavs });
  } catch (err) {
    next(err);
  }
});

// App health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', date: new Date().toISOString() });
});

// Apply 404/Error Middleware on unhandled API requests
app.use('/api', notFoundMiddleware);
app.use(errorMiddleware);

export default app;
