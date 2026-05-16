import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "No token found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = info; // or req.userId = info.id, etc.
    next();
  });
};