import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import { initSocket } from './config/socket';
import { MatchService } from './services/matchService';
import { initDatabase } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

async function start() {
  // Initialize Database tables and sync store to Supabase if connected
  await initDatabase();

  // Initialize Websockets on server
  initSocket(server);

  // Boot live-match simulated ticker job
  MatchService.startSimulation();

  server.listen(PORT, () => {
    console.log(`[HTTP Server] Live on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[HTTP Server] Initialization crash:', err);
});
