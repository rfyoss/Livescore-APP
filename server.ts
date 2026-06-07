import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './backend-express/src/app';
import { initSocket } from './backend-express/src/config/socket';
import { MatchService } from './backend-express/src/services/matchService';
import { initDatabase } from './backend-express/src/config/db';

async function startServer() {
  // Initialize Database tables and sync store to Supabase if connected
  await initDatabase();

  const server = http.createServer(app);

  // Initialize Socket.io on the Node http server
  initSocket(server);

  // Kick off the real-time goal score matches simulation
  MatchService.startSimulation();

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Let Vite handle assets and pages, API requests are pre-registered on 'app'
    app.use(vite.middlewares);
    console.log('[Dev System] Vite dev middleware loaded successfully.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Production System] Static folder configured.');
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full stack App] Football Real-Time server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Startup Fail]', err);
});
