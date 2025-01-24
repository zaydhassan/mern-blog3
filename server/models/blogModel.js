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
    user:{
      type: mongoose.Types.ObjectId,
      ref:'User',
      require:[true,"user id is required"],
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } 
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
