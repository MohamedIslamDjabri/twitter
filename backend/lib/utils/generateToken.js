import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  // Generate a JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d", // Adjust expiration time based on your security policy
  });

  // Set the JWT as an HTTP-only cookie
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Protect against XSS
    sameSite: "strict", // Protect against CSRF
    secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
  });

  // Optionally, return the token in the response (if needed for frontend use)
  return token;
};
