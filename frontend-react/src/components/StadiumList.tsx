import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { stadiumService } from '../services/api';
import StadiumItem from './StadiumItem';
import type { Stadium } from '../types';

const StadiumList: React.FC = () => {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStadiums();
  }, []);

  const loadStadiums = async () => {
    try {
      const response = await stadiumService.getAll();
      setStadiums(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load stadiums';
      setError(errorMsg);
      console.error('Error loading stadiums:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStadiums();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Stadiums</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {stadiums.length === 0 ? (
        <Typography color="text.secondary">No stadiums found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {stadiums.map((stadium) => (
            <StadiumItem key={stadium.id} stadium={stadium} onRefresh={handleRefresh} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default StadiumList;

