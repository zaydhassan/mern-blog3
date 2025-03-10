import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Toolbar, IconButton, Button, Avatar, MenuItem, Menu, Drawer, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setAnchorEl(null);
  }, [location]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  
  const handleMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => setAnchorEl(null);

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

  return (
    <AppBar
      position="static"
      className={`navbar ${theme}`}
      sx={{
        backgroundColor: theme === 'dark' ? "#121212" : "#ffffff",
        color: theme === 'dark' ? "#ffffff" : "#000000",
        borderBottom: theme === 'dark' ? "none" : "2px solid #e0e0e0"
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Mobile Menu Button */}
        <IconButton 
          edge="start" 
          color="inherit" 
          aria-label="menu"
          sx={{ display: { md: "none" } }}  
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo */}
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={() => navigate('/')} 
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <img src="polysia.jpeg" alt="Logo" style={{ height: '50px' }} />  
        </IconButton>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button onClick={() => navigate("/")} color="inherit">Home</Button>
          <Button onClick={() => navigate("/about")} color="inherit">About</Button>
          <Button onClick={() => handleNavigation("/blogs")} color="inherit">Blogs</Button>
          <Button onClick={() => navigate("/contact")} color="inherit">Contact</Button>
        </Box>

        {/* Mobile Drawer */}
        <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
          <Box sx={{ width: 250, display: "flex", flexDirection: "column", padding: 2 }}>
            <Button onClick={() => navigate("/")} color="inherit">Home</Button>
            <Button onClick={() => navigate("/about")} color="inherit">About</Button>
            <Button onClick={() => handleNavigation("/blogs")} color="inherit">Blogs</Button>
            <Button onClick={() => navigate("/contact")} color="inherit">Contact</Button>
          </Box>
        </Drawer>
        
        {/* User Profile & Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isLogin && (
            <>
              <IconButton onClick={toggleTheme} color="inherit">
                {theme === 'light' ? <Brightness5Icon /> : <NightsStayIcon />}
              </IconButton>
              <Avatar
                src={user?.profile_image || "/default-avatar.png"}
                alt="Profile"
                onClick={handleMenu}
                sx={{ cursor: 'pointer', width: '40px', height: '40px', marginLeft: 1 }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Profile</MenuItem>
                <MenuItem onClick={() => { handleNavigation('/my-blogs'); handleClose(); }}>My Blogs</MenuItem>
                <MenuItem onClick={() => { handleNavigation('/create-blog'); handleClose(); }}>Create Blog</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
          {!isLogin && (
            <Button onClick={() => navigate("/login")} variant="contained" sx={{ background: '#5e81ac', color: '#ffffff', marginLeft: 2 }}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
