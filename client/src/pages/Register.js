import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Grid, CssBaseline } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
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
      const { data } = await axios.post("/api/v1/user/register", {
        username: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      if (data.success) {
        toast.success("Sign up successful. Please log in.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Registration failed!");
      console.log(error);
    }
  };

  return (
    <Grid container style={{ height: '85vh' }}>
      <CssBaseline />
      <Grid item xs={6} style={{ backgroundImage: 'url(/signup.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      </Grid>
      <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={2} style={{ padding: 45, width: 450 }}>
          <Typography variant="h5" style={{ color: '#3f51b5', textAlign: 'center', marginBottom: 20 }}>Register</Typography>
          <form style={{ width: '100%', marginTop: 1 }} onSubmit={handleSubmit}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              required
              name="name"
              autoFocus
              value={inputs.name}
              onChange={handleChange}
              variant="outlined"
            />
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
              autoComplete="new-password"
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
              Sign Up
            </Button>
            <Typography style={{ marginTop: 20, textAlign: 'center' }}>
              <a href="/login" style={{ textDecoration: 'none', color: '#3f51b5' }}>
                Already have an account? Sign in
              </a>
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Register;
