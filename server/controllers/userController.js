const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // Ensure this path is correct and the directory exists
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

exports.registerController = async (req, res) => {
  try {
    const { username, email, password, role, bio, profile_image } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Please fill all fields'
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: 'User already exists'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      role: role || 'Author',
      bio,
      profile_image
    });
    await user.save();
    return res.status(201).send({
      success: true,
      message: 'New User Created',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: 'Error In Register callback',
      success: false,
      error
    });
  }
};

exports.updateProfileImage = upload.single('profileImage'), async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id); // Make sure you have access to req.user.id
    user.profile_image = `/uploads/${req.file.filename}`;
    await user.save();
    res.send({
      success: true,
      message: "Profile image updated successfully",
      profile_image: user.profile_image
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update profile image",
      error
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "All users data",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Users",
      error,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please provide email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image, 
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Login Callback",
      error,
    });
  }
};
