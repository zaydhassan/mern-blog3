import React, { useState, useEffect, useRef,useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, TextField, Avatar, List, ListItem, ListItemButton, ListItemText,Chip,Typography, LinearProgress,Paper, CircularProgress,Link } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { updateUser, authActions } from '../redux/store';
import { useTheme } from '../context/ThemeContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import RedeemIcon from '@mui/icons-material/CardGiftcard';
import { ToastContainer, toast, Slide, Zoom, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [rewards, setRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isWriter = user?.role?.toLowerCase() === "writer";
  const fileInputRef = useRef(null);
  const [points,setPoints] = useState(0);
  const [level, setLevel] = useState("Beginner");
  const [badges, setBadges] = useState([]); 
  const [topWriters, setTopWriters] = useState([]);
  const [topReaders, setTopReaders] = useState([]);
  const nextLevelPoints = 100; 
  const progress = (points / nextLevelPoints) * 100;

  const fetchUserStats = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/user/${user._id}`);
      if (response.data.success) {
        setPoints(response.data.user.points || 0);
        setLevel(response.data.user.level || "Beginner");
        setBadges(response.data.user.badges || []);
      } else {
        console.error("Failed to fetch user stats:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [user]);

  const fetchRewards = async () => {
    setLoadingRewards(true);
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
    }
    setLoadingRewards(false);
  };

  const handleRedeem = async (rewardId) => {
    try {
      const response = await axios.post('/api/v1/rewards/redeem', { userId: user._id, rewardId });
      if (response.data.success) {
        alert('Reward redeemed successfully!');
      } else {
        alert('Failed to redeem reward.');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

   const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/user/leaderboard`);
      if (response.data.success) {
        setTopWriters(response.data.topWriters || []);
        setTopReaders(response.data.topReaders || []);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }, []);
  

  useEffect(() => {
    if (user && user._id) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      fetchUserStats();
      fetchLeaderboard();
      setIsLoading(false);
      fetchRewards();
    }
  }, [user, points, fetchUserStats,fetchLeaderboard]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpdate(file);
    }
  };

  const handleUpdate = async (selectedImage = null) => {
    if (!user || !user._id) {
        toast.error("⚠️ Cannot update: User data not available.", {
            position: "top-center",
            transition: Flip,
        });
      return;
    }

    const updatedData = { id: user._id, username, email, bio };

    if (password.trim()) {
      updatedData.password = password;
    }

    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);

      try {
        const imageResponse = await fetch(`/api/v1/user/upload-image`, {
          method: 'POST',
          body: formData,
        });

        const imageData = await imageResponse.json();
        if (imageResponse.ok) {
          updatedData.profile_image = imageData.imageUrl;
        } else {
          throw new Error(imageData.message || 'Image upload failed');
        }
      } catch (error) {
        toast.error('Failed to upload image');
        return;
      }
    }

    dispatch(updateUser(updatedData));
    toast.success("Profile updated successfully!", {
      position: "top-center",
      autoClose: 3000,
      transition: Zoom,
  });
};

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleRestrictedNavigation = (path) => {
    if (isWriter) {
      navigate(path);
    } else {
      toast.error("Login as a writer to access this feature");
    }
  };

  return (
    <>
    <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
        toastStyle={{
          backgroundColor: "#1E1E1E",  
          color: "#FFFFFF", 
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.3)",
      }}
    />
    <Box display="flex" height="100vh">
      <Box
  width="240px"
  p={2}
  sx={{
    bgcolor: theme === 'dark' ? '#1E1E1E' : '#E3F2FD',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/profile')}>
            <AccountCircleIcon sx={{ marginRight: 1, color: 'cyan' }} />
            <ListItemText primary="Profile" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
          
         <ListItem disablePadding>
            <ListItemButton onClick={() => handleRestrictedNavigation('/my-blogs')}>
              <ArticleIcon sx={{ marginRight: 1, color: 'orange' }} />
              <ListItemText primary="My Blogs" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleRestrictedNavigation('/create-blog')}>
              <AddCircleIcon sx={{ marginRight: 1, color: 'limegreen' }} />
              <ListItemText primary="Create Blog" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
          <ListItemButton component={Link} to="/rewards">
    <RedeemIcon sx={{ marginRight: 1, color: 'Aquamarine' }} /> 
    <ListItemText primary="Rewards" sx={{ color: 'inherit' }} />
  </ListItemButton>
</ListItem>
          
          <ListItem disablePadding>
            <ListItemButton>
              <LeaderboardIcon sx={{ marginRight: 1, color: 'gold' }} />
              <ListItemText primary="Leaderboard" />
            </ListItemButton>
          </ListItem>

<Box mt={2} p={1} 
  sx={{ 
    bgcolor: theme === 'dark' ? '#2E2E2E' : '#fff', 
    color: theme === 'dark' ? '#fff' : '#000',
    borderRadius: 1 
  }}>
  <Typography variant="h6" sx={{ textAlign: "center", color: theme === 'dark' ? 'cyan' : 'black' }}>
    ✍️ Top Writers
  </Typography>
  {topWriters.length > 0 ? (
    topWriters.map((writer, index) => (
      <ListItem key={writer._id} disablePadding>
        <ListItemText 
          primary={`${index + 1}. ${writer.username}`} 
          secondary={`${writer.points} Points`} 
          sx={{ color: theme === 'dark' ? '#fff' : '#000' }} 
        />
      </ListItem>
    ))
  ) : (
    <Typography variant="body2" sx={{ textAlign: "center", color: theme === 'dark' ? '#fff' : '#000' }}>
      No top writers yet.
    </Typography>
  )}
</Box>

<Box mt={2} p={1} 
  sx={{ 
    bgcolor: theme === 'dark' ? '#2E2E2E' : '#fff', 
    color: theme === 'dark' ? '#fff' : '#000',
    borderRadius: 1 
  }}>
  <Typography variant="h6" sx={{ textAlign: "center", color: theme === 'dark' ? 'cyan' : 'black' }}>
    📖 Top Readers
  </Typography>
  {topReaders.length > 0 ? (
    topReaders.map((reader, index) => (
      <ListItem key={reader._id} disablePadding>
        <ListItemText 
          primary={`${index + 1}. ${reader.username}`} 
          secondary={`${reader.points} Points`} 
          sx={{ color: theme === 'dark' ? '#fff' : '#000' }} 
        />
      </ListItem>
    ))
  ) : (
    <Typography variant="body2" sx={{ textAlign: "center", color: theme === 'dark' ? '#fff' : '#000' }}>
      No top readers yet.
    </Typography>
  )}
</Box>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
            <ExitToAppIcon sx={{ marginRight: 1, color: "red" }} />
            <ListItemText primary="LOGOUT" sx={{ fontWeight: "bold", color: "inherit" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box flexGrow={1} p={3}>
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
          <Avatar
            src={user?.profile_image || "/default-avatar.png"}
            sx={{
              width: 110,
              height: 110,
              mb: 2,
              cursor: 'pointer',
              border: "3px solid transparent",
              transition: "border 0.3s ease, box-shadow 0.3s ease",
              boxShadow: theme === 'dark'
                ? "0px 0px 15px rgba(0, 255, 255, 0.7)"
                : "0px 0px 10px rgba(0, 0, 255, 0.4)",
              "&:hover": {
                border: theme === 'dark' ? "3px solid cyan" : "3px solid blue",
                boxShadow: theme === 'dark'
                  ? "0px 0px 35px rgba(0, 255, 255, 0.9)"
                  : "0px 0px 15px rgba(0, 0, 255, 0.6)"
              }
            }}
            onClick={handleAvatarClick}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
<Paper 
  elevation={4} 
  sx={{ 
    maxWidth: 450, 
    padding: 4, 
    borderRadius: 3, 
    textAlign: "center", 
    background: "rgba(30, 30, 30, 0.9)", 
    backdropFilter: "blur(8px)", 
    boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.3)",
    border: "2px solid rgba(0, 255, 255, 0.4)",
    color: "white",
  }}
>

 <Typography 
  variant="h6" 
  sx={{ fontWeight: "bold", textShadow: "0px 1px 1px cyan" }}
>
  🎯 Level: {level}
</Typography>

<Typography 
  variant="h5" 
  sx={{ mt: 1, fontWeight: "bold", letterSpacing: "1px" }}
>
  {points} Points
</Typography>

<LinearProgress 
  variant="determinate" 
  value={progress} 
  sx={{ 
    height: 9, 
    borderRadius: 5, 
    backgroundColor: "#444", 
    "& .MuiLinearProgress-bar": { 
      background: "linear-gradient(90deg, cyan, blue)", 
      transition: "width 1s ease-in-out"
    },
  }} 
/>

<Typography 
  variant="caption" 
  sx={{ 
    mt: 1, 
    display: "block", 
    fontWeight: "bold", 
    color: "rgba(0, 255, 255, 0.8)" 
  }}
>
  {progress.toFixed(1)}% to next level
</Typography>

</Paper>

<Box mt={3} textAlign="center">
  <Typography variant="h6">🏅 Badges Earned:</Typography>
  {badges.length > 0 ? (
    badges.map((badge, index) => (
      <Chip 
        key={index} 
        label={badge} 
        sx={{ 
          m: 0.5, 
          bgcolor: "gold", 
          color: "#000", 
          fontWeight: "bold", 
          boxShadow: "0px 3px 6px rgba(0,0,0,0.2)" 
        }} 
      />
    ))
  ) : (
    <Typography variant="body2">No badges yet. Keep engaging!</Typography>
  )}
</Box>

{loadingRewards ? (
  <CircularProgress />
) : Array.isArray(rewards) && rewards.length > 0 ? ( 
  <List>
    {rewards.map(reward => (
      <ListItem key={reward._id}>
        <ListItemText primary={reward.name} secondary={`Cost: ${reward.costInPoints} Points`} />
        <Button 
          variant="contained" 
          color="primary" 
          disabled={user.points < reward.costInPoints} 
          onClick={() => handleRedeem(reward._id)}
        >
          Redeem
        </Button>
      </ListItem>
    ))}
  </List>
) : (
  <Typography></Typography> 
)}

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

          <TextField
            fullWidth
            margin="normal"
            label="Bio"
            variant="outlined"
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Enter new password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => handleUpdate()}
            disabled={isLoading}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default Profile;