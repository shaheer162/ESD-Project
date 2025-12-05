import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import { cityService } from '../services/api';
import type { City } from '../types';

interface CityItemProps {
  city: City;
  onRefresh: () => void;
}

const CityItem: React.FC<CityItemProps> = ({ city, onRefresh }) => {
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    if (!city.id || !window.confirm('Are you sure you want to delete this city?')) return;
    try {
      await cityService.delete(city.id);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete city');
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{city.name || 'Unnamed City'}</Typography>
          </Box>
          {isAdmin && (
            <Box>
              <IconButton color="primary" title="Edit City">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="error" title="Delete City">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CityItem;

