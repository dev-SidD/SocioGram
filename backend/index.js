const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const cors = require("cors");

// Allow requests from the frontend (http://localhost:3000)
app.use(cors({ origin: "http://localhost:3000" }));

// If you want to allow multiple origins, you can do:
const allowedOrigins = ["http://localhost:3000", "http://another-origin.com"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));


app.use("/api/auth", require("./routes/auth"));
app.use("/api/user",require("./routes/user"))
app.use("/api/posts", require("./routes/post"))

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
