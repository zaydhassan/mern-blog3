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

exports.getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.find({ blog_id: blogId }).populate('user_id', 'username');
    res.status(200).send({ success: true, comments });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to retrieve comments", error });
  }
};
