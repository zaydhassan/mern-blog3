import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,InputAdornment, TextField,Box, Grid, Button, CircularProgress,Avatar,CardMedia
} from '@mui/material';
import BlogCard from '../components/BlogCard'; 
import SearchIcon from '@mui/icons-material/Search';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

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
      setFilteredBlogs(formattedBlogs);
    } else {
      setBlogs([]);
      setFilteredBlogs([]);
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    setBlogs([]);
    setFilteredBlogs([]);
  } finally {
    setLoading(false);
  }
};

fetchBlogs();
}, [location.pathname]);

useEffect(() => {
  const filtered = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  setFilteredBlogs(filtered);
}, [searchQuery, blogs]);

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
      border: 2px solid #000;
      border-radius: 50px;
       background-color:#B2FFFF;
      color: #000;
      transition: box-shadow 0.3s ease, background-color 0.3s ease;
    }

    .neon-effect:hover {
      background-color: #4bff00;
      box-shadow: 0 0 25px #9dff00, 0 0 50px #9dff00, 0 0 100px #9dff00, 0 0 250px rgba(0, 0, 0, 0.8);
    }
          .custom-search-box {
            width: 310px;
            padding: 5px 20px;
            background-color: #fff;
            border-radius: 50px;
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            position: relative;
            background-image: linear-gradient(120deg, #fbc2eb, #a6c1ee);
          }

          .custom-search-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50px;
            padding: 2px;
            background: linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
          }

          input {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: #333;
            font-size: 1rem;
          }
        `}
      </style>

       <Box display="flex" justifyContent="center" marginBottom={4}>
        <Box className="custom-search-box">
        <TextField
        placeholder="Search blogs..."
         variant="standard"
          fullWidth
        InputProps={{
           startAdornment: (
           <InputAdornment position="start">
           <SearchIcon style={{ color: "#333" }} /> 
          </InputAdornment>
          ),
    disableUnderline: true,
    sx: {
      "&::placeholder": {
        color: "#fff !important", 
        opacity: 1,
      },
      color: "#000", 

    },
  }}
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
        </Box>
      </Box>

    <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" fontWeight="bold" marginBottom={3} sx={{ color: '#fff' }}>
          {location.pathname.includes('/category/') ? `Blogs in ${location.pathname.split('/').pop()}` : 'Featured This Week'}
          </Typography>
          <Grid container spacing={2}>
          {filteredBlogs.map((blog, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <BlogCard
                id={blog._id}
                title={blog.title}
                description={blog.description}
                image={blog.image}
                username={blog.user.username}
                time={moment(blog.created_at).format('MMM DD, YYYY')}
                userAvatar={blog.userAvatar}
                tags={blog.tags ? blog.tags.map(tag => tag.tag_name).join(", ") : "No tags available"} 
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
  {categories.map((category, index) => {
    const isActive = location.pathname.includes(`/category/${category}`);
    return (
      <Grid item xs={4} key={index} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          className={`neon-effect ${isActive ? 'active-category' : ''}`}
          style={{
            borderRadius: '50px',
            minWidth: 'auto',
            padding: '10px 18px',
            textTransform: 'none',
            fontWeight: 'bold',
            width: '100%',
            backgroundColor: isActive ? '#4bff00' : '#B2FFFF',  
            color: isActive ? '' : '#000',
            boxShadow: isActive
            ? '0 0 5px #9dff00, 0 0 20px #9dff00, 0 0 20px #9dff00'
            : 'none',  
          border: isActive ? '2px solid #9dff00' : '2px solid transparent'
        }}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      </Grid>
    );
  })}
</Grid>

          <Typography variant="h6" fontWeight="bold" marginTop={4} marginBottom={2} sx={{ color: '#fff' }}>
            Trending ↝
          </Typography>
          {blogs.slice(0, 5).map((blog, index) => (
            <Box key={blog._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, cursor: 'pointer', color: '#fff' }} onClick={() => navigate(`/blog-details/${blog._id}`)}>
              <Box sx={{ minWidth: '50px', marginRight: '10px' }}>
                <Typography variant="h4" fontWeight="bold" color="">
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