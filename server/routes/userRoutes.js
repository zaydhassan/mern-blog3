const express = require("express");
const multer = require("multer");
const {
  getAllUsers,
  registerController,
  loginController,
  updateUser,
  uploadImage,
} = require("../controllers/userController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/all-users", getAllUsers);

router.post("/register", registerController);

router.post("/login", loginController);

router.put('/:userId', updateUser);

router.post("/upload-image", upload.single("image"), uploadImage);

module.exports = router;