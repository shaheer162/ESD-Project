import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Container,
  Grid,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';
import TeamDashboard from '../components/TeamDashboard';
import TeamProfile from '../components/TeamProfile';
import EventList from '../components/EventList';
import TeamList from '../components/TeamList';
import CityList from '../components/CityList';
import StadiumList from '../components/StadiumList';
import DivisionList from '../components/DivisionList';
import LeagueStandings from '../components/LeagueStandings';
import TopScorers from '../components/TopScorers';
import TopAssists from '../components/TopAssists';
import PlayerList from '../components/PlayerList';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentTeam, logout, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabLabels = ['Matches'];
  if (isAdmin) {
    tabLabels.push('Teams');
  }
  tabLabels.push('Players');
  tabLabels.push('Statistics');

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsSoccerIcon />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Sports Management System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {currentUser && (
              <Typography variant="body2">
                Welcome, {currentUser.username} ({currentUser.role || 'USER'})
              </Typography>
            )}
            {currentTeam && (
              <Typography variant="body2">
                Welcome, {currentTeam.username || 'Team'} (Team)
              </Typography>
            )}
            <Button
              color="error"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: 'rgba(244, 67, 54, 0.5)',
                '&:hover': {
                  borderColor: 'rgba(244, 67, 54, 0.8)',
                  background: 'rgba(244, 67, 54, 0.2)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 10 }}>
        {/* Team Dashboard and Profile - Show for logged-in teams */}
        {currentTeam && (
          <Container maxWidth="xl" sx={{ mb: 3 }}>
            <TeamDashboard />
            <TeamProfile />
          </Container>
        )}

        <Container maxWidth="xl">
          <Box
            sx={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              p: 2,
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={(_, newValue) => setSelectedTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              {tabLabels.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>

            <Box sx={{ mt: 4, minHeight: '400px' }}>
              {/* Matches Tab */}
              {selectedTab === 0 && <EventList />}
              
              {/* Teams Tab (Admin only) */}
              {selectedTab === 1 && isAdmin && <TeamList />}
              
              {/* Players Tab */}
              {(selectedTab === 1 && !isAdmin) || (selectedTab === 2 && isAdmin) ? (
                <PlayerList />
              ) : null}
              
              {/* Statistics Tab */}
              {((isAdmin && selectedTab === 3) || (!isAdmin && selectedTab === 2)) && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <LeagueStandings teamDivisionId={currentTeam?.division?.id} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TopScorers />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TopAssists />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

