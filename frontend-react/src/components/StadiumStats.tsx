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
import type { StadiumStats as StadiumStatsType } from '../types';

const StadiumStats: React.FC = () => {
  const [stats, setStats] = useState<StadiumStatsType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStadiumStats();
  }, []);

  const loadStadiumStats = async () => {
    setLoading(true);
    try {
      const response = await statisticsService.getStadiumStatistics();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stadium statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Stadium Statistics
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
                  <TableCell>Stadium</TableCell>
                  <TableCell align="right">Matches Hosted</TableCell>
                  <TableCell align="right">Total Spectators</TableCell>
                  <TableCell align="right">Average Attendance</TableCell>
                  <TableCell align="right">Occupancy Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No stadium statistics available.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.map((stadium) => (
                    <TableRow key={stadium.stadiumId}>
                      <TableCell>{stadium.stadiumName}</TableCell>
                      <TableCell align="right">{stadium.totalMatchesHosted}</TableCell>
                      <TableCell align="right">{stadium.totalSpectators.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        {stadium.averageAttendance.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {(stadium.occupancyRate * 100).toFixed(1)}%
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

export default StadiumStats;

