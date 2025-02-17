import React from "react";
import { Typography, Container, Grid, Box, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons"; 
import { motion } from 'framer-motion';

const AboutPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <>
      <style>
        {`
          .icon {
            color: ${isDarkMode ? '#fff' : '#191717'};
            font-size: 30px;
            height: 60px;
            width: 60px;
            background: ${theme.palette.background.paper};
            line-height: 60px;
            border-radius: 50%;
            margin: 0 15px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            box-shadow: 8px 8px 15px #babecc, -8px -8px 15px #ffffff;
            transition: 0.4s;
          }

          .icon:hover {
            color: #ff6600;
            background: ${theme.palette.background.default};
            box-shadow: inset 8px 8px 15px #babecc, inset -8px -8px 15px #ffffff;
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
            <a href="https://polysia.github.io/Main-Website/" target="_blank" className="icon">
              <FontAwesomeIcon icon={faGlobe} />
            </a>
            <a href="https://www.youtube.com/@PolysiaTech" target="_blank" className="icon">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="https://www.linkedin.com/in/polysia-tech/" target="_blank" className="icon">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a href="https://www.instagram.com/polysiatech/" target="_blank" className="icon">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;