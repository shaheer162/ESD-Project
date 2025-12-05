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
import type { TopAssists } from '../types';

const TopAssists: React.FC = () => {
  const { currentTeam, isAdmin } = useAuth();
  const [assists, setAssists] = useState<TopAssists[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopAssists();
  }, [currentTeam]);

  const loadTopAssists = async () => {
    setLoading(true);
    try {
      const response = await statisticsService.getTopAssists(100); // Get more to filter
      let filteredAssists = response.data;
      
      // If a team is logged in, filter to show only their players
      if (currentTeam?.id && !isAdmin) {
        filteredAssists = response.data.filter(
          (assist) => assist.teamId === currentTeam.id
        );
      }
      
      // Limit to top 10 after filtering
      setAssists(filteredAssists.slice(0, 10));
    } catch (err) {
      console.error('Error loading top assists:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {currentTeam && !isAdmin ? 'Team Top Assists' : 'Top Assists'}
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
                  <TableCell align="right">Assists</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  assists.map((assist, index) => (
                    <TableRow key={assist.playerId}>
                      <TableCell>
                        <Typography variant="h6" component="span">
                          #{index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>{assist.playerName}</TableCell>
                      <TableCell>{assist.teamName}</TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" component="span" color="primary">
                          {assist.assists}
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

export default TopAssists;

