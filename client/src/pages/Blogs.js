import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBlogs = async () => {
    try {
      const { data } = await axios.get("/api/v1/blog/all-blog");
      if (data?.success) {
        const formattedBlogs = data.blogs.map(blog => ({
          ...blog,
          created_at: moment(blog.created_at).format('MMMM Do YYYY, h:mm:ss a')
        }));
        setTimeout(() => {
          setBlogs(formattedBlogs);
          setLoading(false);
        }, 2000); 
      }
    } catch (error) {
      console.log(error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress /> 
      </div>
    );
  }

  return (
    <div>
      {blogs && blogs.map(blog => (
        <BlogCard
        id={blog?._id}
        isUser={localStorage.getItem("userId") === blog?.user?._id}
        title={blog?.title}
        description={blog?.description}
        image={blog?.image}
        username={blog?.user?.username}
        time={blog.createdAt}
        />
      ))}
    </div>
  );
};

export default Blogs;
