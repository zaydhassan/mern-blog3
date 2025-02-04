import React from "react";
import { Card,CardMedia,Typography, Box,Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ id, title, description, image, username, time }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      transition={{ duration: 0.3 }}
      style={{ margin: "1rem", flex: "1 0 45%" }} // Controls layout to fit 2 cards in a row
    >
      <Card
        sx={{
          width: "100%",
          position: 'relative',
          border: "1px solid #ffffff40", 
        '&:hover': {
          boxShadow: '0px 0px 20px #fff' 
        },
        borderRadius: '10px',
          cursor: "pointer",
          overflow: 'hidden',
          "&:hover .contentOverlay": { 
            opacity: 1, 
            visibility: 'visible'
          },
          "&:hover .image": {
            transform: 'scale(1.1)'
          }
        }}
        onClick={() => navigate(`/blog-details/${id}`)}
      >
        <CardMedia
          component="img"
          className="image"
          image={image}
          alt={title}
          sx={{
            height: 300,
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out'
          }}
        />
        <Box className="contentOverlay" sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.5s ease, visibility 0.5s ease'
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
            {title}
          </Typography>
          <Typography sx={{ mb: 2, px: 2, textAlign: 'center' }}>
            {description.length > 100 ? `${description.substring(0, 100)}...` : description}
          </Typography>
          <Button variant="contained" onClick={(e) => {
            e.stopPropagation(); 
            navigate(`/blog-details/${id}`);
          }}>
            Read More
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
