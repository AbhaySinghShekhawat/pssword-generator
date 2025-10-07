const express = require("express");
const auth = require("../middleware/auth");
const { getVaultItems, getVaultItemById, createVaultItem, updateVaultItem, deleteVaultItem } = require("../controllers/vaultController");

const vaultRouter = new express.Router();
vaultRouter.use(auth);

vaultRouter.get("/", getVaultItems);
vaultRouter.get("/:id", getVaultItemById);
vaultRouter.post("/", createVaultItem);
vaultRouter.put("/:id", updateVaultItem);
vaultRouter.delete("/:id", deleteVaultItem);

module.exports = vaultRouter;
