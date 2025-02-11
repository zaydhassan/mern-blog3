const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/authMiddleware');

const {
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  getAllBlogsController,
  updateBlogController,
  deleteBlogController
} = require('../controllers/blogController');

router.get('/users', isAdmin, getAllUsers);
router.put('/users/:id', isAdmin, updateUser);
router.delete('/users/:id', isAdmin, deleteUser);

router.get('/blogs', isAdmin, getAllBlogsController);
router.put('/blogs/:id', isAdmin, updateBlogController);
router.delete('/blogs/:id', isAdmin, deleteBlogController);

module.exports = router;
