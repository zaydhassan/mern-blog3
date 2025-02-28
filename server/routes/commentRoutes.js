const express = require("express");
const commentController = require("../controllers/commentController"); 

const router = express.Router();

router.post("/", commentController.createComment);
router.get("/:blogId", commentController.getCommentsByBlog);
router.put("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);
router.post("/report", commentController.reportComment);
router.get("/reported", commentController.getReportedComments); 
router.post("/reply", commentController.addReply);

module.exports = router;
