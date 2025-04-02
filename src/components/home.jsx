// src/components/home.jsx
import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { API_BASE_URL } from '../config';

function Home() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [arrivals, setArrivals] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNewSubscription = async (subscription) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(subscription),
      });
      
      if (response.ok) {
        fetchSubscriptions();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  // Handle menu open
  const handleMenuClick = (event, subscription) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubscription(subscription);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubscription(null);
  };

  // Delete subscription
  const handleDelete = () => {
    // API call to delete subscription
    setSubscriptions(
      subscriptions.filter((sub) => sub.id !== selectedSubscription.id)
    );
    handleMenuClose();
  };

  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
    const interval = setInterval(fetchArrivals, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // if using JWT
        }
      });
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchArrivals = async () => {
    const newArrivals = {};
    for (const sub of subscriptions) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/arrivals/${sub.routeId}/${sub.stopId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        newArrivals[`${sub.routeId}-${sub.stopId}`] = data;
      } catch (error) {
        console.error('Error fetching arrivals:', error);
      }
    }
    setArrivals(newArrivals);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <List>
        {subscriptions.map((subscription) => (
          <ListItem
            key={subscription.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => handleMenuClick(e, subscription)}
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`Route ${subscription.routeId} - Stop ${subscription.stopName}`}
              secondary={
                arrivals[`${subscription.routeId}-${subscription.stopId}`]
                  ?.map((arrival) => `${arrival.minutes} min`)
                  .join(", ") || "No upcoming arrivals"
              }
            />
          </ListItem>
        ))}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Unsubscribe</MenuItem>
      </Menu>
      <NewSubscriptionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleNewSubscription}
      />
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Home;
