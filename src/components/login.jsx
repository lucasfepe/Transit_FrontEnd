import { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for redirection
import { API_BASE_URL } from '../config';
import { makeAuthenticatedRequest } from "../utils";



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // to navigate after login success

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Important for sending cookies
        });

        if (response.ok) {
          const data = await response.json();
          // Store the new access token
          localStorage.setItem('accessToken', data.accessToken);
          // Redirect to home
          navigate('/home');
        }
      } catch (error) {
        // If verification fails, stay on login page
        console.error('Auth verification failed:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        // If login is successful, save the token (you could use localStorage/sessionStorage or a state management library)
        localStorage.setItem('authToken', data.token);

        // Redirect user to the dashboard or home page
        navigate('/home');
      }
    } catch (err) {
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: 3,
        backgroundColor: 'white',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Log in to Your Account
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ marginTop: 2 }}
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="secondary" /> : 'Log in'}
        </Button>
      </form>

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Or log in with:
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 2 }}>
        {/* These are placeholders for OAuth buttons */}
        <Button variant="outlined" color="primary">
          Google
        </Button>
        <Button variant="outlined" color="primary">
          Facebook
        </Button>
        <Button variant="outlined" color="primary">
          GitHub
        </Button>
      </Box>

      <Link to="/register" style={{ marginTop: '16px' }}>
        Don't have an account? Register here
      </Link>
    </Box>
  );
}
