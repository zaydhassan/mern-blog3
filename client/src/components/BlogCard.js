import React from "react";
import { Card, CardMedia, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import moment from 'moment';

const BlogCard = ({ id, title, description, image, username, time }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      style={{
        margin: "1rem",
      }}
    >
      <Card
        sx={{
          position: 'relative',
          width: "100%",
          overflow: 'hidden',
          borderRadius: '15px',
          background: "linear-gradient(135deg, #1f1f1f, #292929)",
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 20px 50px rgba(0, 255, 0, 0.5)",
          },
        }}
        onClick={() => navigate(`/blog-details/${id}`)}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            height: 250,
            objectFit: 'cover',
            transition: 'transform 0.5s ease-in-out',
            "&:hover": {
              transform: 'scale(1.1)',
            },
          }}
        />

        <Box
          sx={{
            padding: 3,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9))',
            color: 'white',
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
            {title}
          </Typography>
          <Typography sx={{ mb: 2, px: 2, textAlign: 'center' }}>
            {description.length > 100 ? `${description.substring(0, 100)}...` : description}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#9dff00" }}>
              By {username}
            </Typography>
            <Typography variant="body2" sx={{ color: "#7FFF00" }}>
         {moment(time).isValid() ? moment(time).format('MMM DD') : 'Invalid Date'}
        </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#32CD32',
              color: '#000',
              borderRadius: '20px',
              padding: '5px 15px',
              mt: 2,
              "&:hover": {
                backgroundColor: '#7FFF00',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blog-details/${id}`);
            }}
          >
            Read More
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
