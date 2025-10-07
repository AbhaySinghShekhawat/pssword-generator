const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

const auth = async (req, res, next) => {
  try {
    // Accept token from cookie or Authorization header
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ status: 0, message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).send({ status: 0, message: "Not authorized" });

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).send({ status: 0, message: "Not authorized" });
  }
};

module.exports = auth;
