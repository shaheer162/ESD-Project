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
import { teamService, cityService, stadiumService, divisionService } from '../services/api';
import type { Team, City, Stadium, Division } from '../types';

interface CreateTeamProps {
  open: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
}

const CreateTeam: React.FC<CreateTeamProps> = ({ open, onClose, onTeamCreated }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    divisionId: '',
    cityId: '',
    stadiumId: '',
  });

  useEffect(() => {
    if (open) {
      loadDropdownData();
    }
  }, [open]);

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.username || !formData.email) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const teamData: any = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.username.trim(), // Password equals username
      };

      if (formData.divisionId) {
        teamData.division = { id: parseInt(formData.divisionId) };
      }

      if (formData.cityId) {
        teamData.city = { id: parseInt(formData.cityId) };
      }

      if (formData.stadiumId) {
        teamData.stadium = { id: parseInt(formData.stadiumId) };
      }

      await teamService.register(teamData);

      setFormData({
        name: '',
        username: '',
        email: '',
        divisionId: '',
        cityId: '',
        stadiumId: '',
      });
      onClose();
      onTeamCreated();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create team';
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
        Create New Team
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
                fullWidth
                label="Team Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Division"
                name="divisionId"
                value={formData.divisionId}
                onChange={handleChange}
                sx={textFieldStyle}
                SelectProps={{
                  MenuProps: menuProps,
                }}
              >
                {divisions.map((division) => (
                  <MenuItem key={division.id} value={division.id?.toString()}>
                    {division.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="City"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                sx={textFieldStyle}
                SelectProps={{
                  MenuProps: menuProps,
                }}
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id?.toString()}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Stadium"
                name="stadiumId"
                value={formData.stadiumId}
                onChange={handleChange}
                sx={textFieldStyle}
                SelectProps={{
                  MenuProps: menuProps,
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
            {loading ? 'Creating...' : 'Create Team'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTeam;
