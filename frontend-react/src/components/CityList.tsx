import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { cityService } from '../services/api';
import CityItem from './CityItem';
import type { City } from '../types';

const CityList: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response = await cityService.getAll();
      setCities(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load cities';
      setError(errorMsg);
      console.error('Error loading cities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadCities();
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
      <Typography variant="h6" sx={{ mb: 2 }}>Cities</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {cities.length === 0 ? (
        <Typography color="text.secondary">No cities found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cities.map((city) => (
            <CityItem key={city.id} city={city} onRefresh={handleRefresh} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CityList;

