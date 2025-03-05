import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel } from "@mui/material";
import toast from "react-hot-toast";

const categories = ["Technology", "Education", "Health", "Entertainment", "Food", "Business", "Social Media", "Travel", "News"];

const EditBlog = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ title: "", description: "", category: "", image: "", tags: [] });
    const [uploadedImage, setUploadedImage] = useState(null);
    
    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`/api/v1/blog/get-blog/${id}`);
                if (response.data.success) {
                    const { title, description, category, image, tags } = response.data.blog;
                    const tagNames = tags.map(tag => (tag.tag_name ? tag.tag_name : tag));

                    const strippedDescription = description.replace(/<\/?[^>]+(>|$)/g, "");
                    setInputs({ title, description: strippedDescription, category, image, tags: tagNames });
                } else {
                    toast.error("Failed to load blog details");
                    navigate("/my-blogs");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
                toast.error("Error fetching blog details");
            }
        };
        fetchBlogDetails();
    }, [id, navigate]);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedImage(file);
        }
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("title", inputs.title);
        formData.append("description", inputs.description);
        formData.append("category", inputs.category);
        formData.append("tags", JSON.stringify(inputs.tags));

        if (uploadedImage) {
            formData.append("image", uploadedImage);
        } else {
            formData.append("image", inputs.image);
        }

        try {
            const response = await axios.put(`/api/v1/blog/update-blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "user-id": localStorage.getItem("userId"),
                },
            });

            if (response.data.success) {
                toast.success("Blog updated successfully!");
                navigate("/my-blogs");
                window.location.reload();  
                
            } else {
                throw new Error("Failed to update blog");
            }
        } catch (error) {
            console.error("Error updating blog:", error);
            toast.error("Failed to update blog");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
            <Typography variant="h4" textAlign="center">Edit Blog</Typography>
            <InputLabel>Title</InputLabel>
            <TextField name="title" value={inputs.title} onChange={handleChange} fullWidth margin="normal" />

            <InputLabel>Description</InputLabel>
            <TextField 
    name="description"
    value={inputs.description} 
    onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
    fullWidth 
    multiline 
    rows={5} 
    margin="normal" 
/>

            <InputLabel>Category</InputLabel>
            <Select name="category" value={inputs.category} onChange={handleChange} fullWidth margin="normal">
                {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
            </Select>

            <InputLabel>Tags (comma-separated)</InputLabel>
            <TextField 
    name="tags"
    value={inputs.tags.join(", ")} 
    onChange={(e) => {
        setInputs({ 
            ...inputs, 
            tags: e.target.value.split(",").map(tag => tag.trim()) 
        });
    }} 
    fullWidth 
    margin="normal" 
/>

            <InputLabel>Image</InputLabel>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Typography variant="body2" sx={{ mt: 1 }}>Current: {inputs.image}</Typography>

            <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mt: 2, width: "100%" }}>
                Update Blog
            </Button>
        </Box>
    );
};

export default EditBlog;