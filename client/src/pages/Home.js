import React, { useState, useEffect } from 'react';
import { styled, Box } from '@mui/system';
import { TextField, Button, Typography } from '@mui/material';
import './HomePage.css';
import axios from 'axios';

const BlogGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const Blogdummy = styled(Box)(({ theme }) => ({
  backgroundColor: '#AFEEEE',
  padding: '15px',
  borderRadius: '10px',
  boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px #ffffff',
  color: '#333333',
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.2), -10px -10px 20px rgba(255, 255, 255, 0.9)',
  },
}));

const blogs = [
  { id: 1, title: "Future Tech Trends", summary: "Exploring the upcoming technologies shaping our future.", image: "/tech1.jpeg" },
  { id: 2, title: "AI and Machine Learning", summary: "How AI is transforming industries and what it means for the future.", image: "/tech2.png" },
  { id: 3, title: "The Rise of Quantum Computing", summary: "Quantum computing and its potential to revolutionize problem-solving.", image: "/tech3.webp" },
  { id: 4, title: "Web Design Principles", summary: "Essential design principles for modern web developers.", image: "/tech4.jpg" },
  { id: 5, title: "UX/UI Best Practices", summary: "Understanding user experience and user interface strategies for success.", image: "/tech5.jpg" },
  { id: 6, title: "Responsive Design Tips", summary: "Techniques to make your website responsive on all devices.", image: "/tech6.jpeg" },
];

const heroImages = [
  '/hero.jpg',
  '/hero1.jpg',
  '/hero2.jpg',
  '/hero3.jpg'
];

const Home = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    },2000);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async () => {
    if (email.trim() === '') {
      setErrorMessage('Please enter a valid email.');
      setSuccessMessage('');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/v1/newsletter/subscribe', { email });
      if (response.data.success) {
        setSuccessMessage('Thank you for subscribing! 🎉');
        setErrorMessage('');
        setEmail('');
      } else {
        throw new Error('Subscription failed.');
      }
    } catch (error) {
      setErrorMessage('Oops! Something went wrong. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <>
      <div
        className="HeroSection"
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
        }}
      >
        <h1>A Blog for Passionate People and Website Lovers</h1>
        <p>Watch creation is an evolutionary recreation just like life. Skills and knowledge are a living state.</p>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-section-content">
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Join Our Newsletter
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Get the latest blog posts and updates delivered to your inbox.
          </Typography>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                width: '100%',
                maxWidth: '400px',
                bgcolor: '#fff',
                borderRadius: '5px',
                '& .MuiInputBase-input': {
                  color: '#333333',
                },
              }}
            />
            <Button className="subscribe-button" onClick={handleSubscribe}>
              Subscribe
            </Button>
          </div>

          {successMessage && (
            <Typography variant="subtitle1" sx={{ mt: 2, color: '#00e676' }}>
              {successMessage}
            </Typography>
          )}

          {errorMessage && (
            <Typography variant="subtitle1" sx={{ mt: 2, color: 'red' }}>
              {errorMessage}
            </Typography>
          )}
        </div>
      </div>

      <BlogGrid>
        {blogs.map((blog) => (
          <Blogdummy key={blog.id}>
            <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h3>{blog.title}</h3>
            <p>{blog.summary}</p>
          </Blogdummy>
        ))}
      </BlogGrid>
    </>
  );
};

export default Home;