const express = require("express");
const { authenticateUser,isWriter, isReader} = require("../middleware/authMiddleware");
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

const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/all-blog", getAllBlogsController);

router.post("/create-blog",authenticateUser,isWriter, createBlogController);

router.put("/update-blog/:id",authenticateUser,isWriter, updateBlogController);

router.get("/get-blog/:id",authenticateUser,isReader, getBlogByIdController);

router.get("/user-drafts/:userId",authenticateUser, blogController.getUserDrafts);

router.delete("/delete-blog/:id",authenticateUser,isWriter,deleteBlogController);

router.get('/user-blog/:id',authenticateUser, userBlogController);

router.get("/trending", getTrendingBlogs);

router.get("/recommendations/:userId", authenticateUser,getRecommendedBlogs);

router.get('/category/:category', blogController.getBlogsByCategory);

router.get("/tag/:tagId",  authenticateUser, async (req, res) => {
  try {
    const { tagId } = req.params;
    const blogs = await require("../models/blogModel").find({ tags: tagId }).populate("tags user");

    if (!blogs.length) {
      return res.status(404).json({ success: false, message: "No blogs found for this tag" });
    }

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs by tag:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.toString() });
  }
});

module.exports = router;