import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { divisionService, teamService } from '../services/api';
import DivisionItem from './DivisionItem';
import type { Division, Team } from '../types';

const DivisionList: React.FC = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDivisions();
    loadTeams();
  }, []);

  const loadDivisions = async () => {
    try {
      const response = await divisionService.getAll();
      setDivisions(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load divisions';
      setError(errorMsg);
      console.error('Error loading divisions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      const response = await teamService.getAll();
      setTeams(response.data);
    } catch (err) {
      console.error('Error loading teams:', err);
    }
  };

  const handleRefresh = () => {
    loadDivisions();
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
      <Typography variant="h6" sx={{ mb: 2 }}>Divisions</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {divisions.length === 0 ? (
        <Typography color="text.secondary">No divisions found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {divisions.map((division) => {
            const divisionTeams = teams.filter(t => t.division?.id === division.id);
            return (
              <DivisionItem
                key={division.id}
                division={division}
                teams={divisionTeams}
                onRefresh={handleRefresh}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default DivisionList;

