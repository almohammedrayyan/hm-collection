const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Remove 'Bearer ' prefix if it exists
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // Extract actual token
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};
