import React, { useEffect, useState } from 'react';
import {
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
  Box,
  Chip,
} from '@mui/material';
import { statisticsService } from '../services/api';
import type { TeamPerformance as TeamPerformanceType, Team } from '../types';

interface TeamPerformanceProps {
  teamId?: number;
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ teamId }) => {
  const [performance, setPerformance] = useState<TeamPerformanceType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamId) {
      loadTeamPerformance(teamId);
    }
  }, [teamId]);

  const loadTeamPerformance = async (id: number) => {
    setLoading(true);
    try {
      const response = await statisticsService.getTeamPerformance(id);
      setPerformance(response.data);
    } catch (err) {
      console.error('Error loading team performance:', err);
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'win':
        return 'success';
      case 'loss':
        return 'error';
      case 'draw':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Team Performance
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
                  <TableCell>Date</TableCell>
                  <TableCell>Opponent</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No performance data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  performance.map((match, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                      <TableCell>{match.opponentName}</TableCell>
                      <TableCell>
                        {match.isHomeMatch ? 'Home' : 'Away'}
                      </TableCell>
                      <TableCell align="right">
                        {match.teamGoals} - {match.opponentGoals}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={match.result}
                          color={getResultColor(match.result) as any}
                          size="small"
                        />
                      </TableCell>
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

export default TeamPerformance;

