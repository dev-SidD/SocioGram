const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http"); // Needed to create HTTP server
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create server with HTTP for Socket.IO

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Global user/socket map
const onlineUsers = new Map();

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) onlineUsers.delete(userId);
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// Middleware
app.use(express.json());

// CORS settings
const allowedOrigins = ["http://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

// Share io and user map in requests
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/posts", require("./routes/post"));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
