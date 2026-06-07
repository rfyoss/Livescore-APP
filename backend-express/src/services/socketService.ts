import { broadcastEvent, getIO } from '../config/socket';

export const socketService = {
  // Emit goal alert to connected socket clients
  emitGoalScored: (matchId: number, matchDetails: any) => {
    broadcastEvent('goal_scored', {
      match_id: matchId,
      ...matchDetails
    });
  },

  // Emit kick-off match alert
  emitMatchStarted: (matchId: number, details: any) => {
    broadcastEvent('match_started', {
      match_id: matchId,
      ...details
    });
  },

  // Emit final whistle score
  emitMatchFinished: (matchId: number, details: any) => {
    broadcastEvent('match_finished', {
      match_id: matchId,
      ...details
    });
  },

  // Emit live events (cards, subs, details)
  emitLiveStats: (matchId: number, stats: any) => {
    broadcastEvent('live_stats', {
      match_id: matchId,
      ...stats
    });
  },

  // Get active socket connections count
  getConnectedClientCount: (): number => {
    try {
      const io = getIO();
      return io.sockets.sockets.size;
    } catch {
      return 0;
    }
  }
};

export default socketService;
