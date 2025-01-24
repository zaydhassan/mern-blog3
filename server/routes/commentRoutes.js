const express = require("express");
const { createComment, getCommentsByBlog } = require("../controllers/commentController");

const router = express.Router();

router.post("/", createComment);
router.get("/:blogId", getCommentsByBlog);

module.exports = router;
