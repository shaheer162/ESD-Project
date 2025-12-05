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
} from '@mui/material';
import { statisticsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { TopScorer } from '../types';

const TopScorers: React.FC = () => {
  const { currentTeam, isAdmin } = useAuth();
  const [scorers, setScorers] = useState<TopScorer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopScorers();
  }, [currentTeam]);

  const loadTopScorers = async () => {
    setLoading(true);
    try {
      const response = await statisticsService.getTopScorers(100); // Get more to filter
      let filteredScorers = response.data;
      
      // If a team is logged in, filter to show only their players
      if (currentTeam?.id && !isAdmin) {
        filteredScorers = response.data.filter(
          (scorer) => scorer.teamId === currentTeam.id
        );
      }
      
      // Limit to top 10 after filtering
      setScorers(filteredScorers.slice(0, 10));
    } catch (err) {
      console.error('Error loading top scorers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {currentTeam && !isAdmin ? 'Team Top Scorers' : 'Top Scorers'}
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent', maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell align="right">Goals</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scorers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  scorers.map((scorer, index) => (
                    <TableRow key={scorer.playerId}>
                      <TableCell>
                        <Typography variant="h6" component="span">
                          #{index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>{scorer.playerName}</TableCell>
                      <TableCell>{scorer.teamName}</TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" component="span" color="primary">
                          {scorer.goals}
                        </Typography>
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

export default TopScorers;

