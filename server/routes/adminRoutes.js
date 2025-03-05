const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getAllBlogs,
  deleteUser,
  deleteBlog,
  getComments,
  deleteComment,
} = require('../controllers/adminController');

router.get('/users', authenticateUser, isAdmin, getAllUsers);

router.get('/blogs', authenticateUser, isAdmin, getAllBlogs);

router.delete('/users/:id', authenticateUser, isAdmin, deleteUser);

router.delete('/blogs/:id', authenticateUser, isAdmin, deleteBlog);

router.get('/comments', authenticateUser, isAdmin, getComments);

router.delete('/comments/:id', authenticateUser, isAdmin, deleteComment);

module.exports = router;
