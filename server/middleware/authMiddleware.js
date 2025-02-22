const userModel = require("../models/userModel");

exports.attachUser = async (req, res, next) => {
  try {
    console.log("Received headers:", req.headers); // Debugging log

    const userId = req.headers['user-id']; // Get user ID from headers

    console.log("Extracted User ID:", userId); // Debugging log

    if (!userId) {
      console.log("No user ID provided in request headers.");
      return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    const user = await require("../models/userModel").findById(userId);
    console.log("User found in MongoDB:", user);

    if (!user) {
      console.log("User not found in database:", userId);
      return res.status(404).json({ success: false, message: "User not found." });
    }

    req.user = user;
    console.log("User authenticated:", req.user.username); // Log username for debugging
    next();
  } catch (error) {
    console.error("Error in attachUser middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Middleware to check if user is an Admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized. User not authenticated." });
  }

  if (req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }

  next();
};

// Middleware to check if user is a Writer
exports.isWriter = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized. User not authenticated." });
  }

  if (req.user.role !== 'Writer' && req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: "Access denied. Writers or Admins only." });
  }

  next();
};

// Middleware to check if user is a Reader
exports.isReader = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized. User not authenticated." });
  }

  if (req.user.role !== "Reader" && req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Access denied. Readers only." });
  }

  next();
};
