const express = require("express");
const {
  getAllBlogsController,
  createBlogController,
  updateBlogController,
  getBlogByIdController,
  deleteBlogController,
  userBlogController,
  getTrendingBlogs,      
  getRecommendedBlogs, 
  getBlogsByCategory
} = require("../controllers/blogController");

const blogController = require("../controllers/blogController");
const router = express.Router();

router.get("/all-blog", getAllBlogsController);

router.post("/create-blog", createBlogController);

router.put("/update-blog/:id", updateBlogController);

router.get("/get-blog/:id", getBlogByIdController);

router.get("/user-drafts/:userId", blogController.getUserDrafts);

router.delete("/delete-blog/:id", deleteBlogController);

router.get('/user-blog/:id',userBlogController);

router.get("/trending", getTrendingBlogs);

router.get("/recommendations/:userId", getRecommendedBlogs);

router.get('/category/:category', blogController.getBlogsByCategory);

module.exports = router;