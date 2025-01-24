const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      required: [true, "role is required"],
      default: 'Author'
    },
    bio: {
      type: String,
      default: ""
    },
    profile_image: {
      type: String,
      default: ""
    },
    blogs: [
      {
        type: mongoose.Types.ObjectId,
        ref:"Blog",
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;