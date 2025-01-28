import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, TextField, Typography, Avatar, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../redux/store';

const Profile = () => {
  const user = useSelector(state => state.auth.user); // Fix: Correct Redux selector
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Redux User State in Profile Page:", user); // Debugging

    if (user && user._id) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setIsLoading(false);
    } else {
      console.log("User data not available, waiting...");
    }
  }, [user]);

  const handleUpdate = () => {
    console.log("Current user state before update:", user); 

    if (!user || !user._id) {
      console.error('User data is not available for update.');
      alert('Cannot update: User data not available.');
      return;
    }

    dispatch(updateUser({ id: user._id, username, email }));
    alert('User details updated successfully.');
  };

  return (
    <Box display="flex" height="100vh">
      <Box width="240px" bgcolor="#F0F0F0" p={2}>
        <Typography variant="h6">Menu</Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/profile')}>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box flexGrow={1} p={3}>
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
          <Avatar src={user?.profile_image || "/default-avatar.png"} sx={{ width: 90, height: 90, mb: 2 }} />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleUpdate}
            disabled={isLoading}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
