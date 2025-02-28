const User = require("../models/userModel");

exports.authenticateUser = async (req, res, next) => {
    console.log("🔍 Received Headers in authenticateUser:", req.headers);

    const userId = req.headers["user-id"];
    if (!userId) {
        console.error("❌ No user ID found in headers!");
        return res.status(401).json({ success: false, message: "No user ID provided." });
    }

    try {
        console.log("🔍 Looking up user in MongoDB for ID:", userId);
        const user = await User.findById(userId);

        if (!user) {
            console.error(`❌ User not found for ID: ${userId}`);
            return res.status(401).json({ success: false, message: "User not found in database." });
        }

        console.log("✅ User authenticated:", user.username);
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Authentication error:", error);
        return res.status(500).json({ success: false, message: "Server error during authentication.", error: error.toString() });
    }
};

// ✅ Middleware to Check Admin Role
exports.isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.log("❌ Admin check failed. User not authenticated:", req.user);
    return res.status(401).json({ success: false, message: "User not authenticated." });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Middleware to Check Writer Role
exports.isWriter = (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.log("❌ Writer check failed. User not authenticated:", req.user);
    return res.status(401).json({ success: false, message: "User not authenticated." });
  }

  if (req.user.role !== "Writer" && req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Access denied. Writers or Admins only." });
  }
  next();
};

exports.isReader = (req, res, next) => {
  console.log("🔍 User data received in isReader middleware:", req.user);

  if (!req.user || !req.user.role) {
    console.log("❌ Access denied due to missing user or role:", req.user);
    return res.status(401).json({ success: false, message: "User not authenticated." });
  }

  if (req.user.role !== "Reader" && req.user.role !== "Writer" && req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Access denied. Only Readers, Writers, or Admins allowed." });
  }

  next();
};
