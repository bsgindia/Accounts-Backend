const express = require('express');
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware.js");
const { registerReceivable, getReceivables, ReceivablesID } = require('../controllers/receivabledetails.controller.js');

router.post('/register',verifyToken, registerReceivable);
router.get('/get-receivable',verifyToken, getReceivables);
router.get('/get-receivableid',verifyToken,ReceivablesID)
module.exports = router;
