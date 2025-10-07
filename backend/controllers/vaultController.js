const VaultItem = require("../model/VaultItem");

exports.getVaultItems = async (req, res) => {
  try {
    const items = await VaultItem.find({ owner: req.user._id });
    res.send({ status: 1,message: "All items", items });
  } catch (err) {
    console.error(err);
    res.send({ status: 0, message: "Server error" });
  }
};

exports.getVaultItemById = async (req, res) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.send({ status: 0, message: "Item not found" });
    res.send({ status: 1, item });
  } catch (err) {
    console.error(err);
    res.send({ status: 0, message: "Server error" });
  }
};

exports.createVaultItem = async (req, res) => {
  try {
    const { title, username, password, url, notes } = req.body;
    const item = await VaultItem.create({
      owner: req.user._id,
      title,
      username,
      password,
      url,
      notes,
    });
    res.send({ status: 1, message: "Item created",item });
  } catch (err) {
    console.error(err);
    res.send({ status: 0, message: "Server error" });
  }
};

exports.updateVaultItem = async (req, res) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.send({ status: 0, message: "Item not found" });
    Object.assign(item, req.body);
    item.updatedAt = Date.now();
    await item.save();

    res.send({ status: 1, message: "Item updated", item });
  } catch (err) {
    console.error(err);
    res.send({ status: 0, message: "Server error" });
  }
};

exports.deleteVaultItem = async (req, res) => {
  try {
    await VaultItem.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.send({ status: 1, message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.send({ status: 0, message: "Server error" });
  }
};
