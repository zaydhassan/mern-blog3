const mongoose = require("mongoose"); 
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const Reward = require("../models/rewardModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ success: false, message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.status(200).send({
    success: true,
    message: "Image uploaded successfully",
    imageUrl,
  });
};
exports.registerController = async (req,res) =>{
  try {
  const {username,email,password,role,bio,profile_image} = req.body
  if(!username || !email || !password){
    return res.status(400).send({
      success:false,
      message:'Please fill all fields'
    });
  }

  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      await userModel.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting user", error });
    }
  };
  
  const existingUser = await userModel.findOne({email})
  if(existingUser){
    return res.status(409).send({
      success:false,
      message:'user already exists'
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({username,email,password:hashedPassword, role: role || 'Author',bio,profile_image});
  await user.save();
  return res.status(201).send({
    success:true,
    message:'New User Created',
    user: {
      id: user._id,  
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message:'Error In Register callback',
      success:false,
      error
    })
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, bio, profile_image, password } = req.body;

  try {
    const updatedFields = { username, email, bio, profile_image };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    ).select('_id username email bio profile_image'); 

    console.log("Updated User Data:", updatedUser); 

    if (!updatedUser) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    return res.status(200).send({
      success: true,
      message: "User updated successfully",
      user: updatedUser, 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error updating user", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "all users data",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get ALl Users",
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
        message: "Please provide email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "email is not registerd",
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invlid username or password",
      });
    }
    return res.status(200).send({
      success: true,
      message: "login successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Login Callcback",
      error,
    });
  }
};

exports.listRewards = async (req, res) => {
    console.log("Fetching rewards..."); 

    try {
        const rewards = await Reward.find({});
        console.log("Rewards found:", rewards);
        res.json({ success: true, rewards });
    } catch (error) {
        console.error("Error fetching rewards:", error);
        res.status(500).json({ success: false, message: "Failed to list rewards", error });
    }
};

exports.redeemPoints = async (req, res) => {
  const { userId, rewardId } = req.body;

  try {
    console.log("Received request to redeem reward:", { userId, rewardId });

    if (!mongoose.Types.ObjectId.isValid(rewardId)) {
      console.log("Invalid reward ID format:", rewardId);
      return res.status(400).json({ success: false, message: "Invalid reward ID format" });
    }

    const formattedRewardId = new mongoose.Types.ObjectId(rewardId); 
    console.log("Formatted reward ID:", formattedRewardId);

    const reward = await Reward.findById(formattedRewardId);
    console.log("Reward lookup result:", reward);

    if (!reward) {
      return res.status(404).json({ success: false, message: "Reward not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.points < reward.costInPoints) {
      return res.status(400).json({ success: false, message: "Not enough points" });
    }

    user.points -= reward.costInPoints;
    user.redeemedRewards.push({ rewardId: reward._id });

    await user.save();
    res.status(200).json({ success: true, message: "Reward redeemed successfully", pointsLeft: user.points });
  } catch (error) {
    console.error("Error redeeming points:", error);
    res.status(500).json({ success: false, message: "Error redeeming points", error: error.message });
  }
};

const getLevel = (points) => {
  if (points >= 3000) return "Master Storyteller";
  if (points >= 1000) return "Influencer";
  if (points >= 500) return "Engaged Contributor";
  return "Aspiring Wordsmith";
};

const getBadges = (points) => {
  let badges = [];
  if (points >= 500) badges.push("Engaged Reader");
  if (points >= 1000) badges.push("Top Contributor");
  if (points >= 5000) badges.push("Elite Writer");
  return badges;
};

exports.updateUserPoints = async (req, res) => {
  const { userId, activityType } = req.body;

  const pointValues = {
    writer: {
      publishArticle: 50,
      receiveLike: 10,
      receiveComment: 5
    },
    reader: {
      readArticle: 10,
      likeArticle: 5,
      commentArticle: 10,
      shareArticle: 15,
    }
  };

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const pointsEarned = pointValues[user.role.toLowerCase()][activityType] || 0;
    user.points += pointsEarned;
    user.level = getLevel(user.points);
    user.badges = getBadges(user.points);

    await user.save();
    res.json({ success: true, points: user.points, level: user.level, badges: user.badges });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating points", error });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    
    const topWriters = await userModel.find({ role: "Writer", points: { $gt: 0 } }).sort({ points: -1 }).limit(10);
    const topReaders = await userModel.find({ role: "Reader", points: { $gt: 0 } }).sort({ points: -1 }).limit(10);

    console.log("Top Writers Found:", topWriters);
    console.log("Top Readers Found:", topReaders);

    res.json({
      success: true,
      topWriters,
      topReaders,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ success: false, message: "Error fetching leaderboard" });
  }
};

exports.updateLikePoints = async (req, res) => {
  const { userId, liked } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (liked) {
      user.points += 5;  
    } else {
      user.points -= 5; 
      if (user.points < 0) user.points = 0;  
    }

    user.level = getLevel(user.points);
    user.badges = getBadges(user.points);

    await user.save();

    res.json({
      success: true,
      message: `Points updated for ${liked ? "liking" : "unliking"} a blog`,
      points: user.points,
      level: user.level,
      badges: user.badges
    });
  } catch (error) {
    console.error("Error updating like points:", error);
    res.status(500).json({ success: false, message: "Error updating points" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      user: {
        points: user.points,
        level: user.level,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Error fetching user data" });
  }
};