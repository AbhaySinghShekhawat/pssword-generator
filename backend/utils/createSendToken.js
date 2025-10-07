const jwt = require("jsonwebtoken");
require("dotenv").config();

const createSendToken = (user, statusCode, res, generatedPassword = null) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieExpires = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 7;

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + cookieExpires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  user.passwordHash = undefined;

  const response = {
    status: 1,
    token,
    user,
  };

  if (generatedPassword) response.generatedPassword = generatedPassword;

  res.status(statusCode).json(response);
};

module.exports = createSendToken;
