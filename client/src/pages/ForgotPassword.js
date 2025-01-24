import React, { useState } from 'react';
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      height: '85vh'
    }}>
      <div style={{
        background: 'url("/forgot.jpg") no-repeat center center',
        backgroundSize: 'cover'
      }} />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: '#D9EAFD',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ textAlign: 'center' }}>Reset Password</h1>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <label style={{ marginBottom: '0.5rem', display: 'block', color: '#333' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                  width: '100%'
                }}
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              onClick={handleResetPassword}
              style={{
                backgroundColor: '#0056b3',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                fontSize: '18px'
              }}
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
