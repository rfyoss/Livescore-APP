import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export const initSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Permit all connections for the sandbox preview
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO Client Connected] ID: ${socket.id}`);

    socket.on('join_match', (matchId: string) => {
      socket.join(`match_${matchId}`);
      console.log(`Socket ${socket.id} joined match room: match_${matchId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO Client Disconnected] ID: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet. Call initSocket first.');
  }
  return io;
};

// Emit live goals, cards, and match status events with absolute modularity
export const broadcastEvent = (event: 'goal_scored' | 'match_started' | 'match_finished' | 'live_stats', data: any) => {
  if (!io) {
    console.log(`[Socket Broadcast Delayed] Socket not yet online, event: ${event}`);
    return;
  }
  
  // Broadcast globally (for global alerts / live score ticker)
  io.emit(event, data);
  console.log(`[Socket io.emit] Broadcasted global event: ${event}`, data);

  // If match specific, room broadcast as well
  if (data.match_id || data.id) {
    const matchId = data.match_id || data.id;
    io.to(`match_${matchId}`).emit(event, data);
    console.log(`[Socket io.to] Broadcasted to room: match_${matchId}, event: ${event}`);
  }
};
