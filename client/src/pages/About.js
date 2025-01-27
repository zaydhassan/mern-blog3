import React from "react";
import { Typography, Container, Paper, Grid, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter,faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const AboutPage = () => {
    const theme = useTheme();
    const aboutStyle = {
        padding: "20px",
        marginTop: "-65px",
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212',
        color: theme.palette.mode === 'light' ? '#000' : '#fff',
        textAlign: 'center', 
    };

    return (
        <>
            <style>
                {`
                .icon {
                    color: #fff;
                    font-size: 30px;
                    height: 60px;
                    width: 60px;
                    background: #191717;
                    line-height: 60px;
                    border-radius: 50%;
                    margin: 0 15px;
                    cursor: pointer;
                    transition: 0.5s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }

                .icon::before {
                    position: absolute;
                    content: '';
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                    background: #d35400;
                    transform: scale(0.9);
                    z-index: -1;
                    transition: 0.5s;
                }

                .icon:hover {
                    color: #ff6600;
                    box-shadow: 0 0 25px #ff6600, 0 0 50px #ff6600;
                    text-shadow: 0 0 25px #ff6600, 0 0 50px #ff6600;
                    background-color: #000;
                }

                .icon:hover::before {
                    transform: scale(1.2);
                }
                `}
            </style>
            <Container component="main" maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
                <Paper elevation={6} style={aboutStyle}>
                    <Grid container spacing={15} justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={6}>
                        <img src="/about.jpg" alt="About Us" style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" gutterBottom>About Us</Typography>
                            <Typography variant="body1" paragraph>Welcome to My Blog APP – your ultimate destination for exploring insightful and engaging content across various topics. Our mission is to provide our readers with fresh perspectives and thoughtful analysis on the subjects that matter most.</Typography>
                            <Typography variant="body1" paragraph>Our team comprises experienced writers and industry experts who bring their deep knowledge and unique voices to every piece they write. We believe in the power of information and the impact of sharing knowledge, aiming to enrich our readers' lives with high-quality articles and stories.</Typography>
                            <Typography variant="body1">Thank you for visiting our blog. We hope you find our content enlightening and inspiring!</Typography>
                        </Grid>
                    </Grid>
                    <div style={{ marginTop: 10 }}>
                        <ul style={{ display: 'flex', justifyContent: 'center', padding: '0', margin: '0' }}>
                            <li className="icon"><FontAwesomeIcon icon={faFacebookF} /></li>
                            <li className="icon"><FontAwesomeIcon icon={faInstagram} /></li>
                            <li className="icon"><FontAwesomeIcon icon={faTwitter} /></li>
                            <li className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></li>
                        </ul>
                    </div>
                </Paper>
            </Container>
        </>
    );
};

export default AboutPage;
