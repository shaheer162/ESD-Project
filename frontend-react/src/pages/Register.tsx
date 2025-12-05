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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerTeam, registerAdmin } = useAuth();
  const [userType, setUserType] = useState<'team' | 'admin'>('team');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      if (userType === 'admin') {
        await registerAdmin(formData.username.trim(), formData.email.trim(), formData.password);
      } else {
        // For team registration, password is set to username in backend
        await registerTeam({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.username.trim(), // Backend will set this to username anyway
        });
      }
      // Show success message
      setSuccess('Registration successful! Please login.');
      // Clear form after successful registration
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      // Extract error message from various possible response formats
      let errorMessage = 'Registration failed. Please try again.';
      
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
        } else if (err.response.status === 409) {
          errorMessage = 'Username or email already exists. Please choose different credentials.';
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
              {userType === 'admin' ? '🔐 Register Admin' : '⚽ Register Team'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userType === 'admin' 
                ? 'Create an admin account' 
                : 'Create your team account to get started'}
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
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
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
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
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
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                fontWeight: 700,
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                color: 'primary.light',
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Already have an account? Login here
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;

