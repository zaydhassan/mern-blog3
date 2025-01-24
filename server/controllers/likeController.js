const Like = require("../models/likeModel");

exports.addLike = async (req, res) => {
  const { blog_id, user_id } = req.body;
  try {
    const like = new Like({ blog_id, user_id });
    await like.save();
    res.status(201).send({ success: true, like });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to add like", error });
  }
};

exports.getLikesByBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const likes = await Like.find({ blog_id: blogId });
    res.status(200).send({ success: true, likes });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to retrieve likes", error });
  }
};
