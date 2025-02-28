const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  blog_id: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  replies: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    content: { type: String },
    created_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users", default: [] }]
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

module.exports = Comment;
