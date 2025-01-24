const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
