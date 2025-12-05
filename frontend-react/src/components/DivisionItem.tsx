import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import { divisionService } from '../services/api';
import type { Division, Team } from '../types';

interface DivisionItemProps {
  division: Division;
  teams: Team[];
  onRefresh: () => void;
}

const DivisionItem: React.FC<DivisionItemProps> = ({ division, teams, onRefresh }) => {
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    if (!division.id || !window.confirm('Are you sure you want to delete this division?')) return;
    try {
      await divisionService.delete(division.id);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete division');
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{division.name || 'Unnamed Division'}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`${teams.length} Teams`} size="small" variant="outlined" />
            </Box>
          </Box>
          {isAdmin && (
            <Box>
              <IconButton color="primary" title="Edit Division">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="error" title="Delete Division">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DivisionItem;

