const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  passwordHash: {
    type: String,
    required: true
  },
  salt: { type: String },
  createdAt: { type: Date, default: Date.now }
},{timestamps:true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;


