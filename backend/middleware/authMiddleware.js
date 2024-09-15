const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isAuthenticated = async (req, res, next) => {
  console.log(req.cookies.Token);

  const token = req.cookies.Token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token found in request body." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

exports.user = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};