import React, { useState } from 'react';
import { Grid, Paper, Typography, TextField, Button } from '@mui/material';
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset password link sent to your email.");
    } catch (error) {
      toast.error("Failed to send reset link");
    }
  };

  return (
    <Grid 
      container 
      sx={{ height: "85vh", flexDirection: { xs: "column", sm: "row" } }}
    >
      {/* Image Section (Appears on Top for Mobile) */}
      <Grid 
        item 
        xs={12} sm={6}  
        sx={{ 
          backgroundImage: "url(/forgot.jpg)", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          height: { xs: "250px", sm: "100%" } 
        }} 
      />

      {/* Form Section (Below Image on Mobile) */}
      <Grid 
        item 
        xs={12} sm={6} 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: { xs: 2, sm: 4 } 
        }}
      >
        <Paper sx={{ width: { xs: "90%", sm: "400px" }, padding: 4 }}>
          <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
            Reset Password
          </Typography>
          <TextField 
            fullWidth 
            label="Email Address" 
            variant="outlined" 
            margin="normal" 
            required 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            fullWidth 
            variant="contained" 
            sx={{ mt: 2, py: 1.5, fontSize: "16px", backgroundColor: "#0056b3" }}
            onClick={handleResetPassword}
          >
            Send Reset Link
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
