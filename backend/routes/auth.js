const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require("../controllers/authcontroller");

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// ✅ Add these for password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
