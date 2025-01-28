const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
exports.registerController = async (req,res) =>{
  try {
  const {username,email,password,role,bio,profile_image} = req.body
  if(!username || !email || !password){
    return res.status(400).send({
      success:false,
      message:'Please fill all fields'
    });
  }
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
  const { username, email, bio, profile_image } = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { username, email, bio, profile_image },
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