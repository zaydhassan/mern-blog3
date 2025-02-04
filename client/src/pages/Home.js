import React from 'react';
import { styled, Box } from '@mui/system';
import './HomePage.css';
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

const Home = () => {
  return (
    <>
      <div className="HeroSection" style={{ backgroundImage: 'url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff' }}>
      <h1>A Blog for Passionate People and Website Lovers</h1>
      <p>Watch creation is an evolutionary recreation just like life. Skills and knowledge are a living state.</p>
    </div>
      <BlogGrid>
        {blogs.map(blog => (
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
