import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import moment from 'moment';

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
 
  const getUserBlogs = async () => {
    try {
      const id = localStorage.getItem("userId");
      const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`);
      if (data?.success) {
        setBlogs(data?.userBlog.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, []);
  console.log(blogs);
  return (
    <div>
      {blogs && blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogCard
            id={blog._id}
            isUser={true}
            title={blog?.title}
           description={blog?.description}
           image={blog?.image}
         username={blog?.user?.username}
         time={moment(blog.created_at).format('MMMM Do YYYY, h:mm:ss a')}
          />
        ))
      ) : (
        <h1>You Havent Created a blog</h1>
      )}
    </div>
  );
};

export default UserBlogs;