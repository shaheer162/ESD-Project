import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { teamService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TeamItem from './TeamItem';
import CreateTeam from './CreateTeam';
import type { Team } from '../types';

const TeamList: React.FC = () => {
  const { isAdmin } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createTeamOpen, setCreateTeamOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadTeams();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadTeams = async () => {
    if (!isAdmin) {
      setError('Access denied. Administrator privileges required.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await teamService.getAll();
      setTeams(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load teams';
      setError(errorMsg);
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTeams();
  };

  if (!isAdmin) {
    return (
      <Box>
        <Alert severity="info">
          Only administrators can view all teams. Teams can view their own profile in the dashboard.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Teams</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateTeamOpen(true)}
            sx={{
              background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
            }}
          >
            Add Team
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {teams.length === 0 ? (
        <Typography color="text.secondary">No teams found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {teams.map((team) => (
            <TeamItem key={team.id} team={team} onRefresh={handleRefresh} />
          ))}
        </Box>
      )}
      {isAdmin && (
        <CreateTeam
          open={createTeamOpen}
          onClose={() => setCreateTeamOpen(false)}
          onTeamCreated={handleRefresh}
        />
      )}
    </Box>
  );
};

export default TeamList;

