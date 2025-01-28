import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, TextField, Avatar, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { updateUser, authActions } from '../redux/store';
import { useTheme } from '../context/ThemeContext';
import toast from "react-hot-toast";

const Profile = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && user._id) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setIsLoading(false);
    }
  }, [user]);

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
      toast.error('Cannot update: User data not available.');
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
        const imageResponse = await fetch('/api/v1/user/upload-image', {
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
    toast.success('Updated Successfully!');
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  return (
    <Box display="flex" height="100vh">
      <Box
        width="240px"
        p={2}
        sx={{
          bgcolor: theme === 'dark' ? '#333' : '#F0F0F0',
          color: theme === 'dark' ? '#fff' : '#000',
          minHeight: "100vh"
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/profile')}>
              <ListItemText primary="Profile" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/my-blogs')}>
              <ListItemText primary="My Blogs" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/create-blog')}>
              <ListItemText primary="Create Blog" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ExitToAppIcon sx={{ marginRight: '10px', color: 'inherit' }} />
              <ListItemText primary="Logout" sx={{ color: 'inherit' }} />
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
  );
};

export default Profile;
