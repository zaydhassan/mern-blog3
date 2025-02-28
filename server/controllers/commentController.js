const Comment = require("../models/commentModel");

exports.createComment = async (req, res) => {
  const { content, blog_id, user_id,role } = req.body;
  
  if (!["Reader", "Writer"].includes(role)) {
    return res.status(403).json({ success: false, message: "Only Readers and Writers can leave comments." });
  }
  
  try {
    const comment = await new Comment({
      content,
      blog_id,
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    }).save();
    
    const populatedComment = await comment.populate("user_id", "_id username profile_image");
    
    const commentCount = await Comment.countDocuments({ blog_id });
    
    res.status(201).send({
      success: true,
      comment: populatedComment,  // Send the comment with user details
      commentCount
    });
    
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to create comment", error });
  }
};

exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { content, updated_at: new Date() }, { new: true });
    if (!updatedComment) {
      return res.status(404).send({ message: 'Comment not found' });
    }
    res.status(200).send(updatedComment);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update comment', error });
  }
};

exports.addReply = async (req, res) => {
  const { parentId, content, user_id } = req.body;

  if (!parentId || !content || !user_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const comment = await Comment.findById(parentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    const reply = {
      user_id,
      content,
      created_at: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    res.status(201).json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add reply", error });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
      const deletedComment = await Comment.findByIdAndDelete(commentId);
      if (!deletedComment) {
          return res.status(404).send({ message: 'Comment not found' });
      }
      res.status(204).send();
  } catch (error) {
      console.error(`Error deleting comment: ${error}`);
      res.status(500).send({ message: 'Failed to delete comment', error: error.toString() });
  }
};

exports.getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.find({ blog_id: blogId })
    .populate("user_id", "_id username profile_image");
 
    if (!comments) {
      return res.status(404).send({ success: false, message: "No comments found" });
    }

    res.status(200).send({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).send({ success: false, message: "Failed to retrieve comments", error });
  }
};

exports.reportComment = async (req, res) => {
  const { commentId, userId } = req.body;

  if (!commentId || !userId) {
    return res.status(400).json({ success: false, message: "Invalid request: Missing commentId or userId" });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (!comment.reportedBy.includes(userId)) {
      comment.reportedBy.push(userId);
      await comment.save();
      return res.status(200).json({ success: true, message: "Comment reported successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "You have already reported this comment." });
    }
  } catch (error) {
    console.error("Error reporting comment:", error);
    return res.status(500).json({ success: false, message: "Error reporting comment" });
  }
};

exports.getReportedComments = async (req, res) => {
  try {
    const reportedComments = await Comment.find({ reportedBy: { $exists: true, $ne: [] } })
      .populate("user_id", "username")
      .populate("reportedBy", "username"); 

    return res.status(200).json({ success: true, reportedComments });
  } catch (error) {
    console.error("Error fetching reported comments:", error);
    return res.status(500).json({ success: false, message: "Error fetching reported comments" });
  }
};