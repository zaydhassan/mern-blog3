import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Tab, Tabs, TextField, AppBar, Toolbar, Typography, Paper, useTheme, Card, CardMedia, CardContent, CardActions, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import moment from 'moment';

const UserBlogs = () => {
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState('published');
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabChange = (event, newValue) => {
    setFilter(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredBlogs = blogs.filter(blog => {
    return (filter === 'published' ? blog.status === 'Published' : blog.status === 'Draft') &&
           (blog.title.toLowerCase().includes(searchTerm) || blog.description.toLowerCase().includes(searchTerm));
  });

  const getUserBlogs = async () => {
    try {
      const id = localStorage.getItem("userId");
      const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`);
      if (data?.success) {
        setBlogs(data.userBlog.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.background.default, minHeight: '100vh', padding: 3 }}>
      {/* Search Bar */}
      <AppBar position="static" color="default" elevation={1} sx={{ borderRadius: 1 }}>
        <Toolbar>
          <TextField
            variant="outlined"
            placeholder="Search Blogs"
            size="small"
            sx={{
              flex: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              ml: 2, mr: 2,
              fieldset: { border: `1px solid ${theme.palette.divider}` }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            }}
            onChange={handleSearchChange}
          />
        </Toolbar>
      </AppBar>

      <Paper elevation={2} sx={{ flexGrow: 1, marginTop: 2, padding: 1, borderRadius: 1 }}>
        <Tabs
          value={filter}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
        >
          <Tab label="Published" value="published" />
          <Tab label="Drafts" value="draft" />
        </Tabs>

        <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: theme.shadows[3],
                    backgroundColor: theme.palette.background.paper,
                    border: '2px solid transparent',
                    transition: '0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[10],
                      transform: 'scale(1.02)',
                      borderImage: 'linear-gradient(45deg, #FF6B6B, #FFD93D) 1',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={blog.image || "https://via.placeholder.com/180"}
                    alt={blog.title}
                    sx={{
                      transition: '0.3s ease',
                      '&:hover': {
                        filter: 'brightness(85%)',
                      }
                    }}
                  />
                  <CardContent sx={{ padding: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                      {blog.description.substring(0, 100)}...
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      By {blog.user.username} | {moment(blog.created_at).format('MMMM Do YYYY')}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ padding: 2 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => window.location.href = `/blog/${blog._id}`}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        background: 'linear-gradient(to right, #FF6B6B, #FFD93D)',
                        '&:hover': {
                          background: 'linear-gradient(to right, #FFD93D, #FF6B6B)'
                        }
                      }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))
          ) : (
            <Typography textAlign="center" color="textSecondary">No blogs found</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserBlogs;
