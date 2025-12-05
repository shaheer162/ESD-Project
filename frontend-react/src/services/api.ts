import axios from 'axios';
import type {
  Event,
  Team,
  TeamRegisterRequest,
  TeamLoginRequest,
  City,
  Stadium,
  Division,
  Player,
  PlayerHistory,
  MatchPlayerStats,
  LeagueStandings,
  TopScorer,
  TopAssists,
  TeamPerformance,
  StadiumStats,
  TeamMatchHistory,
  TeamDashboard,
  User,
  LoginRequest,
  RegisterRequest,
} from '../types';

// Use relative URL when proxy is configured, otherwise use full URL
const API_URL = import.meta.env.DEV ? '/api/v1' : 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session-based auth
  timeout: 30000, // 30 second timeout to prevent hanging
});

// Helper function to get admin username from localStorage
const getAdminUsername = (): string | null => {
  try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'ADMIN' && user.username) {
        return user.username;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return null;
};

// Events
export const eventService = {
  getAll: () => api.get<Event[]>(`/match`),
  getById: (uuid: string) => api.get<Event>(`/match/${uuid}`),
  create: (event: any) => {
    const adminUsername = getAdminUsername();
    return api.post<Event>(`/match`, event, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  update: (uuid: string, event: any) => {
    const adminUsername = getAdminUsername();
    return api.put<Event>(`/match/${uuid}`, event, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  delete: (uuid: string) => {
    const adminUsername = getAdminUsername();
    return api.delete<Event>(`/match/${uuid}`, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  getMatchStats: (matchUuid: string) => api.get<MatchPlayerStats[]>(`/match/${matchUuid}/stats`),
  getPlayerStatsForMatch: (matchUuid: string, playerId: number) =>
    api.get<MatchPlayerStats>(`/match/${matchUuid}/player/${playerId}/stats`),
  addPlayerStats: (matchUuid: string, playerId: number, stats: MatchPlayerStats) => {
    const adminUsername = getAdminUsername();
    return api.post<MatchPlayerStats>(`/match/${matchUuid}/player/${playerId}/stats`, stats, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  updatePlayerStats: (matchUuid: string, playerId: number, stats: MatchPlayerStats) => {
    const adminUsername = getAdminUsername();
    return api.put<MatchPlayerStats>(`/match/${matchUuid}/player/${playerId}/stats`, stats, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  deletePlayerStats: (matchUuid: string, playerId: number) => {
    const adminUsername = getAdminUsername();
    return api.delete(`/match/${matchUuid}/player/${playerId}/stats`, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
};

// Teams
export const teamService = {
  getAll: () => {
    const adminUsername = getAdminUsername();
    return api.get<Team[]>(`/team`, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  getById: (id: number) => api.get<Team>(`/team/${id}`),
  create: (team: any) => api.post<Team>(`/team`, team),
  update: (id: number, team: any) => api.put<Team>(`/team/${id}`, team),
  delete: (id: number) => api.delete<Team>(`/team/${id}`),
  register: (teamData: TeamRegisterRequest) => api.post<Team>(`/team/register`, teamData),
  login: (credentials: TeamLoginRequest) => api.post<Team>(`/team/login`, credentials),
  getHistory: (teamId: number) => api.get<TeamMatchHistory[]>(`/team/${teamId}/history`),
  getDashboard: (teamId: number) => api.get<TeamDashboard>(`/team/${teamId}/dashboard`),
};

// Cities
export const cityService = {
  getAll: () => api.get<City[]>(`/city`),
  getById: (id: number) => api.get<City>(`/city/${id}`),
  create: (city: City) => api.post<City>(`/city`, city),
  update: (id: number, city: City) => api.put<City>(`/city/${id}`, city),
  delete: (id: number) => api.delete<City>(`/city/${id}`),
};

// Stadiums
export const stadiumService = {
  getAll: () => api.get<Stadium[]>(`/stadium`),
  getById: (id: number) => api.get<Stadium>(`/stadium/${id}`),
  create: (stadium: Stadium) => api.post<Stadium>(`/stadium`, stadium),
  update: (id: number, stadium: Stadium) => api.put<Stadium>(`/stadium/${id}`, stadium),
  delete: (id: number) => api.delete<Stadium>(`/stadium/${id}`),
};

// Divisions
export const divisionService = {
  getAll: () => api.get<Division[]>(`/division`),
  getById: (id: number) => api.get<Division>(`/division/${id}`),
  create: (division: Division) => api.post<Division>(`/division`, division),
  update: (id: number, division: Division) => api.put<Division>(`/division/${id}`, division),
  delete: (id: number) => api.delete<Division>(`/division/${id}`),
};

// Players
export const playerService = {
  getAllByTeam: (teamId: number) => api.get<Player[]>(`/team/${teamId}/players`),
  getById: (id: number) => api.get<Player>(`/player/${id}`),
  create: (player: Player) => {
    const adminUsername = getAdminUsername();
    return api.post<Player>(`/player`, player, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  update: (id: number, player: Player) => {
    const adminUsername = getAdminUsername();
    return api.put<Player>(`/player/${id}`, player, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  delete: (id: number) => {
    const adminUsername = getAdminUsername();
    return api.delete<Player>(`/player/${id}`, {
      headers: adminUsername ? { 'X-Admin-Username': adminUsername } : {}
    });
  },
  getHistory: (playerId: number) => api.get<PlayerHistory[]>(`/player/${playerId}/history`),
};

// Statistics
export const statisticsService = {
  getLeagueStandingsByDivision: (divisionId: number) =>
    api.get<LeagueStandings[]>(`/statistics/standings/division/${divisionId}`),
  getAllLeagueStandings: () => api.get<LeagueStandings[]>(`/statistics/standings/all`),
  getTopScorers: (limit: number = 10) => api.get<TopScorer[]>(`/statistics/top-scorers?limit=${limit}`),
  getTopAssists: (limit: number = 10) => api.get<TopAssists[]>(`/statistics/top-assists?limit=${limit}`),
  getTeamPerformance: (teamId: number) =>
    api.get<TeamPerformance[]>(`/statistics/team/${teamId}/performance`),
  getStadiumStatistics: () => api.get<StadiumStats[]>(`/statistics/stadiums`),
};

// Search
export const searchService = {
  searchTeams: (query?: string) => api.get<Team[]>(`/search/teams${query ? `?q=${query}` : ''}`),
  searchPlayers: (query?: string) => api.get<Player[]>(`/search/players${query ? `?q=${query}` : ''}`),
  filterPlayers: (filters: { teamId?: number; position?: string; minJersey?: number; maxJersey?: number }) =>
    api.get<Player[]>(`/search/players/filter`, { params: filters }),
  filterMatches: (filters: {
    divisionId?: number;
    stadiumId?: number;
    teamId?: number;
    startDate?: string;
    endDate?: string;
  }) => api.get<Event[]>(`/search/matches/filter`, { params: filters }),
};

// Admin
export const adminService = {
  register: (userData: RegisterRequest) => api.post<User>(`/admin/register`, userData),
  login: (credentials: LoginRequest) => api.post<User>(`/admin/login`, credentials),
  getAllAdmins: () => api.get<User[]>(`/admin/admins`),
};


export default api;

