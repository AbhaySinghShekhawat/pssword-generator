const express = require("express");
const auth = require("../middleware/auth");
const { getVaultItems, getVaultItemById, createVaultItem, updateVaultItem, deleteVaultItem } = require("../controllers/vaultController");

const router = express.Router();

router.use(auth); 

router.get("/", getVaultItems);
router.get("/:id", getVaultItemById);
router.post("/", createVaultItem);
router.put("/:id", updateVaultItem);
router.delete("/:id", deleteVaultItem);

module.exports = router;
