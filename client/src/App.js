import React, { useEffect } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; 
import Navbar from "./components/Navbar";
import { Routes, Route,Navigate,useLocation } from "react-router-dom";
import Blogs from "./pages/Blogs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from './pages/ForgotPassword';
import UserBlogs from "./pages/UserBlogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import { Toaster } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
import Contact from "./pages/Contact"; 
import About from './pages/About';
import Profile from './pages/Profile';
import AdminPanel from "./admin/AdminPanel";
import Rewards from "./pages/Rewards";
import EditBlog from "./pages/EditBlog";

function AppWrapper() {
  const { theme } = useTheme();
  const themeInstance = createTheme(theme === 'light' ? {
    palette: { mode: 'light', background: { default: "#fff" } }
  } : {
    palette: { mode: 'dark', background: { default: "#121212" } }
  });

  useEffect(() => {
    document.body.style.backgroundColor = themeInstance.palette.background.default;
  }, [themeInstance]);

  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const isAdmin = user?.role === "Admin";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <MuiThemeProvider theme={themeInstance}>
      <CssBaseline />
      {!isAdminRoute && <Navbar />}
      <Toaster />
      <Routes>
      {!isAdmin && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/my-blogs" element={<UserBlogs />} />
            <Route path="/blog-details/:id" element={<BlogDetails />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/category/:category" element={<Blogs />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/edit-blog/:id" element={<EditBlog />} />
          </>
        )}
        
        {isAdmin ? (
          <Route path="/admin/*" element={<AdminPanel />} />
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" />} />
        )}

        <Route path="*" element={<Navigate to={isAdmin ? "/admin" : "/"} />} />
      </Routes>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppWrapper />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
