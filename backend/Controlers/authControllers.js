const User = require("../models/Use");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    let newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "employee", // Default to 'employee' if role is not specified
    });

    await newUser.save();

    // Create and send token

    res
      .status(201)

      .json({ role: newUser.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid   password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user = user.toObject();
    delete user.password;
    user.token = token;
    return res
    .status(202)
    .cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day expiration
      httpOnly: true, // Restrict access to HTTP(S) requests
      sameSite: "strict",
    })
    .json({ user, role: user.role });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
