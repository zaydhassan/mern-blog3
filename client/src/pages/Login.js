import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CssBaseline,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import NotificationBanner from "./NotificationBanner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(""); 
  const [showWavingHand, setShowWavingHand] = useState(false); 

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post("/api/v1/user/login", {
            email: inputs.email,
            password: inputs.password,
        });

        if (data.success) {
            localStorage.setItem("userId", data.user._id);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("userRole", data.user.role);

            dispatch(authActions.login(data.user));

            setBannerMessage(`Welcome back, ${data.user.username || "User"}!`);
            setShowWavingHand(true);
            setShowBanner(true);

            setTimeout(() => setShowBanner(false), 5000);

            if (data.user.role === "Admin") {
                setTimeout(() => navigate("/admin"), 3000);
            } else {
                setTimeout(() => navigate("/"), 3000);
            }
        } else {
            console.log("❌ Login failed:", data.message);
            setBannerMessage("Login failed! Please try again.");
            setShowWavingHand(false);
            setShowBanner(true);

            setTimeout(() => setShowBanner(false), 5000);
        }
    } catch (error) {
        console.error("❌ Login failed!", error);
        setBannerMessage("Login failed! Please try again.");
        setShowWavingHand(false);
        setShowBanner(true);

        setTimeout(() => setShowBanner(false), 5000);
    }
};
  return (
    <Grid
      container
      sx={{ height: "100vh", flexDirection: { xs: "column", sm: "row" } }}

      style={{
        backgroundColor: "#f4f4f4", 
      }}
    >
      <CssBaseline />
      <Grid
        item
        xs={12} sm={6} 
        style={{
          backgroundImage: "url(/login.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "250px", sm: "100%" } 
        }}
      ></Grid>
      <Grid
        item
        xs={12} sm={6} 
        style={{
          display: "flex",
          padding: { xs: 2, sm: 4 } ,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: 40,
            width: 450,
            borderRadius: 10,
            backgroundColor: "#fff", 
            color: "#000", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
          }}
        >
          <Typography
            variant="h4"
            style={{ color: "#3f51b5", textAlign: "center", marginBottom: 30 }}
          >
            LOGIN
          </Typography>
          <div>
          {showBanner && (
        <Box sx={{ mb: 2 }}>
          <NotificationBanner message={bannerMessage} showHand={showWavingHand} />
        </Box>
      )}
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              required
              name="email"
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
              variant="outlined"
              style={{
                backgroundColor: "#fff", 
                color: "#000", 
                border: "1px solid #ccc", 
                borderRadius: "5px",
              }}
              InputProps={{
                style: { color: "#000" },  
              }}
              InputLabelProps={{
                style: { color: "#666" }, 
              }}
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              required
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={inputs.password}
              onChange={handleChange}
              variant="outlined"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? (
                        <VisibilityOff style={{ color: "#000" }} />
                      ) : (
                        <Visibility style={{ color: "#000" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: "#000" },  
              }}
              InputLabelProps={{
                style: { color: "#666" },  
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{
                marginTop: 20,
                padding: 10,
                fontSize: 16,
                backgroundColor: "#3f51b5",
                color: "#fff",
                borderRadius: 8,
              }}
            >
              Sign In
            </Button>

            <Link
              to="/forgot-password"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 10,
                color: "#3f51b5",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>

            <Typography
              style={{ marginTop: 20, textAlign: "center", color: "#000" }}
            >
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#3f51b5",
                  fontWeight: "bold",
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Typography>
          </form>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
