const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fund.Controller');
const { verifyToken } = require("../middleware/auth.middleware.js");
router.post('/register-funds',verifyToken, fundController.registerFunds);
router.get("/get-funds",verifyToken,fundController.getFunds);

module.exports = router;
