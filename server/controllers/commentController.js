const Comment = require("../models/commentModel");

exports.createComment = async (req, res) => {
  const { content, blog_id, user_id } = req.body;
  try {
    const comment = await new Comment({
      content,
      blog_id,
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    }).save();
    res.status(201).send({ success: true, comment });
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
    const comments = await Comment.find({ blog_id: blogId }).populate('user_id', 'username');
    res.status(200).send({ success: true, comments });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to retrieve comments", error });
  }
};
