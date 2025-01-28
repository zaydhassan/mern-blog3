import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Paper, Typography, TextField, Button, Grid, CssBaseline } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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
        dispatch(authActions.login(data.user));
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Login failed!");
      console.log(error);
    }
  };

  return (
    <Grid container style={{ height: '82vh' }}>
      <CssBaseline />
      <Grid item xs={6} style={{ backgroundImage: 'url(/login.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={2} style={{ padding: 40, width: 450 }}>
          <Typography variant="h4" style={{ color: '#3f51b5', textAlign: 'center', marginBottom: 30 }}>LOGIN</Typography>
          <form style={{ width: '100%', marginTop: 1 }} onSubmit={handleSubmit}>
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
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              required
              name="password"
              type="password"
              autoComplete="current-password"
              value={inputs.password}
              onChange={handleChange}
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Sign In
            </Button>
            <Link to="/forgot-password" className="text-center text-blue-600 hover:underline mt-2">
          Forgot Password?
           </Link>
            <Typography style={{ marginTop: 20, textAlign: 'center' }}>
              <Link to="/register" style={{ textDecoration: 'none', color: '#3f51b5' }}>
                Don't have an account? Sign Up
              </Link>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
