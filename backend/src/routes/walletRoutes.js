const express = require("express");
const {
  createWallet,
  transferFunds,
  retrieveWallet,
  respondToTransfer,
} = require("../controllers/walletController");

const router = express.Router();

router.post("/create", createWallet);
router.post("/transfer", transferFunds);
router.post("/respond-transfer", respondToTransfer);
router.get("/get/:id", retrieveWallet);
module.exports = router;
