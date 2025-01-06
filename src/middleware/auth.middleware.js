const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.session?.auth_token;
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }
  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
