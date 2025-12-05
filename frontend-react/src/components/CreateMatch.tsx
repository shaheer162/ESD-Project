import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { eventService, teamService } from '../services/api';
import type { Team } from '../types';

interface CreateMatchProps {
  onMatchCreated: () => void;
}

const CreateMatch: React.FC<CreateMatchProps> = ({ onMatchCreated }) => {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get today's date in YYYY-MM-DD format for minimum date
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '',
    homeGoals: 0,
    awayGoals: 0,
  });

  useEffect(() => {
    loadTeams();
  }, []);

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

    // Validate that the date is in the future (upcoming match only)
    const selectedDate = new Date(formData.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    
    if (selectedDate <= todayDate) {
      setError('Match date must be in the future. Only upcoming matches can be created.');
      setLoading(false);
      return;
    }

    // Ensure scores are 0-0 for upcoming matches
    if (formData.homeGoals !== 0 || formData.awayGoals !== 0) {
      setError('Upcoming matches must have 0-0 scores. Scores will be updated after the match is played.');
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

      // Always create with 0-0 scores for upcoming matches
      await eventService.create({
        homeTeam: { id: homeTeam.id },
        awayTeam: { id: awayTeam.id },
        date: formData.date,
        time: formData.time,
        homeGoals: 0, // Always 0 for upcoming matches
        awayGoals: 0, // Always 0 for upcoming matches
        spectators: 0,
        ticketPrice: 0,
      });

      setOpen(false);
      setFormData({
        homeTeamId: '',
        awayTeamId: '',
        date: '',
        time: '',
        homeGoals: 0,
        awayGoals: 0,
      });
      onMatchCreated();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create match';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
          mb: 2,
        }}
      >
        Create Match
      </Button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
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
          Create Upcoming Match
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
                  SelectProps={{
                    MenuProps: {
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
                    },
                  }}
                  sx={{ 
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
                  SelectProps={{
                    MenuProps: {
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
                    },
                  }}
                  sx={{ 
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
                  label="Date (Future Date Only)"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  inputProps={{
                    min: today,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="Only future dates are allowed for upcoming matches"
                  sx={{ 
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
                    '& .MuiFormHelperText-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                    },
                  }}
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
                  sx={{ 
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
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Button 
              onClick={() => setOpen(false)}
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
              {loading ? 'Creating...' : 'Create Match'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default CreateMatch;

