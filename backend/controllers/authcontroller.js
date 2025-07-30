const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Register a new user
const register = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email or username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      verified: false, // ⛔ not verified yet
      profilePicture:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png?20221210150350"
    });

    await newUser.save();

    const verifyToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyUrl = `http://localhost:3000/verify-email/${verifyToken}`;

    const message = `
Hi ${newUser.fullName},

Please verify your email to activate your Sociogram account:

👉 ${verifyUrl}

This link is valid for 24 hours.

If you did not sign up, just ignore this email.

— The Sociogram Team
    `;

    await sendEmail(email, "Verify Your Sociogram Email", message);

    res.status(200).json({ msg: "Verification email sent. Please check your inbox." });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.verified) return res.status(400).json({ msg: "Email already verified" });

    user.verified = true;
    await user.save();

    res.status(200).json({ msg: "Email verified successfully! You can now log in." });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.verified) {
      return res.status(401).json({ msg: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        savedPosts: user.savedPosts,
        notifications: user.notifications,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found with this email" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const message = `
Hi ${user.fullName},

You requested to reset your password. Click the link below to proceed:

${resetUrl}

This link is valid for 15 minutes.

If you didn't request this, ignore this email.

— The Sociogram Team
    `;

    await sendEmail(user.email, "Reset Your Sociogram Password", message);

    res.status(200).json({ message: "Password reset link sent to your email." });

  } catch (error) {
    console.error("Forgot Password error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  if (!token) return res.status(400).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "Invalid token or user not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });

  } catch (error) {
    console.error("Reset Password error:", error);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword
};
