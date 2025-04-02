// src/components/NewSubscriptionDialog.jsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material';

function NewSubscriptionDialog({ open, onClose, onSubmit }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);

  // Fetch routes when dialog opens
  useEffect(() => {
    if (open) {
      fetchRoutes();
    }
  }, [open]);

  // Fetch stops when route is selected
  useEffect(() => {
    if (selectedRoute) {
      fetchStops(selectedRoute.id);
    }
  }, [selectedRoute]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchStops = async (routeId) => {
    try {
      const response = await fetch(`/api/routes/${routeId}/stops`);
      const data = await response.json();
      setStops(data);
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  const handleSubmit = () => {
    if (selectedRoute && selectedStop) {
      onSubmit({
        routeId: selectedRoute.id,
        stopId: selectedStop.id,
        routeName: selectedRoute.name,
        stopName: selectedStop.name,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Subscription</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={routes}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedRoute(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Route" margin="normal" />
          )}
        />
        <Autocomplete
          options={stops}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setSelectedStop(newValue)}
          disabled={!selectedRoute}
          renderInput={(params) => (
            <TextField {...params} label="Stop" margin="normal" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedRoute || !selectedStop}
        >
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewSubscriptionDialog;
