const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vaultItemSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
  iv: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{timestamps:true}
);

const VaultItem = mongoose.model('VaultItem', vaultItemSchema);

module.exports = VaultItem;


