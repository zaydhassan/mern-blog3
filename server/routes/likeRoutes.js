const express = require("express");
const { toggleLike, getLikesByBlog } = require("../controllers/likeController"); // ✅ Correct Import

const router = express.Router();

router.post("/toggle", toggleLike); 
router.get("/:blogId", getLikesByBlog);

module.exports = router;