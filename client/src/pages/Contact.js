import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useTheme } from '@mui/material/styles';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const theme = useTheme();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, "contacts"), {
                name: name,
                email: email,
                message: message,
                timestamp: new Date()
            });
            toast.success('Message sent successfully!');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error sending message: ' + error.message);
        }
    };

    return (
        <Container component="main" maxWidth={false} sx={{
            height: '100vh',
            backgroundImage: 'url(/contactus.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#FFFFFF', 
            backgroundColor: '#121212' 
        }}>
            <Paper elevation={6} sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                maxWidth: 'lg',
                width: '100%',
                height: 'auto',
                backgroundColor: 'rgba(55, 55, 55, 0.6)', 
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF' 
            }}>
                <Box sx={{
                    p: 3,
                    width: { xs: '100%', md: '50%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon><LocationOnIcon sx={{ color: '#FFFFFF' }} /></ListItemIcon>
                            <ListItemText primary="4671 Sugar Camp Road, Owatonna, Minnesota, 55060" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><PhoneIcon sx={{ color: '#FFFFFF' }} /></ListItemIcon>
                            <ListItemText primary="571-457-2321" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><EmailIcon sx={{ color: '#FFFFFF' }} /></ListItemIcon>
                            <ListItemText primary="ntamerrwael@mfono.ga" />
                        </ListItem>
                    </List>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{
                    p: 3,
                    width: { xs: '100%', md: '50%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
                        Send Message
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                           sx={{
    input: {
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000", 
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)", 
      padding: "12px",
      borderRadius: "8px",
    },
    fieldset: {
      borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.3)", 
    },
  }}
  InputLabelProps={{
    style: { 
      color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)", 
      fontWeight: "bold",
    }
  }}
/>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                input: {
                                  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000", 
                                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)", // Light grey in light mode
                                  padding: "12px",
                                  borderRadius: "8px",
                                },
                                fieldset: {
                                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.3)", 
                                },
                              }}
                              InputLabelProps={{
                                style: { 
                                  color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)", 
                                  fontWeight: "bold",
                                }
                              }}
                            />
                        <TextField
                            required
                            fullWidth
                            id="message"
                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                            margin="normal"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            sx={{
                                input: {
                                  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000", 
                                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)", // Light grey in light mode
                                  padding: "12px",
                                  borderRadius: "8px",
                                },
                                fieldset: {
                                  borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.3)", 
                                },
                              }}
                              InputLabelProps={{
                                style: { 
                                  color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)", 
                                  fontWeight: "bold",
                                }
                              }}
                            />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#1a73e8' }} 
                        >
                            Send Message
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
