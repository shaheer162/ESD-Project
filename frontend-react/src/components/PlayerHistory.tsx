import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { playerService, eventService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { PlayerHistory, MatchPlayerStats } from '../types';
import { format } from 'date-fns';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AssistIcon from '@mui/icons-material/Handshake';
import PassIcon from '@mui/icons-material/SwapHoriz';
import SaveIcon from '@mui/icons-material/Shield';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface PlayerHistoryProps {
  playerId: number;
}

const PlayerHistory: React.FC<PlayerHistoryProps> = ({ playerId }) => {
  const { isAdmin } = useAuth();
  const [history, setHistory] = useState<PlayerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMatch, setEditingMatch] = useState<PlayerHistory | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    goals: 0,
    assists: 0,
    passes: 0,
    saves: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [playerId]);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await playerService.getHistory(playerId);
      setHistory(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load player history');
    } finally {
      setLoading(false);
    }
  };

  const totalGoals = history.reduce((sum, match) => sum + (match.goals || 0), 0);
  const totalAssists = history.reduce((sum, match) => sum + (match.assists || 0), 0);
  const totalPasses = history.reduce((sum, match) => sum + (match.passes || 0), 0);
  const totalSaves = history.reduce((sum, match) => sum + (match.saves || 0), 0);
  const matchesPlayed = history.length;
  
  // Check if player is a goalkeeper (has saves)
  const isGoalkeeper = totalSaves > 0 || history.some(m => (m.saves || 0) > 0);

  const handleEditStats = (match: PlayerHistory) => {
    setEditingMatch(match);
    setFormData({
      goals: match.goals || 0,
      assists: match.assists || 0,
      passes: match.passes || 0,
      saves: match.saves || 0,
    });
    setEditDialogOpen(true);
  };

  const handleSaveStats = async () => {
    if (!editingMatch?.matchUuid || !playerId) return;

    setError('');
    setSaving(true);

    try {
      await eventService.updatePlayerStats(editingMatch.matchUuid, playerId, {
        goals: formData.goals,
        assists: formData.assists,
        passes: formData.passes,
        saves: formData.saves,
      } as MatchPlayerStats);

      setEditDialogOpen(false);
      setEditingMatch(null);
      loadHistory();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update statistics';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStats = async (match: PlayerHistory) => {
    if (!match.matchUuid || !playerId || !window.confirm(`Are you sure you want to delete statistics for this match?`)) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await eventService.deletePlayerStats(match.matchUuid, playerId);
      loadHistory();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete statistics';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Statistics Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {!isGoalkeeper && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent>
                <SportsSoccerIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#B300CA' }}>
                  {totalGoals}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Total Goals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {!isGoalkeeper && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent>
                <AssistIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#B300CA' }}>
                  {totalAssists}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Total Assists
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.1)', 
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent>
              <PassIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#B300CA' }}>
                {totalPasses}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Total Passes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {isGoalkeeper && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent>
                <SaveIcon sx={{ fontSize: 40, color: '#9C27B0', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#B300CA' }}>
                  {totalSaves}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Total Saves
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.1)', 
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#B300CA' }}>
                {matchesPlayed}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Matches Played
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'rgba(255, 255, 255, 0.7)' }}>
                {isGoalkeeper 
                  ? `Avg: ${(totalSaves / matchesPlayed || 0).toFixed(2)} saves/match`
                  : `Avg: ${(totalGoals / matchesPlayed || 0).toFixed(2)} goals/match`
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Match History Table */}
      <Card sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
            Match History
          </Typography>
          {history.length === 0 ? (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', align: 'center', py: 4 }}>
              No match history available for this player.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                      Time
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                      Opponent
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                      <SportsSoccerIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Goals
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                      <AssistIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Assists
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                      <PassIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Passes
                    </TableCell>
                    {isGoalkeeper && (
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                        <SaveIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Saves
                      </TableCell>
                    )}
                    {isAdmin && (
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((match) => (
                    <TableRow 
                      key={match.matchUuid}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}
                    >
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {match.date ? format(new Date(match.date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {match.time ? format(new Date(`2000-01-01T${match.time}`), 'HH:mm') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={match.isHomeMatch ? 'H' : 'A'}
                            size="small"
                            sx={{
                              bgcolor: match.isHomeMatch ? '#4CAF50' : '#2196F3',
                              color: 'white',
                              fontWeight: 'bold',
                              minWidth: 30,
                            }}
                          />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            {match.opponentName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {match.goals > 0 ? (
                          <Chip
                            label={match.goals}
                            size="small"
                            sx={{
                              bgcolor: '#FF9800',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            0
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {match.assists > 0 ? (
                          <Chip
                            label={match.assists}
                            size="small"
                            sx={{
                              bgcolor: '#4CAF50',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            0
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {match.passes}
                        </Typography>
                      </TableCell>
                      {isGoalkeeper && (
                        <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          {(match.saves || 0) > 0 ? (
                            <Chip
                              label={match.saves || 0}
                              size="small"
                              sx={{
                                bgcolor: '#9C27B0',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              0
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      {isAdmin && (
                        <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditStats(match)}
                              sx={{
                                color: 'rgba(179, 0, 202, 0.9)',
                                '&:hover': {
                                  bgcolor: 'rgba(179, 0, 202, 0.1)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteStats(match)}
                              color="error"
                              sx={{
                                '&:hover': {
                                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Edit Statistics Dialog - Admin Only */}
      {isAdmin && editingMatch && (
        <Dialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingMatch(null);
          }}
          maxWidth="sm"
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
            Edit Player Statistics
          </DialogTitle>
          <DialogContent sx={{ color: '#fff' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
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
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Button
              onClick={() => {
                setEditDialogOpen(false);
                setEditingMatch(null);
              }}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveStats}
              variant="contained"
              disabled={saving}
              sx={{
                background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                '&:hover': {
                  background: 'linear-gradient(90deg, rgb(118, 0, 137), rgba(199, 0, 222, 0.938))',
                },
              }}
            >
              {saving ? 'Saving...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Goals History Timeline */}
      {!isGoalkeeper && history.filter((m) => m.goals > 0).length > 0 && (
        <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mt: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
              Goals History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {history
                .filter((m) => m.goals > 0)
                .map((match) => (
                  <Box
                    key={match.matchUuid}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 100, color: 'rgba(255, 255, 255, 0.8)' }}>
                      {match.date ? format(new Date(match.date), 'MMM dd, yyyy') : 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: 150, color: 'rgba(255, 255, 255, 0.8)' }}>
                      vs {match.opponentName}
                    </Typography>
                    <Chip
                      label={`${match.goals} ${match.goals === 1 ? 'goal' : 'goals'}`}
                      size="small"
                      sx={{
                        bgcolor: '#FF9800',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Assists History Timeline */}
      {history.filter((m) => m.assists > 0).length > 0 && (
        <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mt: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
              Assists History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {history
                .filter((m) => m.assists > 0)
                .map((match) => (
                  <Box
                    key={match.matchUuid}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 100, color: 'rgba(255, 255, 255, 0.8)' }}>
                      {match.date ? format(new Date(match.date), 'MMM dd, yyyy') : 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: 150, color: 'rgba(255, 255, 255, 0.8)' }}>
                      vs {match.opponentName}
                    </Typography>
                    <Chip
                      label={`${match.assists} ${match.assists === 1 ? 'assist' : 'assists'}`}
                      size="small"
                      sx={{
                        bgcolor: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Saves History Timeline - For Goalkeepers */}
      {isGoalkeeper && history.filter((m) => (m.saves || 0) > 0).length > 0 && (
        <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mt: 2, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
              Saves History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {history
                .filter((m) => (m.saves || 0) > 0)
                .map((match) => (
                  <Box
                    key={match.matchUuid}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(156, 39, 176, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 100, color: 'rgba(255, 255, 255, 0.8)' }}>
                      {match.date ? format(new Date(match.date), 'MMM dd, yyyy') : 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: 150, color: 'rgba(255, 255, 255, 0.8)' }}>
                      vs {match.opponentName}
                    </Typography>
                    <Chip
                      label={`${match.saves || 0} ${(match.saves || 0) === 1 ? 'save' : 'saves'}`}
                      size="small"
                      sx={{
                        bgcolor: '#9C27B0',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PlayerHistory;

