import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography, Box, Grid, Button, CircularProgress,Avatar,CardMedia
} from '@mui/material';
import BlogCard from '../components/BlogCard'; 

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = ['Technology', 'Education', 'Health', 'Entertainment', 'Food', 'Business', 'Social Media', 'Travel', 'News'];

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
};

useEffect(() => {
const fetchBlogs = async () => {
  setLoading(true);
  try {
    const categoryPath = location.pathname;
    const isCategoryPage = categoryPath.startsWith('/category/');
    const category = isCategoryPage ? categoryPath.split('/').pop() : '';
    const endpoint = isCategoryPage ? `/api/v1/blog/category/${category}` : '/api/v1/blog/all-blog';
    
    const { data } = await axios.get(endpoint);
    if (data.success) {
      const formattedBlogs = data.blogs.map(blog => ({
        ...blog,
        created_at: moment(blog.created_at).format('MMM DD'),
        userAvatar: blog.user.profile_image 
      }));
      setBlogs(formattedBlogs);
    } else {
      setBlogs([]);
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    setBlogs([]);
  } finally {
    setLoading(false);
  }
};

fetchBlogs();
}, [location.pathname]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" marginTop="50px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: 4 }}>
    <style>
      {`
        .neon-effect {
          border: 2.5px solid #000;
          box-shadow: 0 0 5px #9dff00, 0 0 21px #9dff00, 0 0 11px #9dff00, 0 0 0px #9dff00;
        }

        .neon-effect:hover {
          animation: neon 1.8s ease-in-out infinite alternate;
        }

        @keyframes neon {
          from {
            box-shadow: 0 0 5px #9dff00, 0 0 25px #9dff00, 0 0 50px #9dff00, 0 0 200px #9dff00;
          }
          to {
            box-shadow: 0 0 10px #9dff00, 0 0 35px #9dff00, 0 0 70px #9dff00, 0 0 300px #9dff00;
          }
        }
      `}
    </style>
    <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" fontWeight="bold" marginBottom={3} sx={{ color: '#fff' }}>
          {location.pathname.includes('/category/') ? `Blogs in ${location.pathname.split('/').pop()}` : 'Featured This Week'}
          </Typography>
          <Grid container spacing={2}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <BlogCard
                id={blog._id}
                title={blog.title}
                description={blog.description}
                image={blog.image}
                username={blog.user.username}
                time={moment(blog.created_at).format('MMM DD, YYYY')}
                userAvatar={blog.userAvatar}
              />
            </Grid>
          ))}
        </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '30px', color: '#fff' }}>
            Browse Categories
          </Typography>
          <Grid container spacing={2} justifyContent="center">
  {categories.map((category, index) => (
    <Grid item xs={4} key={index} style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="contained"
        className="neon-effect"
        style={{
          borderRadius: '50px',
          minWidth: 'auto',
          padding: '10px 18px',
          textTransform: 'none',
          backgroundColor: '#c9ee82',
          '&:hover': { backgroundColor: '#555' },
          color: '#000',
          fontWeight: 'bold',
          width: '100%',
        }}
        onClick={() => handleCategoryClick(category)}
      >
        {category}
      </Button>
    </Grid>
  ))}
</Grid>

          <Typography variant="h6" fontWeight="bold" marginTop={4} marginBottom={2} sx={{ color: '#fff' }}>
            Trending ↝
          </Typography>
          {blogs.slice(0, 5).map((blog, index) => (
            <Box key={blog._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, cursor: 'pointer', color: '#fff' }} onClick={() => navigate(`/blog-details/${blog._id}`)}>
              <Box sx={{ minWidth: '50px', marginRight: '10px' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  0{index + 1}
                </Typography>
              </Box>
              <Avatar src={blog.userAvatar} sx={{ width: 40, height: 40, marginRight: '10px' }} alt={blog.user.username} />
              <Box flexGrow={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {blog.title}
                </Typography>
                <Typography variant="caption" display="block">
                  {blog.user.username}
                </Typography>
                <Typography variant="caption" color="gray">
                  {moment(blog.created_at).format('MMM DD')}
                </Typography>
              </Box>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 60, marginLeft: 'auto', borderRadius: '5px' }}
                image={blog.image}
                alt={blog.title}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Blogs;