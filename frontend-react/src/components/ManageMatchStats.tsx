import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { eventService, playerService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Event, Player, MatchPlayerStats } from '../types';

interface ManageMatchStatsProps {
  open: boolean;
  match: Event | null;
  onClose: () => void;
  onStatsUpdated: () => void;
}

const ManageMatchStats: React.FC<ManageMatchStatsProps> = ({ open, match, onClose, onStatsUpdated }) => {
  const { isAdmin } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchStats, setMatchStats] = useState<MatchPlayerStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingStats, setEditingStats] = useState<{ playerId: number; stats: MatchPlayerStats } | null>(null);
  const [formData, setFormData] = useState({
    goals: 0,
    assists: 0,
    passes: 0,
    saves: 0,
  });

  useEffect(() => {
    if (open && match?.uuid && isAdmin) {
      loadPlayers();
      loadMatchStats();
    }
  }, [open, match, isAdmin]);

  const loadPlayers = async () => {
    if (!match) return;
    
    try {
      const homeTeamId = match.homeTeam?.id;
      const awayTeamId = match.awayTeam?.id;
      
      const allPlayers: Player[] = [];
      
      if (homeTeamId) {
        const homePlayers = await playerService.getAllByTeam(homeTeamId);
        allPlayers.push(...homePlayers.data);
      }
      
      if (awayTeamId) {
        const awayPlayers = await playerService.getAllByTeam(awayTeamId);
        allPlayers.push(...awayPlayers.data);
      }
      
      setPlayers(allPlayers);
    } catch (err) {
      console.error('Error loading players:', err);
    }
  };

  const loadMatchStats = async () => {
    if (!match?.uuid) return;
    
    setLoading(true);
    try {
      const response = await eventService.getMatchStats(match.uuid);
      setMatchStats(response.data);
    } catch (err) {
      console.error('Error loading match stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player: Player) => {
    const existingStats = matchStats.find(s => s.playerId === player.id);
    if (existingStats) {
      setEditingStats({ playerId: player.id!, stats: existingStats });
      setFormData({
        goals: existingStats.goals || 0,
        assists: existingStats.assists || 0,
        passes: existingStats.passes || 0,
        saves: existingStats.saves || 0,
      });
    } else {
      setEditingStats({ playerId: player.id!, stats: {} as MatchPlayerStats });
      setFormData({
        goals: 0,
        assists: 0,
        passes: 0,
        saves: 0,
      });
    }
  };

  const handleSave = async () => {
    if (!match?.uuid || !editingStats) return;
    
    setError('');
    setLoading(true);
    
    try {
      if (matchStats.find(s => s.playerId === editingStats.playerId)) {
        // Update existing stats
        await eventService.updatePlayerStats(match.uuid, editingStats.playerId, {
          goals: formData.goals,
          assists: formData.assists,
          passes: formData.passes,
          saves: formData.saves,
        } as MatchPlayerStats);
      } else {
        // Add new stats
        await eventService.addPlayerStats(match.uuid, editingStats.playerId, {
          goals: formData.goals,
          assists: formData.assists,
          passes: formData.passes,
          saves: formData.saves,
        } as MatchPlayerStats);
      }
      
      setEditingStats(null);
      loadMatchStats();
      onStatsUpdated();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save statistics';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (playerId: number) => {
    if (!match?.uuid) return;
    
    const player = players.find(p => p.id === playerId);
    if (!player || !window.confirm(`Are you sure you want to delete statistics for ${player.name}?`)) {
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await eventService.deletePlayerStats(match.uuid, playerId);
      loadMatchStats();
      onStatsUpdated();
      if (editingStats && editingStats.playerId === playerId) {
        setEditingStats(null);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete statistics';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'goalkeeper':
        return '#FF5722';
      case 'defender':
        return '#2196F3';
      case 'midfielder':
        return '#4CAF50';
      case 'forward':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getPlayerStats = (playerId: number): MatchPlayerStats | undefined => {
    return matchStats.find(s => s.playerId === playerId);
  };

  if (!isAdmin || !match) return null;

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
        Manage Match Statistics - {match.homeTeam?.name || 'Home'} vs {match.awayTeam?.name || 'Away'}
      </DialogTitle>
      <DialogContent sx={{ color: '#fff' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading && !matchStats.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {editingStats ? (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {players.find(p => p.id === editingStats.playerId)?.name} - Statistics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <TextField
                    label="Goals"
                    type="number"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiInputBase-root': { color: '#fff' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  />
                  <TextField
                    label="Assists"
                    type="number"
                    value={formData.assists}
                    onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiInputBase-root': { color: '#fff' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  />
                  <TextField
                    label="Passes"
                    type="number"
                    value={formData.passes}
                    onChange={(e) => setFormData({ ...formData, passes: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiInputBase-root': { color: '#fff' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  />
                  <TextField
                    label="Saves"
                    type="number"
                    value={formData.saves}
                    onChange={(e) => setFormData({ ...formData, saves: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiInputBase-root': { color: '#fff' },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingStats(null)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Click on a player's row to add or update their statistics for this match.
              </Typography>
            )}

            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', maxHeight: '400px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Player</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Position</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Team</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Goals</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Assists</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Passes</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Saves</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {players.map((player) => {
                    const stats = getPlayerStats(player.id!);
                    return (
                      <TableRow key={player.id} sx={{ cursor: 'pointer' }} onClick={() => handleEdit(player)}>
                        <TableCell sx={{ color: '#fff' }}>{player.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={player.position}
                            size="small"
                            sx={{
                              bgcolor: getPositionColor(player.position),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff' }}>
                          {player.team?.name || 'N/A'}
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>
                          {stats?.goals || 0}
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>
                          {stats?.assists || 0}
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff' }}>
                          {stats?.passes || 0}
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#fff' }}>
                          {stats?.saves || 0}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(player);
                              }}
                              sx={{
                                color: 'rgba(179, 0, 202, 0.9)',
                              }}
                            >
                              {stats ? 'Edit' : 'Add'}
                            </Button>
                            {stats && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(player.id!);
                                }}
                                color="error"
                                disabled={loading}
                                sx={{
                                  '&:hover': {
                                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
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

export default ManageMatchStats;
