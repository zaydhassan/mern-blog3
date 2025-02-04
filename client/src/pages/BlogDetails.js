import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge,
  Drawer,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { Favorite, FavoriteBorder, Share, Comment } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import moment from "moment";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);
        if (data.success) {
          setBlog(data.blog);
          setComments(data.blog.comments || []);
          setLiked(data.blog.liked);
          setLikeCount(data.blog.likes?.length || 0);
          setLoading(false);
        }
      } catch (error) {
        toast.error("Failed to fetch blog details.");
      }
    };
    fetchBlogDetails();
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await axios.post(`/api/v1/likes`, { blog_id: id });
      if (data.success) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        toast.success(liked ? "Like removed!" : "Liked!");
      }
    } catch (error) {
      toast.error("Error updating like");
    }
  };

  const handleComment = async () => {
    if (!newComment) {
      toast.error("Please write a comment before posting.");
      return;
    }
    let currentUser = user;
    if (!currentUser) {
      const storedUser = localStorage.getItem('user');
      currentUser = storedUser ? JSON.parse(storedUser) : null;
    }
  
    if (!currentUser || !currentUser.username) {
      toast.error("User data not available.");
      return;
    }
  
    const formattedDate = moment().format("MMM DD");
  
    try {
      const { data, status } = await axios.post(`/api/v1/comments`, {
        content: newComment,
        blog_id: id,
      });
  
      if (status === 201 && data) {
        setComments([
          ...comments,
          {
            text: newComment,
            user: {
              username: currentUser.username,
              avatar: currentUser.profile_image || "",
            },
            date: formattedDate,
          },
        ]);
        setNewComment("");
        toast.success("Comment added!");
      } else {
        toast.error("Unexpected response format.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding comment");
    }
  };
  
  const toggleComments = () => {
    setCommentsOpen((prev) => !prev);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
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
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 40, height: 40 }} src={blog?.user?.profile_image || ""}>
            {blog?.user?.username?.charAt(0)}
          </Avatar>
          <Typography variant="h6">{blog?.user?.username}</Typography>
          <Typography variant="body2" color="gray">
            {new Date(blog?.createdAt).toDateString()}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <IconButton onClick={handleLike}>
            <Badge badgeContent={likeCount} color="primary">
              {liked ? <Favorite color="error" /> : <FavoriteBorder />}
            </Badge>
          </IconButton>
          <IconButton onClick={toggleComments}>
            <Comment />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h4" fontWeight="bold" marginTop={3}>
        {blog?.title}
      </Typography>
      <Typography variant="body1" marginTop={2} color="gray">
        {blog?.description}
      </Typography>

      <Drawer
        anchor="right"
        open={commentsOpen}
        onClose={toggleComments}
        sx={{ width: 400 }}
      >
        <Box
          width={400}
          padding={2}
          display="flex"
          flexDirection="column"
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.5)",
            color: "white",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Comments
          </Typography>
          <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", marginY: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflowY: "auto",
              maxHeight: "60vh",
            }}
          >
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box
                  key={index}
                  padding={2}
                  sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                    color: "white",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={comment.user.avatar}>
                      {comment.user.avatar ? "" : comment.user.username.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.user.username}
                      </Typography>
                      <Typography variant="caption" color="gray">
                        {comment.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {comment.text}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No comments yet.</Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginTop: 2,
              padding: "10px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <TextField
              fullWidth
              label="Leave a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              sx={{
                input: {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ padding: "0 15px", height: "56px" }}
              onClick={handleComment}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default BlogDetails;
