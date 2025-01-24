const express = require("express");
const { addLike, getLikesByBlog } = require("../controllers/likeController");

const router = express.Router();

router.post("/", addLike);
router.get("/:blogId", getLikesByBlog);

module.exports = router;
