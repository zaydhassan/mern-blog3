import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, InputLabel, TextField, Typography, Select, MenuItem, styled, useTheme, IconButton } from "@mui/material";
import toast from "react-hot-toast";
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useLocation } from "react-router-dom";

const StyledFormBox = styled(Box)(({ theme }) => ({
  width: "55%",
  border: "none",
  borderRadius: "20px",
  padding: theme.spacing(3),
  margin: `${theme.spacing(-3)} auto`,
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
  const userRole = localStorage.getItem('userRole');
  const id = localStorage.getItem("userId");
  const [inputs, setInputs] = useState({ title: "", description: "", image: "", category: "" });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(true);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  
  const location = useLocation();
  const editingBlog = location.state?.blog || null;
  
  useEffect(() => {
      if (editingBlog) {
          setInputs({
              title: editingBlog.title || "",
              description: editingBlog.description || "",
              image: editingBlog.image || "",
              category: editingBlog.category || "",
              tags: editingBlog.tags ? editingBlog.tags.join(", ") : "",
          });
  
          if (quillInstance.current) {
              quillInstance.current.root.innerHTML = editingBlog.description || "";
          }
      }
  }, [editingBlog]);
  
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (quillInstance.current && transcript) {
      quillInstance.current.root.innerHTML += ` ${transcript}`;
      setInputs((prev) => ({ ...prev, description: quillInstance.current.root.innerHTML }));
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  useEffect(() => {
    if (userRole !== 'Writer') {
      toast.error('Only Writers can create blogs');
      navigate('/');
    }
  }, [navigate, userRole]);

  useEffect(() => {
    if (!quillInstance.current && quillRef.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Write something amazing...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
          ],
        },
      });
  
      quillInstance.current.on('text-change', () => {
        setInputs((prev) => ({
          ...prev,
          description: quillInstance.current.root.innerHTML,
        }));
      });
    }
  }, [])
  
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setUploadedImage(file); 
    }
};

const handleBlogAction = async (status) => {
  const formData = new FormData();
  formData.append("title", inputs.title);
  formData.append("description", inputs.description);
  formData.append("category", inputs.category);
  formData.append("status", status);
  formData.append("user", id);
    
  const formattedTags = inputs.tags ? inputs.tags.split(",").map(tag => tag.trim()) : [];
  formData.append("tags", JSON.stringify(formattedTags)); 
 
  if (uploadedImage) {
    formData.append("image", uploadedImage);
} else if (inputs.image) {
    formData.append("image", inputs.image);
} else {
    toast.error("Please upload an image or provide an image URL.");
    return;
}
    if (!inputs.title || !inputs.description || !inputs.category || (!inputs.image && !uploadedImage)) {
      toast.error("Please provide all required fields, including an image.");
      return;
    }

    try {
      
      const response = await axios.post("/api/v1/blog/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "user-id": localStorage.getItem("userId"), 
        },
      });
      
      if (response.data.success) {
        toast.success(`Blog ${status === 'Published' ? 'published' : 'saved as draft'}`, { icon: '👏' });
        navigate("/my-blogs");
      } else {
        throw new Error(`Failed to ${status.toLowerCase()} blog.`);
      }
    } catch (error) {
      console.error("Failed to create blog:", error);
      toast.error(`Failed to ${status.toLowerCase()} blog: ` + (error.response ? error.response.data.message : "Check the console for more information."));
    }
  };

  return (
    <form style={{
      backgroundImage: "url('./create.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ alignSelf: 'flex-end', padding: theme.spacing(2) }}>
        <Button onClick={() => handleBlogAction('Published')} variant="contained" style={{ marginRight: 15 }}>
          Publish
        </Button>
        <Button onClick={() => handleBlogAction('Draft')} variant="outlined">
          Save Draft
        </Button>
      </div>
      <StyledFormBox
       sx={{ width: { xs: "90%", sm: "75%", md: "55%" } }}>
        <Typography variant="h5" textAlign="center" fontWeight="bold" paddingBottom={0} paddingTop={0} color={theme.palette.text.primary}>
          Create A Blog
        </Typography>
        <InputLabel>Title</InputLabel>
        <TextField name="title"  fullWidth value={inputs.title} onChange={handleChange} variant="outlined" required size="small" />

        <InputLabel>Description</InputLabel>
        <div style={{ marginBottom: '12px', width: '100%' }}>
          <div
            ref={quillRef}
            style={{
              height: 250,
              width: '100%',
              padding: '10px',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <IconButton
            onClick={() => {
              listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true });
            }}
            color={listening ? "secondary" : "primary"}
            style={{ marginLeft: '12px', marginTop: '10px' }}
          >
            {listening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </div>

        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={inputs.category}
          onChange={handleChange}
          fullWidth
          required
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </Select>
        <TextField
  name="tags"
  placeholder="Enter tags separated by commas"
  value={inputs.tags || ''}
  onChange={handleChange}
/>
        <InputLabel>Choose Image Source</InputLabel>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button variant="contained" onClick={() => setUseImageUrl(true)}>Use Image URL</Button>
          <Button variant="contained" onClick={() => setUseImageUrl(false)}>Upload Image</Button>
        </div>
        {useImageUrl ? (
          <TextField name="image" value={inputs.image} onChange={handleChange} variant="outlined" fullWidth size="small" />
        ) : (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        )}
      </StyledFormBox>
    </form>
  );
};

export default CreateBlog;
