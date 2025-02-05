const express = require("express");
const { createComment, getCommentsByBlog } = require("../controllers/commentController");
const commentController = require('../controllers/commentController');
const router = express.Router();

router.post("/", createComment);
router.get("/:blogId", getCommentsByBlog);
router.put('/:commentId', commentController.updateComment); 
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
