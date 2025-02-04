import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { Favorite, FavoriteBorder, Share, Comment, Close } from "@mui/icons-material";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);
        if (data?.success) {
          setBlog(data?.blog);
          setComments(data?.blog?.comments || []);
          setLiked(data?.blog?.liked);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    setTimeout(() => {
      fetchBlogDetails();
      setRecommendedBlogs([
        {
          _id: "1",
          title: "How AI is Changing the World",
          image: "https://source.unsplash.com/400x250/?ai,technology",
        },
        {
          _id: "2",
          title: "10 Tips to Improve Your Coding Skills",
          image: "https://source.unsplash.com/400x250/?coding,development",
        },
      ]);
    }, 2000);
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await axios.post(`/api/v1/blog/like/${id}`);
      if (data?.success) {
        setLiked(!liked);
        toast.success(liked ? "Like removed!" : "Liked!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!newComment) return;
    try {
      const { data } = await axios.post(`/api/v1/blog/comment/${id}`, { comment: newComment });
      if (data?.success) {
        setComments([...comments, { text: newComment }]);
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Box
        sx={{
          width: "100%",
          height: "400px",
          backgroundImage: `url(${blog?.image || "https://source.unsplash.com/800x400/?blog"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 40, height: 40 }}>{blog?.user?.username?.charAt(0)}</Avatar>
          <Typography variant="h6">{blog?.user?.username}</Typography>
          <Typography variant="body2" color="gray">
            {new Date(blog?.createdAt).toDateString()}
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <IconButton onClick={handleLike}>{liked ? <Favorite color="error" /> : <FavoriteBorder />}</IconButton>
          <IconButton onClick={() => setCommentsOpen(true)}>
            <Comment />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h4" fontWeight="bold" marginTop={3}>{blog?.title}</Typography>
      <Typography variant="body1" marginTop={2} color="gray">{blog?.description}</Typography>

      <Box display="flex" gap={2} marginTop={3}>
        {recommendedBlogs.map((recBlog) => (
          <Box key={recBlog._id} onClick={() => navigate(`/blog-details/${recBlog._id}`)} sx={{ cursor: "pointer", textAlign: "center" }}>
            <img src={recBlog.image} alt={recBlog.title} width="150" height="100" style={{ borderRadius: "10px" }} />
            <Typography variant="subtitle2" marginTop={1}>{recBlog.title}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BlogDetails;
