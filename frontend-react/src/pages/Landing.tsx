import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Divider } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SportsSoccerIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              ⚽ Sports Management System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage teams, players, matches, and statistics
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                Login
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                Access your team account or administrator dashboard
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                  border: '2px solid #ffffff',
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(179, 0, 202, 0.938), rgb(98, 0, 117))',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(179, 0, 202, 0.4)',
                  },
                }}
              >
                Login
              </Button>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box>
              <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                Register
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                Create a new team account and start managing your players
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(90deg, rgb(98, 0, 117), rgba(179, 0, 202, 0.938))',
                  border: '2px solid #ffffff',
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(179, 0, 202, 0.938), rgb(98, 0, 117))',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(179, 0, 202, 0.4)',
                  },
                }}
              >
                Register Team
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Landing;

