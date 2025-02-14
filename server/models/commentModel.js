const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  blog_id: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }] // ✅ Store users who reported this comment
});

module.exports = mongoose.model("Comment", CommentSchema);
