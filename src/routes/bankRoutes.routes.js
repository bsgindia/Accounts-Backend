const express = require("express");
const router = express.Router();
const bankAccountController = require("../controllers/bankAccount.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");
router.post("/register", verifyToken, bankAccountController.registerBankAccount);
router.get("/",verifyToken, bankAccountController.getTotalBalances);
router.get("/details",verifyToken, bankAccountController.getAllBankAccounts);
router.put("/details/:accountId",verifyToken, bankAccountController.updateBankAccount);

module.exports = router;
