import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Paper, CircularProgress } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import axios from 'axios';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get('/api/v1/rewards');
        if (response.data.success && Array.isArray(response.data.rewards)) {
          setRewards(response.data.rewards);
        } else {
          setRewards([]);
        }
      } catch (error) {
        console.error('Failed to fetch rewards:', error);
        setRewards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} sx={{ minHeight: "100vh", bgcolor: "#f4f4f4" }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 600, width: "100%", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CardGiftcardIcon sx={{ fontSize: 40, mr: 1, color: "purple" }} />
          Available Rewards
        </Typography>
        
        {loading ? (
          <CircularProgress />
        ) : rewards.length > 0 ? (
          <List>
            {rewards.map(reward => (
              <ListItem key={reward._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                <ListItemText primary={reward.name} secondary={`Cost: ${reward.costInPoints} Points`} />
                <Button variant="contained" color="primary">
                  Redeem
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No rewards available.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Rewards;
