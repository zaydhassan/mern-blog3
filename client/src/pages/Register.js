import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CssBaseline,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    role: "Reader"
  });

  const [showPassword, setShowPassword] = useState(false);

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
      const { data } = await axios.post("/api/v1/user/register", {
        username: inputs.name,
        email: inputs.email,
        password: inputs.password,
        role: inputs.role
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
        xs={6}
        style={{
          backgroundImage: "url(/signup.jpg)",
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, sm: 4 } 
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
            REGISTER
          </Typography>

          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
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
              autoComplete="new-password"
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
             <TextField
              select
              label="Role"
              fullWidth
              required
              name="role"
              value={inputs.role}
              onChange={handleChange}
              variant="outlined"
            >
              <MenuItem value="Reader">Reader</MenuItem>
              <MenuItem value="Writer">Writer</MenuItem>
            </TextField>
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
              Sign Up
            </Button>
            <Typography
              style={{ marginTop: 20, textAlign: "center", color: "#000" }}
            >
              <a
                href="/login"
                style={{
                  textDecoration: "none",
                  color: "#3f51b5",
                  fontWeight: "bold",
                }}
              >
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
