const express = require("express");
const { signup, login, logout, getUser, getUserById } = require("../controllers/authController");
const auth = require("../middleware/auth");

const authRouter = new express.Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout); 
authRouter.get("/get-user", auth, getUser);
authRouter.get("/current-user/:id", auth, getUserById); 

module.exports = authRouter;
