const express = require("express");
const {
  getAllUsers,
  registerController,
  loginController,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/all-users", getAllUsers);

router.post("/register", registerController);

router.post("/login", loginController);

router.put('/:userId', updateUser);

module.exports = router;