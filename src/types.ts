export interface Team {
  id: number;
  name: string;
  logo: string;
  country: string;
  founded: number;
  venue: string;
  created_at?: string;
}

export interface Player {
  id: number;
  team_id: number;
  name: string;
  age: number;
  nationality: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  photo: string;
  created_at?: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
  season: string;
}

export interface Match {
  id: number;
  league_id: string;
  home_team_id: number;
  away_team_id: number;
  match_date: string; // ISO string
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  home_score: number;
  away_score: number;
  created_at?: string;
  // Join helper properties (optional)
  home_team?: Team;
  away_team?: Team;
  events?: MatchEvent[];
}

export interface MatchEvent {
  id: number;
  match_id: number;
  team_id: number;
  player_id?: number;
  event_type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'MATCH_START' | 'MATCH_END' | 'CORNER' | 'SHOT';
  minute: number;
  description: string;
  created_at?: string;
  // Join helpers
  player_name?: string;
  team_name?: string;
}

export interface Standing {
  id: number;
  league_id: string;
  team_id: number;
  played: number;
  win: number;
  draw: number;
  loss: number;
  goals_for: number;
  goals_against: number;
  points: number;
  team?: Team;
}

export interface Favorite {
  id: number;
  user_id: string;
  team_id: number;
  team?: Team;
}
