const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: { 
      type: String,
      required: [true, "Description is required"],
    },
   image: {
      type: String,
      required: [true, "Image is required"],
    },
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Archived'], 
      default: 'Draft'
    },
    views: {
      type: Number,
      default: 0
    },
    category: {  
      type: String,
      required: [true, "Category is required"],
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], 
    comments: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, 
      text: String
    }],
    user:{
      type: mongoose.Types.ObjectId,
      ref:'users',
      required:[true,"user id is required"],
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } 
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;