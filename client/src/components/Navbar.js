import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Toolbar, Typography, IconButton, Button, Avatar, MenuItem, Menu } from "@mui/material";
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import toast from "react-hot-toast";
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';
import { authActions } from "../redux/store";

const Navbar = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const user = useSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const location = useLocation(); 
  const [anchorEl, setAnchorEl] = useState(null);
  const isWriter = user?.role?.toLowerCase() === "writer";

  useEffect(() => {
    setAnchorEl(null);
  }, [location]);

  const handleMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const handleRestrictedNavigation = (path) => {
    if (isWriter) {
      navigate(path);
    } else {
      toast.error("Login as a writer to access this feature");
    }
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
          <Button className={location.pathname === "/" ? "active" : ""} onClick={() => navigate("/")} color="inherit">Home</Button>
          <Button className={location.pathname === "/about" ? "active" : ""} onClick={() => navigate("/about")} color="inherit">About</Button>
          <Button className={location.pathname.startsWith("/blogs") ? "active" : ""} onClick={() => handleNavigation("/blogs")} color="inherit">Blogs</Button>
          <Button className={location.pathname === "/contact" ? "active" : ""} onClick={() => navigate("/contact")} color="inherit">Contact</Button>
        </div>

        {isLogin && (
          <>
            <IconButton onClick={toggleTheme} color="inherit">{theme === 'light' ? <Brightness5Icon /> : <NightsStayIcon />}</IconButton>
            <Avatar
              src={user?.profile_image || "/default-avatar.png"}
              alt="Profile"
              onClick={handleMenu}
              style={{ marginRight: '10px', cursor: 'pointer', width: '40px', height: '40px' }}
            />
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleNavigation('/profile'); handleClose(); }}>Profile</MenuItem>
              
              <MenuItem onClick={() => { handleRestrictedNavigation('/my-blogs'); handleClose(); }}>My Blogs</MenuItem>
              <MenuItem onClick={() => { handleRestrictedNavigation('/create-blog'); handleClose(); }}>Create Blog</MenuItem>
              
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}

        {!isLogin && (
          <Button onClick={() => navigate("/login")} variant="contained" style={{ background: '#5e81ac', color: '#ffffff' }}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;