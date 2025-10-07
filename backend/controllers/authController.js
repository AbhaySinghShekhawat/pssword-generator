const bcrypt = require("bcrypt");
const User = require("../model/UserModel");
const generatePassword = require("../utils/passwordGen");
const createSendToken = require("../utils/createSendToken");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({
        status: 0,
        message: "User already exists",
      })
    }

    let pwd = password || generatePassword();
    const hash = await bcrypt.hash(pwd, 12);
    const salt = require("crypto").randomBytes(16).toString("hex");

    const user = await User.create({ email, passwordHash: hash, salt });

    createSendToken(user, 201, res, !password ? pwd : null);
  } catch (err) {
    console.error(err);
    res.send({
       status: 0,
      message: "Server error",
    })
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.send({
        status: 0,
        message: "Please provide email and password",
      })

    const user = await User.findOne({ email });
    if (!user)
      return res.send({
        status: 0,
        message: "Invalid credentials",
      })

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.send({
        status: 0,
        message: "Invalid credentials",
      })

    createSendToken(user, 200, res);
  } catch (err) {
    console.error(err);
    res.send({
      status: 0,
      message: "Server error",
    })
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.send({
    status: 1,
    message: "Logged out successfully",
  })
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.send({    
      status: 1,
      message:"All User",
      user,
    })
  } catch (err) {
    console.error(err);
    res.send({
    status: 0, 
    message: "Server error" 
    })
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.send({
status: 0,
 message: "User not found"
    })
    res.send({
      status: 1,
      message: "User found",
      user,
    })
  } catch (err) {
    console.error(err);
    res.send({ status: 0, message: "Server error" });
  
  }
};
