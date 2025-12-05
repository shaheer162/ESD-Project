import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { playerService, teamService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Player, Team } from '../types';

interface ManagePlayersProps {
  open: boolean;
  onClose: () => void;
  teamId: number;
  onPlayersUpdated: () => void;
}

const ManagePlayers: React.FC<ManagePlayersProps> = ({ open, onClose, teamId, onPlayersUpdated }) => {
  const { isAdmin } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    jerseyNumber: '',
    teamId: teamId.toString(),
  });

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

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

  useEffect(() => {
    if (open && isAdmin) {
      loadPlayers();
      loadTeams();
    }
  }, [open, teamId, isAdmin]);

  const loadTeams = async () => {
    try {
      const response = await teamService.getAll();
      setTeams(response.data);
    } catch (err) {
      console.error('Error loading teams:', err);
    }
  };

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const response = await playerService.getAllByTeam(teamId);
      setPlayers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'jerseyNumber' || name === 'teamId' ? value : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      jerseyNumber: '',
      teamId: teamId.toString(),
    });
    setEditingPlayer(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.position || !formData.jerseyNumber) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const selectedTeam = teams.find(t => t.id?.toString() === formData.teamId);
    if (!selectedTeam || !selectedTeam.id) {
      setError('Invalid team selection');
      setLoading(false);
      return;
    }

    try {
      const playerData: Player = {
        name: formData.name,
        position: formData.position,
        jerseyNumber: parseInt(formData.jerseyNumber),
        team: { id: selectedTeam.id },
      };

      if (editingPlayer?.id) {
        await playerService.update(editingPlayer.id, playerData);
      } else {
        await playerService.create(playerData);
      }

      resetForm();
      loadPlayers();
      onPlayersUpdated();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save player';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      position: player.position,
      jerseyNumber: player.jerseyNumber.toString(),
      teamId: player.team?.id?.toString() || teamId.toString(),
    });
  };

  const handleDelete = async (playerId: number) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;

    setLoading(true);
    setError('');
    try {
      await playerService.delete(playerId);
      loadPlayers();
      onPlayersUpdated();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete player';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
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
        Manage Players
      </DialogTitle>
      <DialogContent sx={{ color: '#fff' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingPlayer ? 'Edit Player' : 'Add New Player'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Player Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={textFieldStyle}
                />
                <TextField
                  fullWidth
                  select
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  sx={textFieldStyle}
                  SelectProps={{
                    MenuProps: menuProps,
                  }}
                >
                  {positions.map((pos) => (
                    <MenuItem key={pos} value={pos}>
                      {pos}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Jersey Number"
                  name="jerseyNumber"
                  type="number"
                  value={formData.jerseyNumber}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1, max: 99 }}
                  sx={textFieldStyle}
                />
                <TextField
                  fullWidth
                  select
                  label="Team"
                  name="teamId"
                  value={formData.teamId}
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                    }}
                  >
                    {loading ? 'Saving...' : editingPlayer ? 'Update' : 'Add Player'}
                  </Button>
                  {editingPlayer && (
                    <Button variant="outlined" onClick={resetForm} fullWidth>
                      Cancel
                    </Button>
                  )}
                </Box>
              </form>
            </Paper>
          </Grid>

          {/* Players List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Players ({players.length})
            </Typography>
            <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Jersey #</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {players.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No players found. Add a player to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.position}</TableCell>
                        <TableCell>{player.jerseyNumber}</TableCell>
                        <TableCell>{player.team?.name || 'N/A'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(player)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => player.id && handleDelete(player.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagePlayers;

