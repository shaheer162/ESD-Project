import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import { stadiumService } from '../services/api';
import type { Stadium } from '../types';

interface StadiumItemProps {
  stadium: Stadium;
  onRefresh: () => void;
}

const StadiumItem: React.FC<StadiumItemProps> = ({ stadium, onRefresh }) => {
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    if (!stadium.id || !window.confirm('Are you sure you want to delete this stadium?')) return;
    try {
      await stadiumService.delete(stadium.id);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete stadium');
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{stadium.name || 'Unnamed Stadium'}</Typography>
            {stadium.city && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {stadium.city.name}
              </Typography>
            )}
          </Box>
          {isAdmin && (
            <Box>
              <IconButton color="primary" title="Edit Stadium">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="error" title="Delete Stadium">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StadiumItem;

