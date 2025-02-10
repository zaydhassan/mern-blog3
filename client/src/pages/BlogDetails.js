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
  CardMedia,
} from "@mui/material";
import { Favorite, FavoriteBorder, Share, Comment, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [editingComment, setEditingComment] = useState({ id: null, text: "" });
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/blog/get-blog/${id}`);
        console.log("Fetched Blog Details:", response.data.blog);  // Debugging log
        if (response.data.success) {
          setBlog(response.data.blog);
        } else {
          toast.error("Failed to fetch blog details.");
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        toast.error("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get("/api/v1/blog/all-blog");
        if (data.success) {
          setRecommendations(data.blogs.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    fetchBlogDetails();
    fetchRecommendations();
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
        user_id: currentUser._id
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

  const handleEdit = (commentId) => {
    if (!commentId) {
      toast.error("Cannot edit comment without an ID.");
      return;
    }
    const commentToEdit = comments.find(comment => comment._id === commentId);
    if (commentToEdit) {
      setEditingComment({ id: commentToEdit._id, text: commentToEdit.text });
    } else {
      toast.error("Comment not found for editing.");
    }
  };
  
  
  const handleEditSave = async (commentId, updatedText) => {
    try {
        const response = await axios.put(`/api/v1/comments/${commentId}`, { content: updatedText });
        if (response.status === 200) {
          
            setComments(comments.map(comment =>
                comment._id === commentId ? { ...comment, content: updatedText } : comment
            ));
            toast.success("Comment updated successfully!");
        }
    } catch (error) {
        console.error("Failed to update comment:", error);
        toast.error("Failed to update comment.");
    }
};

  
const handleDelete = async (commentId) => {
  if (!commentId) {
    toast.error("Cannot delete comment without an ID.");
    return;
  }
  try {
    const response = await axios.delete(`/api/v1/comments/${commentId}`);
    if (response.status === 204) {
        setComments(comments.filter(comment => comment._id !== commentId));
        toast.success("Comment deleted successfully!");
    }
  } catch (error) {
    console.error("Failed to delete comment:", error);
    toast.error("Failed to delete comment.");
  }
};

  const handleReply = async (commentId, replyContent) => {
    if (!replyContent) return toast.error("Reply cannot be empty.");
    try {
      const { data } = await axios.post(`/api/v1/comments/reply`, { parentId: commentId, content: replyContent });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, replies: [...c.replies, data] } : c))
      );
      toast.success("Reply added successfully!");
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      toast.error("Failed to add reply.");
    }
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

<Box display="flex" alignItems="center" gap={2} marginBottom={2}>
<Avatar
  sx={{ width: 56, height: 56 }}
  src={blog?.user?.profile_image || "/default-avatar.png"}
  alt={blog?.user?.username || "User"}
>
  {!blog?.user?.profile_image && blog?.user?.username 
    ? blog?.user?.username.charAt(0).toUpperCase() 
    : ""}
</Avatar>
  <Box>
    <Typography variant="subtitle1" fontWeight="bold">
      {blog?.user?.username || "Unknown User"}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {moment(blog?.created_at).format("MMMM DD, YYYY")}
    </Typography>
  </Box>
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
      

        <Typography variant="h4" fontWeight="bold" marginTop={3}>
        {blog?.title}
      </Typography>
      <Box
        dangerouslySetInnerHTML={{ __html: blog?.description }}
        sx={{ marginTop: 2, color: "gray" }}
      />

      <Typography variant="h5" fontWeight="bold" marginTop={5} marginBottom={3}>
        Recommended for You ↝
      </Typography>

      {recommendations.map((rec, index) => (
        <Box
          key={rec._id}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 3,
            cursor: "pointer",
            color: "#fff",
          }}
          onClick={() => navigate(`/blog-details/${rec._id}`)}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ marginRight: 2 }}>
            0{index + 1}
          </Typography>
          <Avatar
            src={rec.user.profile_image}
            sx={{ width: 40, height: 40, marginRight: 2 }}
            alt={rec.user.username}
          />
          <Box flexGrow={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {rec.title}
            </Typography>
            <Typography variant="caption" display="block">
              {rec.user.username}
            </Typography>
            <Typography variant="caption" color="gray">
              {moment(rec.created_at).format("MMM DD")}
            </Typography>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 60, borderRadius: "10px" }}
            image={rec.image}
            alt={rec.title}
          />
        </Box>
      ))}

      <Drawer anchor="right" open={commentsOpen} onClose={toggleComments} sx={{ width: 400 }}>
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
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
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
                    <Box>
                      
                      <IconButton onClick={() => handleEdit(comment._id)}>
                        <Edit fontSize="small" sx={{ color: "white" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(comment._id)}>
                        <Delete fontSize="small" sx={{ color: "white" }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {editingComment?.id === comment._id ? (
                    <Box display="flex" alignItems="center" gap={1} marginTop={1}>
                      <TextField
                        fullWidth
                        value={editingComment.text}
                        onChange={(e) =>
                          setEditingComment((prev) => ({ ...prev, text: e.target.value }))
                        }
                        size="small"
                        sx={{
                          input: { color: "white" },
                          "& .MuiOutlinedInput-root": {
                            background: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditSave(comment._id, editingComment.text)}
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      {comment.text}
                    </Typography>
                  )}

                  {comment.replies?.map((reply, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        marginLeft: 3,
                        background: "rgba(255, 255, 255, 0.1)",
                        padding: 1,
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {reply.user.username}
                      </Typography>
                      <Typography variant="body2">{reply.content}</Typography>
                    </Box>
                  ))}

                  <Box display="flex" alignItems="center" gap={1} marginTop={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Write a reply..."
                      value={replyText[comment._id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({ ...prev, [comment._id]: e.target.value }))
                      }
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReply(comment._id, replyText[comment._id])}
                    >
                      Reply
                    </Button>
                  </Box>
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