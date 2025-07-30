const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/user"); // Adjust this path as per your project structure

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    const dummyUsers = [
      {
        fullName: "Alice Sharma",
        username: "alice123",
        email: "alice@example.com",
        password: "password123",
        profilePicture: "https://via.placeholder.com/100",
        bio: "Love nature 🌿",
      },
      {
        fullName: "Bob Verma",
        username: "bob_rock",
        email: "bob@example.com",
        password: "password123",
        profilePicture: "https://via.placeholder.com/100",
        bio: "Tech enthusiast 💻",
      },
      {
        fullName: "Charlie Patel",
        username: "charlie.codes",
        email: "charlie@example.com",
        password: "password123",
        profilePicture: "https://via.placeholder.com/100",
        bio: "Coffee + Code ☕",
      },
    ];

    for (const user of dummyUsers) {
      const exists = await User.findOne({ email: user.email });
      if (exists) {
        console.log(`⚠️  Skipping existing user: ${user.username}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({ ...user, password: hashedPassword });
      await newUser.save();
      console.log(`✅ Inserted: ${user.username}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedUsers();
