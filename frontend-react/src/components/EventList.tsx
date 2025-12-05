import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Tabs, Tab, Card, CardContent } from '@mui/material';
import { eventService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import EventItem from './EventItem';
import CreateMatch from './CreateMatch';
import type { Event } from '../types';

const EventList: React.FC = () => {
  const { isAdmin, currentTeam } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderByRecent, setOrderByRecent] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0 = All/Upcoming, 1 = Past (for admins)

  useEffect(() => {
    loadEvents();
  }, [currentTeam]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventService.getAll();
      let filteredEvents = response.data;
      
      // If a team is logged in, filter to show only their matches
      if (currentTeam?.id && !isAdmin) {
        filteredEvents = response.data.filter(
          (event) =>
            event.homeTeam?.id === currentTeam.id || event.awayTeam?.id === currentTeam.id
        );
      }
      
      const sortedEvents = sortEvents(filteredEvents);
      setEvents(sortedEvents);
    } catch (err: any) {
      console.error('Error loading events:', err);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
    }
  };

  const sortEvents = (eventsList: Event[]) => {
    return [...eventsList].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return orderByRecent ? dateB - dateA : dateA - dateB;
    });
  };

  const toggleOrder = () => {
    setOrderByRecent(!orderByRecent);
    setEvents(sortEvents(events));
  };

  const handleRefresh = () => {
    loadEvents();
  };

  // Filter events into upcoming and past for admins
  const getUpcomingMatches = (eventsList: Event[]): Event[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return eventsList.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      const isFutureDate = eventDate > today;
      const isToday = eventDate.getTime() === today.getTime();
      const isZeroZero = event.homeGoals === 0 && event.awayGoals === 0;
      const hasScores = event.homeGoals > 0 || event.awayGoals > 0;
      
      // Upcoming: (future date OR today) with 0-0 scores (not played yet)
      return (isFutureDate || isToday) && isZeroZero && !hasScores;
    });
  };

  const getPastMatches = (eventsList: Event[]): Event[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return eventsList.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      const isPastDate = eventDate < today;
      const hasScores = event.homeGoals > 0 || event.awayGoals > 0;
      
      // Past: date is before today OR has non-zero scores (match was played)
      return isPastDate || hasScores;
    });
  };

  // Get filtered and sorted events
  const getFilteredEvents = () => {
    let filtered: Event[] = [];
    
    if (isAdmin && tabValue === 1) {
      // Past matches: sort by date descending (most recent first)
      filtered = getPastMatches(events);
      return filtered.sort((a, b) => {
        const dateA = new Date(a.date + (a.time ? 'T' + a.time : '')).getTime();
        const dateB = new Date(b.date + (b.time ? 'T' + b.time : '')).getTime();
        return dateB - dateA; // Most recent first
      });
    } else if (isAdmin && tabValue === 0) {
      // Upcoming matches: sort by date ascending (earliest first)
      filtered = getUpcomingMatches(events);
      return filtered.sort((a, b) => {
        const dateA = new Date(a.date + (a.time ? 'T' + a.time : '')).getTime();
        const dateB = new Date(b.date + (b.time ? 'T' + b.time : '')).getTime();
        return dateA - dateB; // Earliest first
      });
    }
    
    return events;
  };

  const displayEvents = getFilteredEvents();

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
        <Typography variant="h6">Matches</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAdmin && tabValue === 0 && <CreateMatch onMatchCreated={handleRefresh} />}
          {!isAdmin && (
            <Button variant="outlined" onClick={toggleOrder}>
              {orderByRecent ? 'Oldest First' : 'Recent First'}
            </Button>
          )}
        </Box>
      </Box>
      
      {isAdmin && (
        <Card sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <Tab label={`Upcoming Matches (${getUpcomingMatches(events).length})`} />
            <Tab label={`Past Matches (${getPastMatches(events).length})`} />
          </Tabs>
        </Card>
      )}

      {displayEvents.length === 0 ? (
        <Typography color="text.secondary">
          {isAdmin && tabValue === 0 
            ? 'No upcoming matches found. Create a new match to get started.'
            : isAdmin && tabValue === 1
            ? 'No past matches found.'
            : 'No matches found.'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayEvents.map((event) => (
            <EventItem key={event.uuid} event={event} onRefresh={handleRefresh} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventList;

