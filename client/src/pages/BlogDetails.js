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
import { Favorite, FavoriteBorder, Share, Comment, Edit, Delete,Report } from "@mui/icons-material";
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
  const [reportedComments, setReportedComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {

  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/blog/get-blog/${id}`);
      const likeResponse = await axios.get(`/api/v1/likes/${id}`);
      const commentResponse = await axios.get(`/api/v1/comments/${id}`);

      if (response.data.success) {
        setBlog(response.data.blog);
      } else {
        toast.error("Failed to fetch blog details.");
      }

      if (likeResponse.data.success) {
        const likes = likeResponse.data.likes;
        setLikeCount(likes.length);

        let currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");
        const userLiked = likes.some((like) => like.user_id === currentUser._id);

        setLiked(userLiked); 
      } else {
        setLikeCount(0);
        setLiked(false);
      }
      if (commentResponse.data.success) {
        setComments(commentResponse.data.comments);
        setCommentCount(commentResponse.data.commentCount);
      } else {
        setComments([]);
        setCommentCount(0);
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Failed to fetch blog details.");
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
  }, [id, user]);

  const handleLike = async () => {
    try {
      let currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  
      if (!currentUser || !currentUser._id) {
        toast.error("User not logged in.");
        return;
      }
  
      const { data } = await axios.post(
        `/api/v1/likes/toggle`,
        { blog_id: id, user_id: currentUser._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (data.success) {
        setLiked(data.liked); 
        setLikeCount(data.likeCount); 

        await axios.post("/api/v1/user/update-like-points", { 
          userId: currentUser._id, 
          liked: data.liked
        });
  
        toast(
          data.liked 
            ? "+5 Points! Liked the blog." 
            : "-5 Points! Unliked the blog.",
          { icon: data.liked ? "👍" : "👎" }
        );
      }
        const likeResponse = await axios.get(`/api/v1/likes/${id}`);
        if (likeResponse.data.success) {
          const likes = likeResponse.data.likes;
          setLikeCount(likes.length);
  
          const userLiked = likes.some((like) => like.user_id === currentUser._id);
          setLiked(userLiked);
        }
      
    } catch (error) {
      console.error("Error in handleLike:", error.response || error);
      toast.error("Error updating like");
    }
  };  
  
  const handleComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please write a comment before posting.");
      return;
    }
  
    let currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  
    if (!currentUser || !currentUser._id || !currentUser.role) {
      toast.error("User data not available.");
      return;
    }
  
    if (!["Reader", "Writer"].includes(currentUser.role)) {
      toast.error("Only Readers and Writers can leave comments.");
      return;
    }
  
    try {
      const response = await axios.post(`/api/v1/comments`, {
        content: newComment.trim(),
        blog_id: id,
        user_id: currentUser._id,
        role: currentUser.role
      });
  
      if (response.status === 201) {
        toast.success("Comment added!");
        setNewComment("");

        const commentResponse = await axios.get(`/api/v1/comments/${id}`);
        if (commentResponse.data.success) {
          setComments(commentResponse.data.comments);
          setCommentCount(commentResponse.data.commentCount);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding comment");
    }
  };
  
  const toggleComments = () => {
    setCommentsOpen((prev) => !prev);
  };

  const handleEdit = (commentId) => {
    const commentToEdit = comments.find(comment => comment._id === commentId);
    if (commentToEdit) {
      setEditingComment({ id: commentToEdit._id, text: commentToEdit.content }); // Ensure correct property
    }
  };
  
  const handleEditSave = async (commentId, updatedText) => {
    if (!updatedText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
  
    try {
      const response = await axios.put(`/api/v1/comments/${commentId}`, { content: updatedText });
  
      if (response.status === 200) {
        setComments(comments.map(comment =>
          comment._id === commentId ? { ...comment, content: updatedText } : comment
        ));
        toast.success("Comment updated successfully!");
        setEditingComment({ id: null, text: "" }); 
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("Failed to update comment.");
    }
  };
  
  const handleDelete = async (commentId) => {
    try {
      const response = await axios.delete(`/api/v1/comments/${commentId}`);
  
      if (response.status === 204) {
        setComments(comments.filter(comment => comment._id !== commentId));
        toast.success("Comment deleted successfully!");
        setCommentCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment.");
    }
  };
  
const handleReport = async (commentId, commentUserId) => {
  if (!commentId) {
    toast.error("Cannot report a comment without an ID.");
    return;
  }

  let currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");

  if (!currentUser || !currentUser._id) {
    toast.error("User not logged in.");
    return;
  }

  if (currentUser._id === commentUserId) {
    toast.error("You cannot report your own comment.");
    return;
  }

  try {
    const response = await axios.post(`/api/v1/comments/report`, {
      commentId: commentId, 
      userId: currentUser._id, 
    });

    if (response.data.success) {
      setReportedComments([...reportedComments, commentId]);
      toast.success("Comment reported successfully!");
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Error reporting comment:", error);
    toast.error(error.response?.data?.message || "Error reporting comment");
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);  
    }, 3000);
    return () => clearTimeout(timer); 
  }, []);
  
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ backgroundColor: "#121212" }}
      >
        <Box className="glowing-gradient-spinner"></Box>
        <style>
          {`
            .glowing-gradient-spinner {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              border: 6px solid transparent;
              border-top: 6px solid #ff00ff;
              border-left: 6px solid #00c6ff;
              animation: spin 1.2s linear infinite, glow 1.5s ease-in-out infinite alternate;
            }
  
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
  
            @keyframes glow {
              0% { box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff; }
              100% { box-shadow: 0 0 10px #00c6ff, 0 0 20px #00c6ff, 0 0 40px #00c6ff; }
            }
          `}
        </style>
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
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}
      />

<Box display="flex" alignItems="center" gap={2} marginBottom={2}>
<Avatar src={blog?.user?.profile_image ?? "/default-avatar.png"} />

        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {blog?.user?.username || "Unknown Author"}
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
    <Badge badgeContent={commentCount} color="primary">
      <Comment />
    </Badge>
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
  src={rec.user?.profile_image ?? "/default-avatar.png"}
  sx={{ width: 40, height: 40, marginRight: 2 }}
  alt={rec.user?.username ?? "Unknown"}
/>
          <Box flexGrow={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {rec.title}
            </Typography>
            <Typography variant="caption" display="block">
  {rec.user?.username ?? "Unknown"}
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
                    <Avatar src={comment?.user?.avatar || "/default-avatar.png"}>
                      {comment?.user?.avatar ? "" : comment?.user?.username?.charAt(0) || "U"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment?.user?.username || "Unknown User"}
                      </Typography>
                      <Typography variant="caption" color="gray">
                        {comment?.date || moment().format("MMM DD, YYYY")}
                      </Typography>
                      </Box>
                    </Box>

                    <Box>
  
  {user && comment.user_id && String(user._id) === String(comment.user_id._id) ? (
    <>
      <IconButton onClick={() => handleEdit(comment._id)}>
        <Edit fontSize="small" sx={{ color: "white" }} />
      </IconButton>
      <IconButton onClick={() => handleDelete(comment._id)}>
        <Delete fontSize="small" sx={{ color: "white" }} />
      </IconButton>
    </>
  ) : (
    <>
     
      <IconButton
        onClick={() => handleReport(comment._id, comment.user_id._id)}
        disabled={reportedComments.includes(comment._id)}
      >
        <Report
          fontSize="small"
          sx={{ color: reportedComments.includes(comment._id) ? "gray" : "white" }}
        />
      </IconButton>
    </>
  )}
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
    {comment.content || comment.text || "No content available"}
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
                 {reply?.user?.username || "Anonymous"}
              </Typography>
            <Typography variant="body2">
             {reply?.content || "No content available"}
                 </Typography>
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