const Like = require("../models/likeModel");

const toggleLike = async (req, res) => {
  const { blog_id, user_id } = req.body;

  try {
    const existingLike = await Like.findOne({ blog_id, user_id });

    if (existingLike) {
      
      await Like.findByIdAndDelete(existingLike._id);
      const likeCount = await Like.countDocuments({ blog_id });
      return res.status(200).json({ success: true, liked: false, likeCount });
    } else {
      
      await new Like({ blog_id, user_id }).save();
    }
      const likeCount = await Like.countDocuments({ blog_id });
      return res.status(201).json({ success: true, liked: true, likeCount });
    }
  catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ success: false, message: "Failed to toggle like", error });
  }
};

const getLikesByBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const likes = await Like.find({ blog_id: blogId });
    const likeCount = likes.length;
    res.status(200).send({ success: true, likeCount, likes });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).send({ success: false, message: "Failed to retrieve likes", error });
  }
};

module.exports = { toggleLike, getLikesByBlog };
