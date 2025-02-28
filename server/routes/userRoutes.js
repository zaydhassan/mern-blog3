const express = require("express");
const multer = require("multer");
const {
  getAllUsers,
  registerController,
  loginController,
  updateUser,
  uploadImage,
  updateUserPoints,
  getLeaderboard,
  updateLikePoints,
  getUserProfile,
  redeemPoints,
  listRewards
} = require("../controllers/userController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/all-users", getAllUsers);

router.post("/register", registerController);

router.post("/login", loginController);

router.put('/:userId', updateUser);

router.post("/upload-image", upload.single("image"), uploadImage);

router.post("/update-points", updateUserPoints);
router.get("/leaderboard", getLeaderboard);
router.post("/update-like-points", updateLikePoints);
router.get("/rewards", listRewards);
router.post("/rewards/redeem", redeemPoints);
router.get("/:id", getUserProfile);

module.exports = router;