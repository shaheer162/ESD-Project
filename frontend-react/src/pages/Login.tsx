import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginTeam, loginAdmin } = useAuth();
  const [userType, setUserType] = useState<'team' | 'admin'>('team');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userType === 'admin') {
        await loginAdmin(username.trim(), password);
      } else {
        await loginTeam(username.trim(), password);
      }
      navigate('/home');
    } catch (err: any) {
      // Extract error message from various possible response formats
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // Axios error response
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.response.status === 401) {
          errorMessage = 'Invalid username or password.';
        } else if (err.response.status === 404) {
          errorMessage = 'User not found. Please check your credentials.';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: 450,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {userType === 'admin' ? (
              <AdminPanelSettingsIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            ) : (
              <SportsSoccerIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            )}
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              {userType === 'admin' ? '🔐 Admin Login' : '⚽ Team Login'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userType === 'admin' 
                ? 'Sign in to access admin panel' 
                : 'Sign in to access your team dashboard'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Tabs
              value={userType === 'admin' ? 1 : 0}
              onChange={(_, newValue) => {
                setUserType(newValue === 0 ? 'team' : 'admin');
                setError('');
              }}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <Tab label="Team" />
              <Tab label="Admin" />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
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
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="text"
              onClick={() => navigate('/register')}
              sx={{
                color: 'primary.light',
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Don't have an account? Register here
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

