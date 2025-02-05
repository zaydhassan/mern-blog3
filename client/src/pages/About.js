import React from "react";
import { Typography, Container, Grid, Box, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

const AboutPage = () => {
  const theme = useTheme();

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

      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          padding: '60px 0',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Animated Image Section */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src="/about.jpg"
                  alt="About Us"
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  About Us
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                  Welcome to <b>My Blog APP</b> – your ultimate destination for exploring insightful and engaging content across various topics. Our mission is to provide our readers with fresh perspectives and thoughtful analysis on the subjects that matter most.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                  Our team comprises experienced writers and industry experts who bring their deep knowledge and unique voices to every piece they write. We believe in the power of information and the impact of sharing knowledge, aiming to enrich our readers' lives with high-quality articles and stories.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                  Thank you for visiting our blog. We hope you find our content enlightening and inspiring!
                </Typography>
              </motion.div>
            </Grid>
          </Grid>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 20 }}
          >
            <div className="icon"><FontAwesomeIcon icon={faFacebookF} /></div>
            <div className="icon"><FontAwesomeIcon icon={faInstagram} /></div>
            <div className="icon"><FontAwesomeIcon icon={faTwitter} /></div>
            <div className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></div>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
