import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../contexts/AuthContext';
import { teamService } from '../services/api';
import ManagePlayers from './ManagePlayers';
import type { TeamDashboard, TeamMatchHistory } from '../types';

const TeamDashboard: React.FC = () => {
  const { currentTeam, isAdmin } = useAuth();
  const [dashboard, setDashboard] = useState<TeamDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [managePlayersOpen, setManagePlayersOpen] = useState(false);

  useEffect(() => {
    if (currentTeam?.id) {
      loadDashboard();
    }
  }, [currentTeam]);

  const loadDashboard = async () => {
    if (!currentTeam?.id) return;
    setLoading(true);
    setError('');
    try {
      const response = await teamService.getDashboard(currentTeam.id);
      setDashboard(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load dashboard';
      setError(errorMsg);
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMatchResult = (match: TeamMatchHistory): string => {
    const teamGoals = match.isHomeMatch ? match.homeGoals : match.awayGoals;
    const opponentGoals = match.isHomeMatch ? match.awayGoals : match.homeGoals;
    if (teamGoals > opponentGoals) return 'W';
    if (teamGoals < opponentGoals) return 'L';
    return 'D';
  };

  const getScoreDisplay = (match: TeamMatchHistory): string => {
    if (match.isHomeMatch) {
      return `${match.homeGoals} - ${match.awayGoals}`;
    }
    return `${match.awayGoals} - ${match.homeGoals}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!dashboard) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Unable to load dashboard. Please try again later.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        ⚽ {dashboard.teamName} Dashboard
      </Typography>

      {/* Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h4">{dashboard.totalMatches}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                {dashboard.wins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(244, 67, 54, 0.2)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#F44336' }}>
                {dashboard.losses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Losses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(255, 235, 59, 0.2)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#FFEB3B' }}>
                {dashboard.draws}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Draws
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h4">{dashboard.points}</Typography>
              <Typography variant="body2" color="text.secondary">
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h4">{dashboard.goalsScored}</Typography>
              <Typography variant="body2" color="text.secondary">
                Goals Scored
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h4">{dashboard.goalsConceded}</Typography>
              <Typography variant="body2" color="text.secondary">
                Goals Conceded
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h4">{dashboard.totalPlayers}</Typography>
              <Typography variant="body2" color="text.secondary">
                Players
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Team Statistics Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Win Percentage:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboard.winPercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Avg Goals Scored:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboard.averageGoalsScored.toFixed(1)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Avg Goals Conceded:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboard.averageGoalsConceded.toFixed(1)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Current Streak:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dashboard.currentStreak}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Player Roster
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Total Players: <strong>{dashboard.totalPlayers}</strong>
              </Typography>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  fullWidth
                  onClick={() => setManagePlayersOpen(true)}
                  sx={{
                    background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                  }}
                >
                  Manage Players
                </Button>
              )}
            </CardContent>
          </Card>

        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Upcoming Matches" />
              <Tab label="Past Matches" />
            </Tabs>
            <CardContent>
              {tabValue === 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Opponent</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard.upcomingMatches && dashboard.upcomingMatches.length > 0 ? (
                        dashboard.upcomingMatches.map((match, index) => (
                          <TableRow key={index}>
                            <TableCell>{match.date}</TableCell>
                            <TableCell>{match.time}</TableCell>
                            <TableCell>
                              {match.opponentName}
                            </TableCell>
                            <TableCell>{match.stadium?.name || 'TBD'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No upcoming matches scheduled.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {tabValue === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Opponent</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Result</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard.pastMatches && dashboard.pastMatches.length > 0 ? (
                        dashboard.pastMatches.slice(0, 10).map((match, index) => {
                          const result = getMatchResult(match);
                          return (
                            <TableRow key={index}>
                              <TableCell>{match.date}</TableCell>
                              <TableCell>{match.time}</TableCell>
                              <TableCell>
                                {match.opponentName}
                              </TableCell>
                              <TableCell>{match.stadium?.name || 'N/A'}</TableCell>
                              <TableCell
                                sx={{
                                  color:
                                    result === 'W'
                                      ? '#4CAF50'
                                      : result === 'L'
                                      ? '#F44336'
                                      : '#FFEB3B',
                                  fontWeight: 'bold',
                                }}
                              >
                                {getScoreDisplay(match)} ({result})
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No past matches yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Manage Players Dialog - Admin Only */}
      {isAdmin && currentTeam?.id && (
        <ManagePlayers
          open={managePlayersOpen}
          onClose={() => setManagePlayersOpen(false)}
          teamId={currentTeam.id}
          onPlayersUpdated={() => {
            loadDashboard();
          }}
        />
      )}
    </Box>
  );
};

export default TeamDashboard;

