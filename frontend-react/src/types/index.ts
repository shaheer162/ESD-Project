// User Types
export interface User {
  id?: number;
  username: string;
  email: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

// Team Types
export interface Team {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  homeMatches?: Event[];
  awayMatches?: Event[];
  division?: Division;
  city?: City;
  stadium?: Stadium;
}

export interface TeamRegisterRequest {
  name?: string;
  username: string;
  password: string;
  email: string;
  division?: Division;
  city?: City;
  stadium?: Stadium;
}

export interface TeamLoginRequest {
  username: string;
  password: string;
}

// Team Reference (simplified team info for matches)
export interface TeamReference {
  id?: number;
  name?: string;
}

// Event Types
export interface Event {
  uuid?: string;
  stadium?: Stadium;
  date: string;
  time: string;
  homeTeam: TeamReference;
  awayTeam: TeamReference;
  homeGoals: number;
  awayGoals: number;
  spectators: number;
  ticketPrice: number;
  revenue?: number;
}

// City Types
export interface City {
  id?: number;
  name: string;
}

// Stadium Types
export interface Stadium {
  id?: number;
  name: string;
  city?: City;
}

// Division Types
export interface Division {
  id?: number;
  name?: string;
}

// Player Types
export interface Player {
  id?: number;
  name: string;
  position: string;
  jerseyNumber: number;
  team: Team;
}

export interface PlayerHistory {
  matchUuid: string;
  date: string;
  time: string;
  opponentName: string;
  isHomeMatch: boolean;
  goals: number;
  assists: number;
  passes: number;
  saves: number;
}

export interface MatchPlayerStats {
  id?: number;
  matchUuid: string;
  player: Player;
  goals: number;
  assists: number;
  passes: number;
  saves: number;
}

// Statistics Types
export interface LeagueStandings {
  teamId: number;
  teamName: string;
  divisionName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorer {
  playerId: number;
  playerName: string;
  teamName: string;
  goals: number;
}

export interface TopAssists {
  playerId: number;
  playerName: string;
  teamName: string;
  assists: number;
}

export interface TeamPerformance {
  date: string;
  opponentName: string;
  isHomeMatch: boolean;
  teamGoals: number;
  opponentGoals: number;
  result: string;
}

export interface StadiumStats {
  stadiumId: number;
  stadiumName: string;
  totalMatchesHosted: number;
  totalSpectators: number;
  averageAttendance: number;
  occupancyRate: number;
}

// Team Dashboard Types
export interface TeamMatchHistory {
  date: string;
  time: string;
  opponentName: string;
  isHomeMatch: boolean;
  homeGoals: number;
  awayGoals: number;
  spectators: number;
  stadium?: Stadium;
}

export interface TeamDashboard {
  teamId: number;
  teamName: string;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  winPercentage: number;
  averageGoalsScored: number;
  averageGoalsConceded: number;
  currentStreak: string;
  totalPlayers: number;
  upcomingMatches: TeamMatchHistory[];
  pastMatches: TeamMatchHistory[];
  announcements: string[];
}

