import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateRegistration = () => {
    const errorsConst = [];

    if (!password || password.length < 6) {
      errorsConst.push("Password must be at least 6 characters long");
    }
    if (!email || !email.includes("@")) {
      errorsConst.push("Please enter a valid email address");
    }
    if (password !== confirmPassword) {
      errorsConst.push("Passwords do not match");
    }
    // Add any other validation rules

    return errorsConst;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");

    const errors = validateRegistration();
    if (errors.length > 0) {
      setErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.message || "Registration failed");
        return;
      }

      // Redirect to login page or automatically log in the user
      window.location.href = "/login";
    } catch (err) {
      setErrors(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: 3,
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Create an Account
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {errors.length > 0 && (
          <Box sx={{ marginTop: 1 }}>
            {errors.map((error, index) => (
              <Typography
                key={index}
                color="error"
                variant="body2"
                sx={{ marginBottom: index === errors.length - 1 ? 0 : 0.5 }}
              >
                • {error}
              </Typography>
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ marginTop: 2 }}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="secondary" />
          ) : (
            "Register"
          )}
        </Button>
      </form>
      <Link to="/">Back to login</Link>
    </Box>
  );
}
