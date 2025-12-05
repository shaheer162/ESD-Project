import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/api';
import EditMatch from './EditMatch';
import ManageMatchStats from './ManageMatchStats';
import type { Event } from '../types';

interface EventItemProps {
  event: Event;
  onRefresh: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onRefresh }) => {
  const { isAdmin } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!event.uuid || !window.confirm('Are you sure you want to delete this match?')) return;
    try {
      await eventService.delete(event.uuid);
      onRefresh();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete match');
    }
  };

  const getWinner = () => {
    if (event.homeGoals > event.awayGoals) return 'home';
    if (event.awayGoals > event.homeGoals) return 'away';
    return 'draw';
  };

  const isUpcomingMatch = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    
    const isFutureDate = eventDate > today;
    const isToday = eventDate.getTime() === today.getTime();
    const isZeroZero = event.homeGoals === 0 && event.awayGoals === 0;
    const hasScores = event.homeGoals > 0 || event.awayGoals > 0;
    
    // Upcoming: (future date OR today) with 0-0 scores (not played yet)
    return (isFutureDate || isToday) && isZeroZero && !hasScores;
  };

  const winner = getWinner();
  const isUpcoming = isUpcomingMatch();

  return (
    <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              {event.homeTeam?.name || 'Home Team'} vs {event.awayTeam?.name || 'Away Team'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.stadium?.name || 'TBD'}
            </Typography>
            {!isUpcoming && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6">
                  {event.homeGoals} - {event.awayGoals}
                </Typography>
                {winner === 'home' && <Chip label="Home Wins" color="success" size="small" />}
                {winner === 'away' && <Chip label="Away Wins" color="error" size="small" />}
                {winner === 'draw' && <Chip label="Draw" color="warning" size="small" />}
              </Box>
            )}
            {isAdmin && (
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<BarChartIcon />}
                  onClick={() => setStatsDialogOpen(true)}
                  sx={{
                    borderColor: 'rgba(179, 0, 202, 0.5)',
                    color: 'rgba(179, 0, 202, 0.9)',
                    '&:hover': {
                      borderColor: 'rgba(179, 0, 202, 0.8)',
                      bgcolor: 'rgba(179, 0, 202, 0.1)',
                    },
                  }}
                >
                  Manage Stats
                </Button>
              </Box>
            )}
          </Box>
          <Box>
            {isAdmin && (
              <>
                <IconButton onClick={() => setEditDialogOpen(true)} color="primary" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete} color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
      {isAdmin && (
        <>
          <EditMatch
            open={editDialogOpen}
            match={event}
            onClose={() => setEditDialogOpen(false)}
            onMatchUpdated={onRefresh}
          />
          <ManageMatchStats
            open={statsDialogOpen}
            match={event}
            onClose={() => setStatsDialogOpen(false)}
            onStatsUpdated={onRefresh}
          />
        </>
      )}
    </Card>
  );
};

export default EventItem;
