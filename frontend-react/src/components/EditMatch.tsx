import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { eventService, teamService } from '../services/api';
import type { Event, Team } from '../types';

interface EditMatchProps {
  open: boolean;
  match: Event | null;
  onClose: () => void;
  onMatchUpdated: () => void;
}

const EditMatch: React.FC<EditMatchProps> = ({ open, match, onClose, onMatchUpdated }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '',
    homeGoals: 0,
    awayGoals: 0,
  });

  useEffect(() => {
    if (open) {
      loadTeams();
      if (match) {
        // Format date for input (YYYY-MM-DD)
        const matchDate = new Date(match.date);
        const formattedDate = matchDate.toISOString().split('T')[0];
        
        // Format time for input (HH:MM)
        const timeParts = match.time.split(':');
        const formattedTime = `${timeParts[0]}:${timeParts[1]}`;

        setFormData({
          homeTeamId: match.homeTeam?.id?.toString() || '',
          awayTeamId: match.awayTeam?.id?.toString() || '',
          date: formattedDate,
          time: formattedTime,
          homeGoals: match.homeGoals || 0,
          awayGoals: match.awayGoals || 0,
        });
      }
    }
  }, [open, match]);

  const loadTeams = async () => {
    try {
      const response = await teamService.getAll();
      setTeams(response.data);
    } catch (err) {
      console.error('Error loading teams:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'homeTeamId' || name === 'awayTeamId' ? value : 
              name === 'homeGoals' || name === 'awayGoals' 
                ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match?.uuid) return;

    setError('');
    setLoading(true);

    if (!formData.homeTeamId || !formData.awayTeamId) {
      setError('Please select both home and away teams');
      setLoading(false);
      return;
    }

    if (formData.homeTeamId === formData.awayTeamId) {
      setError('Home team and away team must be different');
      setLoading(false);
      return;
    }

    if (!formData.date || !formData.time) {
      setError('Please provide both date and time');
      setLoading(false);
      return;
    }

    try {
      const homeTeam = teams.find(t => t.id?.toString() === formData.homeTeamId);
      const awayTeam = teams.find(t => t.id?.toString() === formData.awayTeamId);

      if (!homeTeam || !awayTeam || !homeTeam.id || !awayTeam.id) {
        setError('Invalid team selection');
        setLoading(false);
        return;
      }

      await eventService.update(match.uuid, {
        homeTeam: { id: homeTeam.id },
        awayTeam: { id: awayTeam.id },
        date: formData.date,
        time: formData.time,
        homeGoals: formData.homeGoals,
        awayGoals: formData.awayGoals,
        spectators: match.spectators || 0,
        ticketPrice: match.ticketPrice || 0,
      });

      onClose();
      onMatchUpdated();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update match';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    mb: 2,
    '& .MuiInputBase-root': {
      color: '#fff',
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(179, 0, 202, 0.938)',
    },
    '& .MuiSelect-icon': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: 'rgba(30, 30, 30, 0.98)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        '& .MuiMenuItem-root': {
          color: '#fff',
          '&:hover': {
            bgcolor: 'rgba(179, 0, 202, 0.2)',
          },
          '&.Mui-selected': {
            bgcolor: 'rgba(179, 0, 202, 0.3)',
            '&:hover': {
              bgcolor: 'rgba(179, 0, 202, 0.4)',
            },
          },
        },
      },
    },
  };

  if (!match) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          backdropFilter: 'blur(5px)',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
        },
        '& .MuiDialog-paper': {
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        Edit Match
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ color: '#fff' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Home Team"
                name="homeTeamId"
                value={formData.homeTeamId}
                onChange={handleChange}
                required
                sx={textFieldStyle}
                SelectProps={{
                  MenuProps: menuProps,
                }}
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id?.toString()}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Away Team"
                name="awayTeamId"
                value={formData.awayTeamId}
                onChange={handleChange}
                required
                sx={textFieldStyle}
                SelectProps={{
                  MenuProps: menuProps,
                }}
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id?.toString()}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Home Goals"
                name="homeGoals"
                type="number"
                value={formData.homeGoals}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Away Goals"
                name="awayGoals"
                type="number"
                value={formData.awayGoals}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button
            onClick={onClose}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
              '&:hover': {
                background: 'linear-gradient(90deg, rgb(118, 0, 137), rgba(199, 0, 222, 0.938))',
              },
            }}
          >
            {loading ? 'Updating...' : 'Update Match'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditMatch;
