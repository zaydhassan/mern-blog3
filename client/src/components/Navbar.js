import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux"; // Removed useDispatch
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import toast from "react-hot-toast";
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';
import { authActions } from "../redux/store";

const Header = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.isLogin);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
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
      <AppBar position="static" className={`navbar ${theme}`}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          My Blog APP
        </Typography>
        <div style={{ flexGrow: 1, justifyContent: 'center', display: 'flex' }}>
          <Button onClick={() => navigate("/")} color="inherit">Home</Button>
          <Button onClick={() => navigate("/about")} color="inherit">About</Button>
          <Button onClick={() => handleNavigation("/blogs")} color="inherit">Blogs</Button>
          {isLogin ? (
            <>
              <Button onClick={() => navigate("/my-blogs")} color="inherit">My Blogs</Button>
              <Button onClick={() => navigate("/create-blog")} color="inherit">Create Blog</Button>
            </>
          ) : null}
          <Button onClick={() => handleNavigation("/contact")} color="inherit">Contact</Button>
        </div>
        <div>
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

export default Header;