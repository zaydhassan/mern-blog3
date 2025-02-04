import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, InputLabel, TextField, Typography, Select, MenuItem, styled, useTheme } from "@mui/material";
import toast from "react-hot-toast";
import 'quill/dist/quill.snow.css'; 
import Quill from 'quill';

const StyledFormBox = styled(Box)(({ theme }) => ({
  width: "50%", 
  border: "none",
  borderRadius: "20px",
  padding: theme.spacing(3),
  margin: `${theme.spacing(4)} auto ${theme.spacing(1)} auto`,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark' 
    ? `12px 12px 24px #bebebe, -12px -12px 24px #ffffff` 
    : `12px 12px 24px #d9d9d9, -12px -12px 24px #ffffff`, 
  transition: "all 0.3s ease-in-out"
}));

const categories = ['Technology', 'Education', 'Health', 'Entertainment', 'Food', 'Business', 'Social Media', 'Travel', 'News'];

const CreateBlog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");
  const [inputs, setInputs] = useState({ title: "", description: "", image: "", category: ""});
  const [uploadedImage, setUploadedImage] = useState(null); 
  const [useImageUrl, setUseImageUrl] = useState(true); 
  const quillRef = useRef(null);
  const quillEditor = useRef(null);

  useEffect(() => {
    if (!quillEditor.current && quillRef.current) {
      const quill = new Quill(quillRef.current, { theme: 'snow' });
      quillEditor.current = quill;
      quill.on('text-change', () => { setInputs(prevInputs => ({ ...prevInputs, description: quill.root.innerHTML })); });
    }
  }, []);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: inputs.title,
      description: inputs.description,
      image: useImageUrl ? inputs.image : uploadedImage, 
      category: inputs.category,
      user: id,
    };

    try {
      const response = await axios.post("/api/v1/blog/create-blog", payload);
      if (response.data.success) {
        toast.success("Blog Created", { icon: '👏' });
        navigate("/my-blogs");
      } else {
        throw new Error('Failed to create blog due to unknown reason.');
      }
    } catch (error) {
      console.error("Failed to create blog:", error);
      toast.error("Failed to create blog: " + (error.response ? error.response.data.message : "Check the console for more information."));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundImage: "url('./create.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <StyledFormBox>
        <Typography variant="h5" textAlign="center" fontWeight="bold" paddingBottom={0} paddingTop={0} color={theme.palette.text.primary}>
          Create A Blog
        </Typography>
        <InputLabel sx={{ mb: 1, fontSize: "14px", fontWeight: "medium", color: theme.palette.text.primary }}>Title</InputLabel>
        <TextField name="title" value={inputs.title} onChange={handleChange} variant="outlined" required size="small" InputLabelProps={{ style: { color: theme.palette.text.primary } }} inputProps={{ style: { color: theme.palette.text.primary } }} />
        <InputLabel sx={{ mb: 1, fontSize: "14px", fontWeight: "medium", color: theme.palette.text.primary }}>Description</InputLabel>
        <div ref={quillRef} style={{ height: '150px', marginBottom: 1 }} />
        <InputLabel sx={{ mb: 1, fontSize: "14px", fontWeight: "medium", color: theme.palette.text.primary }}>Category</InputLabel>
        <Select
          name="category"
          value={inputs.category}
          onChange={handleChange}
          displayEmpty
          fullWidth
          required
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </Select>
        <InputLabel sx={{ mb: 1, fontSize: "14px", fontWeight: "medium", color: theme.palette.text.primary }}>
          Choose Image Source
        </InputLabel>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button
            variant="contained"
            color={useImageUrl ? "primary" : "default"}
            onClick={() => { setUseImageUrl(true); setUploadedImage(null); }}
          >
            Use Image URL
          </Button>
          <Button
            variant="contained"
            color={!useImageUrl ? "primary" : "default"}
            onClick={() => { setUseImageUrl(false); setInputs(prev => ({ ...prev, image: "" })); }}
          >
            Upload Image
          </Button>
        </div>
        {useImageUrl ? (
          <>
            <InputLabel sx={{ mb: 1, fontSize: "14px", fontWeight: "medium", color: theme.palette.text.primary }}>Image URL</InputLabel>
            <TextField name="image" value={inputs.image} onChange={handleChange} variant="outlined" fullWidth size="small" />
          </>
        ) : (
          <>
            <InputLabel sx={{ mb: 1, fontSize: "14px", fontWeight: "medium", color: theme.palette.text.primary }}>Upload Image</InputLabel>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {uploadedImage && (
  <div style={{ marginTop: 10, textAlign: "center" }}>
    <img
      src={uploadedImage}
      alt="Uploaded Preview"
      style={{
        maxWidth: '100px',
        maxHeight: '100px',
        objectFit: 'cover',
        display: "block",
        border: "1px solid #ccc", 
        borderRadius: "5px", 
      }}
    />
  </div>
)}
          </>
        )}
        <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>
          SUBMIT
        </Button>
      </StyledFormBox>
    </form>
  );
};

export default CreateBlog;