exports.isAdmin = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== 'Admin') {
    return res.status(403).send({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

exports.isWriter = (req, res, next) => {
const userRole = req.user.role;
if (userRole !== 'Writer' && userRole !== 'Admin') {
  return res.status(403).send({ success: false, message: "Access denied. Writers or Admins only." });
}
next();
};

exports.isReader = (req, res, next) => {
  console.log("User data received in isReader middleware:", req.user); // Log user data for debugging

  if (!req.user || req.user.role !== "Reader") {
    console.log("Access denied due to role or missing user:", req.user); // Log the issue
    return res.status(403).json({ success: false, message: "Only readers can perform this action." });
  }

  next();
};