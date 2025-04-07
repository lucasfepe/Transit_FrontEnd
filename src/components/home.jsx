import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Fab,
  Typography,
  Stack,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "../utils";
import NewSubscriptionDialog from "./NewSubscriptionDialog";
import LogoutButton from "./LogoutButton";
import { API_BASE_URL } from '../config';

const MOCK_SUBSCRIPTIONS = [
  {
    id: 1,
    routeId: "45",
    stopId: "1234",
    stopName: "Downtown Station",
  },
  {
    id: 2,
    routeId: "67",
    stopId: "5678",
    stopName: "Central Square",
  },
  {
    id: 3,
    routeId: "22",
    stopId: "9012",
    stopName: "University Ave",
  }
];

// Mock arrival data
const MOCK_ARRIVALS = {
  "45-1234": [
    { minutes: 5 },
    { minutes: 15 },
    { minutes: 25 }
  ],
  "67-5678": [
    { minutes: 3 },
    { minutes: 18 }
  ],
  "22-9012": [
    { minutes: 10 },
    { minutes: 20 },
    { minutes: 30 }
  ]
};


function getColorForTime(minutes) {
  if (minutes <= 5) return "green";
  if (minutes <= 10) return "orange";
  return "red";
}

function getInterval(arrivals) {
  if (arrivals.length < 2) return 10; // default interval
  return arrivals[1].minutes - arrivals[0].minutes;
}

function getProgress(minutes, interval) {
  if (interval === 0) return 100;
  const percent = 100 - (minutes / interval) * 100;
  return Math.max(0, Math.min(100, percent));
}

function Home() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [arrivals, setArrivals] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { makeAuthenticatedRequest } = useAuth();

  const handleNewSubscription = async (subscription) => {
    setSubscriptions(MOCK_SUBSCRIPTIONS);
  };

  const handleMenuClick = (event, subscription) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubscription(subscription);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubscription(null);
  };

  const handleDelete = () => {
    setSubscriptions(
      subscriptions.filter((sub) => sub.id !== selectedSubscription.id)
    );
    handleMenuClose();
  };

  useEffect(() => {
    fetchSubscriptions();
    const interval = setInterval(fetchArrivals, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubscriptions = async () => {
    setSubscriptions(MOCK_SUBSCRIPTIONS);
  };

  const fetchArrivals = async () => {
    setArrivals(MOCK_ARRIVALS);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <LogoutButton />
      <List>
        {subscriptions.map((subscription) => {
          const key = `${subscription.routeId}-${subscription.stopId}`;
          const stopArrivals = arrivals[key] || [];
          const nextArrival = stopArrivals[0];
          const interval = getInterval(stopArrivals);
          const progress = getProgress(nextArrival?.minutes || 0, interval);
          const color = getColorForTime(nextArrival?.minutes || 99);

          return (
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
              alignItems="flex-start"
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: color,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                {subscription.routeId}
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight="bold">{subscription.stopName}</Typography>
                  <Typography fontWeight="bold">
                    {nextArrival ? `${nextArrival.minutes} min` : "N/A"}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    height: 8,
                    width: "100%",
                    mt: 1,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 5,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${progress}%`,
                      backgroundColor: color,
                      borderRadius: "5px 0 0 5px",
                      transition: "width 0.3s ease",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: 0,
                        width: 10,
                        height: "100%",
                        backgroundColor: color,
                        clipPath: "polygon(0 0, 100% 50%, 0 100%)", // arrow tip
                      },
                    }}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Next: {stopArrivals.slice(1).map(a => `${a.minutes} min`).join(", ")}
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
