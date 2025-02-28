const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getAllBlogs,
  deleteUser,
  deleteBlog,
} = require('../controllers/adminController');

router.get('/users', authenticateUser, isAdmin, getAllUsers);

router.get('/blogs', authenticateUser, isAdmin, getAllBlogs);

router.delete('/users/:id', authenticateUser, isAdmin, deleteUser);

router.delete('/blogs/:id', authenticateUser, isAdmin, deleteBlog);

module.exports = router;
