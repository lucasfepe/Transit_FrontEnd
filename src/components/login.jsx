import { useState, useEffect, useContext } from 'react';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils';
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, refresh } = useAuth();


  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await refresh();
      } catch (error) {
        // If verification fails, stay on login page
        console.error('Auth verification failed:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the login function from AuthContext with email and password
      await login(email, password);
      // No need for navigation here as it's handled in AuthContext

    } catch (err) {
      // Handle any errors thrown from the login function in AuthContext
      setError(err.message || 'Login failed');
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
      className="loginForm"
    >
      <Box
        component="img"
        src="/logo.png"
        alt="Logo"
        sx={{
          display: 'block',
          maxWidth: '200px', // Adjust this value based on your needs
          width: '100%',
          height: 'auto',
          marginBottom: 2, // Adds some space between the image and the text below
        }}
      />


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
