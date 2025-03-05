import React from "react";
import { Card, CardMedia, Typography, Box, Button, Chip, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import moment from "moment";
import { useTheme } from "@mui/material/styles";

const BlogCard = ({ id, title, description, image, username, profileImage, time, tags }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  
  const stripHtmlTags = (html) => {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      style={{ margin: "1rem" }}
    >
      <Card
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          borderRadius: "15px",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1f1f1f, #292929)"
            : "linear-gradient(135deg, #f9f9f9, #ffffff)",
          boxShadow: theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0, 0, 0, 0.5)"
            : "0 10px 30px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          "&:hover": {
            boxShadow: theme.palette.mode === "dark"
              ? "0 20px 50px rgba(0, 255, 0, 0.5)"
              : "0 20px 50px rgba(0, 0, 0, 0.1)",
          },
        }}
        onClick={() => navigate(`/blog-details/${id}`)}
      >
        {/* Blog Image */}
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            height: 250,
            objectFit: "cover",
            borderBottom: `1.5px solid ${theme.palette.mode === "dark" ? "#444" : "#ccc"}`,
            boxShadow: theme.palette.mode === "dark"
            ? "0px 5px 10px rgba(0, 255, 0, 0.5)" 
            : "0px 5px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.5s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />

        {/* Blog Details */}
        <Box sx={{ padding: 3, background: theme.palette.mode === "dark" ? "#181818" : "#fff" }}>
          {/* Title */}
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ textAlign: "center", mb: 1, color: theme.palette.mode === "dark" ? "#fff" : "#111" }}
          >
            {title.replace(/<\/?[^>]+(>|$)/g, "")} {/* Removes unwanted HTML tags */}
          </Typography>
          
         <Typography sx={{ color: theme.palette.mode === "dark" ? "#ddd" : "#333", textAlign: "center" }}>
  {stripHtmlTags(description).length > 120 ? `${stripHtmlTags(description).substring(0, 120)}...` : stripHtmlTags(description)}
</Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar 
  src={profileImage && profileImage.startsWith("http") ? profileImage : "/default-avatar.png"}
  onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
  sx={{ width: 35, height: 35 }}
/>
              <Typography 
                variant="body2" 
                sx={{ color: theme.palette.mode === "dark" ? "#7FFFD4" : "#007BFF", fontWeight: "bold" }}
              >
                {username || "Unknown"}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#aaa" : "#555" }}>
  {moment(time).isValid() ? moment(time).format("MMM DD") : "Invalid Date"}
</Typography>

          </Box>

          {tags && tags.length > 0 ? (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 1 }}>
    {tags.map((tag, index) => (
      tag ? (
        <Chip
          key={index}
          label={tag} 
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#7FFFD4" : "#007BFF",
            color: "#000",
            fontWeight: "bold",
            fontSize: "12px",
            padding: "5px",
          }}
        />
      ) : null
    ))}
  </Box>
) : (
  <Typography sx={{ textAlign: "center", fontSize: "12px", color: "#999" }}>
    No tags available
  </Typography>
)}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#7FFF00",
                color: "#000",
                borderRadius: "20px",
                padding: "5px 15px",
                "&:hover": { backgroundColor: "#7FFF00" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/blog-details/${id}`);
              }}
            >
              Read More
            </Button>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
