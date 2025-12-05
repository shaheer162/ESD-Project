import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from '../contexts/AuthContext';
import { teamService } from '../services/api';
import EditTeam from './EditTeam';
import type { Team } from '../types';

interface TeamItemProps {
  team: Team;
  onRefresh: () => void;
}

const TeamItem: React.FC<TeamItemProps> = ({ team, onRefresh }) => {
  const { isAdmin } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!team.id || !window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await teamService.delete(team.id);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete team');
    }
  };

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{team.name || 'Unnamed Team'}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {team.division && (
                <Chip label={team.division.name} size="small" variant="outlined" />
              )}
              {team.city && (
                <Chip label={team.city.name} size="small" variant="outlined" />
              )}
              {team.stadium && (
                <Chip label={team.stadium.name} size="small" variant="outlined" />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {team.username && `Username: ${team.username}`}
            </Typography>
          </Box>
          <Box>
            <IconButton color="primary" title="View Players">
              <PeopleIcon />
            </IconButton>
            <IconButton color="primary" title="View History">
              <HistoryIcon />
            </IconButton>
            {isAdmin && (
              <>
                <IconButton onClick={() => setEditDialogOpen(true)} color="primary" title="Edit Team" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete} color="error" title="Delete Team">
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
      {isAdmin && (
        <EditTeam
          open={editDialogOpen}
          team={team}
          onClose={() => setEditDialogOpen(false)}
          onTeamUpdated={onRefresh}
        />
      )}
    </Card>
  );
};

export default TeamItem;

