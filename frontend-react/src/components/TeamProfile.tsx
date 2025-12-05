import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { teamService, cityService, stadiumService, divisionService } from '../services/api';
import type { Team, City, Stadium, Division } from '../types';

const TeamProfile: React.FC = () => {
  const { currentTeam } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    division: '',
    city: '',
    stadium: '',
  });

  useEffect(() => {
    if (currentTeam) {
      loadTeamData();
      loadDropdownData();
    }
  }, [currentTeam]);

  const loadTeamData = async () => {
    if (!currentTeam?.id) return;
    setLoading(true);
    try {
      const response = await teamService.getById(currentTeam.id);
      const teamData = response.data;
      setTeam(teamData);
      setIsEditing(!teamData.name || !teamData.division || !teamData.city || !teamData.stadium);
      setFormData({
        name: teamData.name || '',
        division: teamData.division?.id?.toString() || '',
        city: teamData.city?.id?.toString() || '',
        stadium: teamData.stadium?.id?.toString() || '',
      });
    } catch (err: any) {
      console.error('Error loading team data:', err);
      setError(err.response?.data?.message || 'Failed to load team profile');
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [citiesRes, stadiumsRes, divisionsRes] = await Promise.all([
        cityService.getAll(),
        stadiumService.getAll(),
        divisionService.getAll(),
      ]);
      setCities(citiesRes.data);
      setStadiums(stadiumsRes.data);
      setDivisions(divisionsRes.data);
    } catch (err) {
      console.error('Error loading dropdown data:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team?.id) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selectedDivision = divisions.find((d) => d.id?.toString() === formData.division);
      const selectedCity = cities.find((c) => c.id?.toString() === formData.city);
      const selectedStadium = stadiums.find((s) => s.id?.toString() === formData.stadium);

      const teamData: Team = {
        ...team,
        name: formData.name,
        division: selectedDivision,
        city: selectedCity,
        stadium: selectedStadium,
      };

      const response = await teamService.update(team.id, teamData);
      setTeam(response.data);
      setIsEditing(false);
      setSuccess('Team information updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update team information.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !team) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Loading team profile...</Alert>
      </Box>
    );
  }

  if (!team && !loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">Unable to load team profile. Please try again later.</Alert>
      </Box>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', maxWidth: 900, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            ⚽ Team Profile
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Team Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                >
                  {divisions.map((div) => (
                    <MenuItem key={div.id} value={div.id?.toString()}>
                      {div.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          bgcolor: 'rgba(30, 30, 30, 0.98)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                          zIndex: 1300,
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
                >
                  {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id?.toString()}>
                      {city.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Stadium"
                  name="stadium"
                  value={formData.stadium}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          bgcolor: 'rgba(30, 30, 30, 0.98)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                          zIndex: 1300,
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
                >
                  {stadiums.map((stadium) => (
                    <MenuItem key={stadium.id} value={stadium.id?.toString()}>
                      {stadium.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      loadTeamData();
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamProfile;

