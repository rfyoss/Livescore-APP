import { Socket, Server } from 'socket.io';

export const handleLiveSocketEvents = (io: Server, socket: Socket) => {
  console.log(`[socket event handler routing] Registering room handshakes for ID: ${socket.id}`);

  // When a user selects a detailed match view, join a specific room for notifications
  socket.on('subscribe_to_match', (matchId: number) => {
    socket.join(`match_${matchId}`);
    console.log(`[Socket Action] Participant ${socket.id} subscribed to live updates of Match: ${matchId}`);
    
    // Welcome client
    socket.emit('live_status_connected', {
      connected: true,
      room: `match_${matchId}`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('unsubscribe_from_match', (matchId: number) => {
    socket.leave(`match_${matchId}`);
    console.log(`[Socket Action] Participant ${socket.id} unsubscribed from Match: ${matchId}`);
  });
};

export default handleLiveSocketEvents;
