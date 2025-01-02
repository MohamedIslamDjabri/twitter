import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (err) {
    // Handle specific JWT errors for better feedback
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token Expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    console.error("Error in protectRoute middleware:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
