import { store, db } from '../config/db';
import { broadcastEvent } from '../config/socket';
import { Match, MatchEvent, Player } from '../../../src/types';
import { redis } from '../config/redis';

// Simulated Football Event Generator
export class MatchService {
  private static intervalId: NodeJS.Timeout | null = null;

  public static startSimulation() {
    if (this.intervalId) return;

    console.log('[Match Sim Engine] Live football match simulation kicked off.');

    this.intervalId = setInterval(async () => {
      try {
        const liveMatches = store.matches.filter(m => m.status === 'LIVE');
        if (liveMatches.length === 0) return;

        for (const match of liveMatches) {
          // 1. Advance the game clock
          const minuteIncrement = Math.floor(Math.random() * 2) + 1; // +1 to +2 minutes per clock tick
          let currentMinute = 15; // default starter
          
          // Find last event to see current elapsed minute
          const matchEvents = store.matchEvents.filter(e => e.match_id === match.id);
          if (matchEvents.length > 0) {
            const maxMinObj = matchEvents.reduce((prev, current) => (prev.minute > current.minute) ? prev : current);
            currentMinute = maxMinObj.minute + minuteIncrement;
          }

          if (currentMinute >= 90) {
            // End the match!
            match.status = 'FINISHED';
            db.query('UPDATE matches SET status = $1 WHERE id = $2', ['FINISHED', match.id]).catch(err => console.error(err));
            
            const endEvent: MatchEvent = {
              id: store.matchEvents.length + 1,
              match_id: match.id,
              team_id: match.home_team_id,
              event_type: 'MATCH_END',
              minute: 90,
              description: `FULL TIME! The referee blows the final whistle! Final match score is ${match.home_team?.name || 'Home'} ${match.home_score} - ${match.away_score} ${match.away_team?.name || 'Away'}.`
            };

            store.matchEvents.push(endEvent);
            db.query(
              'INSERT INTO match_events (id, match_id, team_id, player_id, event_type, minute, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
              [endEvent.id, endEvent.match_id, endEvent.team_id, null, endEvent.event_type, endEvent.minute, endEvent.description]
            ).catch(err => console.error(err));
            
            // Adjust standings points based on final outcome
            this.updateStandingsOnMatchEnd(match);

            broadcastEvent('match_finished', {
              match_id: match.id,
              home_score: match.home_score,
              away_score: match.away_score,
              event_description: endEvent.description
            });

            // Wipe cache records to reload freshness
            await redis.delete('matches:all');
            await redis.delete('matches:live');
            await redis.delete(`matches:${match.id}`);
            await redis.delete('standings:PL');
            await redis.delete('standings:LL');
            continue;
          }

          // 2. Roll probability for match event (30% chance per tick)
          if (Math.random() < 0.3) {
            const eventRoll = Math.random();
            const scoringTeamId = Math.random() < 0.5 ? match.home_team_id : match.away_team_id;
            const isHome = scoringTeamId === match.home_team_id;
            const scoringTeamName = isHome 
              ? (store.teams.find(t => t.id === match.home_team_id)?.name || 'Home')
              : (store.teams.find(t => t.id === match.away_team_id)?.name || 'Away');

            // Find eligible squad players to link
            const clubSquad = store.players.filter(p => p.team_id === scoringTeamId);
            const playerScorer = clubSquad.length > 0 ? clubSquad[Math.floor(Math.random() * clubSquad.length)] : null;

            if (eventRoll < 0.25) {
              // GOAL EVENT
              if (isHome) match.home_score += 1;
              else match.away_score += 1;

              db.query('UPDATE matches SET home_score = $1, away_score = $2 WHERE id = $3', [match.home_score, match.away_score, match.id]).catch(err => console.error(err));

              const goalDescriptions = [
                `GOAL! ${playerScorer?.name || 'Striker'} fires a bullet header directly into the back of the net after a perfect crossing play!`,
                `GOAL! Dynamic striking! ${playerScorer?.name || 'Winger'} sweeps an effortless finish past the keeper from close range!`,
                `GOAL! Unbelievable goal! ${playerScorer?.name || 'Midfielder'} curls a brilliant long-range strike into the top corner!`
              ];

              const matchEvent: MatchEvent = {
                id: store.matchEvents.length + 1,
                match_id: match.id,
                team_id: scoringTeamId,
                player_id: playerScorer?.id,
                event_type: 'GOAL',
                minute: currentMinute,
                description: `${goalDescriptions[Math.floor(Math.random() * goalDescriptions.length)]} (${scoringTeamName} ${match.home_score} - ${match.away_score})`
              };

              store.matchEvents.push(matchEvent);
              db.query(
                'INSERT INTO match_events (id, match_id, team_id, player_id, event_type, minute, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [matchEvent.id, matchEvent.match_id, matchEvent.team_id, matchEvent.player_id || null, matchEvent.event_type, matchEvent.minute, matchEvent.description]
              ).catch(err => console.error(err));

              // Clear caches
              await redis.delete('matches:all');
              await redis.delete('matches:live');
              await redis.delete(`matches:${match.id}`);

              broadcastEvent('goal_scored', {
                match_id: match.id,
                home_team: store.teams.find(t => t.id === match.home_team_id)?.name,
                away_team: store.teams.find(t => t.id === match.away_team_id)?.name,
                home_score: match.home_score,
                away_score: match.away_score,
                scorer: playerScorer?.name,
                minute: currentMinute,
                description: matchEvent.description
              });

            } else if (eventRoll < 0.55) {
              // YELLOW CARD
              const cardedPlayer = clubSquad[Math.floor(Math.random() * clubSquad.length)];
              const yellowEvent: MatchEvent = {
                id: store.matchEvents.length + 1,
                match_id: match.id,
                team_id: scoringTeamId,
                player_id: cardedPlayer?.id,
                event_type: 'YELLOW_CARD',
                minute: currentMinute,
                description: `Yellow Card: ${cardedPlayer?.name || 'Defender'} is booked for a hard tactical challenge in mid-field.`
              };

              store.matchEvents.push(yellowEvent);
              db.query(
                'INSERT INTO match_events (id, match_id, team_id, player_id, event_type, minute, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [yellowEvent.id, yellowEvent.match_id, yellowEvent.team_id, yellowEvent.player_id || null, yellowEvent.event_type, yellowEvent.minute, yellowEvent.description]
              ).catch(err => console.error(err));

              await redis.delete(`matches:${match.id}`);

              broadcastEvent('live_stats', {
                match_id: match.id,
                event_type: 'YELLOW_CARD',
                minute: currentMinute,
                description: yellowEvent.description
              });

            } else if (eventRoll < 0.75) {
              // CORNER OR SHOT
              const cornerEvent: MatchEvent = {
                id: store.matchEvents.length + 1,
                match_id: match.id,
                team_id: scoringTeamId,
                event_type: 'CORNER',
                minute: currentMinute,
                description: `Corner Kick for ${scoringTeamName}. Sent into the box but scrambled away by defenders.`
              };

              store.matchEvents.push(cornerEvent);
              db.query(
                'INSERT INTO match_events (id, match_id, team_id, player_id, event_type, minute, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [cornerEvent.id, cornerEvent.match_id, cornerEvent.team_id, null, cornerEvent.event_type, cornerEvent.minute, cornerEvent.description]
              ).catch(err => console.error(err));

              await redis.delete(`matches:${match.id}`);

              broadcastEvent('live_stats', {
                match_id: match.id,
                event_type: 'CORNER',
                minute: currentMinute,
                description: cornerEvent.description
              });

            } else {
              // SUBSTITUTION
              const subEvent: MatchEvent = {
                id: store.matchEvents.length + 1,
                match_id: match.id,
                team_id: scoringTeamId,
                event_type: 'SUBSTITUTION',
                minute: currentMinute,
                description: `Tactical Substitution for ${scoringTeamName}. Replacing fatigued players to support tempo.`
              };

              store.matchEvents.push(subEvent);
              db.query(
                'INSERT INTO match_events (id, match_id, team_id, player_id, event_type, minute, description) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                [subEvent.id, subEvent.match_id, subEvent.team_id, null, subEvent.event_type, subEvent.minute, subEvent.description]
              ).catch(err => console.error(err));

              await redis.delete(`matches:${match.id}`);

              broadcastEvent('live_stats', {
                match_id: match.id,
                event_type: 'SUBSTITUTION',
                minute: currentMinute,
                description: subEvent.description
              });
            }
          }
        }
      } catch (err) {
        console.error('[Simulator Engine Fail]', err);
      }
    }, 12000); // Progress matches cleanly
  }

  public static stopSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private static updateStandingsOnMatchEnd(match: Match) {
    const isHomeWin = match.home_score > match.away_score;
    const isAwayWin = match.away_score > match.home_score;
    const isDraw = match.home_score === match.away_score;

    const lid = match.league_id;

    // Update home standing record
    const homeSt = store.standings.find(s => s.league_id === lid && s.team_id === match.home_team_id);
    if (homeSt) {
      homeSt.played += 1;
      homeSt.goals_for += match.home_score;
      homeSt.goals_against += match.away_score;
      if (isHomeWin) {
        homeSt.win += 1;
        homeSt.points += 3;
      } else if (isDraw) {
        homeSt.draw += 1;
        homeSt.points += 1;
      } else {
        homeSt.loss += 1;
      }

      db.query(
        'UPDATE standings SET played = $1, win = $2, draw = $3, loss = $4, goals_for = $5, goals_against = $6, points = $7 WHERE league_id = $8 AND team_id = $9',
        [homeSt.played, homeSt.win, homeSt.draw, homeSt.loss, homeSt.goals_for, homeSt.goals_against, homeSt.points, lid, match.home_team_id]
      ).catch(err => console.error('[Supabase Standings Error]', err));
    }

    // Update away standing record
    const awaySt = store.standings.find(s => s.league_id === lid && s.team_id === match.away_team_id);
    if (awaySt) {
      awaySt.played += 1;
      awaySt.goals_for += match.away_score;
      awaySt.goals_against += match.home_score;
      if (isAwayWin) {
        awaySt.win += 1;
        awaySt.points += 3;
      } else if (isDraw) {
        awaySt.draw += 1;
        awaySt.points += 1;
      } else {
        awaySt.loss += 1;
      }

      db.query(
        'UPDATE standings SET played = $1, win = $2, draw = $3, loss = $4, goals_for = $5, goals_against = $6, points = $7 WHERE league_id = $8 AND team_id = $9',
        [awaySt.played, awaySt.win, awaySt.draw, awaySt.loss, awaySt.goals_for, awaySt.goals_against, awaySt.points, lid, match.away_team_id]
      ).catch(err => console.error('[Supabase Standings Error]', err));
    }
  }
}
export default MatchService;
