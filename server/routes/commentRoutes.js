const express = require("express");
const commentController = require("../controllers/commentController"); // ✅ Ensure correct import

const router = express.Router();

router.post("/", commentController.createComment);
router.get("/:blogId", commentController.getCommentsByBlog);
router.put("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);
router.post("/report", commentController.reportComment);
router.get("/reported", commentController.getReportedComments); // ✅ Ensure this function exists

module.exports = router;
