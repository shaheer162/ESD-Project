import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { statisticsService } from '../services/api';
import type { LeagueStandings } from '../types';

interface LeagueStandingsProps {
  teamDivisionId?: number;
}

const LeagueStandings: React.FC<LeagueStandingsProps> = ({ teamDivisionId }) => {
  const [standings, setStandings] = useState<LeagueStandings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (teamDivisionId) {
      loadStandings(teamDivisionId);
    } else {
      loadAllStandings();
    }
  }, [teamDivisionId]);

  const loadStandings = async (divisionId: number) => {
    setLoading(true);
    try {
      const response = await statisticsService.getLeagueStandingsByDivision(divisionId);
      setStandings(response.data);
    } catch (err) {
      console.error('Error loading standings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStandings = async () => {
    setLoading(true);
    try {
      const response = await statisticsService.getAllLeagueStandings();
      setStandings(response.data);
    } catch (err) {
      console.error('Error loading all standings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          League Standings
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pos</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>P</TableCell>
                  <TableCell>W</TableCell>
                  <TableCell>D</TableCell>
                  <TableCell>L</TableCell>
                  <TableCell>GF</TableCell>
                  <TableCell>GA</TableCell>
                  <TableCell>GD</TableCell>
                  <TableCell>Pts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No standings data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  standings.map((standing, index) => (
                    <TableRow key={standing.teamId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{standing.teamName}</TableCell>
                      <TableCell>{standing.played}</TableCell>
                      <TableCell>{standing.wins}</TableCell>
                      <TableCell>{standing.draws}</TableCell>
                      <TableCell>{standing.losses}</TableCell>
                      <TableCell>{standing.goalsFor}</TableCell>
                      <TableCell>{standing.goalsAgainst}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            standing.goalDifference > 0
                              ? '#4CAF50'
                              : standing.goalDifference < 0
                              ? '#F44336'
                              : 'inherit',
                        }}
                      >
                        {standing.goalDifference > 0 ? '+' : ''}
                        {standing.goalDifference}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{standing.points}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default LeagueStandings;

