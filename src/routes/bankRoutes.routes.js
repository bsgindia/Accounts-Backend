const express = require("express");
const router = express.Router();
const bankAccountController = require("../controllers/bankAccount.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");
router.post("/register", verifyToken, bankAccountController.registerBankAccount);
router.post("/transactions",verifyToken,bankAccountController.registerdailytransition)
router.get("/",verifyToken, bankAccountController.getTotalBalances);
router.get("/details",verifyToken, bankAccountController.getAllBankAccounts);
router.get("/banknumber",verifyToken, bankAccountController.getaccountNumber);
router.put("/details/:accountId",verifyToken, bankAccountController.updateBankAccount);
router.get("/transactions",verifyToken, bankAccountController.getDailyTransactions);

module.exports = router;
