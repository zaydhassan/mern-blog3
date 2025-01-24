import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Toolbar, Typography, IconButton, Button, Avatar, MenuItem, Select } from "@mui/material";
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import toast from "react-hot-toast";
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';
import { authActions } from "../redux/store";

const Navbar = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.isLogin);
  const user = useSelector((state) => state.user);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState("en");

  const handleLogout = () => {
    dispatch(authActions.logout());
    toast.success("Logged out Successfully");
    navigate("/");
  };

  const handleNavigation = (path) => {
    if (isLogin) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    toast.success(`Language changed to ${event.target.value.toUpperCase()}`);
  };

  return (
    <AppBar position="static" className={`navbar ${theme}`}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          My Blog APP
        </Typography>

        <div style={{ flexGrow: 1, justifyContent: 'center', display: 'flex' }}>
          <Button onClick={() => navigate("/")} color="inherit">Home</Button>
          <Button onClick={() => navigate("/about")} color="inherit">About</Button>
          <Button onClick={() => handleNavigation("/blogs")} color="inherit">Blogs</Button>
          {isLogin && (
            <>
              <Button onClick={() => navigate("/my-blogs")} color="inherit">My Blogs</Button>
              <Button onClick={() => navigate("/create-blog")} color="inherit">Create Blog</Button>
            </>
          )}
          <Button onClick={() => handleNavigation("/contact")} color="inherit">Contact</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            style={{ marginRight: '10px', color: 'inherit' }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="zh">Chinese</MenuItem>
            <MenuItem value="ja">Japanese</MenuItem>
            <MenuItem value="ru">Russian</MenuItem>
            <MenuItem value="ar">Arabic</MenuItem>
            <MenuItem value="it">Italian</MenuItem>
          </Select>

          {isLogin && (
            <Avatar
              src={user?.profile_image || "/default-avatar.png"}
              alt="Profile"
              onClick={() => navigate('/profile')}
              style={{ marginRight: '10px', cursor: 'pointer', width: '40px', height: '40px' }}
            />
          )}

          {isLogin ? (
            <>
              <IconButton onClick={toggleTheme} color="inherit">
                {theme === 'light' ? <Brightness5Icon /> : <NightsStayIcon />}
              </IconButton>
              <Button onClick={handleLogout} color="inherit">Logout</Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="contained"
              className="MuiButton-contained"
            >
              Login
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
