const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Check if the Authorization header contains the token
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token)
    if (!token) {
      console.log("hat")
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data (e.g., id, username) to req.user
    console.log(req.user)
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
module.exports = authMiddleware;
