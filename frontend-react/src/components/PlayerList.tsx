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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { playerService, teamService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Player, Team } from '../types';
import PlayerHistory from './PlayerHistory';
import ManagePlayers from './ManagePlayers';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

const PlayerList: React.FC = () => {
  const { currentTeam, isAdmin } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [managePlayersOpen, setManagePlayersOpen] = useState(false);

  useEffect(() => {
    loadTeams();
    if (currentTeam?.id) {
      setSelectedTeamId(currentTeam.id);
      loadPlayers(currentTeam.id);
    } else if (isAdmin) {
      loadAllPlayers();
    }
  }, [currentTeam, isAdmin]);

  const loadTeams = async () => {
    try {
      const response = await teamService.getAll();
      setTeams(response.data);
    } catch (err) {
      console.error('Error loading teams:', err);
    }
  };

  const loadPlayers = async (teamId: number) => {
    setLoading(true);
    try {
      const response = await playerService.getAllByTeam(teamId);
      setPlayers(response.data);
    } catch (err) {
      console.error('Error loading players:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPlayers = async () => {
    setLoading(true);
    try {
      // Load players from all teams
      const teamsResponse = await teamService.getAll();
      const allPlayers: Player[] = [];
      
      for (const team of teamsResponse.data) {
        if (team.id) {
          try {
            const playersResponse = await playerService.getAllByTeam(team.id);
            allPlayers.push(...playersResponse.data);
          } catch (err) {
            console.error(`Error loading players for team ${team.id}:`, err);
          }
        }
      }
      
      setPlayers(allPlayers);
    } catch (err) {
      console.error('Error loading all players:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamChange = (teamId: number | null) => {
    setSelectedTeamId(teamId);
    if (teamId) {
      loadPlayers(teamId);
    } else {
      loadAllPlayers();
    }
  };

  const handleViewHistory = (player: Player) => {
    setSelectedPlayer(player);
    setHistoryDialogOpen(true);
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
        <Typography variant="h6">Players</Typography>
        {isAdmin && teams.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                if (teams.length > 0) {
                  setManagePlayersOpen(true);
                }
              }}
              sx={{
                background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                mr: 1,
              }}
            >
              Add Player
            </Button>
            <Button
              variant={selectedTeamId === null ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleTeamChange(null)}
              sx={{
                background: selectedTeamId === null ? 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))' : 'transparent',
              }}
            >
              All Teams
            </Button>
            {teams.map((team) => (
              <Button
                key={team.id}
                variant={selectedTeamId === team.id ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleTeamChange(team.id || null)}
                sx={{
                  background: selectedTeamId === team.id ? 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))' : 'transparent',
                }}
              >
                {team.name}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      {players.length === 0 ? (
        <Typography color="text.secondary">No players found.</Typography>
      ) : (
        <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
          <CardContent>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 200 }}>Name</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Position</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Jersey #</TableCell>
                    <TableCell sx={{ minWidth: 180 }}>Team</TableCell>
                    <TableCell align="right" sx={{ minWidth: 150 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '100%' }}>
                          <PersonIcon fontSize="small" />
                          <Typography 
                            variant="body1" 
                            fontWeight="medium"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '180px'
                            }}
                          >
                            {player.name}
                          </Typography>
                        </Box>
                      </TableCell>
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
                      <TableCell>
                        <Typography variant="body2">#{player.jerseyNumber}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '160px'
                          }}
                        >
                          {player.team?.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewHistory(player)}
                          sx={{
                            borderColor: 'rgba(179, 0, 202, 0.5)',
                            color: 'rgba(179, 0, 202, 0.9)',
                            '&:hover': {
                              borderColor: 'rgba(179, 0, 202, 0.8)',
                              bgcolor: 'rgba(179, 0, 202, 0.1)',
                            },
                          }}
                        >
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(30, 30, 30, 0.95)',
            backgroundImage: 'none',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
          mb: 2
        }}>
          {selectedPlayer?.name} - Match History
        </DialogTitle>
        <DialogContent sx={{ 
          color: 'white',
          bgcolor: 'transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(179, 0, 202, 0.5)',
            borderRadius: '4px',
          },
        }}>
          {selectedPlayer && <PlayerHistory playerId={selectedPlayer.id!} />}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          pt: 2,
          px: 3
        }}>
          <Button 
            onClick={() => setHistoryDialogOpen(false)}
            sx={{
              color: 'rgba(179, 0, 202, 0.9)',
              borderColor: 'rgba(179, 0, 202, 0.5)',
              '&:hover': {
                borderColor: 'rgba(179, 0, 202, 0.8)',
                bgcolor: 'rgba(179, 0, 202, 0.1)',
              },
            }}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Players Dialog - Admin Only */}
      {isAdmin && teams.length > 0 && teams[0]?.id && (
        <ManagePlayers
          open={managePlayersOpen}
          onClose={() => {
            setManagePlayersOpen(false);
            // Reload players after closing
            if (selectedTeamId) {
              loadPlayers(selectedTeamId);
            } else if (isAdmin) {
              loadAllPlayers();
            }
          }}
          teamId={selectedTeamId || teams[0].id}
          onPlayersUpdated={() => {
            // Reload players after update
            if (selectedTeamId) {
              loadPlayers(selectedTeamId);
            } else if (isAdmin) {
              loadAllPlayers();
            }
          }}
        />
      )}
    </Box>
  );
};

export default PlayerList;

