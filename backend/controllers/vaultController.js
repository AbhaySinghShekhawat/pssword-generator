const VaultItem = require("../model/VaultItem");

exports.getVaultItems = async (req, res) => {
  try {
    const items = await VaultItem.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.send({ status: 1, message: "All items", items });
  } catch (err) {
    console.error("Get vault items error:", err);
    res.status(500).send({ status: 0, message: "Server error" });
  }
};

exports.getVaultItemById = async (req, res) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).send({ status: 0, message: "Item not found" });
    res.send({ status: 1, item });
  } catch (err) {
    console.error("Get vault item by id error:", err);
    res.status(500).send({ status: 0, message: "Server error" });
  }
};

exports.createVaultItem = async (req, res) => {
  try {
    const { title, username, password, url, notes } = req.body;
    if (!title || !password) return res.status(400).send({ status: 0, message: "Title and password required" });

    const item = await VaultItem.create({
      owner: req.user._id,
      title,
      username,
      password,
      url,
      notes,
    });

    res.send({ status: 1, message: "Item created", item });
  } catch (err) {
    console.error("Create vault item error:", err);
    res.status(500).send({ status: 0, message: "Server error" });
  }
};

exports.updateVaultItem = async (req, res) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).send({ status: 0, message: "Item not found" });

    Object.assign(item, req.body);
    item.updatedAt = Date.now();
    await item.save();

    res.send({ status: 1, message: "Item updated", item });
  } catch (err) {
    console.error("Update vault item error:", err);
    res.status(500).send({ status: 0, message: "Server error" });
  }
};

exports.deleteVaultItem = async (req, res) => {
  try {
    const item = await VaultItem.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).send({ status: 0, message: "Item not found" });

    res.send({ status: 1, message: "Item deleted" });
  } catch (err) {
    console.error("Delete vault item error:", err);
    res.status(500).send({ status: 0, message: "Server error" });
  }
};
